'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const source = fs.readFileSync(path.join(__dirname, '..', 'measurement.js'), 'utf8');
const ID = 'G-VLPZR721SK';
const KEY = 'hop.measurement-consent.v1';
const NOW = Date.parse('2026-10-25T12:00:00Z');
const MAX_AGE = 180 * 24 * 60 * 60 * 1000;
const DENIED = {
  analytics_storage: 'denied', ad_storage: 'denied',
  ad_user_data: 'denied', ad_personalization: 'denied'
};

// This DOM records script insertion without executing it or making network calls.
function browser(options = {}) {
  const nodes = [];
  const cookieWrites = [];
  const cookieJar = new Map((options.cookies || '').split(';').filter(Boolean).map((part) => {
    const index = part.indexOf('=');
    return [part.slice(0, index).trim(), part.slice(index + 1)];
  }));
  const saved = new Map();
  if (options.stored !== undefined) {
    saved.set(KEY, typeof options.stored === 'string' ? options.stored : JSON.stringify(options.stored));
  }
  const windowListeners = new Map();
  let reloads = 0;
  let focused;

  class Element {
    constructor(tag) {
      this.tagName = tag.toUpperCase();
      this.children = [];
      this.attributes = {};
      this.listeners = new Map();
      this.textContent = '';
      this.hidden = false;
      nodes.push(this);
    }
    append(...children) { this.children.push(...children); }
    setAttribute(name, value) { this.attributes[name] = String(value); }
    addEventListener(type, listener) {
      if (!this.listeners.has(type)) this.listeners.set(type, []);
      this.listeners.get(type).push(listener);
    }
    focus() { focused = this; }
    dispatch(type, event = {}) {
      for (const listener of this.listeners.get(type) || []) listener(event);
    }
  }

  const document = {
    head: new Element('head'),
    body: new Element('body'),
    referrer: options.referrer || '',
    createElement: (tag) => new Element(tag)
  };
  Object.defineProperty(document, 'cookie', {
    get: () => Array.from(cookieJar, ([name, value]) => name + '=' + value).join('; '),
    set: (value) => {
      cookieWrites.push(value);
      const [pair] = value.split(';');
      const separator = pair.indexOf('=');
      const name = pair.slice(0, separator);
      if (/Max-Age=0/.test(value)) cookieJar.delete(name);
      else cookieJar.set(name, pair.slice(separator + 1));
    }
  });
  const location = new URL(options.url || 'https://handsonphysio.ca/');
  const window = {
    location: {
      href: location.href, hostname: location.hostname,
      reload() { reloads++; }
    },
    localStorage: {
      getItem(key) {
        if (options.storageUnavailable) throw new Error('Storage blocked');
        return saved.get(key) ?? null;
      },
      setItem(key, value) {
        if (options.storageUnavailable) throw new Error('Storage blocked');
        saved.set(key, value);
      }
    },
    addEventListener(type, listener) {
      if (!windowListeners.has(type)) windowListeners.set(type, []);
      windowListeners.get(type).push(listener);
    }
  };
  class Clock extends Date {
    constructor(...args) { super(...(args.length ? args : [NOW])); }
    static now() { return NOW; }
  }
  const context = vm.createContext({ window, document, URL, Date: Clock });
  const run = () => vm.runInContext(source, context, { filename: 'measurement.js' });
  run();

  return {
    window, document, nodes, saved, cookieWrites, cookieJar, run,
    get reloads() { return reloads; },
    get focused() { return focused; },
    get vendors() { return document.head.children.filter((node) => node.tagName === 'SCRIPT'); },
    // Normalize objects from the VM realm for strict assertions.
    commands() { return window.dataLayer.map((args) => JSON.parse(JSON.stringify(Array.from(args)))); },
    config() { return this.commands().find((command) => command[0] === 'config'); },
    button(text) {
      const node = nodes.find((item) => item.tagName === 'BUTTON' && item.textContent === text);
      assert.ok(node, 'Expected a button labelled ' + text);
      return node;
    },
    click(text) { this.button(text).dispatch('click'); },
    storageEvent(value, key = KEY) {
      if (value === null) saved.delete(key);
      else saved.set(key, JSON.stringify(value));
      for (const listener of windowListeners.get('storage') || []) listener({ key });
    }
  };
}

function assertNoVendor(page) {
  assert.equal(page.vendors.length, 0, 'No Google script may be inserted without valid consent on production');
  assert.equal(page.config(), undefined, 'No Analytics config may be queued');
}

function assertAllowed(page) {
  assert.equal(page.vendors.length, 1);
  assert.equal(page.vendors[0].src, 'https://www.googletagmanager.com/gtag/js?id=' + ID);
  assert.equal(page.vendors[0].async, true);
  assert.deepEqual(page.commands().find((entry) => entry[0] === 'consent' && entry[1] === 'update')[2], {
    analytics_storage: 'granted', ad_storage: 'granted',
    ad_user_data: 'granted', ad_personalization: 'denied'
  });
  const config = page.config();
  assert.equal(config[1], ID);
  assert.equal(config[2].allow_google_signals, false);
  assert.equal(config[2].allow_ad_personalization_signals, false);
  assert.ok(page.commands().some((entry) => entry[0] === 'set' && entry[1] === 'allow_google_signals' && entry[2] === false));
  assert.ok(page.commands().some((entry) => entry[0] === 'set' && entry[1] === 'allow_ad_personalization_signals' && entry[2] === false));
}

test('first visit defaults all storage and advertising consent to denied without a vendor', () => {
  const page = browser();
  assertNoVendor(page);
  assert.deepEqual(page.commands()[0], ['consent', 'default', DENIED]);
  assert.ok(page.commands().some((entry) => entry[0] === 'set' && entry[1] === 'ads_data_redaction' && entry[2] === true));
  assert.equal(page.nodes.find((node) => node.id === 'hop-measurement').hidden, false);
  assert.equal(page.button('Close').hidden, true);
  assert.equal(page.button('Privacy choices').hidden, true);
});

test('declining saves denial without loading Google or reloading a never-enabled page', () => {
  const page = browser();
  page.click('No thanks');
  assertNoVendor(page);
  assert.deepEqual(JSON.parse(page.saved.get(KEY)), { value: 'denied', at: NOW });
  assert.deepEqual(page.commands().at(-1), ['consent', 'update', DENIED]);
  assert.equal(page.reloads, 0);
  assert.equal(page.nodes.find((node) => node.id === 'hop-measurement').hidden, true);
  assert.equal(page.button('Privacy choices').hidden, false);
});

test('fresh stored denial stays off and can reopen the choice panel', () => {
  const page = browser({ stored: { value: 'denied', at: NOW - 1 } });
  assertNoVendor(page);
  page.click('Privacy choices');
  assert.equal(page.nodes.find((node) => node.id === 'hop-measurement').hidden, false);
  assert.equal(page.focused, page.button('Allow measurement'));
});

test('fresh stored allowance loads exactly one configured tag with personalization disabled', () => {
  const page = browser({ stored: { value: 'allowed', at: NOW - 1 } });
  assertAllowed(page);
  assert.deepEqual(page.commands()[0], ['consent', 'default', DENIED]);
  assert.equal(page.nodes.find((node) => node.id === 'hop-measurement').hidden, true);
});

test('explicit allowance persists the choice and initializes production measurement', () => {
  const page = browser({ url: 'https://www.handsonphysio.ca/physiotherapy' });
  page.click('Allow measurement');
  assertAllowed(page);
  assert.deepEqual(JSON.parse(page.saved.get(KEY)), { value: 'allowed', at: NOW });
});

test('repeat script execution and repeated allowance do not duplicate UI, vendor or configuration', () => {
  const page = browser({ stored: { value: 'allowed', at: NOW } });
  const initialNodeCount = page.nodes.length;
  const initialCommandCount = page.commands().length;
  page.run();
  assert.equal(page.nodes.length, initialNodeCount);
  assert.equal(page.commands().length, initialCommandCount);
  page.click('Allow measurement');
  assert.equal(page.vendors.length, 1);
  assert.equal(page.commands().filter((entry) => entry[0] === 'config').length, 1);
});

test('expired, future-dated, malformed and unrecognized stored choices fail closed', async (t) => {
  for (const [name, stored] of [
    ['exactly 180 days old', { value: 'allowed', at: NOW - MAX_AGE }],
    ['older than 180 days', { value: 'allowed', at: NOW - MAX_AGE - 1 }],
    ['expired denial', { value: 'denied', at: NOW - MAX_AGE }],
    ['future timestamp', { value: 'allowed', at: NOW + 1 }],
    ['invalid timestamp', { value: 'allowed', at: 'yesterday' }],
    ['unknown choice', { value: 'yes', at: NOW }],
    ['malformed JSON', '{bad json']
  ]) {
    await t.test(name, () => {
      const page = browser({ stored });
      assertNoVendor(page);
      assert.equal(page.nodes.find((node) => node.id === 'hop-measurement').hidden, false);
    });
  }
  assertAllowed(browser({ stored: { value: 'allowed', at: NOW - MAX_AGE + 1 } }));
});

test('blocked storage stays off initially but a deliberate choice works for the current page', () => {
  const page = browser({ storageUnavailable: true });
  assertNoVendor(page);
  assert.doesNotThrow(() => page.click('Allow measurement'));
  assertAllowed(page);
  assert.equal(page.saved.has(KEY), false);
});

test('page location strips private queries and hash while retaining only attribution identifiers', () => {
  const page = browser({
    stored: { value: 'allowed', at: NOW },
    url: 'https://handsonphysio.ca/physiotherapy?name=Example&email=example%40invalid.test&claim=123&diagnosis=private&question=private&user_id=123&utm_term=private&gclid=ad-click&dclid=display-click&gbraid=gb&wbraid=wb&gclsrc=aw&_gl=linker#private',
    referrer: 'https://source.example/patient/private?email=example%40invalid.test#private'
  });
  const parameters = page.config()[2];
  const location = new URL(parameters.page_location);
  assert.equal(location.origin, 'https://handsonphysio.ca');
  assert.equal(location.pathname, '/physiotherapy');
  assert.equal(location.hash, '');
  assert.deepEqual(Array.from(location.searchParams), [
    ['gclid', 'ad-click'], ['dclid', 'display-click'], ['gbraid', 'gb'],
    ['wbraid', 'wb'], ['gclsrc', 'aw'], ['_gl', 'linker']
  ]);
  assert.equal(parameters.page_referrer, 'https://source.example/');
  assert.equal(Object.hasOwn(parameters, 'user_id'), false);
  assert.equal(Object.hasOwn(parameters, 'user_data'), false);
});

test('invalid or absent referrers are omitted safely', async (t) => {
  for (const referrer of ['', 'not a valid URL']) {
    await t.test(referrer || 'empty', () => {
      const page = browser({ stored: { value: 'allowed', at: NOW }, referrer });
      assert.equal(page.config()[2].page_referrer, '');
    });
  }
});

test('ordinary service visits and opening privacy choices never emit a booking event', async (t) => {
  for (const pathname of ['/', '/physiotherapy', '/icbc-physiotherapy', '/worksafebc-physiotherapy', '/#services']) {
    await t.test(pathname, () => {
      const page = browser({ stored: { value: 'allowed', at: NOW }, url: 'https://handsonphysio.ca' + pathname });
      page.click('Privacy choices');
      page.click('Close');
      assert.equal(page.commands().some((entry) => entry[0] === 'event'), false);
      assert.equal(JSON.stringify(page.commands()).includes('appointment_booked'), false);
    });
  }
});

test('withdrawal disables measurement, clears only measurement cookies across relevant scopes and reloads', () => {
  const page = browser({
    url: 'https://www.handsonphysio.ca/',
    stored: { value: 'allowed', at: NOW },
    cookies: '_ga=one; _ga_VLPZR721SK=two; _gcl_au=three; _gac_example=four; essential=keep; _garden=keep'
  });
  page.click('Privacy choices');
  page.click('No thanks');
  assert.equal(page.window['ga-disable-' + ID], true);
  assert.equal(page.reloads, 1);
  assert.deepEqual(page.commands().at(-1), ['consent', 'update', DENIED]);
  assert.equal(JSON.parse(page.saved.get(KEY)).value, 'denied');
  assert.equal(page.cookieWrites.length, 12);
  for (const name of ['_ga', '_ga_VLPZR721SK', '_gcl_au', '_gac_example']) {
    const writes = page.cookieWrites.filter((value) => value.startsWith(name + '='));
    assert.equal(writes.length, 3);
    assert.ok(writes.every((value) => value.includes('Max-Age=0; path=/')));
    assert.ok(writes.some((value) => !value.includes('domain=')));
    assert.ok(writes.some((value) => value.includes('domain=www.handsonphysio.ca;')));
    assert.ok(writes.some((value) => value.includes('domain=.handsonphysio.ca;')));
  }
  assert.equal(page.cookieJar.get('essential'), 'keep');
  assert.equal(page.cookieJar.get('_garden'), 'keep');
  assert.equal(page.cookieWrites.some((value) => value.startsWith('essential=') || value.startsWith('_garden=')), false);
});

test('another tab withdrawing or removing consent stops an already loaded tag', async (t) => {
  for (const choice of [{ value: 'denied', at: NOW }, null]) {
    await t.test(choice ? 'denial' : 'removal', () => {
      const page = browser({ stored: { value: 'allowed', at: NOW }, cookies: '_ga=one' });
      page.storageEvent(choice);
      assert.equal(page.window['ga-disable-' + ID], true);
      assert.equal(page.reloads, 1);
      assert.deepEqual(page.commands().at(-1), ['consent', 'update', DENIED]);
      assert.equal(page.cookieJar.has('_ga'), false);
    });
  }
});

test('consent granted in another tab starts once; unrelated storage changes do not start it', () => {
  const page = browser();
  page.storageEvent({ value: 'allowed', at: NOW }, 'unrelated-setting');
  assertNoVendor(page);
  page.storageEvent({ value: 'allowed', at: NOW });
  assertAllowed(page);
  page.storageEvent({ value: 'allowed', at: NOW });
  assert.equal(page.vendors.length, 1);
});

test('local and non-production previews never load the clinic vendor, even after allowance', async (t) => {
  for (const url of [
    'http://localhost:8000/', 'http://127.0.0.1:8000/', 'file:///preview/index.html',
    'https://handsonphysio.github.io/handsonphysio.ca/', 'https://handsonphysio.ca.preview.invalid/'
  ]) {
    await t.test(url, () => {
      const page = browser({ url, stored: { value: 'allowed', at: NOW } });
      assertNoVendor(page);
      page.click('Allow measurement');
      assertNoVendor(page);
      assert.equal(page.commands().some((entry) => entry[0] === 'consent' && entry[1] === 'update' && entry[2].analytics_storage === 'granted'), false);
    });
  }
});
