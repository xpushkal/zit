class Zit < Formula
  desc "A TUI-based Git dashboard for efficient repository management"
  homepage "https://github.com/JUSTMEETPATEL/zit"
  url "https://github.com/JUSTMEETPATEL/zit/archive/refs/tags/v0.1.2.tar.gz"
  sha256 "8a7ac6a5cbdda396acd25995d402dd811486f4d02bb4036263d7a811f3a1362a"
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
