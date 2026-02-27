//! Secure token storage using the OS keychain (macOS Keychain, Windows Credential Manager,
//! Linux Secret Service). Falls back gracefully to plaintext config if the keychain is unavailable.

use anyhow::Result;

const SERVICE_NAME: &str = "zit-cli";

/// Keychain key names
const KEY_GITHUB_TOKEN: &str = "github-oauth-token";
const KEY_GITHUB_PAT: &str = "github-pat";
const KEY_AI_API_KEY: &str = "ai-api-key";

/// Store a secret in the OS keychain.
fn set_secret(key: &str, value: &str) -> Result<()> {
    let entry = keyring::Entry::new(SERVICE_NAME, key)?;
    entry.set_password(value)?;
    log::debug!("Stored secret in keychain: {}", key);
    Ok(())
}

/// Retrieve a secret from the OS keychain. Returns None if not found.
fn get_secret(key: &str) -> Option<String> {
    let entry = keyring::Entry::new(SERVICE_NAME, key).ok()?;
    match entry.get_password() {
        Ok(pw) => Some(pw),
        Err(keyring::Error::NoEntry) => None,
        Err(e) => {
            log::debug!("Keychain read failed for {}: {}", key, e);
            None
        }
    }
}

/// Delete a secret from the OS keychain.
fn delete_secret(key: &str) {
    if let Ok(entry) = keyring::Entry::new(SERVICE_NAME, key) {
        let _ = entry.delete_credential();
        log::debug!("Deleted secret from keychain: {}", key);
    }
}

// ── GitHub OAuth Token ──────────────────────────────────────────────

/// Store the GitHub OAuth token securely.
pub fn store_github_token(token: &str) -> Result<()> {
    set_secret(KEY_GITHUB_TOKEN, token)
}

/// Retrieve the GitHub OAuth token from the keychain.
pub fn get_github_token() -> Option<String> {
    get_secret(KEY_GITHUB_TOKEN)
}

/// Delete the stored GitHub OAuth token.
pub fn delete_github_token() {
    delete_secret(KEY_GITHUB_TOKEN);
}

// ── GitHub PAT ──────────────────────────────────────────────────────

/// Store a GitHub Personal Access Token securely.
pub fn store_github_pat(pat: &str) -> Result<()> {
    set_secret(KEY_GITHUB_PAT, pat)
}

/// Retrieve the GitHub PAT from the keychain.
pub fn get_github_pat() -> Option<String> {
    get_secret(KEY_GITHUB_PAT)
}

/// Delete the stored GitHub PAT.
pub fn delete_github_pat() {
    delete_secret(KEY_GITHUB_PAT);
}

// ── AI API Key ──────────────────────────────────────────────────────

/// Store the AI mentor API key securely.
pub fn store_ai_api_key(key: &str) -> Result<()> {
    set_secret(KEY_AI_API_KEY, key)
}

/// Retrieve the AI API key from the keychain.
pub fn get_ai_api_key() -> Option<String> {
    get_secret(KEY_AI_API_KEY)
}

/// Delete the stored AI API key.
pub fn delete_ai_api_key() {
    delete_secret(KEY_AI_API_KEY);
}

// ── Bulk Operations ─────────────────────────────────────────────────

/// Delete all zit secrets from the keychain (used on logout).
pub fn clear_all() {
    delete_github_token();
    delete_github_pat();
    delete_ai_api_key();
}

/// Migrate plaintext tokens from config to keychain.
/// Returns the number of secrets migrated.
pub fn migrate_from_config(config: &mut crate::config::Config) -> u32 {
    let mut count = 0;

    // Migrate GitHub OAuth token
    if let Some(ref token) = config.github.oauth_token {
        if store_github_token(token).is_ok() {
            config.github.oauth_token = None;
            count += 1;
            log::info!("Migrated GitHub OAuth token to keychain");
        }
    }

    // Migrate GitHub PAT
    if let Some(ref pat) = config.github.pat {
        if store_github_pat(pat).is_ok() {
            config.github.pat = None;
            count += 1;
            log::info!("Migrated GitHub PAT to keychain");
        }
    }

    // Migrate AI API key
    if let Some(ref key) = config.ai.api_key {
        if store_ai_api_key(key).is_ok() {
            config.ai.api_key = None;
            count += 1;
            log::info!("Migrated AI API key to keychain");
        }
    }

    count
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_keychain_constants() {
        assert_eq!(SERVICE_NAME, "zit-cli");
        assert_eq!(KEY_GITHUB_TOKEN, "github-oauth-token");
        assert_eq!(KEY_GITHUB_PAT, "github-pat");
        assert_eq!(KEY_AI_API_KEY, "ai-api-key");
    }
}
