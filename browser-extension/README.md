# Fiverr Copilot — Browser Extension

Adds a floating assistant to Fiverr's inbox page that classifies buyer messages, generates reply drafts, and shows a 24-hour response timer.

---

## Install

### Chrome / Brave / Edge / Opera

1. Open `chrome://extensions`
2. Enable **Developer mode** (top right)
3. Click **Load unpacked**
4. Select the `build/chrome/` folder (after running the build script)

### Firefox

1. Open `about:debugging#/runtime/this-firefox`
2. Click **Load Temporary Add-on**
3. Select `build/firefox/manifest.json` (after running the build script)

> **Permanent install:** Package the `.xpi` via `about:addons` → gear icon → "Debug Add-ons".

### Safari

Requires Xcode. Run once:

```bash
xcrun safari-web-extension-converter build/chrome/ --app-name "Fiverr Copilot"
```

This creates an Xcode project. Open it, then run from Xcode to enable the extension in Safari > Settings > Extensions.

---

## Build

```bash
cd browser-extension
bash scripts/build.sh
```

Generates:
- `build/chrome/` — Chrome / Edge / Brave / Opera
- `build/firefox/` — Firefox

---

## Usage

1. Start the backend: `cd ../backend && .venv/bin/uvicorn backend.main:app --reload`
2. Go to `https://www.fiverr.com/users/YOUR_USERNAME/inbox`
3. Click the purple floating button (bottom right)
4. The panel shows: backend status, conversation intent, reply draft, and 24h timer

---

## Files

| File | Purpose |
|------|---------|
| `manifest.chrome.json` | Chrome MV3 manifest (source) |
| `manifest.firefox.json` | Firefox MV3 manifest (source) |
| `scripts/build.sh` | Build script for all browsers |
| `src/content-script.js` | Injected into Fiverr inbox pages |
| `src/panel/panel.css` | Styles for the floating panel |
| `src/popup/popup.html` | Extension popup (dashboard summary) |
| `src/popup/popup.js` | Popup logic |
| `src/background.js` | Service worker (proxies API calls) |
| `icons/` | Extension icons |
