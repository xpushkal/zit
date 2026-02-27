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

/// Get the repository root path.
#[allow(dead_code)]
pub fn repo_root() -> Result<String> {
    let out = run_git(&["rev-parse", "--show-toplevel"])?;
    Ok(out.trim().to_string())
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
}
