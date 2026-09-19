import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

test('navigation closes honestly after a link or Escape, including nested link content', () => {
  const source = fs.readFileSync(new URL('../site.js', import.meta.url), 'utf8');
  const menu = source.split('/* Mobile menu toggle */')[1].split('/* Reveal-on-scroll */')[0];
  const events = {};
  const classes = new Set();
  const attrs = {};
  let focused = false;
  const toggle = {
    addEventListener: (name, fn) => { events[name] = fn; },
    setAttribute: (key, value) => { attrs[key] = value; },
    focus: () => { focused = true; },
  };
  const links = {
    classList: {
      toggle: key => { if (classes.has(key)) { classes.delete(key); return false; } classes.add(key); return true; },
      remove: key => classes.delete(key), contains: key => classes.has(key),
    },
    addEventListener: (name, fn) => { events['links:' + name] = fn; },
  };
  vm.runInNewContext(menu, { document: {
    querySelector: selector => selector === '.nav-toggle' ? toggle : links,
    addEventListener: (name, fn) => { events[name] = fn; },
  }});
  events.click();
  assert.equal(attrs['aria-expanded'], 'true');
  events['links:click']({target: {closest: () => ({tagName: 'A'})}});
  assert.equal(attrs['aria-expanded'], 'false');
  assert.equal(classes.has('open'), false);
  events.click();
  events.keydown({key: 'Escape'});
  assert.equal(attrs['aria-expanded'], 'false');
  assert.equal(classes.has('open'), false);
  assert.equal(focused, true);
});
