/* Modern Bold Theme — Cellhasher Documentation
 *
 * Injected via honkit-plugin-add-js.
 * Responsibilities:
 *   1. Load the custom theme CSS from docs/assets/css/theme.css
 *   2. Inject branded sidebar header (logo + name)
 *   3. Load Inter + JetBrains Mono fonts
 *
 * Works with HonKit's pushState navigation via MutationObserver.
 */
(function () {
  'use strict';

  /* ------------------------------------------------------------------ */
  /* 1. Inject theme CSS                                                 */
  /* ------------------------------------------------------------------ */
  function injectThemeCSS() {
    if (document.getElementById('ch-theme-css')) return;

    /* Determine the base path for assets.
     * HonKit exposes gitbook.state.basePath (e.g. "." or "..") on each page.
     * Fallback: find a <link> to styles/website.css and derive from that. */
    var basePath = '.';
    if (typeof gitbook !== 'undefined' && gitbook.state && gitbook.state.basePath) {
      basePath = gitbook.state.basePath;
    } else {
      var links = document.querySelectorAll('link[rel="stylesheet"]');
      for (var i = 0; i < links.length; i++) {
        var href = links[i].getAttribute('href') || '';
        var idx = href.indexOf('gitbook/');
        if (idx !== -1) {
          basePath = href.substring(0, idx).replace(/\/+$/, '') || '.';
          break;
        }
      }
    }

    var link = document.createElement('link');
    link.id = 'ch-theme-css';
    link.rel = 'stylesheet';
    link.href = basePath + '/docs/assets/css/theme.css';
    document.head.appendChild(link);
  }

  /* ------------------------------------------------------------------ */
  /* 2. Inject sidebar branding                                          */
  /* ------------------------------------------------------------------ */
  function injectSidebarBrand() {
    if (document.getElementById('ch-sidebar-brand')) return;

    var summary = document.querySelector('.book-summary');
    if (!summary) return;

    var brand = document.createElement('div');
    brand.id = 'ch-sidebar-brand';
    brand.innerHTML =
      '<div class="ch-brand-text">' +
        '<span class="ch-brand-name">Cellhasher</span>' +
        '<span class="ch-brand-label">Documentation</span>' +
      '</div>';

    /* Insert before the first child */
    if (summary.firstChild) {
      summary.insertBefore(brand, summary.firstChild);
    } else {
      summary.appendChild(brand);
    }
  }

  /* ------------------------------------------------------------------ */
  /* 3. Enhance page transitions (fade-in on navigation)                 */
  /* ------------------------------------------------------------------ */
  function addPageTransition() {
    var style = document.createElement('style');
    style.textContent =
      '@keyframes ch-fade-in { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }' +
      '.page-inner section.normal { animation: ch-fade-in 0.3s ease-out; }';
    document.head.appendChild(style);
  }

  /* ------------------------------------------------------------------ */
  /* Init                                                                */
  /* ------------------------------------------------------------------ */
  function init() {
    injectThemeCSS();
    injectSidebarBrand();
    addPageTransition();
  }

  /* Watch for HonKit SPA navigation */
  if (typeof MutationObserver !== 'undefined') {
    var observer = new MutationObserver(function () {
      injectSidebarBrand();
    });

    var target = document.querySelector('.book-summary') || document.documentElement;
    observer.observe(target, { childList: true, subtree: true });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
}());
