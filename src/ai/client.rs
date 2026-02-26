//! AI Mentor client — calls the AWS Lambda backend for AI-powered suggestions.

use anyhow::{Context, Result};
use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use std::sync::{Arc, Mutex};
use std::time::{Duration, Instant};

use crate::config::AiConfig;
use crate::git;

// ─── Constants ─────────────────────────────────────────────────

/// Maximum number of retry attempts for transient failures.
const MAX_RETRIES: u32 = 2;

/// Maximum diff content included in context (chars). Truncated beyond this.
const DIFF_TRUNCATE_AT: usize = 4000;

/// Cache TTL — responses are cached for 5 minutes.
const CACHE_TTL: Duration = Duration::from_secs(300);

/// Maximum cached entries before eviction.
const CACHE_MAX_ENTRIES: usize = 50;

// ─── Request / Response Types ──────────────────────────────────

#[derive(Debug, Serialize)]
pub struct MentorRequest {
    #[serde(rename = "type")]
    pub request_type: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub context: Option<RepoContext>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub query: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub error: Option<String>,
}

#[derive(Debug, Serialize)]
pub struct RepoContext {
    #[serde(skip_serializing_if = "Option::is_none")]
    pub branch: Option<String>,
    #[serde(skip_serializing_if = "Vec::is_empty")]
    pub staged_files: Vec<String>,
    #[serde(skip_serializing_if = "Vec::is_empty")]
    pub unstaged_files: Vec<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub diff_stats: Option<DiffStats>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub diff: Option<String>,
}

#[derive(Debug, Serialize)]
pub struct DiffStats {
    pub files_changed: usize,
    pub insertions: usize,
    pub deletions: usize,
}

#[derive(Debug, Deserialize)]
pub struct MentorApiResponse {
    pub success: bool,
    #[serde(default)]
    pub response: Option<MentorResponseData>,
    #[serde(default)]
    pub error: Option<String>,
}

#[derive(Debug, Deserialize)]
pub struct MentorResponseData {
    #[serde(rename = "type")]
    #[allow(dead_code)]
    pub response_type: Option<String>,
    pub content: Option<String>,
}

// ─── Cache ─────────────────────────────────────────────────────

#[derive(Clone)]
struct CacheEntry {
    response: String,
    created: Instant,
}

type ResponseCache = Arc<Mutex<HashMap<String, CacheEntry>>>;

/// Compute a simple hash key for a request (type + query + error + branch).
fn cache_key(request: &MentorRequest) -> String {
    use std::collections::hash_map::DefaultHasher;
    use std::hash::{Hash, Hasher};

    let mut hasher = DefaultHasher::new();
    request.request_type.hash(&mut hasher);
    request.query.hash(&mut hasher);
    request.error.hash(&mut hasher);
    if let Some(ref ctx) = request.context {
        ctx.branch.hash(&mut hasher);
        ctx.staged_files.hash(&mut hasher);
        ctx.diff.hash(&mut hasher);
    }
    format!("{:x}", hasher.finish())
}

// ─── Client ────────────────────────────────────────────────────

/// AI Mentor client that talks to the AWS Lambda backend.
#[derive(Clone)]
pub struct AiClient {
    endpoint: String,
    api_key: String,
    client: reqwest::blocking::Client,
    cache: ResponseCache,
}

impl AiClient {
    /// Create a new AI client from config. Returns None if AI is not configured.
    /// Supports env vars ZIT_AI_ENDPOINT and ZIT_AI_API_KEY as fallbacks.
    pub fn from_config(config: &AiConfig) -> Option<Self> {
        if !config.enabled {
            return None;
        }
        let endpoint = config.resolved_endpoint()?;
        let api_key = config.resolved_api_key()?;

        // Validate endpoint URL format
        if !endpoint.starts_with("https://") && !endpoint.starts_with("http://") {
            return None;
        }

        let client = reqwest::blocking::Client::builder()
            .timeout(std::time::Duration::from_secs(
                config.timeout_secs.unwrap_or(30),
            ))
            .connect_timeout(std::time::Duration::from_secs(5))
            .build()
            .ok()?;

        Some(Self {
            endpoint,
            api_key,
            client,
            cache: Arc::new(Mutex::new(HashMap::new())),
        })
    }

    /// Generate a unique request ID for tracing.
    fn request_id() -> String {
        use std::time::SystemTime;
        let ts = SystemTime::now()
            .duration_since(SystemTime::UNIX_EPOCH)
            .unwrap_or_default()
            .as_nanos();
        format!("zit-{:x}", ts)
    }

    /// Look up a cached response. Returns None if not found or expired.
    fn get_cached(&self, key: &str) -> Option<String> {
        let cache = self.cache.lock().ok()?;
        if let Some(entry) = cache.get(key) {
            if entry.created.elapsed() < CACHE_TTL {
                return Some(entry.response.clone());
            }
        }
        None
    }

    /// Store a response in cache, evicting old entries if needed.
    fn set_cached(&self, key: String, response: String) {
        if let Ok(mut cache) = self.cache.lock() {
            // Evict expired entries
            cache.retain(|_, v| v.created.elapsed() < CACHE_TTL);
            // Evict oldest if at capacity
            if cache.len() >= CACHE_MAX_ENTRIES {
                if let Some(oldest_key) = cache
                    .iter()
                    .min_by_key(|(_, v)| v.created)
                    .map(|(k, _)| k.clone())
                {
                    cache.remove(&oldest_key);
                }
            }
            cache.insert(
                key,
                CacheEntry {
                    response,
                    created: Instant::now(),
                },
            );
        }
    }

    /// Send a request to the AI mentor API with caching, retry, and error classification.
    fn call(&self, request: &MentorRequest) -> Result<String> {
        // Check cache first
        let ckey = cache_key(request);
        if let Some(cached) = self.get_cached(&ckey) {
            return Ok(cached);
        }

        let request_id = Self::request_id();
        let mut last_error = None;

        for attempt in 0..=MAX_RETRIES {
            if attempt > 0 {
                // Exponential backoff: 500ms, 1s
                std::thread::sleep(std::time::Duration::from_millis(
                    500 * 2u64.pow(attempt - 1),
                ));
            }

            let send_result = self
                .client
                .post(&self.endpoint)
                .header("Content-Type", "application/json")
                .header("x-api-key", &self.api_key)
                .header("x-request-id", &request_id)
                .json(request)
                .send();

            match send_result {
                Ok(resp) => {
                    let status = resp.status();

                    // Don't retry client errors (4xx) — they won't change
                    if status.is_client_error() {
                        return self.parse_error_response(resp, status.as_u16());
                    }

                    // Retry server errors (5xx)
                    if status.is_server_error() {
                        last_error = Some(anyhow::anyhow!(classify_http_error(status.as_u16())));
                        continue;
                    }

                    // Success — parse and cache
                    let response = self.parse_success_response(resp)?;
                    self.set_cached(ckey, response.clone());
                    return Ok(response);
                }
                Err(e) => {
                    // On first attempt, detect offline state
                    if attempt == 0 && e.is_connect() {
                        return Err(anyhow::anyhow!(
                            "You appear to be offline — cannot reach AI service. Check your internet connection."
                        ));
                    }
                    last_error = Some(classify_request_error(e));
                    continue;
                }
            }
        }

        Err(last_error.unwrap_or_else(|| anyhow::anyhow!("AI request failed after retries")))
    }

    fn parse_success_response(&self, resp: reqwest::blocking::Response) -> Result<String> {
        let body: MentorApiResponse = resp.json().context("Failed to parse AI mentor response")?;

        if !body.success {
            let err_msg = body
                .error
                .unwrap_or_else(|| "Unknown API error".to_string());
            anyhow::bail!("{}", err_msg);
        }

        body.response
            .and_then(|r| r.content)
            .ok_or_else(|| anyhow::anyhow!("Empty response from AI mentor"))
    }

    fn parse_error_response(
        &self,
        resp: reqwest::blocking::Response,
        status: u16,
    ) -> Result<String> {
        // Try to extract a meaningful error message from the body
        if let Ok(body) = resp.json::<MentorApiResponse>() {
            if let Some(err) = body.error {
                anyhow::bail!("{}", err);
            }
        }
        anyhow::bail!("{}", classify_http_error(status));
    }

    /// Suggest a commit message based on staged changes.
    pub fn suggest_commit_message(&self) -> Result<String> {
        let ctx = build_repo_context(true)?;
        let request = MentorRequest {
            request_type: "commit_suggestion".to_string(),
            context: Some(ctx),
            query: None,
            error: None,
        };
        self.call(&request)
    }

    /// Explain the current repository state.
    pub fn explain_repo(&self, query: Option<&str>) -> Result<String> {
        let ctx = build_repo_context(false)?;
        let request = MentorRequest {
            request_type: "explain".to_string(),
            context: Some(ctx),
            query: query.map(|s| s.to_string()),
            error: None,
        };
        self.call(&request)
    }

    /// Explain a git error and suggest fixes.
    pub fn explain_error(&self, error_message: &str) -> Result<String> {
        let ctx = build_repo_context(false)?;
        let request = MentorRequest {
            request_type: "error".to_string(),
            context: Some(ctx),
            query: None,
            error: Some(error_message.to_string()),
        };
        self.call(&request)
    }

    /// Get a recommendation for a git operation.
    pub fn recommend(&self, query: &str) -> Result<String> {
        let ctx = build_repo_context(false)?;
        let request = MentorRequest {
            request_type: "recommend".to_string(),
            context: Some(ctx),
            query: Some(query.to_string()),
            error: None,
        };
        self.call(&request)
    }

    /// Check if the AI service is reachable. Returns the health response or an error.
    pub fn health_check(&self) -> Result<String> {
        // The health endpoint is the mentor endpoint's sibling path
        let health_url = self.endpoint.replace("/mentor", "/health");

        let resp = self
            .client
            .get(&health_url)
            .header("x-api-key", &self.api_key)
            .send()
            .context("Cannot reach AI service")?;

        if resp.status().is_success() {
            Ok("AI service is healthy and connected".to_string())
        } else {
            anyhow::bail!(classify_http_error(resp.status().as_u16()));
        }
    }

    /// Review a specific file's diff using AI. Returns review comments/suggestions.
    pub fn review_diff(&self, file_path: &str, diff_content: &str) -> Result<String> {
        let branch = git::branch::BranchOps::current().ok();

        // Truncate diff if too long
        let diff_text = if diff_content.len() > DIFF_TRUNCATE_AT {
            format!("{}...(truncated)", &diff_content[..DIFF_TRUNCATE_AT])
        } else {
            diff_content.to_string()
        };

        let context = RepoContext {
            branch,
            staged_files: vec![file_path.to_string()],
            unstaged_files: vec![],
            diff_stats: None,
            diff: Some(diff_text),
        };

        let request = MentorRequest {
            request_type: "review".to_string(),
            context: Some(context),
            query: Some(format!(
                "Review the following diff for file '{}'. Identify potential issues, \
                 suggest improvements, and highlight anything noteworthy. \
                 Be concise and actionable.",
                file_path
            )),
            error: None,
        };

        self.call(&request)
    }

    /// Learn about a git topic with beginner-friendly explanations.
    pub fn learn(&self, topic: &str) -> Result<String> {
        let ctx = build_repo_context(false)?;
        let request = MentorRequest {
            request_type: "learn".to_string(),
            context: Some(ctx),
            query: Some(topic.to_string()),
            error: None,
        };
        self.call(&request)
    }

    /// Ask a free-form question with full repo context.
    pub fn ask(&self, question: &str) -> Result<String> {
        let ctx = build_repo_context(false)?;
        let request = MentorRequest {
            request_type: "explain".to_string(),
            context: Some(ctx),
            query: Some(question.to_string()),
            error: None,
        };
        self.call(&request)
    }

    /// Check if the client is configured and reachable (quick check, no API call).
    #[allow(dead_code)]
    pub fn is_configured(&self) -> bool {
        !self.endpoint.is_empty() && !self.api_key.is_empty()
    }
}

// ─── Helpers ───────────────────────────────────────────────────

/// Build repository context from the current git state.
fn build_repo_context(include_diff: bool) -> Result<RepoContext> {
    let branch = git::branch::BranchOps::current().ok();

    let status = git::status::get_status().unwrap_or_default();
    let staged_files: Vec<String> = status.staged.iter().map(|f| f.path.clone()).collect();
    let unstaged_files: Vec<String> = status
        .unstaged
        .iter()
        .chain(status.untracked.iter())
        .map(|f| f.path.clone())
        .collect();

    let mut diff_text = None;
    let mut diff_stats = None;

    if include_diff && !staged_files.is_empty() {
        // Get staged diff for commit suggestions
        if let Ok(stat) = git::diff::get_staged_stat() {
            let parts = parse_stat_line(&stat);
            diff_stats = Some(DiffStats {
                files_changed: parts.0,
                insertions: parts.1,
                deletions: parts.2,
            });
        }

        if let Ok(diffs) = git::diff::get_staged_diff() {
            let mut combined = String::new();
            for file_diff in &diffs {
                for hunk in &file_diff.hunks {
                    for line in &hunk.lines {
                        combined.push_str(&line.content);
                        combined.push('\n');
                        if combined.len() > DIFF_TRUNCATE_AT {
                            combined.push_str("...(truncated)");
                            break;
                        }
                    }
                    if combined.len() > DIFF_TRUNCATE_AT {
                        break;
                    }
                }
                if combined.len() > DIFF_TRUNCATE_AT {
                    break;
                }
            }
            if !combined.is_empty() {
                diff_text = Some(combined);
            }
        }
    }

    Ok(RepoContext {
        branch,
        staged_files,
        unstaged_files,
        diff_stats,
        diff: diff_text,
    })
}

// ─── Error Classification ──────────────────────────────────────

/// Classify a reqwest transport-level error into a user-friendly message.
fn classify_request_error(e: reqwest::Error) -> anyhow::Error {
    if e.is_timeout() {
        anyhow::anyhow!(
            "Request timed out — the AI service may be under load. Try again in a moment."
        )
    } else if e.is_connect() {
        anyhow::anyhow!(
            "Cannot connect to AI service — check your internet connection and endpoint URL"
        )
    } else if e.is_decode() {
        anyhow::anyhow!("Received invalid response from AI service")
    } else {
        anyhow::anyhow!("Network error: {}", e)
    }
}

/// Map HTTP status codes to user-friendly error messages.
fn classify_http_error(status: u16) -> String {
    match status {
        401 => {
            "Invalid API key — check [ai] api_key in ~/.config/zit/config.toml or ZIT_AI_API_KEY"
                .to_string()
        }
        403 => "Access denied — your API key may have expired or hit its quota".to_string(),
        429 => "Rate limited — too many requests. Wait a moment and try again.".to_string(),
        500 => "AI service internal error — try again in a moment".to_string(),
        502..=504 => "AI service temporarily unavailable — try again shortly".to_string(),
        _ => format!("API error (HTTP {})", status),
    }
}

/// Parse `git diff --stat` summary line like " 3 files changed, 10 insertions(+), 2 deletions(-)"
fn parse_stat_line(stat: &str) -> (usize, usize, usize) {
    let mut files = 0;
    let mut ins = 0;
    let mut del = 0;

    for part in stat.split(',') {
        let part = part.trim();
        if part.contains("file") {
            files = part
                .split_whitespace()
                .next()
                .and_then(|n| n.parse().ok())
                .unwrap_or(0);
        } else if part.contains("insertion") {
            ins = part
                .split_whitespace()
                .next()
                .and_then(|n| n.parse().ok())
                .unwrap_or(0);
        } else if part.contains("deletion") {
            del = part
                .split_whitespace()
                .next()
                .and_then(|n| n.parse().ok())
                .unwrap_or(0);
        }
    }

    (files, ins, del)
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_parse_stat_line_full() {
        let stat = " 3 files changed, 45 insertions(+), 12 deletions(-)";
        let (f, i, d) = parse_stat_line(stat);
        assert_eq!(f, 3);
        assert_eq!(i, 45);
        assert_eq!(d, 12);
    }

    #[test]
    fn test_parse_stat_line_insertions_only() {
        let stat = " 1 file changed, 10 insertions(+)";
        let (f, i, d) = parse_stat_line(stat);
        assert_eq!(f, 1);
        assert_eq!(i, 10);
        assert_eq!(d, 0);
    }

    #[test]
    fn test_parse_stat_line_empty() {
        let (f, i, d) = parse_stat_line("");
        assert_eq!(f, 0);
        assert_eq!(i, 0);
        assert_eq!(d, 0);
    }

    #[test]
    fn test_mentor_request_serialization() {
        let req = MentorRequest {
            request_type: "commit_suggestion".to_string(),
            context: Some(RepoContext {
                branch: Some("main".to_string()),
                staged_files: vec!["src/main.rs".to_string()],
                unstaged_files: vec![],
                diff_stats: Some(DiffStats {
                    files_changed: 1,
                    insertions: 10,
                    deletions: 2,
                }),
                diff: Some("+fn hello() {}".to_string()),
            }),
            query: None,
            error: None,
        };

        let json = serde_json::to_string(&req).unwrap();
        assert!(json.contains("commit_suggestion"));
        assert!(json.contains("main"));
        assert!(json.contains("src/main.rs"));
        assert!(!json.contains("query")); // None fields should be skipped
        assert!(!json.contains("error"));
    }
}
