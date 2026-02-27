use anyhow::{bail, Context, Result};
use std::process::Command;
use std::time::{Duration, Instant};

/// Default timeout for git commands (30 seconds).
const GIT_TIMEOUT: Duration = Duration::from_secs(30);

/// Execute a git command with the given arguments and return stdout.
/// Fails with a descriptive error if the command exits non-zero or times out after 30s.
pub fn run_git(args: &[&str]) -> Result<String> {
    run_git_with_timeout(args, GIT_TIMEOUT)
}

/// Execute a git command with a custom timeout.
pub fn run_git_with_timeout(args: &[&str], timeout: Duration) -> Result<String> {
    log::debug!("git {}", args.join(" "));
    let mut child = Command::new("git")
        .args(args)
        .stdout(std::process::Stdio::piped())
        .stderr(std::process::Stdio::piped())
        .spawn()
        .context("Failed to execute git command")?;

    let start = Instant::now();
    loop {
        match child.try_wait() {
            Ok(Some(status)) => {
                // Process finished
                let output = child.wait_with_output()
                    .context("Failed to read git output")?;
                if !status.success() {
                    let stderr = String::from_utf8_lossy(&output.stderr);
                    log::warn!("git {} failed: {}", args.join(" "), stderr.trim());
                    bail!("git {} failed: {}", args.join(" "), stderr.trim());
                }
                let stdout = String::from_utf8_lossy(&output.stdout).to_string();
                return Ok(stdout);
            }
            Ok(None) => {
                // Still running — check timeout
                if start.elapsed() > timeout {
                    let _ = child.kill();
                    let _ = child.wait();
                    bail!(
                        "git {} timed out after {}s",
                        args.join(" "),
                        timeout.as_secs()
                    );
                }
                std::thread::sleep(Duration::from_millis(50));
            }
            Err(e) => {
                bail!("Failed waiting for git {}: {}", args.join(" "), e);
            }
        }
    }
}

/// Check if the current directory is inside a git repository.
pub fn is_git_repo() -> bool {
    run_git(&["rev-parse", "--is-inside-work-tree"]).is_ok()
}

/// Minimum git version required (porcelain v2 with --branch).
const MIN_GIT_VERSION: (u32, u32, u32) = (2, 13, 0);

/// Parse a version string like "git version 2.39.3 (Apple Git-146)" into (major, minor, patch).
fn parse_git_version(version_str: &str) -> Option<(u32, u32, u32)> {
    // Find the version number part (digits and dots after "git version ")
    let version_part = version_str
        .strip_prefix("git version ")
        .unwrap_or(version_str)
        .trim();
    let mut parts = version_part.split(|c: char| !c.is_ascii_digit()).filter(|s| !s.is_empty());
    let major = parts.next()?.parse().ok()?;
    let minor = parts.next()?.parse().ok()?;
    let patch = parts.next().and_then(|s| s.parse().ok()).unwrap_or(0);
    Some((major, minor, patch))
}

/// Check that the installed git version meets the minimum requirement (≥ 2.13.0).
/// Returns Ok(()) if the version is sufficient, or an error describing the problem.
pub fn check_git_version() -> Result<()> {
    let output = run_git(&["--version"])?;
    let version = parse_git_version(output.trim())
        .ok_or_else(|| anyhow::anyhow!("Could not parse git version from: {}", output.trim()))?;
    let (min_major, min_minor, min_patch) = MIN_GIT_VERSION;
    if version < (min_major, min_minor, min_patch) {
        bail!(
            "Git version {}.{}.{} is too old (minimum: {}.{}.{})",
            version.0, version.1, version.2,
            min_major, min_minor, min_patch
        );
    }
    log::debug!("Git version {}.{}.{} OK", version.0, version.1, version.2);
    Ok(())
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_run_git_version() {
        let result = run_git(&["--version"]);
        assert!(result.is_ok());
        assert!(result.unwrap().starts_with("git version"));
    }

    #[test]
    fn test_parse_git_version_standard() {
        assert_eq!(parse_git_version("git version 2.39.3"), Some((2, 39, 3)));
    }

    #[test]
    fn test_parse_git_version_apple() {
        assert_eq!(
            parse_git_version("git version 2.39.3 (Apple Git-146)"),
            Some((2, 39, 3))
        );
    }

    #[test]
    fn test_parse_git_version_no_patch() {
        assert_eq!(parse_git_version("git version 2.13"), Some((2, 13, 0)));
    }

    #[test]
    fn test_parse_git_version_garbage() {
        assert_eq!(parse_git_version("not a version"), None);
    }

    #[test]
    fn test_check_git_version_passes() {
        // The system git should be >= 2.13.0
        assert!(check_git_version().is_ok());
    }
}
