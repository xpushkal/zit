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

#[cfg(test)]
mod tests {
    use super::*;

    // ── GeneralConfig defaults ──────────────────────────────────────
    #[test]
    fn test_general_config_defaults() {
        let g = GeneralConfig::default();
        assert_eq!(g.tick_rate_ms, 2000);
        assert!(g.confirm_destructive);
    }

    // ── UiConfig defaults ───────────────────────────────────────────
    #[test]
    fn test_ui_config_defaults() {
        let u = UiConfig::default();
        assert_eq!(u.color_scheme, "default");
        assert!(u.show_help_hints);
    }

    // ── AiConfig defaults ───────────────────────────────────────────
    #[test]
    fn test_ai_config_defaults() {
        let a = AiConfig::default();
        assert!(!a.enabled);
        assert!(a.endpoint.is_none());
        assert!(a.api_key.is_none());
        assert_eq!(a.timeout_secs, Some(30));
    }

    // ── AiConfig::is_ready ──────────────────────────────────────────
    #[test]
    fn test_ai_not_ready_by_default() {
        let a = AiConfig::default();
        assert!(!a.is_ready());
    }

    #[test]
    fn test_ai_ready_when_fully_configured() {
        let a = AiConfig {
            enabled: true,
            endpoint: Some("https://api.example.com/mentor".to_string()),
            api_key: Some("test-api-key-12345".to_string()),
            timeout_secs: Some(30),
        };
        assert!(a.is_ready());
    }

    #[test]
    fn test_ai_not_ready_if_disabled() {
        let a = AiConfig {
            enabled: false,
            endpoint: Some("https://api.example.com".to_string()),
            api_key: Some("key12345".to_string()),
            timeout_secs: Some(30),
        };
        assert!(!a.is_ready());
    }

    #[test]
    fn test_ai_not_ready_missing_endpoint() {
        let a = AiConfig {
            enabled: true,
            endpoint: None,
            api_key: Some("key12345".to_string()),
            timeout_secs: Some(30),
        };
        // Also remove any env var to ensure no fallback
        std::env::remove_var("ZIT_AI_ENDPOINT");
        assert!(!a.is_ready());
    }

    #[test]
    fn test_ai_not_ready_missing_key() {
        let a = AiConfig {
            enabled: true,
            endpoint: Some("https://api.example.com".to_string()),
            api_key: None,
            timeout_secs: Some(30),
        };
        std::env::remove_var("ZIT_AI_API_KEY");
        assert!(!a.is_ready());
    }

    // ── AiConfig::validate ──────────────────────────────────────────
    #[test]
    fn test_validate_disabled_returns_no_issues() {
        let a = AiConfig::default();
        assert!(a.validate().is_empty());
    }

    #[test]
    fn test_validate_no_endpoint() {
        std::env::remove_var("ZIT_AI_ENDPOINT");
        std::env::remove_var("ZIT_AI_API_KEY");
        let a = AiConfig {
            enabled: true,
            endpoint: None,
            api_key: Some("test-key-1234".to_string()),
            timeout_secs: Some(30),
        };
        let issues = a.validate();
        assert!(issues.iter().any(|i| i.contains("endpoint not set")));
    }

    #[test]
    fn test_validate_bad_endpoint_scheme() {
        let a = AiConfig {
            enabled: true,
            endpoint: Some("ftp://example.com".to_string()),
            api_key: Some("test-key-1234".to_string()),
            timeout_secs: Some(30),
        };
        let issues = a.validate();
        assert!(issues.iter().any(|i| i.contains("must start with https://")));
    }

    #[test]
    fn test_validate_short_api_key() {
        let a = AiConfig {
            enabled: true,
            endpoint: Some("https://api.example.com".to_string()),
            api_key: Some("abc".to_string()),
            timeout_secs: Some(30),
        };
        let issues = a.validate();
        assert!(issues.iter().any(|i| i.contains("too short")));
    }

    #[test]
    fn test_validate_zero_timeout() {
        let a = AiConfig {
            enabled: true,
            endpoint: Some("https://api.example.com".to_string()),
            api_key: Some("test-key-1234".to_string()),
            timeout_secs: Some(0),
        };
        let issues = a.validate();
        assert!(issues.iter().any(|i| i.contains("must be > 0")));
    }

    #[test]
    fn test_validate_high_timeout() {
        let a = AiConfig {
            enabled: true,
            endpoint: Some("https://api.example.com".to_string()),
            api_key: Some("test-key-1234".to_string()),
            timeout_secs: Some(300),
        };
        let issues = a.validate();
        assert!(issues.iter().any(|i| i.contains("unusually high")));
    }

    #[test]
    fn test_validate_all_good() {
        let a = AiConfig {
            enabled: true,
            endpoint: Some("https://api.example.com/mentor".to_string()),
            api_key: Some("test-key-1234".to_string()),
            timeout_secs: Some(30),
        };
        assert!(a.validate().is_empty());
    }

    // ── GithubConfig ────────────────────────────────────────────────
    #[test]
    fn test_github_config_no_token() {
        let g = GithubConfig::default();
        assert!(g.get_token().is_none());
    }

    #[test]
    fn test_github_config_prefers_oauth() {
        let g = GithubConfig {
            pat: Some("pat-token".to_string()),
            oauth_token: Some("oauth-token".to_string()),
            username: None,
        };
        assert_eq!(g.get_token(), Some("oauth-token"));
    }

    #[test]
    fn test_github_config_falls_back_to_pat() {
        let g = GithubConfig {
            pat: Some("pat-token".to_string()),
            oauth_token: None,
            username: None,
        };
        assert_eq!(g.get_token(), Some("pat-token"));
    }

    // ── Config serialization roundtrip ──────────────────────────────
    #[test]
    fn test_config_toml_roundtrip() {
        let config = Config {
            general: GeneralConfig { tick_rate_ms: 500, confirm_destructive: false },
            github: GithubConfig {
                pat: Some("ghp_test".to_string()),
                oauth_token: None,
                username: Some("user".to_string()),
            },
            ui: UiConfig { color_scheme: "dark".to_string(), show_help_hints: false },
            ai: AiConfig {
                enabled: true,
                endpoint: Some("https://x.com".to_string()),
                api_key: Some("key123456".to_string()),
                timeout_secs: Some(60),
            },
        };
        let toml_str = toml::to_string_pretty(&config).unwrap();
        let parsed: Config = toml::from_str(&toml_str).unwrap();
        assert_eq!(parsed.general.tick_rate_ms, 500);
        assert!(!parsed.general.confirm_destructive);
        assert_eq!(parsed.github.pat, Some("ghp_test".to_string()));
        assert_eq!(parsed.ui.color_scheme, "dark");
        assert!(parsed.ai.enabled);
    }

    // ── Config::default has expected values ──────────────────────────
    #[test]
    fn test_config_default_has_expected_values() {
        let config = Config::default();
        assert_eq!(config.general.tick_rate_ms, 2000);
        assert!(config.general.confirm_destructive);
        assert!(!config.ai.enabled);
        assert_eq!(config.ui.color_scheme, "default");
    }

    // ── AiConfig::resolved_endpoint env fallback ────────────────────
    #[test]
    fn test_resolved_endpoint_prefers_config() {
        std::env::set_var("ZIT_AI_ENDPOINT", "https://env.example.com");
        let a = AiConfig {
            enabled: true,
            endpoint: Some("https://config.example.com".to_string()),
            api_key: None,
            timeout_secs: None,
        };
        assert_eq!(a.resolved_endpoint().unwrap(), "https://config.example.com");
        std::env::remove_var("ZIT_AI_ENDPOINT");
    }

    #[test]
    fn test_resolved_endpoint_env_fallback() {
        std::env::set_var("ZIT_AI_ENDPOINT", "https://env.example.com");
        let a = AiConfig {
            enabled: true,
            endpoint: None,
            api_key: None,
            timeout_secs: None,
        };
        assert_eq!(a.resolved_endpoint().unwrap(), "https://env.example.com");
        std::env::remove_var("ZIT_AI_ENDPOINT");
    }
}
