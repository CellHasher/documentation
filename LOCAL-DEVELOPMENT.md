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

> **After pulling changes that touch `package.json`** (e.g. the `honkit-plugin-add-js`
> dependency was added): always re-run `npm install` to pick up new packages. The CI
> pipeline uses `npm install` for the same reason.

### Workflow

1. Create a branch off `main`:
   ```bash
   git checkout -b your-name/description
   ```
2. Edit any `.md` files in your editor.
3. Preview your changes locally:
   ```bash
   # Fast live-reload (no analytics injection — good for content editing)
   npm run serve:content

   # Full build preview with analytics injected (mirrors the deployed site)
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
| `npm run build` | Generate `analytics-config.js`, then build static HTML via HonKit (scripts injected by plugin) |
| `npm run serve` | Full build then serve at `http://localhost:4000` — supports `GTAG` env var |
| `npm run serve:content` | Generate config then start HonKit live-reload dev server — good for fast content editing |
| `npm run lint` | Run Markdown linter |
| `npm run links` | Check all internal and external links |
| `npm test` | Run lint + link checks |

---

## Project Structure

```
documentation/
├── README.md                      # Welcome / home page
├── SUMMARY.md                     # Table of contents — controls sidebar nav
├── book.json                      # HonKit configuration (includes add-js plugin)
├── package.json                   # Node.js dependencies and scripts
├── releases.json                  # Download links for the latest release
├── LOCAL-DEVELOPMENT.md           # This file
├── .gitignore
├── .markdownlint.json             # Markdown lint rules
├── .mlc.json                      # Link checker config
├── .github/workflows/docs.yml     # GitHub Pages CI pipeline
├── .gitlab-ci.yml                 # GitLab Pages CI pipeline
├── .gitbook/assets/               # Images and media
├── scripts/
│   ├── generate-config.js         # Pre-build: writes analytics-config.js
│   ├── serve.js                   # Local static file server (npm run serve)
│   └── inject-analytics.js        # Superseded — kept as reference only
├── docs/assets/
│   ├── css/consent.css            # Consent modal + download button styles
│   └── js/
│       ├── analytics-config.js    # AUTO-GENERATED (committed as empty placeholder)
│       ├── consent.js             # GDPR consent modal + GA4 loader
│       └── os-detect.js          # OS detection + download button wiring
├── cellhasher-chassis/            # Hardware setup guides
├── cellhasher-control/            # Software download and usage guides
│   ├── installing.md              # Download page with OS auto-detection UI
│   ├── tabs-walkthrough/          # Detailed tab-by-tab walkthrough
│   └── how-to-use/                # Quick how-to guides
└── additional-docs/               # Supplementary docs (ADB, debugging, etc.)
```

---

## Download Links (`releases.json`)

`releases.json` is a **generated, gitignored build artifact** — do not commit it.

It is written automatically by `scripts/generate-config.js` (the first step of
`npm run build`) by fetching:

```
GET https://api.github.com/repos/CellHasher/Beta-Cellhasher/releases?per_page=3
Accept: application/vnd.github+json
```

In CI the request is authenticated via `GITHUB_TOKEN` (5 000 req/hr limit). Locally
it is unauthenticated (60 req/hr). If the fetch fails for any reason, the script falls
back to the last known `releases.json` if it is present on disk — otherwise
`window.CELLHASHER_RELEASES` is set to `null` and the browser falls back to showing
only the GitHub Releases page link.

**No manual update is ever needed** when a new GitHub Release is published. The next
CI build will pick it up automatically.

### How download links resolve at runtime

`os-detect.js` runs in the browser and independently fetches the same API endpoint
live on each page load. It scans the response (newest release first, drafts skipped)
and picks the first asset whose filename matches the visitor's OS:

| OS | Filename pattern |
|---|---|
| Windows | `*.exe` |
| macOS — Apple Silicon | `*aarch64*.dmg` |
| macOS — Intel | `*.dmg` (excluding `aarch64`) |
| Linux | `*.deb` |

If the live fetch fails, it falls back to `window.CELLHASHER_RELEASES` (the releases
array baked in at build time). If that is also unavailable, individual per-platform
links are hidden and only the "browse all releases on GitHub" link is shown.

> **Local development:** Run `node scripts/generate-config.js` to regenerate
> `releases.json` and `analytics-config.js` without doing a full build.

---

## Google Analytics

GA4 is injected at build time via `honkit-plugin-add-js`. The consent popup always
appears on first load; GA4 only loads after the user clicks **Enable Analytics**.

### Serving / building locally with analytics enabled

Pass `GTAG` before calling `npm run serve` or `npm run build`.
Both commands read the same environment variable — `npm run serve` builds first and
then starts the static server, so the injected GTAG is live at `http://localhost:4000`.

**Linux / macOS**

```bash
GTAG=G-XXX npm run serve
GTAG=G-XXX npm run build   # build only, no server
```

**Windows — Command Prompt**

```cmd
set GTAG=G-XXX && npm run serve
set GTAG=G-XXX && npm run build
```

**Windows — PowerShell**

```powershell
$env:GTAG = "G-XXX"; npm run serve
$env:GTAG = "G-XXX"; npm run build
```

Replace `G-XXX` with your actual GA4 Measurement ID.

> **Without `GTAG`:** Running `npm run serve` or `npm run build` without the variable
> is fine — the inject script will warn that no GTAG is set, the consent popup will
> still appear, but GA4 will not load even if the user accepts. This is the expected
> behaviour for local builds.

### How the injection works

`npm run build` runs two steps in sequence:

**Step 1 — `node scripts/generate-config.js`** (pre-build)

1. Fetches the GitHub Releases API (authenticated in CI via `GITHUB_TOKEN`)
2. Writes `releases.json` — the raw API response array (gitignored)
3. Writes `docs/assets/js/analytics-config.js` (gitignored) containing:
   - `window.CELLHASHER_GTAG` — the GA4 Measurement ID from the `GTAG` env var
   - `window.CELLHASHER_RELEASES` — the raw releases array as a browser-side fallback
   - An IIFE that creates a `<style>` tag from `docs/assets/css/consent.css`

Both output files are gitignored; they are always regenerated at build time.

**Step 2 — `honkit build . _book`** (build)

`honkit-plugin-add-js` (configured in `book.json → pluginsConfig.add-js.js`) copies
the three files below into HonKit's asset pipeline and injects a `<script>` tag for
each into every built page, **in this order**:

1. `analytics-config.js` — sets globals + injects CSS (must be first)
2. `consent.js`          — reads `window.CELLHASHER_GTAG`, shows modal if needed
3. `os-detect.js`        — fetches GitHub Releases API, wires download buttons; falls back to `window.CELLHASHER_RELEASES` on error

### Download event tracking

Download click events fire via `gtag('event', 'download', { os, version })`.
The `gtag` function is only defined after the user grants consent, so no events
are sent if analytics is disabled.

To view download events in GA4: **Reports → Engagement → Events → `download`**

### Updating the Measurement ID in CI

The `GTAG` value in GitHub Actions comes from a **repository variable** (not a secret):

1. Go to your repository → **Settings → Secrets and variables → Actions → Variables**.
2. Create or update a variable named `GTAG` with your GA4 Measurement ID.
3. The workflow passes it as `GTAG: ${{ vars.GTAG }}` in the build step — no code
   changes are required.

---

## Adding New Pages

1. Create a new `.md` file in the appropriate folder.
2. Add it to `SUMMARY.md` in the correct position — this controls where it appears in the sidebar.
3. To hide a page from the sidebar, simply omit it from `SUMMARY.md`.
