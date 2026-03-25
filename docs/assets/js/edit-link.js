/* GitHub edit-link button — Cellhasher Documentation
 *
 * Injects an "Edit on GitHub" button into .book-header on every page.
 * Works with HonKit's client-side pushState navigation via MutationObserver.
 */
(function () {
  'use strict';

  var GITHUB_EDIT_BASE = 'https://github.com/CellHasher/documentation/edit/main/';
  var ROUTE_PREFIX_TO_REMOVE = 'documentation';

  /* Convert an HTML path to a GitHub MD path */
  function dataPathToMdPath(dataPath) {
    if (!dataPath || dataPath === './') return 'README.md';
    // trailing slash means directory index → index.md
    if (dataPath.slice(-1) === '/') return dataPath + 'index.md';
    // .html → .md
    return dataPath.replace(/\.html$/, '.md');
  }

  function getEditUrl() {
    var pathname = window.location.pathname;
    // Strip leading slash and any base path segments to get the page-relative path
    var pagePath = pathname.replace(/^\//, '');

    if (ROUTE_PREFIX_TO_REMOVE) {
      var routePrefix = ROUTE_PREFIX_TO_REMOVE.replace(/^\/+|\/+$/g, '') + '/';
      if (pagePath.indexOf(routePrefix) === 0) {
        pagePath = pagePath.slice(routePrefix.length);
      } else if (pagePath === ROUTE_PREFIX_TO_REMOVE.replace(/^\/+|\/+$/g, '')) {
        pagePath = '';
      }
    }

    // Root or empty → fall back to data-path (handles localhost:4000/ etc.)
    if (!pagePath || pagePath === '/' || pagePath === 'index.html') {
      var active = document.querySelector('.chapter.active[data-path]');
      if (!active) return null;
      pagePath = active.getAttribute('data-path') || './';
    }

    var mdPath = dataPathToMdPath(pagePath);
    return GITHUB_EDIT_BASE + mdPath;
  }

  function injectButton(url) {
    var header = document.querySelector('.book-header');
    if (!header) return;
    header.style.position = 'relative';

    /* Remove any previously injected button (SPA navigation) */
    var existing = document.getElementById('ch-edit-link');
    if (existing) existing.parentNode.removeChild(existing);

    var link = document.createElement('a');
    link.id = 'ch-edit-link';
    link.href = url;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.setAttribute('aria-label', 'Edit this page on GitHub');
    link.title = 'Edit on GitHub';
    link.innerHTML =
      '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" ' +
      'fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ' +
      'aria-hidden="true" style="vertical-align:-2px;margin-right:5px">' +
      '<path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>' +
      '<path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>' +
      '</svg>Edit on GitHub';

    link.style.cssText =
      'display:inline-flex;align-items:center;font-size:13px;' +
      'color:#555;text-decoration:none;padding:3px 8px;border:1px solid #ddd;' +
      'border-radius:4px;background:#f8f8f8;position:absolute;right:105px;top:50%;' +
      'transform:translateY(-50%);transition:background 0.15s,color 0.15s;';

    link.addEventListener('mouseover', function () {
      link.style.background = '#e8f0fe';
      link.style.color = '#1a73e8';
      link.style.borderColor = '#1a73e8';
    });
    link.addEventListener('mouseout', function () {
      link.style.background = '#f8f8f8';
      link.style.color = '#555';
      link.style.borderColor = '#ddd';
    });

    header.appendChild(link);
  }

  function tryInit() {
    var url = getEditUrl();
    if (url) injectButton(url);
  }

  /* Watch for HonKit pushState navigation.
   * HonKit swaps the <section class="normal markdown-section"> inside .page-inner
   * on every client-side navigation — detect that and re-inject the button. */
  if (typeof MutationObserver !== 'undefined') {
    var observer = new MutationObserver(function (mutations) {
      for (var i = 0; i < mutations.length; i++) {
        var added = mutations[i].addedNodes;
        for (var j = 0; j < added.length; j++) {
          var node = added[j];
          if (node.nodeType !== 1) continue;
          if (
            (node.tagName === 'SECTION' && node.classList.contains('normal')) ||
            (node.querySelector && node.querySelector('section.normal'))
          ) {
            tryInit();
            return;
          }
        }
      }
    });
    observer.observe(document.documentElement, { childList: true, subtree: true });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', tryInit);
  } else {
    tryInit();
  }
}());
