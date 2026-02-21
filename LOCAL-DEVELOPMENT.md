---
hidden: true
---

# Local Development Guide

Internal reference for contributors. This page is hidden from the published documentation.

---

## Overview

This GitBook is synced with the [`CellHasher/documentation`](https://github.com/CellHasher/documentation) GitHub repository. Changes pushed to `main` are automatically published to the live GitBook site. Changes on other branches can be previewed in the GitBook web editor.

---

## Editing Locally

You do not need any special tooling to edit content — all pages are standard Markdown files.

**Recommended editor:** [VS Code](https://code.visualstudio.com/) with the [GitBook Markdown](https://marketplace.visualstudio.com/items?itemName=gitbook.gitbook-markdown) or general Markdown Preview extension.

> Note: GitBook-specific directives (e.g. `{% hint %}`, `{% columns %}`, `{% tabs %}`) will not render in standard Markdown previewers. They render correctly only on the GitBook platform.

### Clone the repo

```bash
git clone git@github.com:CellHasher/documentation.git
cd documentation
```

### Workflow

1. Create a branch off `main`:
   ```bash
   git checkout -b your-name/description
   ```
2. Edit any `.md` files in your editor.
3. Commit and push your branch:
   ```bash
   git add .
   git commit -m "Your change description"
   git push origin your-name/description
   ```
4. Open a PR into `main`. GitBook will publish automatically when merged.

---

## Previewing in GitBook

GitBook supports branch-based previews via the web editor.

1. Go to [gitbook.com](https://app.gitbook.com) and open the **CellHasher** space.
2. In the editor, use the branch selector (top-left) to switch to your branch.
3. GitBook will render a live preview of your changes, including all directives.

---

## Project Structure

```
documentation/
├── README.md                      # Welcome / home page
├── SUMMARY.md                     # Table of contents — controls sidebar nav
├── releases.json                  # Download links for the latest release
├── LOCAL-DEVELOPMENT.md           # This file (hidden)
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

For sitewide pageview tracking (not just the download page), enable the Google Analytics integration in the GitBook space settings:

**GitBook Space → Settings → Integrations → Google Analytics → enter your Measurement ID**

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
3. To hide a page from the sidebar (keep it accessible by URL only), add this frontmatter:
   ```yaml
   ---
   hidden: true
   ---
   ```
