use super::runner::run_git;
use anyhow::Result;

#[derive(Debug, Clone, PartialEq)]
pub enum DiffLineType {
    Context,
    Added,
    Removed,
    Header,
}

#[derive(Debug, Clone)]
pub struct DiffLine {
    pub line_type: DiffLineType,
    pub content: String,
}

#[derive(Debug, Clone)]
#[allow(dead_code)]
pub struct Hunk {
    pub header: String,
    pub old_start: u32,
    pub old_count: u32,
    pub new_start: u32,
    pub new_count: u32,
    pub lines: Vec<DiffLine>,
}

#[derive(Debug, Clone)]
pub struct FileDiff {
    pub path: String,
    pub old_path: Option<String>,
    pub hunks: Vec<Hunk>,
}

/// Get diff of unstaged changes (working tree vs index).
pub fn get_unstaged_diff() -> Result<Vec<FileDiff>> {
    let output = run_git(&["diff"])?;
    Ok(parse_diff_output(&output))
}

/// Get diff of staged changes (index vs HEAD).
pub fn get_staged_diff() -> Result<Vec<FileDiff>> {
    let output = run_git(&["diff", "--cached"])?;
    Ok(parse_diff_output(&output))
}

/// Get diff for a specific commit.
pub fn get_commit_diff(hash: &str) -> Result<Vec<FileDiff>> {
    let output = run_git(&["diff", &format!("{}^..{}", hash, hash)])?;
    Ok(parse_diff_output(&output))
}

/// Get diffstat for staged changes (for commit preview).
pub fn get_staged_stat() -> Result<String> {
    run_git(&["diff", "--cached", "--stat"])
}

fn parse_diff_output(output: &str) -> Vec<FileDiff> {
    let mut files: Vec<FileDiff> = Vec::new();
    let mut current_file: Option<FileDiff> = None;
    let mut current_hunk: Option<Hunk> = None;

    for line in output.lines() {
        if line.starts_with("diff --git") {
            // Save previous hunk and file
            if let Some(ref mut f) = current_file {
                if let Some(h) = current_hunk.take() {
                    f.hunks.push(h);
                }
                files.push(f.clone());
            }

            // Parse file path from "diff --git a/path b/path"
            let path = line.rsplit(" b/").next().unwrap_or("").to_string();

            current_file = Some(FileDiff {
                path,
                old_path: None,
                hunks: Vec::new(),
            });
            current_hunk = None;
        } else if line.starts_with("rename from ") {
            if let Some(ref mut f) = current_file {
                f.old_path = Some(line.strip_prefix("rename from ").unwrap_or("").to_string());
            }
        } else if line.starts_with("@@") {
            // Save previous hunk
            if let Some(ref mut f) = current_file {
                if let Some(h) = current_hunk.take() {
                    f.hunks.push(h);
                }
            }

            let (old_start, old_count, new_start, new_count) = parse_hunk_header(line);
            current_hunk = Some(Hunk {
                header: line.to_string(),
                old_start,
                old_count,
                new_start,
                new_count,
                lines: vec![DiffLine {
                    line_type: DiffLineType::Header,
                    content: line.to_string(),
                }],
            });
        } else if let Some(ref mut hunk) = current_hunk {
            let line_type = if line.starts_with('+') {
                DiffLineType::Added
            } else if line.starts_with('-') {
                DiffLineType::Removed
            } else {
                DiffLineType::Context
            };

            hunk.lines.push(DiffLine {
                line_type,
                content: line.to_string(),
            });
        }
    }

    // Save last hunk and file
    if let Some(ref mut f) = current_file {
        if let Some(h) = current_hunk.take() {
            f.hunks.push(h);
        }
        files.push(f.clone());
    }

    files
}

fn parse_hunk_header(header: &str) -> (u32, u32, u32, u32) {
    // Format: @@ -old_start,old_count +new_start,new_count @@
    let mut old_start = 0u32;
    let mut old_count = 1u32;
    let mut new_start = 0u32;
    let mut new_count = 1u32;

    if let Some(content) = header.strip_prefix("@@ ") {
        let parts: Vec<&str> = content.split_whitespace().collect();
        if parts.len() >= 2 {
            // Parse -old_start,old_count
            let old = parts[0].trim_start_matches('-');
            let old_parts: Vec<&str> = old.split(',').collect();
            old_start = old_parts[0].parse().unwrap_or(0);
            if old_parts.len() > 1 {
                old_count = old_parts[1].parse().unwrap_or(1);
            }

            // Parse +new_start,new_count
            let new = parts[1].trim_start_matches('+');
            let new_parts: Vec<&str> = new.split(',').collect();
            new_start = new_parts[0].parse().unwrap_or(0);
            if new_parts.len() > 1 {
                new_count = new_parts[1].parse().unwrap_or(1);
            }
        }
    }

    (old_start, old_count, new_start, new_count)
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_parse_diff_output() {
        let sample = "\
diff --git a/src/main.rs b/src/main.rs
index abc123..def456 100644
--- a/src/main.rs
+++ b/src/main.rs
@@ -1,3 +1,4 @@
 fn main() {
-    println!(\"Hello\");
+    println!(\"Hello, world!\");
+    println!(\"Welcome\");
 }
";
        let files = parse_diff_output(sample);
        assert_eq!(files.len(), 1);
        assert_eq!(files[0].path, "src/main.rs");
        assert_eq!(files[0].hunks.len(), 1);
        // Header + 1 context + 1 removed + 2 added + 1 context = 6 lines
        assert_eq!(files[0].hunks[0].lines.len(), 6);
    }

    #[test]
    fn test_parse_hunk_header() {
        let (os, oc, ns, nc) = parse_hunk_header("@@ -1,3 +1,4 @@ fn main()");
        assert_eq!(os, 1);
        assert_eq!(oc, 3);
        assert_eq!(ns, 1);
        assert_eq!(nc, 4);
    }

    #[test]
    fn test_parse_hunk_header_single_line() {
        let (os, oc, ns, nc) = parse_hunk_header("@@ -10 +10 @@");
        assert_eq!(os, 10);
        assert_eq!(oc, 1); // default when no comma
        assert_eq!(ns, 10);
        assert_eq!(nc, 1);
    }

    #[test]
    fn test_parse_empty_diff() {
        let files = parse_diff_output("");
        assert!(files.is_empty());
    }

    #[test]
    fn test_parse_diff_multiple_files() {
        let sample = "\
diff --git a/file1.rs b/file1.rs
index abc..def 100644
--- a/file1.rs
+++ b/file1.rs
@@ -1,2 +1,2 @@
-old1
+new1
diff --git a/file2.rs b/file2.rs
index 111..222 100644
--- a/file2.rs
+++ b/file2.rs
@@ -1,2 +1,3 @@
 keep
-remove
+add1
+add2
";
        let files = parse_diff_output(sample);
        assert_eq!(files.len(), 2);
        assert_eq!(files[0].path, "file1.rs");
        assert_eq!(files[1].path, "file2.rs");
        assert_eq!(files[1].hunks.len(), 1);
    }

    #[test]
    fn test_parse_diff_rename() {
        let sample = "\
diff --git a/old_name.rs b/new_name.rs
rename from old_name.rs
rename to new_name.rs
@@ -1,2 +1,2 @@
-old
+new
";
        let files = parse_diff_output(sample);
        assert_eq!(files.len(), 1);
        assert_eq!(files[0].path, "new_name.rs");
        assert_eq!(files[0].old_path, Some("old_name.rs".to_string()));
    }

    #[test]
    fn test_diff_line_types_classified_correctly() {
        let sample = "\
diff --git a/t.rs b/t.rs
index abc..def 100644
--- a/t.rs
+++ b/t.rs
@@ -1,3 +1,3 @@
 context
-removed
+added
";
        let files = parse_diff_output(sample);
        let lines = &files[0].hunks[0].lines;
        assert_eq!(lines[0].line_type, DiffLineType::Header); // @@ header
        assert_eq!(lines[1].line_type, DiffLineType::Context); // " context"
        assert_eq!(lines[2].line_type, DiffLineType::Removed); // "-removed"
        assert_eq!(lines[3].line_type, DiffLineType::Added);   // "+added"
    }

    #[test]
    fn test_parse_diff_multiple_hunks() {
        let sample = "\
diff --git a/f.rs b/f.rs
index abc..def 100644
--- a/f.rs
+++ b/f.rs
@@ -1,2 +1,2 @@
-a
+b
@@ -10,2 +10,2 @@
-c
+d
";
        let files = parse_diff_output(sample);
        assert_eq!(files[0].hunks.len(), 2);
        assert_eq!(files[0].hunks[0].old_start, 1);
        assert_eq!(files[0].hunks[1].old_start, 10);
    }
}
