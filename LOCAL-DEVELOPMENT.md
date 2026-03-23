---
hidden: true
---

# Local Development Guide

Internal reference for contributors.

---

## Overview

This documentation is built with [HonKit](https://github.com/honkit/honkit) and synced with the [`CellHasher/documentation`](https://github.com/CellHasher/documentation) GitHub repository. Changes pushed to `main` are automatically built and deployed to GitHub Pages via the CI pipeline in `.github/workflows/docs.yml`.

---

## Editing Locally

You do not need any special tooling to edit content — all pages are standard Markdown files.

**Recommended editor:** [VS Code](https://code.visualstudio.com/) with a Markdown Preview extension.

> **Note:** This repo previously used GitBook. GitBook-specific directives (e.g. {% raw %}{% hint %}{% endraw %}, {% raw %}{% columns %}{% endraw %}, {% raw %}{% tabs %}{% endraw %}) have been converted to standard Markdown for HonKit compatibility.

### Clone the repo

```bash
git clone git@github.com:CellHasher/documentation.git
cd documentation
```

### Install dependencies

```bash
npm install
```

### Workflow

1. Create a branch off `main`:
   ```bash
   git checkout -b your-name/description
   ```
2. Edit any `.md` files in your editor.
3. Preview your changes locally:
   ```bash
   npm run serve
   ```
   Open `http://localhost:4000` in your browser.
4. Run tests before committing:
   ```bash
   npm test
   ```
5. Commit and push your branch:
   ```bash
   git add .
   git commit -m "Your change description"
   git push origin your-name/description
   ```
6. Open a PR into `main`. The CI pipeline will build and deploy automatically on merge.

---

## Available Scripts

| Command | Description |
|---|---|
| `npm run build` | Build static HTML into `_book/` |
| `npm run serve` | Serve docs locally with live reload at `http://localhost:4000` |
| `npm run lint` | Run Markdown linter |
| `npm run links` | Check all internal and external links |
| `npm test` | Run lint + link checks |

---

## Project Structure

```
documentation/
├── README.md                      # Welcome / home page
├── SUMMARY.md                     # Table of contents — controls sidebar nav
├── book.json                      # HonKit configuration
├── package.json                   # Node.js dependencies and scripts
├── releases.json                  # Download links for the latest release
├── LOCAL-DEVELOPMENT.md           # This file
├── .gitignore
├── .markdownlint.json             # Markdown lint rules
├── .mlc.json                      # Link checker config
├── .github/workflows/docs.yml     # GitHub Pages CI pipeline
├── .gitlab-ci.yml                 # GitLab Pages CI pipeline
├── .gitbook/assets/               # Images and media
├── cellhasher-chassis/            # Hardware setup guides
├── cellhasher-control/            # Software download and usage guides
│   ├── set-up-download.md         # Download page (loads from releases.json)
│   ├── tabs-walkthrough/          # Detailed tab-by-tab walkthrough
│   └── how-to-use/                # Quick how-to guides
└── additional-docs/               # Supplementary docs (ADB, debugging, etc.)
```

---

## Updating the Download Links (`releases.json`)

When a new release is published, update `releases.json` in the root of the repo. The download page at `cellhasher-control/set-up-download.md` fetches this file at runtime from the `main` branch — no changes to the markdown page are required.

**Format:**

```json
{
  "version": "0.5.6",
  "downloads": {
    "mac": {
      "arm64": "https://github.com/CellHasher/Beta-Cellhasher/releases/download/0.5.6/cellhasher_controller_0.5.6_aarch64.dmg",
      "intel": "https://github.com/CellHasher/Beta-Cellhasher/releases/download/0.5.6/cellhasher_controller_0.5.6_x86_64.dmg"
    },
    "windows": {
      "x64": "https://github.com/CellHasher/Beta-Cellhasher/releases/download/0.5.6/cellhasher_controller_0.5.6_x86_64.exe"
    },
    "linux": {
      "deb": "https://github.com/CellHasher/Beta-Cellhasher/releases/download/0.5.6/cellhasher_controller_0.5.6_amd64.deb"
    }
  }
}
```

Steps:
1. Update the `version` field.
2. Update each download URL to point to the new release assets.
3. Commit and push to `main`.

---

## Google Analytics

GA4 is configured in `cellhasher-control/set-up-download.md`. Replace the two instances of `G-XXXXXXXXXX` with your actual GA4 Measurement ID.

Download click events are tracked via `gtag('event', 'download', {...})` with the following custom parameters:

| Parameter | Description |
|---|---|
| `app_version` | Release version (e.g. `0.5.6`) |
| `platform` | `mac`, `windows`, or `linux` |
| `architecture` | `arm64`, `intel`, `x64`, `deb` |
| `event_label` | Human-readable label (e.g. `mac arm64 v0.5.6`) |

To view download events in GA4: **Reports → Engage → Events → `download`**

---

## Adding New Pages

1. Create a new `.md` file in the appropriate folder.
2. Add it to `SUMMARY.md` in the correct position — this controls where it appears in the sidebar.
3. To hide a page from the sidebar, simply omit it from `SUMMARY.md`.
