//! AI Mentor client — calls the AWS Lambda backend for AI-powered suggestions.

use anyhow::{Context, Result};
use serde::{Deserialize, Serialize};

use crate::config::AiConfig;
use crate::git;

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

// ─── Client ────────────────────────────────────────────────────

/// AI Mentor client that talks to the AWS Lambda backend.
pub struct AiClient {
    endpoint: String,
    api_key: String,
    client: reqwest::blocking::Client,
}

impl AiClient {
    /// Create a new AI client from config. Returns None if AI is not configured.
    pub fn from_config(config: &AiConfig) -> Option<Self> {
        if !config.enabled {
            return None;
        }
        let endpoint = config.endpoint.as_ref()?;
        let api_key = config.api_key.as_ref()?;

        let client = reqwest::blocking::Client::builder()
            .timeout(std::time::Duration::from_secs(
                config.timeout_secs.unwrap_or(30),
            ))
            .build()
            .ok()?;

        Some(Self {
            endpoint: endpoint.clone(),
            api_key: api_key.clone(),
            client,
        })
    }

    /// Send a request to the AI mentor API.
    fn call(&self, request: &MentorRequest) -> Result<String> {
        let resp = self
            .client
            .post(&self.endpoint)
            .header("Content-Type", "application/json")
            .header("x-api-key", &self.api_key)
            .json(request)
            .send()
            .context("Failed to reach AI mentor API")?;

        let status = resp.status();
        let body: MentorApiResponse = resp.json().context("Failed to parse AI mentor response")?;

        if !body.success {
            let err_msg = body
                .error
                .unwrap_or_else(|| format!("API error (status {})", status));
            anyhow::bail!("{}", err_msg);
        }

        body.response
            .and_then(|r| r.content)
            .ok_or_else(|| anyhow::anyhow!("Empty response from AI mentor"))
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
    #[allow(dead_code)]
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
    #[allow(dead_code)]
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
    #[allow(dead_code)]
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
                        // Limit to ~4000 chars to avoid token explosion
                        if combined.len() > 4000 {
                            combined.push_str("...(truncated)");
                            break;
                        }
                    }
                    if combined.len() > 4000 {
                        break;
                    }
                }
                if combined.len() > 4000 {
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
