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

  var RELEASES_API  = 'https://api.github.com/repos/CellHasher/Beta-Cellhasher/releases?per_page=3';
  var RELEASES_PAGE = 'https://github.com/CellHasher/Beta-Cellhasher/releases';

  /** Resolved asset map, cached after the first successful fetch/fallback. */
  var cachedFound = null;

  /* ------------------------------------------------------------------ */
  /* OS detection → internal key                                         */
  /* ------------------------------------------------------------------ */
  function detectOS() {
    var ua       = (navigator.userAgent || '').toLowerCase();
    var platform = (navigator.platform  || '').toLowerCase();
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
    var n = name.toLowerCase();
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
    var keys  = ['windows', 'mac-arm64', 'mac-intel', 'linux', 'linux-appimage'];
    var found = { windows: null, 'mac-arm64': null, 'mac-intel': null, linux: null, 'linux-appimage': null };
    var filled = 0;

    for (var i = 0; i < releases.length && filled < keys.length; i++) {
      var rel = releases[i];
      if (rel.draft) continue;
      var assets = rel.assets || [];
      for (var k = 0; k < keys.length; k++) {
        var key = keys[k];
        if (found[key]) continue;
        for (var j = 0; j < assets.length; j++) {
          var a = assets[j];
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
      window.gtag('event', 'download_click', {
        os: os,
        version: version,
        url: url
      });
    }
    setTimeout(function () {
      window.location.href = url;
    }, 150);
  }
  window.trackAndDownload = trackAndDownload;

  /* ------------------------------------------------------------------ */
  /* DOM helpers                                                          */
  /* ------------------------------------------------------------------ */
  function show(id) { var el = document.getElementById(id); if (el) el.removeAttribute('hidden'); }

  var PLATFORM_ORDER  = ['windows', 'mac-arm64', 'mac-intel', 'linux', 'linux-appimage'];
  var PLATFORM_LABELS = {
    'windows'       : 'Windows (x64)',
    'mac-arm64'     : 'macOS \u2014 Apple Silicon (arm64)',
    'mac-intel'     : 'macOS \u2014 Intel (x64)',
    'linux'         : 'Linux (.deb, amd64)',
    'linux-appimage': 'Linux (.AppImage, amd64)'
  };

  function renderPlatformList(found) {
    var ul = document.getElementById('ch-platform-list');
    if (!ul) return;
    ul.innerHTML = '';
    for (var i = 0; i < PLATFORM_ORDER.length; i++) {
      var key   = PLATFORM_ORDER[i];
      var asset = found[key];
      if (!asset) continue;
      var li  = document.createElement('li');
      var btn = document.createElement('button');
      btn.type        = 'button';
      btn.textContent = PLATFORM_LABELS[key] || key;
      btn.setAttribute('onclick',
        'window.trackAndDownload(' +
        JSON.stringify(key) + ',' +
        JSON.stringify(asset.version) + ',' +
        JSON.stringify(asset.url) + ');return false');
      li.appendChild(btn);
      ul.appendChild(li);
    }
  }

  /* ------------------------------------------------------------------ */
  /* Render — populate the UI from a resolved "found" map                */
  /* ------------------------------------------------------------------ */
  function render(found) {
    var os = detectOS();

    renderPlatformList(found);
    show('ch-fallback-download');

    var osAsset = os ? found[os] : null;
    if (osAsset) {
      var labels = {
        'windows'       : 'Download for Windows',
        'mac-arm64'     : 'Download for macOS \u2014 Apple Silicon',
        'mac-intel'     : 'Download for macOS \u2014 Intel',
        'linux'         : 'Download for Linux (.deb)',
        'linux-appimage': 'Download for Linux (.AppImage)'
      };
      var btn  = document.getElementById('ch-download-primary');
      var text = document.getElementById('ch-download-primary-text');
      if (btn) {
        // btn.href = osAsset.url;
        if (text) text.textContent = (labels[os] || 'Download') + '  (v' + osAsset.version + ')';
        btn.setAttribute('onclick',
          'window.trackAndDownload(' +
          JSON.stringify(os) + ',' +
          JSON.stringify(osAsset.version) + ',' +
          JSON.stringify(osAsset.url) + ');return false');
      }
      show('ch-auto-download');
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
    var container = document.getElementById('ch-download-container');
    if (!container) return;
    if (container.getAttribute('data-ch-init')) return; // already initialised
    container.setAttribute('data-ch-init', '1');

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
    .then(function (r) {
      if (!r.ok) throw new Error('HTTP ' + r.status);
      return r.json();
    })
    .then(function (releases) {
      cachedFound = resolveFromReleases(releases);
      render(cachedFound);
    })
    .catch(function (err) {
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
    var observer = new MutationObserver(function (mutations) {
      for (var i = 0; i < mutations.length; i++) {
        var added = mutations[i].addedNodes;
        for (var j = 0; j < added.length; j++) {
          var node = added[j];
          if (node.nodeType !== 1) continue; // element nodes only
          if (node.id === 'ch-download-container' ||
              (node.querySelector && node.querySelector('#ch-download-container'))) {
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
