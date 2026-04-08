/* Cellhasher Dark Theme Loader — GitBook-Style
 *
 * Injected via honkit-plugin-add-js.
 *
 * Responsibilities:
 *   1. Load the custom theme CSS
 *   2. Inject branded sidebar header (icon + "Cellhasher Docs")
 *   3. Add icons to sidebar section headers
 *   4. Mark sidebar items with children for right-side arrow CSS
 *   5. Inject section breadcrumb above page title
 *   6. Style blockquotes as GitBook-style hint blocks
 *   7. Subtle page transitions
 *
 * Works with HonKit's pushState navigation via MutationObserver.
 */
(function () {
  'use strict';

  /* ------------------------------------------------------------------ */
  /* SVG Icons                                                           */
  /* ------------------------------------------------------------------ */
  var ICONS = {
    chassis: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>',
    control: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>',
    docs: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>',
    brand: '<svg width="16" height="16" viewBox="0 0 24 24" fill="white"><rect x="3" y="3" width="18" height="18" rx="3" fill="none" stroke="white" stroke-width="2"/><rect x="7" y="7" width="4" height="10" rx="1" fill="white"/><rect x="13" y="7" width="4" height="10" rx="1" fill="white"/></svg>',
    external: '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>'
  };

  /* Map section header text → icon key */
  var SECTION_ICON_MAP = {
    'cellhasher chassis': 'chassis',
    'cellhasher control': 'control',
    'additional docs': 'docs'
  };

  /* Map section header text → breadcrumb display */
  var SECTION_BREADCRUMB_MAP = {
    'cellhasher chassis': { text: 'CELLHASHER CHASSIS', icon: 'chassis' },
    'cellhasher control': { text: 'CELLHASHER CONTROL', icon: 'control' },
    'additional docs': { text: 'ADDITIONAL DOCS', icon: 'docs' }
  };

  /* ------------------------------------------------------------------ */
  /* 1. Inject theme CSS                                                 */
  /* ------------------------------------------------------------------ */
  function injectThemeCSS() {
    if (document.getElementById('ch-theme-css')) return;

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
      '<div class="ch-brand-icon">' + ICONS.brand + '</div>' +
      '<span class="ch-brand-name">Cellhasher Docs</span>';

    if (summary.firstChild) {
      summary.insertBefore(brand, summary.firstChild);
    } else {
      summary.appendChild(brand);
    }
  }

  /* ------------------------------------------------------------------ */
  /* 3. Add icons to sidebar section headers                             */
  /* ------------------------------------------------------------------ */
  function addSidebarIcons() {
    var headers = document.querySelectorAll('.book-summary .summary li.header');
    headers.forEach(function (header) {
      if (header.getAttribute('data-ch-icon')) return;
      header.setAttribute('data-ch-icon', '1');

      var text = header.textContent.trim().toLowerCase();
      var iconKey = SECTION_ICON_MAP[text];
      if (!iconKey) return;

      var iconSpan = document.createElement('span');
      iconSpan.style.cssText = 'display:inline-flex;align-items:center;margin-right:6px;vertical-align:middle;opacity:0.64;';
      iconSpan.innerHTML = ICONS[iconKey];
      header.insertBefore(iconSpan, header.firstChild);
    });

    /* Also try dividers (some HonKit versions use this class) */
    var dividers = document.querySelectorAll('.book-summary .summary .divider');
    dividers.forEach(function (divider) {
      if (divider.getAttribute('data-ch-icon')) return;
      divider.setAttribute('data-ch-icon', '1');

      var text = divider.textContent.trim().toLowerCase();
      var iconKey = SECTION_ICON_MAP[text];
      if (!iconKey) return;

      var iconSpan = document.createElement('span');
      iconSpan.style.cssText = 'display:inline-flex;align-items:center;margin-right:6px;vertical-align:middle;opacity:0.64;';
      iconSpan.innerHTML = ICONS[iconKey];
      divider.insertBefore(iconSpan, divider.firstChild);
    });
  }

  /* ------------------------------------------------------------------ */
  /* 4. Mark sidebar items that have children (for right-side arrow CSS) */
  /* ------------------------------------------------------------------ */
  function markSubItems() {
    var items = document.querySelectorAll('.book-summary .summary li.chapter');
    items.forEach(function (li) {
      if (li.querySelector('ul.articles')) {
        li.classList.add('has-sub');
      }
    });
  }

  /* ------------------------------------------------------------------ */
  /* 5. Add external link icons to outbound sidebar links                */
  /* ------------------------------------------------------------------ */
  function addExternalIcons() {
    var links = document.querySelectorAll('.book-summary .summary li.chapter a[target="_blank"]');
    links.forEach(function (a) {
      if (a.getAttribute('data-ch-ext')) return;
      a.setAttribute('data-ch-ext', '1');

      var iconSpan = document.createElement('span');
      iconSpan.style.cssText = 'display:inline-flex;align-items:center;margin-left:6px;opacity:0.4;';
      iconSpan.innerHTML = ICONS.external;
      a.appendChild(iconSpan);
    });
  }

  /* ------------------------------------------------------------------ */
  /* 6. Inject section breadcrumb above page title                       */
  /* ------------------------------------------------------------------ */
  function injectBreadcrumb() {
    /* Remove existing breadcrumb (SPA navigation) */
    var existing = document.getElementById('ch-breadcrumb');
    if (existing) existing.parentNode.removeChild(existing);

    /* Find the active sidebar item and determine which section it belongs to */
    var activeItem = document.querySelector('.book-summary .summary li.chapter.active');
    if (!activeItem) return;

    /* Walk backwards through siblings to find the section header */
    var sectionText = null;
    var el = activeItem;
    while (el) {
      el = el.previousElementSibling;
      if (el && (el.classList.contains('header') || el.classList.contains('divider'))) {
        sectionText = el.textContent.trim().toLowerCase();
        break;
      }
    }

    /* If not found at this level, check parent (for nested items) */
    if (!sectionText) {
      var parentLi = activeItem.closest('ul.articles')?.closest('li.chapter');
      if (parentLi) {
        el = parentLi;
        while (el) {
          el = el.previousElementSibling;
          if (el && (el.classList.contains('header') || el.classList.contains('divider'))) {
            sectionText = el.textContent.trim().toLowerCase();
            break;
          }
        }
      }
    }

    if (!sectionText) return;

    /* Remove any icon text that was prepended */
    for (var key in SECTION_ICON_MAP) {
      if (sectionText.indexOf(key) !== -1) {
        sectionText = key;
        break;
      }
    }

    var breadcrumbInfo = SECTION_BREADCRUMB_MAP[sectionText];
    if (!breadcrumbInfo) return;

    /* Find the first h1 in the content */
    var h1 = document.querySelector('.page-inner section.normal h1');
    if (!h1) return;

    var breadcrumb = document.createElement('div');
    breadcrumb.id = 'ch-breadcrumb';
    breadcrumb.innerHTML = ICONS[breadcrumbInfo.icon] + ' ' + breadcrumbInfo.text;

    h1.parentNode.insertBefore(breadcrumb, h1);
  }

  /* ------------------------------------------------------------------ */
  /* 7. Style blockquotes as GitBook-style hint blocks                   */
  /* ------------------------------------------------------------------ */
  function styleHintBlocks() {
    var blockquotes = document.querySelectorAll('.page-inner section blockquote');
    blockquotes.forEach(function (bq) {
      if (bq.getAttribute('data-ch-hint')) return;
      bq.setAttribute('data-ch-hint', '1');

      var firstP = bq.querySelector('p');
      if (!firstP) return;
      var text = firstP.textContent.trim();

      var hintType = 'info';
      if (/^(danger|warning)\s*:/i.test(text) || /^⚠/.test(text) || /🚨/.test(text)) {
        hintType = 'danger';
      } else if (/^(caution|attention)\s*:/i.test(text) || /^⚡/.test(text)) {
        hintType = 'warning';
      } else if (/^(success|tip|done)\s*:/i.test(text) || /^✅/.test(text) || /^💡/.test(text)) {
        hintType = 'success';
      }

      bq.classList.add('hint-' + hintType);
    });
  }

  /* ------------------------------------------------------------------ */
  /* 8. Page transition                                                  */
  /* ------------------------------------------------------------------ */
  function addPageTransition() {
    if (document.getElementById('ch-transition-style')) return;
    var style = document.createElement('style');
    style.id = 'ch-transition-style';
    style.textContent =
      '@keyframes ch-fade-in { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: translateY(0); } }' +
      '.page-inner section.normal { animation: ch-fade-in 0.2s ease-out; }';
    document.head.appendChild(style);
  }

  /* ------------------------------------------------------------------ */
  /* Init                                                                */
  /* ------------------------------------------------------------------ */
  function init() {
    injectThemeCSS();
    injectSidebarBrand();
    addSidebarIcons();
    markSubItems();
    addExternalIcons();
    injectBreadcrumb();
    styleHintBlocks();
    addPageTransition();
  }

  function onPageChange() {
    injectSidebarBrand();
    addSidebarIcons();
    markSubItems();
    addExternalIcons();
    injectBreadcrumb();
    styleHintBlocks();
  }

  /* Watch for HonKit SPA navigation */
  if (typeof MutationObserver !== 'undefined') {
    var currentUrl = location.href;
    var observer = new MutationObserver(function (mutations) {
      if (location.href !== currentUrl) {
        currentUrl = location.href;
        onPageChange();
        return;
      }
      for (var i = 0; i < mutations.length; i++) {
        var added = mutations[i].addedNodes;
        for (var j = 0; j < added.length; j++) {
          var node = added[j];
          if (node.nodeType !== 1) continue;
          if (
            (node.tagName === 'SECTION' && node.classList.contains('normal')) ||
            (node.querySelector && node.querySelector('section.normal'))
          ) {
            onPageChange();
            return;
          }
        }
      }
    });
    observer.observe(document.documentElement, { childList: true, subtree: true });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
}());
