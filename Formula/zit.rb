class Zit < Formula
  desc "A TUI-based Git dashboard for efficient repository management"
  homepage "https://github.com/JUSTMEETPATEL/zit"
  url "https://github.com/JUSTMEETPATEL/zit/archive/refs/tags/v0.1.1.tar.gz"
  sha256 "7f19e19c66d459cd22d2b40fbefb9c9c0495e064c0420eef158d6b7676f1bfbe"
  license "MIT"
  head "https://github.com/JUSTMEETPATEL/zit.git", branch: "main"

  depends_on "rust" => :build
  depends_on "git"

  def install
    system "cargo", "install", *std_cargo_args
  end

  test do
    # zit requires a git repo; verify the binary runs and detects non-repo
    assert_match "Not a git repository", shell_output("#{bin}/zit 2>&1", 1)
  end
end
