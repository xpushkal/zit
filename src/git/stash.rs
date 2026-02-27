//! Stash management — list, push, pop, apply, drop, and show stash entries.

use super::runner::run_git;
use anyhow::Result;

/// A single stash entry.
#[derive(Debug, Clone)]
pub struct StashEntry {
    pub index: usize,
    pub branch: String,
    pub message: String,
}

/// List all stash entries.
pub fn list_stashes() -> Result<Vec<StashEntry>> {
    let output = run_git(&["stash", "list", "--format=%gd|%gs"])?;
    let mut entries = Vec::new();

    for (i, line) in output.lines().enumerate() {
        let line = line.trim();
        if line.is_empty() {
            continue;
        }
        // Format: stash@{0}|WIP on main: abc1234 commit msg
        let parts: Vec<&str> = line.splitn(2, '|').collect();
        let message = if parts.len() > 1 {
            parts[1].to_string()
        } else {
            line.to_string()
        };

        // Extract branch from message like "WIP on main: ..." or "On main: ..."
        let branch = extract_branch(&message);

        entries.push(StashEntry {
            index: i,
            branch,
            message,
        });
    }

    Ok(entries)
}

/// Extract the branch name from a stash message.
fn extract_branch(message: &str) -> String {
    // Patterns: "WIP on <branch>: ...", "On <branch>: ...", "index on <branch>: ..."
    let prefixes = ["WIP on ", "On ", "index on "];
    for prefix in &prefixes {
        if let Some(rest) = message.strip_prefix(prefix) {
            if let Some(colon_pos) = rest.find(':') {
                return rest[..colon_pos].to_string();
            }
        }
    }
    String::new()
}

/// Create a new stash with an optional message.
pub fn stash_push(message: Option<&str>) -> Result<String> {
    match message {
        Some(msg) if !msg.is_empty() => run_git(&["stash", "push", "-m", msg]),
        _ => run_git(&["stash", "push"]),
    }
}

/// Pop the stash at the given index (removes it from the stash list).
pub fn stash_pop(index: usize) -> Result<String> {
    let stash_ref = format!("stash@{{{}}}", index);
    run_git(&["stash", "pop", &stash_ref])
}

/// Apply the stash at the given index (keeps it in the stash list).
pub fn stash_apply(index: usize) -> Result<String> {
    let stash_ref = format!("stash@{{{}}}", index);
    run_git(&["stash", "apply", &stash_ref])
}

/// Drop (delete) the stash at the given index.
pub fn stash_drop(index: usize) -> Result<String> {
    let stash_ref = format!("stash@{{{}}}", index);
    run_git(&["stash", "drop", &stash_ref])
}

/// Show the diff for a stash entry.
pub fn stash_show(index: usize) -> Result<String> {
    let stash_ref = format!("stash@{{{}}}", index);
    run_git(&["stash", "show", "-p", &stash_ref])
}

/// Drop all stash entries.
pub fn stash_clear() -> Result<String> {
    run_git(&["stash", "clear"])
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_extract_branch_wip() {
        assert_eq!(extract_branch("WIP on main: abc1234 some msg"), "main");
    }

    #[test]
    fn test_extract_branch_on() {
        assert_eq!(
            extract_branch("On feature/foo: abc1234 some msg"),
            "feature/foo"
        );
    }

    #[test]
    fn test_extract_branch_index() {
        assert_eq!(
            extract_branch("index on develop: abc1234 some msg"),
            "develop"
        );
    }

    #[test]
    fn test_extract_branch_unknown_format() {
        assert_eq!(extract_branch("random stash message"), "");
    }

    #[test]
    fn test_extract_branch_no_colon() {
        assert_eq!(extract_branch("WIP on main"), "");
    }
}
