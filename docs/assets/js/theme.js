/* Cellhasher Dark Theme Loader — GitBook-Style
 *
 * Injected via honkit-plugin-add-js.
 *
 * Responsibilities:
 *   1. Load the custom theme CSS
 *   2. Inject branded sidebar header (icon + "Cellhasher Docs")
 *   3. Add icons to sidebar section headers (CELLHASHER CHASSIS, etc.)
 *   4. Style blockquotes as GitBook-style hint blocks (info, warning, danger)
 *   5. Subtle page transitions
 *
 * Works with HonKit's pushState navigation via MutationObserver.
 */
(function () {
  'use strict';

  /* ------------------------------------------------------------------ */
  /* SVG Icons (inline, no external deps)                                */
  /* ------------------------------------------------------------------ */
  var ICONS = {
    /* Box/package icon for CELLHASHER CHASSIS */
    chassis: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>',
    /* Monitor/desktop icon for CELLHASHER CONTROL */
    control: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>',
    /* File/document icon for ADDITIONAL DOCS */
    docs: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>',
    /* Brand icon (small cellhasher logo placeholder) */
    brand: '<svg width="16" height="16" viewBox="0 0 24 24" fill="white"><rect x="3" y="3" width="18" height="18" rx="3" fill="none" stroke="white" stroke-width="2"/><rect x="7" y="7" width="4" height="10" rx="1" fill="white"/><rect x="13" y="7" width="4" height="10" rx="1" fill="white"/></svg>'
  };

  /* Map section header text → icon key */
  var SECTION_ICON_MAP = {
    'cellhasher chassis': 'chassis',
    'cellhasher control': 'control',
    'additional docs': 'docs'
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

    /* Insert before the first child */
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
  /* 4. Style blockquotes as GitBook-style hint blocks                   */
  /* ------------------------------------------------------------------ */
  function styleHintBlocks() {
    var blockquotes = document.querySelectorAll('.page-inner section blockquote');
    blockquotes.forEach(function (bq) {
      if (bq.getAttribute('data-ch-hint')) return;
      bq.setAttribute('data-ch-hint', '1');

      /* Detect hint type from text content */
      var firstP = bq.querySelector('p');
      if (!firstP) return;
      var text = firstP.textContent.trim();

      var hintType = 'info'; /* default */
      if (/^(danger|warning)\s*:/i.test(text) || /^⚠️/.test(text) || /^🚨/.test(text)) {
        hintType = 'danger';
      } else if (/^(caution|attention)\s*:/i.test(text) || /^⚡/.test(text)) {
        hintType = 'warning';
      } else if (/^(success|tip)\s*:/i.test(text) || /^✅/.test(text) || /^💡/.test(text)) {
        hintType = 'success';
      }
      /* info covers: Note:, Info:, ℹ️, or no prefix */

      /* Apply hint styling via inline styles for specificity */
      var colors = {
        info:    { border: '#44A5F2', bg: 'rgba(68, 165, 242, 0.06)' },
        danger:  { border: '#E5534B', bg: 'rgba(229, 83, 75, 0.06)' },
        warning: { border: '#E09B13', bg: 'rgba(224, 155, 19, 0.06)' },
        success: { border: '#3FB950', bg: 'rgba(63, 185, 80, 0.06)' }
      };

      var c = colors[hintType];
      bq.style.cssText =
        'background:' + c.bg + ' !important;' +
        'border:1px solid ' + c.border + '22 !important;' +
        'border-left:3px solid ' + c.border + ' !important;' +
        'border-radius:0 8px 8px 0 !important;' +
        'padding:1rem 1.25rem !important;' +
        'margin:1.25rem 0 !important;';
    });
  }

  /* ------------------------------------------------------------------ */
  /* 5. Page transition                                                  */
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
    styleHintBlocks();
    addPageTransition();
  }

  function onPageChange() {
    injectSidebarBrand();
    addSidebarIcons();
    styleHintBlocks();
  }

  /* Watch for HonKit SPA navigation */
  if (typeof MutationObserver !== 'undefined') {
    var currentUrl = location.href;
    var observer = new MutationObserver(function (mutations) {
      /* Re-run on URL change or new section content */
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
