/* Optional GA4 measurement. Never collect booking-form or clinic-assistant input. */
(() => {
  'use strict';
  if (window.__hopMeasurement) return;
  window.__hopMeasurement = true;

  const ID = 'G-VLPZR721SK';
  const KEY = 'hop.measurement-consent.v1';
  const MAX_AGE = 180 * 24 * 60 * 60 * 1000;
  const HOSTS = ['handsonphysio.ca', 'www.handsonphysio.ca'];
  const DENIED = {
    analytics_storage: 'denied', ad_storage: 'denied',
    ad_user_data: 'denied', ad_personalization: 'denied'
  };
  let started = false;
  let choice = readChoice();

  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };
  const gtag = window.gtag;
  gtag('consent', 'default', { ...DENIED });
  gtag('set', 'ads_data_redaction', true);

  function readChoice() {
    try {
      const saved = JSON.parse(window.localStorage.getItem(KEY));
      if (saved && ['allowed', 'denied'].includes(saved.value) &&
          Number.isFinite(saved.at) && saved.at <= Date.now() &&
          Date.now() - saved.at < MAX_AGE) return saved.value;
    } catch (_) { /* Storage can be unavailable; remain off until a choice. */ }
    return null;
  }

  function safeLocation() {
    const url = new URL(window.location.href);
    const safe = new URL(url.origin + url.pathname);
    // Keep only identifiers needed for ad attribution and the Jane handoff.
    ['gclid', 'dclid', 'gbraid', 'wbraid', 'gclsrc', '_gl'].forEach((key) => {
      const value = url.searchParams.get(key);
      if (value) safe.searchParams.set(key, value);
    });
    return safe.href;
  }

  function safeReferrer() {
    try { return document.referrer ? new URL(document.referrer).origin + '/' : ''; }
    catch (_) { return ''; }
  }

  function startMeasurement() {
    // Development previews must not send traffic to the clinic's property.
    if (started || !HOSTS.includes(window.location.hostname)) return;
    started = true;
    gtag('consent', 'update', {
      analytics_storage: 'granted', ad_storage: 'granted',
      ad_user_data: 'granted', ad_personalization: 'denied'
    });
    gtag('set', 'allow_google_signals', false);
    gtag('set', 'allow_ad_personalization_signals', false);
    // Cross-domain linking is maintained in this stream's Google tag settings.
    gtag('js', new Date());
    gtag('config', ID, {
      page_location: safeLocation(), page_referrer: safeReferrer(),
      allow_google_signals: false, allow_ad_personalization_signals: false
    });
    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://www.googletagmanager.com/gtag/js?id=' + ID;
    document.head.append(script);
  }

  function clearMeasurementCookies() {
    const names = document.cookie.split(';').map((part) => part.trim().split('=')[0]);
    names.filter((name) => /^(_ga(?:_|$)|_gcl_|_gac_)/.test(name)).forEach((name) => {
      ['', window.location.hostname, '.handsonphysio.ca'].forEach((domain) => {
        document.cookie = name + '=; Max-Age=0; path=/' +
          (domain ? '; domain=' + domain : '') + '; SameSite=Lax';
      });
    });
  }

  function element(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text) node.textContent = text;
    return node;
  }

  const panel = element('section', 'hop-measurement');
  panel.id = 'hop-measurement';
  panel.setAttribute('aria-labelledby', 'hop-measurement-title');
  const title = element('h2', '', 'Optional website measurement');
  title.id = 'hop-measurement-title';
  const description = element('p', '', 'With your permission, Google Analytics uses cookies and advertising identifiers to measure visits and which ads lead to online bookings. Measurement information is shared with Google. Personalized advertising is off. You can book with either choice.');
  const privacy = element('a', '', 'How Google uses information');
  privacy.href = 'https://policies.google.com/technologies/partner-sites';
  privacy.target = '_blank';
  privacy.rel = 'noopener noreferrer';
  const status = element('p', 'hop-measurement-status');
  status.setAttribute('aria-live', 'polite');
  const actions = element('div', 'hop-measurement-actions');
  const allow = element('button', '', 'Allow measurement');
  const decline = element('button', '', 'No thanks');
  const close = element('button', 'hop-measurement-close', 'Close');
  [allow, decline, close].forEach((button) => { button.type = 'button'; });
  actions.append(allow, decline, close);
  panel.append(title, description, privacy, status, actions);
  const reopen = element('button', 'hop-privacy-choices', 'Privacy choices');
  reopen.type = 'button';
  reopen.setAttribute('aria-controls', panel.id);

  function render() {
    panel.hidden = choice !== null;
    close.hidden = choice === null;
    reopen.hidden = !panel.hidden;
    reopen.setAttribute('aria-expanded', String(!panel.hidden));
    status.textContent = choice === 'allowed' ? 'Measurement is on. You can change your choice below.' :
      choice === 'denied' ? 'Measurement is off. You can change your choice below.' :
      'Measurement stays off unless you allow it.';
  }

  function save(value) {
    choice = value;
    try { window.localStorage.setItem(KEY, JSON.stringify({ value, at: Date.now() })); }
    catch (_) { /* Keep the choice for this page when storage is blocked. */ }
    if (value === 'allowed') startMeasurement();
    else {
      gtag('consent', 'update', { ...DENIED });
      clearMeasurementCookies();
      if (started) {
        window['ga-disable-' + ID] = true;
        // Unload the vendor so declining also stops cookieless measurement.
        window.location.reload();
      }
    }
    render();
    reopen.focus();
  }

  allow.addEventListener('click', () => save('allowed'));
  decline.addEventListener('click', () => save('denied'));
  reopen.addEventListener('click', () => {
    panel.hidden = false;
    reopen.hidden = true;
    reopen.setAttribute('aria-expanded', 'true');
    allow.focus();
  });
  function dismiss() {
    if (choice !== null) { render(); reopen.focus(); }
  }
  close.addEventListener('click', dismiss);
  panel.addEventListener('keydown', (event) => { if (event.key === 'Escape') dismiss(); });
  window.addEventListener('storage', (event) => {
    if (event.key !== KEY) return;
    choice = readChoice();
    if (choice === 'allowed') startMeasurement();
    else if (started) {
      window['ga-disable-' + ID] = true;
      gtag('consent', 'update', { ...DENIED });
      clearMeasurementCookies();
      window.location.reload();
    }
    render();
  });
  document.body.append(panel, reopen);
  render();
  if (choice === 'allowed') startMeasurement();
})();
