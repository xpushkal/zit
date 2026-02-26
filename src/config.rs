use anyhow::Result;
use serde::{Deserialize, Serialize};
use std::path::PathBuf;

#[derive(Debug, Serialize, Deserialize, Clone, Default)]
pub struct Config {
    #[serde(default)]
    pub general: GeneralConfig,
    #[serde(default)]
    pub github: GithubConfig,
    #[serde(default)]
    pub ui: UiConfig,
    #[serde(default)]
    pub ai: AiConfig,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct GeneralConfig {
    #[serde(default = "default_tick_rate")]
    pub tick_rate_ms: u64,
    #[serde(default = "default_true")]
    pub confirm_destructive: bool,
}

#[derive(Debug, Serialize, Deserialize, Clone, Default)]
pub struct GithubConfig {
    #[serde(default)]
    pub pat: Option<String>,
    #[serde(default)]
    pub oauth_token: Option<String>,
    #[serde(default)]
    pub username: Option<String>,
}

impl GithubConfig {
    /// Get the best available token (OAuth preferred over PAT).
    pub fn get_token(&self) -> Option<&str> {
        self.oauth_token.as_deref().or(self.pat.as_deref())
    }
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct UiConfig {
    #[serde(default = "default_color_scheme")]
    pub color_scheme: String,
    #[serde(default = "default_true")]
    pub show_help_hints: bool,
}

fn default_tick_rate() -> u64 {
    2000
}

fn default_true() -> bool {
    true
}

fn default_color_scheme() -> String {
    "default".to_string()
}

impl Default for GeneralConfig {
    fn default() -> Self {
        Self {
            tick_rate_ms: default_tick_rate(),
            confirm_destructive: true,
        }
    }
}

impl Default for UiConfig {
    fn default() -> Self {
        Self {
            color_scheme: default_color_scheme(),
            show_help_hints: true,
        }
    }
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct AiConfig {
    /// Enable AI mentor features.
    #[serde(default)]
    pub enabled: bool,
    /// API Gateway endpoint URL (e.g. https://xxx.execute-api.region.amazonaws.com/dev/mentor).
    #[serde(default)]
    pub endpoint: Option<String>,
    /// API key for the API Gateway.
    #[serde(default)]
    pub api_key: Option<String>,
    /// Request timeout in seconds.
    #[serde(default)]
    pub timeout_secs: Option<u64>,
}

impl Default for AiConfig {
    fn default() -> Self {
        Self {
            enabled: false,
            endpoint: None,
            api_key: None,
            timeout_secs: Some(30),
        }
    }
}

impl AiConfig {
    /// Resolve API key: config file first, then ZIT_AI_API_KEY env var.
    pub fn resolved_api_key(&self) -> Option<String> {
        self.api_key
            .clone()
            .or_else(|| std::env::var("ZIT_AI_API_KEY").ok())
    }

    /// Resolve endpoint: config file first, then ZIT_AI_ENDPOINT env var.
    pub fn resolved_endpoint(&self) -> Option<String> {
        self.endpoint
            .clone()
            .or_else(|| std::env::var("ZIT_AI_ENDPOINT").ok())
    }

    /// Validate the AI configuration and return a list of issues (empty = valid).
    pub fn validate(&self) -> Vec<String> {
        let mut issues = Vec::new();

        if !self.enabled {
            return issues; // Not enabled, nothing to validate
        }

        // Check endpoint
        match self.resolved_endpoint() {
            None => issues.push("AI endpoint not set — add 'endpoint' to [ai] config or set ZIT_AI_ENDPOINT".to_string()),
            Some(ref url) => {
                if !url.starts_with("https://") && !url.starts_with("http://") {
                    issues.push(format!("AI endpoint must start with https:// or http://, got: {}", url));
                }
                if !url.contains('.') {
                    issues.push("AI endpoint URL doesn't look like a valid domain".to_string());
                }
            }
        }

        // Check API key
        if self.resolved_api_key().is_none() {
            issues.push("AI API key not set — add 'api_key' to [ai] config or set ZIT_AI_API_KEY".to_string());
        } else if let Some(ref key) = self.resolved_api_key() {
            if key.len() < 8 {
                issues.push("AI API key seems too short (< 8 chars)".to_string());
            }
        }

        // Check timeout
        if let Some(timeout) = self.timeout_secs {
            if timeout == 0 {
                issues.push("AI timeout_secs must be > 0".to_string());
            } else if timeout > 120 {
                issues.push("AI timeout_secs > 120s is unusually high — consider lowering".to_string());
            }
        }

        issues
    }

    /// Check if AI is properly configured (enabled + endpoint + api_key).
    pub fn is_ready(&self) -> bool {
        self.enabled && self.resolved_endpoint().is_some() && self.resolved_api_key().is_some()
    }
}

impl Config {
    /// Get the config file path (~/.config/zit/config.toml).
    pub fn path() -> PathBuf {
        let config_dir = dirs::config_dir()
            .unwrap_or_else(|| PathBuf::from("."))
            .join("zit");
        config_dir.join("config.toml")
    }

    /// Load config from file, falling back to defaults if file doesn't exist.
    pub fn load() -> Result<Self> {
        let path = Self::path();
        if path.exists() {
            let content = std::fs::read_to_string(&path)?;
            let config: Config = toml::from_str(&content)?;
            Ok(config)
        } else {
            Ok(Config::default())
        }
    }

    /// Save config to file, creating directories if needed.
    pub fn save(&self) -> Result<()> {
        let path = Self::path();
        if let Some(parent) = path.parent() {
            std::fs::create_dir_all(parent)?;
        }
        let content = toml::to_string_pretty(self)?;
        std::fs::write(&path, content)?;
        Ok(())
    }
}
