.PHONY: build run test lint fmt check clean release coverage help

# Default target
all: check build

## build: Build the project in release mode
build:
	cargo build --release

## run: Run the project in debug mode
run:
	cargo run

## test: Run all tests
test:
	cargo test --all-targets

## lint: Run clippy linter
lint:
	cargo clippy --all-targets -- -D warnings

## fmt: Format code
fmt:
	cargo fmt --all

## fmt-check: Check formatting without modifying files
fmt-check:
	cargo fmt --all -- --check

## check: Run fmt-check + lint + test
check: fmt-check lint test

## clean: Remove build artifacts
clean:
	cargo clean

## release: Create a release build and show binary info
release: check
	cargo build --release
	@echo ""
	@echo "Binary: target/release/zit"
	@ls -lh target/release/zit 2>/dev/null || ls -lh target/release/zit.exe 2>/dev/null

## coverage: Generate test coverage report (requires cargo-tarpaulin)
coverage:
	cargo tarpaulin --out html --output-dir coverage/
	@echo "Coverage report: coverage/tarpaulin-report.html"

## audit: Run security audit (requires cargo-audit)
audit:
	cargo audit

## outdated: Check for outdated dependencies (requires cargo-outdated)
outdated:
	cargo outdated

## install-tools: Install development tools
install-tools:
	cargo install cargo-audit cargo-outdated cargo-tarpaulin

## setup-hooks: Install git pre-commit hooks
setup-hooks:
	@chmod +x scripts/setup-hooks.sh
	@./scripts/setup-hooks.sh
	@echo "Git hooks installed."

## help: Show this help
help:
	@echo "Usage: make [target]"
	@echo ""
	@echo "Targets:"
	@grep -E '^## ' Makefile | sed 's/## /  /'
