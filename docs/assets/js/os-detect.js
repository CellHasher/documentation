/* OS auto-detection and dynamic download button wiring — Cellhasher Documentation
 *
 * Works with HonKit's client-side pushState navigation:
 *   • MutationObserver detects #ch-download-container being inserted on page change.
 *   • data-ch-init attribute guards against double-initialisation.
 *   • cachedFound stores the resolved asset map for the lifetime of the browser
 *     session so re-visits skip the API fetch.
 */
(function () {
  'use strict';

  const RELEASES_API    = 'https://api.github.com/repos/CellHasher/Beta-Cellhasher/releases?per_page=3';
  const LEGACY_API_BASE = 'https://api.github.com/repos/CellHasher/Beta-Cellhasher/releases?per_page=10&page=1';

  /** Resolved asset map, cached after the first successful fetch/fallback. */
  let cachedFound = null;

  /* ------------------------------------------------------------------ */
  /* OS detection → internal key                                         */
  /* ------------------------------------------------------------------ */
  function detectOS() {
    const ua       = (navigator.userAgent || '').toLowerCase();
    const platform = (navigator.platform  || '').toLowerCase();
    if (/win/.test(platform) || /windows/.test(ua))            return 'windows';
    if (/mac/.test(platform) || /macintosh|mac os x/.test(ua)) {
      if (/arm/.test(platform)) return 'mac-arm64';
      return 'mac-intel';
    }
    if (/linux/.test(platform) || /linux/.test(ua))            return 'linux';
    return null;
  }

  /* ------------------------------------------------------------------ */
  /* Asset filename → internal OS key (raw GitHub releases array path)   */
  /* ------------------------------------------------------------------ */
  function assetMatchesOS(name, os) {
    const n = name.toLowerCase();
    if (os === 'windows')         return /\.exe$/.test(n);
    if (os === 'mac-arm64')       return /aarch64.*\.dmg$/.test(n);
    if (os === 'mac-intel')       return /\.dmg$/.test(n) && !/aarch64/.test(n);
    if (os === 'linux')           return /\.deb$/.test(n);
    if (os === 'linux-appimage')  return /\.appimage$/.test(n);
    return false;
  }

  /* ------------------------------------------------------------------ */
  /* Build "found" map from raw GitHub releases array                    */
  /* found: { windows, 'mac-arm64', 'mac-intel', linux }                */
  /*        each value: { url, version } | null                          */
  /* ------------------------------------------------------------------ */
  function resolveFromReleases(releases) {
    const keys  = ['windows', 'mac-arm64', 'mac-intel', 'linux', 'linux-appimage'];
    const found = { windows: null, 'mac-arm64': null, 'mac-intel': null, linux: null, 'linux-appimage': null };
    let filled = 0;

    for (let i = 0; i < releases.length && filled < keys.length; i++) {
      const rel    = releases[i];
      if (rel.draft) continue;
      const assets = rel.assets || [];
      for (let k = 0; k < keys.length; k++) {
        const key = keys[k];
        if (found[key]) continue;
        for (let j = 0; j < assets.length; j++) {
          const a = assets[j];
          if (a.state === 'uploaded' && assetMatchesOS(a.name, key)) {
            found[key] = { url: a.browser_download_url, version: rel.tag_name };
            filled++;
            break;
          }
        }
      }
    }
    return found;
  }

  /* ------------------------------------------------------------------ */
  /* Build "found" map from the pre-processed releases.json dict         */
  /* releases.json format: { windows, mac_arm, mac_intel, debian }       */
  /*   each: { name, tag_name, browser_download_url }                    */
  /* ------------------------------------------------------------------ */
  function resolveFromDict(dict) {
    function entry(d) {
      return d ? { url: d.browser_download_url, version: d.tag_name } : null;
    }
    return {
      windows    : entry(dict.windows),
      'mac-arm64': entry(dict.mac_arm),
      'mac-intel': entry(dict.mac_intel),
      linux      : entry(dict.debian)
    };
  }

  /* ------------------------------------------------------------------ */
  /* Normalise window.CELLHASHER_RELEASES (any shape) → "found" map     */
  /* ------------------------------------------------------------------ */
  function resolveFromFallback(data) {
    if (!data) return null;
    if (Array.isArray(data)) return resolveFromReleases(data);
    if (data.windows || data.mac_arm || data.mac_intel || data.debian)
      return resolveFromDict(data);
    return null;
  }

  /* ------------------------------------------------------------------ */
  /* GA4 download tracking — fires BEFORE navigating                     */
  /*                                                                     */
  /* Exposed on window so inline onclick attributes set by wireLink()    */
  /* can call it after the IIFE has closed.                              */
  /* ------------------------------------------------------------------ */
  function trackAndDownload(os, version, url) {
    if (typeof window.gtag === 'function') {
      window.gtag('event', 'download_click', { os, version, url });
    }
    setTimeout(function () { window.location.href = url; }, 150);
  }
  window.trackAndDownload = trackAndDownload;

  /* ------------------------------------------------------------------ */
  /* DOM helpers                                                          */
  /* ------------------------------------------------------------------ */
  function show(id) {
    const el = document.getElementById(id);
    if (el) el.removeAttribute('hidden');
  }

  const PLATFORM_ORDER  = ['windows', 'mac-arm64', 'mac-intel', 'linux', 'linux-appimage'];
  const PLATFORM_LABELS = {
    'windows'       : 'Windows (x64)',
    'mac-arm64'     : 'macOS \u2014 Apple Silicon (arm64)',
    'mac-intel'     : 'macOS \u2014 Intel (x64)',
    'linux'         : 'Linux (.deb, amd64)',
    'linux-appimage': 'Linux (.AppImage, amd64)'
  };

  function renderPlatformList(found) {
    const ul = document.getElementById('ch-platform-list');
    if (!ul) return;
    ul.innerHTML = '';
    for (const key of PLATFORM_ORDER) {
      const asset = found[key];
      if (!asset) continue;
      const li  = document.createElement('li');
      const btn = document.createElement('button');
      btn.type        = 'button';
      btn.textContent = PLATFORM_LABELS[key] || key;
      btn.setAttribute('onclick',
        `window.trackAndDownload(${JSON.stringify(key)},${JSON.stringify(asset.version)},${JSON.stringify(asset.url)});return false`);
      li.appendChild(btn);
      ul.appendChild(li);
    }
  }

  /* ------------------------------------------------------------------ */
  /* Render — populate the UI from a resolved "found" map                */
  /* ------------------------------------------------------------------ */
  function render(found) {
    const os = detectOS();

    renderPlatformList(found);
    show('ch-fallback-download');

    const osAsset = os ? found[os] : null;
    if (osAsset) {
      const labels = {
        'windows'       : 'Download for Windows',
        'mac-arm64'     : 'Download for macOS \u2014 Apple Silicon',
        'mac-intel'     : 'Download for macOS \u2014 Intel',
        'linux'         : 'Download for Linux (.deb)',
        'linux-appimage': 'Download for Linux (.AppImage)'
      };
      const btn  = document.getElementById('ch-download-primary');
      const text = document.getElementById('ch-download-primary-text');
      if (btn) {
        if (text) text.textContent = `${labels[os] || 'Download'}  (v${osAsset.version})`;
        btn.setAttribute('onclick',
          `window.trackAndDownload(${JSON.stringify(os)},${JSON.stringify(osAsset.version)},${JSON.stringify(osAsset.url)});return false`);
      }
      show('ch-auto-download');
    }
  }

  /* ================================================================== */
  /* Legacy downloads — paginated older releases                         */
  /* ================================================================== */

  /** Current page's release objects; kept in closure so the change handler can look them up. */
  let legacyReleases = [];

  /**
   * Parse the GitHub Link response header.
   * e.g. <url>; rel="next", <url>; rel="prev"
   * Returns { next: url|null, prev: url|null }.
   */
  function parseLinkHeader(header) {
    const result = { next: null, prev: null };
    if (!header) return result;
    for (const part of header.split(',')) {
      const m = part.trim().match(/^<([^>]+)>;\s*rel="([^"]+)"/);
      if (m) result[m[2]] = m[1];
    }
    return result;
  }

  /**
   * Fetch one page of releases.
   * Throws on rate-limit (403/429) or any other HTTP error.
   * Returns { releases[], nextUrl, prevUrl }.
   */
  async function fetchLegacyPage(url) {
    const r = await fetch(url, {
      headers: {
        'accept'    : 'application/vnd.github+json',
        'user-agent': 'cellhasher-docs'
      }
    });
    if (r.status === 403 || r.status === 429) throw new Error(`Rate limited (HTTP ${r.status})`);
    if (!r.ok)                                throw new Error(`HTTP ${r.status}`);
    const releases = await r.json();
    const links    = parseLinkHeader(r.headers.get('Link'));
    return { releases, nextUrl: links.next, prevUrl: links.prev };
  }

  /** Populate #ch-legacy-select with a page of releases. */
  function renderLegacySelect(releases) {
    legacyReleases = releases;
    const sel = document.getElementById('ch-legacy-select');
    if (!sel) return;
    sel.innerHTML = '';

    const placeholder = document.createElement('option');
    placeholder.value       = '';
    placeholder.disabled    = true;
    placeholder.selected    = true;
    placeholder.textContent = '\u2014 choose a version \u2014';
    sel.appendChild(placeholder);

    let hasOptions = false;
    for (const rel of releases) {
      if (rel.draft) continue;
      const opt = document.createElement('option');
      opt.value       = rel.tag_name;
      opt.textContent = rel.name && rel.name !== rel.tag_name
        ? `${rel.tag_name} \u2014 ${rel.name}`
        : rel.tag_name;
      sel.appendChild(opt);
      hasOptions = true;
    }

    if (!hasOptions) {
      const empty = document.createElement('option');
      empty.disabled    = true;
      empty.textContent = 'No releases on this page';
      sel.appendChild(empty);
    }
  }

  /** Populate #ch-legacy-assets from the assets array of a selected release. */
  function renderLegacyAssets(assets) {
    const ul = document.getElementById('ch-legacy-assets');
    if (!ul) return;
    ul.innerHTML = '';

    const uploaded = (assets || []).filter(a => a.state === 'uploaded');
    if (uploaded.length === 0) {
      const li = document.createElement('li');
      li.textContent = 'No downloadable assets for this release.';
      ul.appendChild(li);
      return;
    }

    for (const a of uploaded) {
      const li   = document.createElement('li');
      const link = document.createElement('a');
      link.href        = a.browser_download_url;
      link.textContent = `Download (${a.name})`;
      link.target      = '_blank';
      link.rel         = 'noopener noreferrer';
      li.appendChild(link);
      ul.appendChild(li);
    }
  }

  /**
   * Wire up the legacy section toggle, pagination, and release→assets flow.
   * Called once per container init, after the HTML has been injected.
   */
  function initLegacy() {
    const toggle  = document.getElementById('ch-legacy-toggle');
    const panel   = document.getElementById('ch-legacy-panel');
    const sel     = document.getElementById('ch-legacy-select');
    const prevBtn = document.getElementById('ch-legacy-prev');
    const nextBtn = document.getElementById('ch-legacy-next');

    if (!toggle || !panel || !sel) return;

    let currentNextUrl = null;
    let currentPrevUrl = null;
    let loaded         = false;

    async function loadPage(url) {
      sel.disabled = true;
      if (prevBtn) prevBtn.hidden = true;
      if (nextBtn) nextBtn.hidden = true;

      const statusEl = document.getElementById('ch-legacy-assets');
      if (statusEl) statusEl.innerHTML = '<li>Loading\u2026</li>';

      try {
        const { releases, nextUrl, prevUrl } = await fetchLegacyPage(url);
        currentNextUrl = nextUrl;
        currentPrevUrl = prevUrl;

        renderLegacySelect(releases);

        if (prevBtn) prevBtn.hidden = !prevUrl;
        if (nextBtn) nextBtn.hidden = !nextUrl;
        if (statusEl) statusEl.innerHTML = '';
      } catch (err) {
        if (statusEl) {
          const li   = document.createElement('li');
          const link = document.createElement('a');
          link.href        = 'https://github.com/CellHasher/Beta-Cellhasher/releases';
          link.target      = '_blank';
          link.rel         = 'noopener noreferrer';
          link.textContent = 'Browse on GitHub';
          li.textContent   = `Failed to load releases: ${err.message}. `;
          li.appendChild(link);
          li.appendChild(document.createTextNode('.'));
          statusEl.innerHTML = '';
          statusEl.appendChild(li);
        }
      } finally {
        sel.disabled = false;
      }
    }

    toggle.addEventListener('click', function () {
      const isHidden = panel.hasAttribute('hidden');
      if (isHidden) {
        panel.removeAttribute('hidden');
        toggle.setAttribute('aria-expanded', 'true');
        if (!loaded) {
          loaded = true;
          loadPage(LEGACY_API_BASE);
        }
      } else {
        panel.setAttribute('hidden', '');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });

    sel.addEventListener('change', function () {
      const rel = legacyReleases.find(r => r.tag_name === sel.value);
      renderLegacyAssets(rel ? rel.assets : []);
    });

    if (prevBtn) {
      prevBtn.addEventListener('click', function () {
        if (currentPrevUrl) loadPage(currentPrevUrl);
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', function () {
        if (currentNextUrl) loadPage(currentNextUrl);
      });
    }
  }

  /* ------------------------------------------------------------------ */
  /* tryInit — idempotent entry point for a single container instance    */
  /*                                                                     */
  /* Sets data-ch-init on the container element so that the             */
  /* MutationObserver does not re-run on internal DOM updates within    */
  /* the same page. When HonKit navigates to a new page it removes the  */
  /* old element and inserts a fresh one (no attribute) — so the next   */
  /* page change triggers a clean init.                                  */
  /* ------------------------------------------------------------------ */
  function tryInit() {
    const releaseLink = document.querySelector(`[href="https://github.com/CellHasher/Beta-Cellhasher/releases"]`)?.parentElement;
    if (releaseLink?.tagName == "LI") {
      releaseLink.innerHTML = `<div id="ch-download-container">
        <!-- Auto-detected primary download — shown by os-detect.js when a match is found -->
        <div id="ch-auto-download" hidden>
          <button id="ch-download-primary" type="button" class="ch-download-btn" aria-label="Download for detected OS">
            <span id="ch-download-primary-text">Detecting your OS&hellip;</span>
          </button>
        </div>

        <!-- Manual / fallback section — always visible; individual items hidden if no asset exists -->
        <div id="ch-fallback-download" hidden>
          <h4>Choose your platform:</h4>
          <ul id="ch-platform-list"></ul>
          <p>
            Or
            <a
              href="https://github.com/CellHasher/Beta-Cellhasher/releases"
              target="_blank"
              rel="noopener noreferrer"
              >browse all releases on GitHub</a
            >.
          </p>
        </div>

        <!-- Legacy / older releases — lazy-loaded on toggle -->
        <div id="ch-legacy-downloads">
          <button id="ch-legacy-toggle" type="button" aria-expanded="false">Legacy Downloads</button>
          <div id="ch-legacy-panel" hidden>
            <label for="ch-legacy-select">Select an older version:</label>
            <select id="ch-legacy-select"></select>
            <div id="ch-legacy-pagination">
              <button id="ch-legacy-prev" type="button" hidden>Previous</button>
              <button id="ch-legacy-next" type="button" hidden>Next</button>
            </div>
            <ul id="ch-legacy-assets"></ul>
          </div>
        </div>
      </div>`;
    }

    const container = document.getElementById('ch-download-container');
    if (!container) return;
    if (container.getAttribute('data-ch-init')) return; // already initialised
    container.setAttribute('data-ch-init', '1');

    /* Wire up legacy section before the async fetch starts */
    initLegacy();

    /* Use cached result when the user navigates back to this page */
    if (cachedFound) {
      render(cachedFound);
      return;
    }

    fetch(RELEASES_API, {
      method : 'GET',
      headers: {
        'accept'    : 'application/vnd.github+json',
        'user-agent': 'cellhasher-docs'
      }
    })
    .then(r => {
      if (!r.ok) throw new Error('HTTP ' + r.status);
      return r.json();
    })
    .then(releases => {
      cachedFound = resolveFromReleases(releases);
      render(cachedFound);
    })
    .catch(err => {
      console.warn('[os-detect] GitHub API failed:', err.message, '— using baked-in fallback.');
      cachedFound = resolveFromFallback(window.CELLHASHER_RELEASES);
      if (cachedFound) {
        render(cachedFound);
      } else {
        show('ch-fallback-download');
      }
    });
  }

  /* ------------------------------------------------------------------ */
  /* MutationObserver — re-runs tryInit on HonKit pushState navigation   */
  /*                                                                     */
  /* HonKit replaces the inner page content without a full reload.       */
  /* We watch for any element with id="ch-download-container" being      */
  /* added to the DOM tree and call tryInit when found.                  */
  /* ------------------------------------------------------------------ */
  if (typeof MutationObserver !== 'undefined') {
    const observer = new MutationObserver(function (mutations) {
      for (const mutation of mutations) {
        for (const node of mutation.addedNodes) {
          if (node.nodeType !== 1) continue; // element nodes only
          if (node.id === 'ch-download-container' ||
              (node.querySelector && (node.querySelector('#ch-download-container') || node.querySelector('[href="https://github.com/CellHasher/Beta-Cellhasher/releases"]')?.parentElement?.tagName === 'LI'))) {
            tryInit();
            return; // one init per mutation batch is enough
          }
        }
      }
    });
    observer.observe(document.documentElement, { childList: true, subtree: true });
  }

  /* Initial load (full page load or hard refresh) */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', tryInit);
  } else {
    tryInit();
  }
}());
