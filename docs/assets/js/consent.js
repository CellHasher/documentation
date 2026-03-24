/* GDPR-compliant analytics consent — Cellhasher Documentation */
(function () {
  'use strict';

  var GTAG_ID = (typeof window.CELLHASHER_GTAG === 'string' && window.CELLHASHER_GTAG.trim()) || '';
  var STORAGE_KEY = 'cellhasher_analytics';

  /* ---------- Storage helpers ---------- */
  function getConsent() {
    try {
      var val = localStorage.getItem(STORAGE_KEY);
      if (val === 'true') return true;
      if (val === 'false') return false;
    } catch (e) { /* storage blocked */ }
    return null; // not yet decided
  }

  function setConsent(value) {
    try {
      localStorage.setItem(STORAGE_KEY, value ? 'true' : 'false');
    } catch (e) { /* ignore */ }
  }

  /* ---------- GA4 loader ---------- */
  function loadGA() {
    if (!GTAG_ID) return;
    window.dataLayer = window.dataLayer || [];
    function gtag() { window.dataLayer.push(arguments); }
    window.gtag = gtag;
    gtag('js', new Date());
    gtag('config', GTAG_ID);
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GTAG_ID;
    document.head.appendChild(s);
  }

  /* ---------- Modal builder ---------- */
  function buildModal() {
    var overlay = document.createElement('div');
    overlay.id = 'ch-consent-overlay';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-labelledby', 'ch-consent-title');
    overlay.setAttribute('aria-describedby', 'ch-consent-desc');

    var modal = document.createElement('div');
    modal.id = 'ch-consent-modal';

    var title = document.createElement('h2');
    title.id = 'ch-consent-title';
    title.textContent = 'Analytics Preferences';

    var desc = document.createElement('p');
    desc.id = 'ch-consent-desc';
    desc.textContent =
      'We use Google Analytics (GA4) to understand how our documentation is used and to improve it. ' +
      'No personal data is collected. Your choice is stored in your browser and can be changed at any time.';

    var btnWrap = document.createElement('div');
    btnWrap.className = 'ch-consent-buttons';

    var acceptBtn = document.createElement('button');
    acceptBtn.id = 'ch-consent-accept';
    acceptBtn.className = 'ch-btn-primary';
    acceptBtn.setAttribute('type', 'button');
    acceptBtn.textContent = 'Enable Analytics';

    var declineBtn = document.createElement('button');
    declineBtn.id = 'ch-consent-decline';
    declineBtn.className = 'ch-btn-secondary';
    declineBtn.setAttribute('type', 'button');
    declineBtn.textContent = 'Disable Analytics';

    btnWrap.appendChild(acceptBtn);
    btnWrap.appendChild(declineBtn);
    modal.appendChild(title);
    modal.appendChild(desc);
    modal.appendChild(btnWrap);
    overlay.appendChild(modal);
    return overlay;
  }

  /* ---------- Modal display ---------- */
  function showModal() {
    var overlay = buildModal();
    document.body.appendChild(overlay);

    var acceptBtn = document.getElementById('ch-consent-accept');
    var declineBtn = document.getElementById('ch-consent-decline');
    var focusable = [acceptBtn, declineBtn];

    acceptBtn.focus();

    function trapFocus(e) {
      if (e.key !== 'Tab') return;
      var idx = focusable.indexOf(document.activeElement);
      var next = e.shiftKey
        ? focusable[(idx - 1 + focusable.length) % focusable.length]
        : focusable[(idx + 1) % focusable.length];
      next.focus();
      e.preventDefault();
    }

    function dismiss(accepted) {
      setConsent(accepted);
      document.removeEventListener('keydown', trapFocus);
      if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
      if (accepted) loadGA();
    }

    acceptBtn.addEventListener('click', function () { dismiss(true); });
    declineBtn.addEventListener('click', function () { dismiss(false); });
    document.addEventListener('keydown', trapFocus);
  }

  /* ---------- Entry point ---------- */
  function init() {
    var consent = getConsent();
    if (consent === null) {
      showModal();
    } else if (consent === true) {
      loadGA();
    }
    // consent === false → do nothing (GA never loads)
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
}());
