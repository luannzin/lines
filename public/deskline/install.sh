#!/bin/sh
# Deskline for macOS, opened straight away: downloads the latest release into Applications and
# opens it. What curl downloads isn't marked as coming from the internet, so macOS doesn't stop
# it the way it stops the .dmg from a browser (Open Anyway).
#   curl -fsSL https://deskline.luannzin.com/install.sh | sh
# Served by deskline.luannzin.com (luannzin/lines, public/deskline/install.sh).
set -eu

if [ "$(uname -s)" != Darwin ]; then
  echo "Deskline: this line is for macOS. Other systems: https://deskline.luannzin.com" >&2
  exit 1
fi

# /Applications needs an administrator; anyone else gets their own Applications folder.
apps=/Applications
if [ ! -w "$apps" ]; then
  apps="$HOME/Applications"
  mkdir -p "$apps"
fi
tmp=$(mktemp -d)
trap 'rm -rf "$tmp"' EXIT

echo "Downloading Deskline..."
curl -fL --progress-bar https://github.com/luannzin/deskline/releases/latest/download/Deskline-macos.zip -o "$tmp/Deskline.zip"
ditto -x -k "$tmp/Deskline.zip" "$tmp"

# A copy that's running (in the menu bar, say) would get the focus instead of the new one.
if pgrep -x deskline >/dev/null; then
  echo "Closing the Deskline that's running..."
  pkill -x deskline || true
  sleep 1
fi
rm -rf "$apps/Deskline.app"
mv "$tmp/Deskline.app" "$apps/Deskline.app"

echo "Installed in $apps. It keeps itself up to date."
open "$apps/Deskline.app"
