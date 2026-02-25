pub mod branch;
pub mod diff;
pub mod github_auth;
pub mod log;
pub mod reflog;
pub mod remote;
pub mod runner;
pub mod status;

pub use branch::{BranchEntry, BranchOps};
pub use diff::{DiffLine, DiffLineType};
pub use log::CommitEntry;
pub use reflog::ReflogEntry;
pub use remote::RemoteOps;
pub use runner::run_git;
pub use status::{FileEntry, FileStatus};
