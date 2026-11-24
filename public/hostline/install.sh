#!/bin/sh
# Hostline for Linux and macOS: downloads the latest release into ~/.local/bin. It keeps itself up
# to date from then on.
#   curl -fsSL https://hostline.luannzin.com/install.sh | sh
# Served by hostline.luannzin.com (luannzin/lines, public/hostline/install.sh). What curl
# downloads isn't marked as coming from the internet, so macOS runs it without asking.
set -eu

case "$(uname -s) $(uname -m)" in
  "Linux x86_64") asset=hostline-linux-x86_64 ;;
  "Linux aarch64" | "Linux arm64") asset=hostline-linux-arm64 ;;
  Darwin*) asset=hostline-macos ;;
  *)
    echo "Hostline: there's no build for $(uname -s) $(uname -m) yet. With Rust: cargo install --git https://github.com/luannzin/hostline" >&2
    exit 1
    ;;
esac

dir="$HOME/.local/bin"
mkdir -p "$dir"
echo "Downloading Hostline..."
curl -fL --progress-bar "https://github.com/luannzin/hostline/releases/latest/download/$asset" -o "$dir/hostline.part"
chmod +x "$dir/hostline.part"
mv -f "$dir/hostline.part" "$dir/hostline"

echo "Installed in $dir. It keeps itself up to date."
case ":$PATH:" in
  *":$dir:"*) echo "Share a port: hostline 3000" ;;
  *) echo "Share a port: $dir/hostline 3000 (or add $dir to your PATH)" ;;
esac
