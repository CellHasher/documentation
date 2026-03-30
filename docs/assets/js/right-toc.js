(function () {
  function addStyle(css) {
    const style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);
  }

  function hideSidebarItems() {
    const hideTitles = ['Installing', 'How to Use'];
    const summary = document.querySelector('.book-summary .summary');
    if (!summary) return;

    summary.querySelectorAll('li.chapter').forEach((li) => {
      const a = li.querySelector(':scope > a');
      if (!a) return;
      const title = a.textContent.trim();
      if (hideTitles.includes(title)) {
        li.style.display = 'none';
      }
    });
  }

  function hideNavButtons() {
    document.querySelectorAll('a.navigation-prev, a.navigation-next').forEach((el) => {
      el.style.display = 'none';
    });
  }

  function buildRightToc() {
    const section = document.querySelector('.page-inner .normal.markdown-section');
    if (!section) return;

    const headingSelectors = 'h1, h2, h3';
    const headings = Array.from(section.querySelectorAll(headingSelectors)).filter((h) => h.textContent.trim());
    if (!headings.length) return;

    const toc = document.createElement('aside');
    toc.id = 'custom-right-toc';
    toc.setAttribute('aria-label', 'On this page');

    const title = document.createElement('div');
    title.className = 'custom-right-toc-title';
    title.textContent = 'On this page';
    toc.appendChild(title);

    const list = document.createElement('ul');
    list.className = 'custom-right-toc-list';

    headings.forEach((heading) => {
      if (!heading.id) {
        heading.id = heading.textContent
          .trim()
          .toLowerCase()
          .replace(/[^a-z0-9\s\-]/g, '')
          .replace(/\s+/g, '-')
          .replace(/-+/g, '-')
          .replace(/^-|-$/g, '');
      }

      const li = document.createElement('li');
      li.className = 'custom-right-toc-item custom-right-toc-' + heading.tagName.toLowerCase();

      const a = document.createElement('a');
      a.href = '#' + heading.id;
      a.textContent = heading.textContent.trim();
      a.addEventListener('click', function (event) {
        event.preventDefault();
        document.getElementById(heading.id).scrollIntoView({ behavior: 'smooth', block: 'start' });
        history.replaceState(null, '', '#' + heading.id);
      });

      li.appendChild(a);
      list.appendChild(li);
    });

    toc.appendChild(list);
    document.body.appendChild(toc);

    function setActiveHeading() {
      const offset = window.scrollY + 120;
      let active = null;
      for (const heading of headings) {
        if (heading.offsetTop <= offset) {
          active = heading;
        }
      }

      document.querySelectorAll('#custom-right-toc .custom-right-toc-item').forEach((li) => {
        li.classList.remove('active');
      });

      if (active) {
        const activeLink = document.querySelector('#custom-right-toc a[href="#' + active.id + '"]');
        if (activeLink && activeLink.parentElement) {
          activeLink.parentElement.classList.add('active');
        }
      }
    }

    window.addEventListener('scroll', setActiveHeading);
    setActiveHeading();
  }

  function clearRightToc() {
    const existing = document.getElementById('custom-right-toc');
    if (existing) {
      existing.remove();
    }
  }

  function refreshPageUI() {
    clearRightToc();
    hideSidebarItems();
    hideNavButtons();
    buildRightToc();
  }

  function init() {
    addStyle(`
#custom-right-toc {
  position: fixed;
  top: 100px;
  right: 20px;
  width: 250px;
  max-height: calc(100vh - 130px);
  overflow-y: auto;
  padding: 12px 14px;
  background: #f8fafb;
  border: 1px solid rgba(0, 0, 0, 0.08);
  border-radius: 8px;
  box-shadow: 0 8px 35px rgba(0, 0, 0, 0.08);
  font-size: 14px;
  z-index: 999;
}

#custom-right-toc .custom-right-toc-title {
  font-weight: 700;
  margin-bottom: 10px;
  color: #30363d;
}

#custom-right-toc .custom-right-toc-list {
  list-style: none;
  margin: 0;
  padding: 0;
}

#custom-right-toc .custom-right-toc-item {
  margin-bottom: 6px;
}

#custom-right-toc .custom-right-toc-item.active > a {
  color: #006dff;
  font-weight: 600;
}

#custom-right-toc .custom-right-toc-item a {
  color: #164a60;
  text-decoration: none;
}

#custom-right-toc .custom-right-toc-h1 { font-weight: 700; }
#custom-right-toc .custom-right-toc-h2 { margin-left: 0.5em; }
#custom-right-toc .custom-right-toc-h3 { margin-left: 1em; }

@media screen and (max-width: 1200px) {
  #custom-right-toc { display: none; }
}

a.navigation-prev, a.navigation-next { display: none !important; }
`);

    hideSidebarItems();
    hideNavButtons();
    buildRightToc();

    if (typeof MutationObserver !== 'undefined') {
      let currentUrlForUrlCheck = location.href;

      const observer = new MutationObserver(function (mutations) {
        for (let i = 0; i < mutations.length; i++) {
          const added = mutations[i].addedNodes;
          for (let j = 0; j < added.length; j++) {
            const node = added[j];
            if (node.nodeType !== 1) continue;
            if (
              node.id === 'ch-download-container' ||
              (node.querySelector &&
                (node.querySelector('#ch-download-container') ||
                  (node.querySelector('[href="https://github.com/CellHasher/Beta-Cellhasher/releases"]')?.parentElement?.tagName === 'LI')))
            ) {
              refreshPageUI();
              return;
            }
          }
        }

        // If no match on special nodes, still refresh on url change.
        if (location.href !== currentUrlForUrlCheck) {
          currentUrlForUrlCheck = location.href;
          refreshPageUI();
        }
      });

      observer.observe(document.documentElement, { childList: true, subtree: true });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
