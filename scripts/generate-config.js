/**
 * generate-config.js
 *
 * PRE-BUILD script — first step of `npm run build`.
 *
 * Steps:
 *   1. Fetch GitHub Releases API (authenticated if GITHUB_TOKEN is set).
 *   2. Reduce the raw releases array into a per-OS dictionary and write releases.json:
 *        {
 *          "windows"  : { name, tag_name, browser_download_url },
 *          "mac_arm"  : { name, tag_name, browser_download_url },
 *          "mac_intel": { name, tag_name, browser_download_url },
 *          "debian"   : { name, tag_name, browser_download_url }
 *        }
 *      Each key holds the asset from the newest non-draft release that has it.
 *      Missing platforms are omitted from the dict.
 *   3. Write docs/assets/js/analytics-config.js (gitignored) containing:
 *        window.CELLHASHER_GTAG     — GA4 Measurement ID (or empty string)
 *        window.CELLHASHER_RELEASES — the dict above as the browser-side fallback
 *        IIFE that injects consent.css as a <style> element
 *
 * Environment variables:
 *   GTAG          — GA4 Measurement ID (e.g. G-XXXXXXXXXX). Optional.
 *   GITHUB_TOKEN  — Bearer token; raises GitHub API limit from 60 → 5 000 req/hr.
 *                   Provided automatically by GitHub Actions. Optional locally.
 */

'use strict';

const fs   = require('fs');
const path = require('path');

const ROOT         = path.join(__dirname, '..');
const RELEASES_OUT = path.join(ROOT, 'releases.json');
const CSS_SRC      = path.join(ROOT, 'docs', 'assets', 'css', 'consent.css');
const CONFIG_OUT   = path.join(ROOT, 'docs', 'assets', 'js', 'analytics-config.js');

const RELEASES_API = 'https://api.github.com/repos/CellHasher/Beta-Cellhasher/releases?per_page=3';
const GTAG         = (process.env.GTAG         || '').trim();
const GITHUB_TOKEN = (process.env.GITHUB_TOKEN || '').trim();

/* ------------------------------------------------------------------ */
/* Asset filename → dict key mapping                                    */
/*   windows   : *.exe                                                  */
/*   mac_arm   : *aarch64*.dmg                                          */
/*   mac_intel : *.dmg  (no "aarch64")                                  */
/*   debian    : *.deb                                                  */
/* ------------------------------------------------------------------ */
const OS_MATCHERS = [
  { key: 'windows',   test: function (n) { return /\.exe$/i.test(n); } },
  { key: 'mac_arm',   test: function (n) { return /aarch64.*\.dmg$/i.test(n); } },
  { key: 'mac_intel', test: function (n) { return /\.dmg$/i.test(n) && !/aarch64/i.test(n); } },
  { key: 'debian',    test: function (n) { return /\.deb$/i.test(n); } },
];

/**
 * Reduce a raw GitHub releases array (newest first) into the per-OS dict.
 * Each key is set once — from the newest release that has that asset.
 */
function buildDict(releases) {
  var dict = {};
  for (var i = 0; i < releases.length; i++) {
    var rel = releases[i];
    if (rel.draft) continue;
    var assets = rel.assets || [];
    for (var m = 0; m < OS_MATCHERS.length; m++) {
      var matcher = OS_MATCHERS[m];
      if (dict[matcher.key]) continue; // already found the newest asset for this OS
      for (var j = 0; j < assets.length; j++) {
        var a = assets[j];
        if (a.state === 'uploaded' && matcher.test(a.name)) {
          dict[matcher.key] = {
            name                : a.name,
            tag_name            : rel.tag_name,
            browser_download_url: a.browser_download_url
          };
          break;
        }
      }
    }
    // All four keys filled — no need to look at older releases
    if (Object.keys(dict).length === OS_MATCHERS.length) break;
  }
  return dict;
}

/* ------------------------------------------------------------------ */
/* Fetch                                                                */
/* ------------------------------------------------------------------ */
async function fetchReleases() {
  var headers = {
    'accept'    : 'application/vnd.github+json',
    'user-agent': 'cellhasher-docs-build'
  };
  if (GITHUB_TOKEN) headers['authorization'] = 'Bearer ' + GITHUB_TOKEN;

  var res = await fetch(RELEASES_API, { method: 'GET', headers: headers });
  if (!res.ok) throw new Error('GitHub API HTTP ' + res.status + ' ' + res.statusText);
  return res.json();
}

/* ------------------------------------------------------------------ */
/* Main                                                                 */
/* ------------------------------------------------------------------ */
async function main() {
  /* --- Step 1: fetch and build dict --- */
  var dict = null;

  try {
    var releases = await fetchReleases();
    dict = buildDict(releases);
    fs.writeFileSync(RELEASES_OUT, JSON.stringify(dict, null, 2), 'utf8');
    console.log('[generate-config] releases.json    : written (' + Object.keys(dict).join(', ') + ')');
  } catch (err) {
    console.warn('[generate-config] WARNING: GitHub API fetch failed —', err.message);
    if (fs.existsSync(RELEASES_OUT)) {
      try {
        dict = JSON.parse(fs.readFileSync(RELEASES_OUT, 'utf8'));
        console.warn('[generate-config] Falling back to existing releases.json.');
      } catch (e2) {
        console.warn('[generate-config] WARNING: could not parse existing releases.json —', e2.message);
      }
    } else {
      console.warn('[generate-config] No releases.json fallback — CELLHASHER_RELEASES will be null.');
    }
  }

  /* --- Step 2: read consent.css --- */
  var cssContent = '';
  if (fs.existsSync(CSS_SRC)) {
    cssContent = fs.readFileSync(CSS_SRC, 'utf8');
  } else {
    console.warn('[generate-config] WARNING: consent.css not found at', CSS_SRC);
  }

  /* --- Step 3: write analytics-config.js --- */
  var cssLiteral      = JSON.stringify(cssContent);
  var releasesLiteral = dict ? JSON.stringify(dict) : 'null';

  var output = '/* AUTO-GENERATED by scripts/generate-config.js — do not edit manually.\n'
    + ' * Fetched from the GitHub Releases API at build time.\n'
    + ' * Regenerate locally:  node scripts/generate-config.js\n'
    + ' */\n'
    + 'window.CELLHASHER_GTAG     = ' + JSON.stringify(GTAG) + ';\n'
    + 'window.CELLHASHER_RELEASES = ' + releasesLiteral + ';\n'
    + '(function () {\n'
    + '  if (!' + cssLiteral + ') return;\n'
    + '  if (document.getElementById(\'ch-consent-styles\')) return;\n'
    + '  var s = document.createElement(\'style\');\n'
    + '  s.id = \'ch-consent-styles\';\n'
    + '  s.textContent = ' + cssLiteral + ';\n'
    + '  (document.head || document.documentElement).appendChild(s);\n'
    + '}());\n';

  fs.writeFileSync(CONFIG_OUT, output, 'utf8');

  /* --- Summary --- */
  console.log('[generate-config] analytics-config.js:', path.relative(ROOT, CONFIG_OUT), '— written.');
  console.log('[generate-config] GTAG               :', GTAG || '(not set)');
  console.log('[generate-config] GitHub auth         :', GITHUB_TOKEN ? 'token provided' : 'unauthenticated (60 req/hr)');
}

main().catch(function (err) {
  console.error('[generate-config] FATAL:', err.message);
  process.exit(1);
});
