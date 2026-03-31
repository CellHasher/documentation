/* Copy-to-clipboard buttons for code blocks — Cellhasher Documentation
 *
 * Injects a "Copy" button into every <pre> block on each page.
 * Works with HonKit's client-side pushState navigation via MutationObserver.
 */
(function () {
  'use strict';

  function addCopyButtons() {
    var blocks = document.querySelectorAll('pre:not([data-copy-btn])');
    blocks.forEach(function (pre) {
      pre.setAttribute('data-copy-btn', '1');
      pre.style.position = 'relative';

      var btn = document.createElement('button');
      btn.textContent = 'Copy';
      btn.setAttribute('aria-label', 'Copy code to clipboard');
      btn.style.cssText =
        'position:absolute;top:8px;right:8px;padding:2px 10px;font-size:12px;' +
        'color:#555;background:#f0f0f0;border:1px solid #ccc;border-radius:4px;' +
        'cursor:pointer;opacity:0;transition:opacity 0.15s,background 0.15s;z-index:10;';

      pre.addEventListener('mouseenter', function () { btn.style.opacity = '1'; });
      pre.addEventListener('mouseleave', function () { btn.style.opacity = '0'; });

      btn.addEventListener('click', function () {
        var code = pre.querySelector('code');
        var text = code ? code.innerText : pre.innerText;
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(text).then(function () { flash(btn); });
        } else {
          var ta = document.createElement('textarea');
          ta.value = text;
          ta.style.cssText = 'position:fixed;opacity:0;';
          document.body.appendChild(ta);
          ta.select();
          document.execCommand('copy');
          document.body.removeChild(ta);
          flash(btn);
        }
      });

      pre.appendChild(btn);
    });
  }

  function flash(btn) {
    btn.textContent = 'Copied!';
    btn.style.background = '#d4edda';
    btn.style.borderColor = '#28a745';
    btn.style.color = '#155724';
    btn.style.opacity = '1';
    setTimeout(function () {
      btn.textContent = 'Copy';
      btn.style.background = '#f0f0f0';
      btn.style.borderColor = '#ccc';
      btn.style.color = '#555';
    }, 1500);
  }

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
            addCopyButtons();
            return;
          }
        }
      }
    });
    observer.observe(document.documentElement, { childList: true, subtree: true });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', addCopyButtons);
  } else {
    addCopyButtons();
  }
}());
