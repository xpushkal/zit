#!/usr/bin/env bash
# Setup git hooks for the zit project.
# Run: ./scripts/setup-hooks.sh  OR  make setup-hooks

set -euo pipefail

HOOKS_DIR="$(git rev-parse --git-dir)/hooks"
PRE_COMMIT="$HOOKS_DIR/pre-commit"

mkdir -p "$HOOKS_DIR"

cat > "$PRE_COMMIT" << 'EOF'
#!/usr/bin/env bash
set -euo pipefail

echo "🔍 Running pre-commit checks..."

# Check formatting
echo "  Checking formatting..."
if ! cargo fmt --all -- --check 2>/dev/null; then
    echo "❌ Formatting check failed. Run 'cargo fmt' and try again."
    exit 1
fi

# Run clippy
echo "  Running clippy..."
if ! cargo clippy --all-targets -- -D warnings 2>/dev/null; then
    echo "❌ Clippy found issues. Fix them and try again."
    exit 1
fi

# Run tests
echo "  Running tests..."
if ! cargo test --all-targets 2>/dev/null; then
    echo "❌ Tests failed. Fix them and try again."
    exit 1
fi

echo "✅ All pre-commit checks passed."
EOF

chmod +x "$PRE_COMMIT"

echo "✅ Pre-commit hook installed at $PRE_COMMIT"
