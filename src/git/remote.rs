use super::runner::run_git;
use anyhow::Result;

pub struct RemoteOps;

impl RemoteOps {
    /// List all remotes with their URLs.
    #[allow(dead_code)]
    pub fn list() -> Result<Vec<(String, String)>> {
        let output = run_git(&["remote", "-v"])?;
        let mut remotes = Vec::new();
        let mut seen = std::collections::HashSet::new();

        for line in output.lines() {
            let parts: Vec<&str> = line.split_whitespace().collect();
            if parts.len() >= 2 {
                let name = parts[0].to_string();
                if seen.insert(name.clone()) {
                    remotes.push((name, parts[1].to_string()));
                }
            }
        }

        Ok(remotes)
    }

    /// Add a new remote.
    pub fn add(name: &str, url: &str) -> Result<()> {
        run_git(&["remote", "add", name, url])?;
        Ok(())
    }

    /// Push to a remote.
    pub fn push(remote: &str, branch: &str, set_upstream: bool) -> Result<String> {
        let mut args = vec!["push"];
        if set_upstream {
            args.push("-u");
        }
        args.push(remote);
        args.push(branch);
        run_git(&args)
    }

    /// Fetch from a remote.
    #[allow(dead_code)]
    pub fn fetch(remote: &str) -> Result<String> {
        run_git(&["fetch", remote])
    }

    /// Pull from a remote with rebase.
    pub fn pull(remote: &str, branch: &str) -> Result<String> {
        run_git(&["pull", "--rebase", remote, branch])
    }

    /// Pull from a remote, allowing unrelated histories (use with caution).
    #[allow(dead_code)]
    pub fn pull_allow_unrelated(remote: &str, branch: &str) -> Result<String> {
        run_git(&[
            "pull",
            "--rebase",
            "--allow-unrelated-histories",
            remote,
            branch,
        ])
    }

    /// Parse `git remote -v` output into (name, url) pairs, deduplicating.
    #[allow(dead_code)]
    pub fn parse_remote_output(output: &str) -> Vec<(String, String)> {
        let mut remotes = Vec::new();
        let mut seen = std::collections::HashSet::new();
        for line in output.lines() {
            let parts: Vec<&str> = line.split_whitespace().collect();
            if parts.len() >= 2 {
                let name = parts[0].to_string();
                if seen.insert(name.clone()) {
                    remotes.push((name, parts[1].to_string()));
                }
            }
        }
        remotes
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_parse_remote_output_basic() {
        let output = "\
origin\thttps://github.com/user/repo.git (fetch)
origin\thttps://github.com/user/repo.git (push)
";
        let remotes = RemoteOps::parse_remote_output(output);
        assert_eq!(remotes.len(), 1);
        assert_eq!(remotes[0].0, "origin");
        assert_eq!(remotes[0].1, "https://github.com/user/repo.git");
    }

    #[test]
    fn test_parse_remote_output_multiple() {
        let output = "\
origin\thttps://github.com/user/repo.git (fetch)
origin\thttps://github.com/user/repo.git (push)
upstream\thttps://github.com/upstream/repo.git (fetch)
upstream\thttps://github.com/upstream/repo.git (push)
";
        let remotes = RemoteOps::parse_remote_output(output);
        assert_eq!(remotes.len(), 2);
        assert_eq!(remotes[0].0, "origin");
        assert_eq!(remotes[1].0, "upstream");
    }

    #[test]
    fn test_parse_remote_output_empty() {
        let remotes = RemoteOps::parse_remote_output("");
        assert!(remotes.is_empty());
    }

    #[test]
    fn test_parse_remote_output_ssh_url() {
        let output = "origin\tgit@github.com:user/repo.git (fetch)\norigin\tgit@github.com:user/repo.git (push)\n";
        let remotes = RemoteOps::parse_remote_output(output);
        assert_eq!(remotes.len(), 1);
        assert_eq!(remotes[0].1, "git@github.com:user/repo.git");
    }
}
