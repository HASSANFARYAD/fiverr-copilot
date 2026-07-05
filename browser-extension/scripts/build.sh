#!/bin/bash
set -euo pipefail

SRC="src"

echo "→ Building for Chrome..."
CHROME_DIR="build/chrome"
mkdir -p "$CHROME_DIR/icons" "$CHROME_DIR/src/panel" "$CHROME_DIR/src/popup"
cp -R "$SRC"/{content-script.js,background.js} "$CHROME_DIR/src/"
cp "$SRC/panel/panel.css" "$CHROME_DIR/src/panel/"
cp "$SRC/popup/popup.html" "$CHROME_DIR/src/popup/"
cp "$SRC/popup/popup.js" "$CHROME_DIR/src/popup/"
cp icons/*.png "$CHROME_DIR/icons/"
cp manifest.chrome.json "$CHROME_DIR/manifest.json"
echo "  ✓ Chrome build at $CHROME_DIR"

echo "→ Building for Firefox..."
FIREFOX_DIR="build/firefox"
mkdir -p "$FIREFOX_DIR/icons" "$FIREFOX_DIR/src/panel" "$FIREFOX_DIR/src/popup"
cp -R "$SRC"/{content-script.js,background.js} "$FIREFOX_DIR/src/"
cp "$SRC/panel/panel.css" "$FIREFOX_DIR/src/panel/"
cp "$SRC/popup/popup.html" "$FIREFOX_DIR/src/popup/"
cp "$SRC/popup/popup.js" "$FIREFOX_DIR/src/popup/"
cp icons/*.png "$FIREFOX_DIR/icons/"
cp manifest.firefox.json "$FIREFOX_DIR/manifest.json"
echo "  ✓ Firefox build at $FIREFOX_DIR"

echo ""
echo "→ Safari: xcrun safari-web-extension-converter build/chrome/ --app-name 'Fiverr Copilot'"
echo ""
echo "Done."
