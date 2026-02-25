# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- CI/CD pipeline with GitHub Actions (lint, test, build across Linux/macOS/Windows)
- Automated release workflow with cross-compilation and GitHub Releases
- Weekly security audit workflow (`cargo audit`)
- Dependabot configuration for Cargo, GitHub Actions, and pip dependencies
- Makefile with common development commands (`make check`, `make test`, `make lint`)
- Pre-commit hook setup script (`make setup-hooks`)
- Shared `ui::utils::centered_rect()` utility to eliminate code duplication
- Lazy-compiled regex in log parser via `OnceLock` for better performance
- `dev-dependencies`: `tempfile`, `pretty_assertions` for testing infrastructure
- This CHANGELOG

### Fixed
- Removed `#![allow(dead_code)]` that was globally suppressing compiler warnings
- Git staging errors are now properly reported to the user instead of silently swallowed
- `git pull` no longer passes `--allow-unrelated-histories` by default (safety fix)
- Homebrew formula test now correctly checks for non-repo error message

### Removed
- Unused dependencies: `clap`, `tokio`, `chrono` (significant compile time reduction)

### Changed
- `Cargo.lock` is now committed (correct practice for binary crates)
- Regex in log parser is now compiled once and reused via `OnceLock`

## [0.1.1] - 2025-01-01

### Added
- Initial release
- Repository dashboard with at-a-glance status
- Interactive file staging with diff previews
- Commit editor with validation
- Branch management (create, delete, rename, switch)
- Timeline view with git log graph
- Time travel (reset/restore) with safety confirmations
- Reflog viewer with filtering
- GitHub integration (OAuth device flow, repo creation, push/pull/sync, collaborators)
- Homebrew formula for macOS installation
