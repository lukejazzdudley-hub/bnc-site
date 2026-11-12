// Rendered checks: no-JS reading, native reset ordering and platform-specific offers.
const {chromium} = require(process.env.BNC_PLAYWRIGHT_PATH || 'playwright');
const assert = require('node:assert/strict');
const {mkdirSync} = require('node:fs');
const {tmpdir} = require('node:os');
const path = require('node:path');
const output = process.env.BNC_SHORTLIST_OUTPUT || path.join(tmpdir(), 'cadence-app-shortlist');
const origin = process.env.BNC_PREVIEW_URL || 'http://127.0.0.1:8000';
const route = '/cadence/resources/choosing-a-songwriting-app/';
const widths = [320, 375, 390, 430, 768, 1024, 1440];

(async () => {
  mkdirSync(output, {recursive:true});
  const browser = await chromium.launch({headless:true,
    executablePath:process.env.BNC_CHROME_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});
  try {
    const context = await browser.newContext({reducedMotion:'reduce'});
    const page = await context.newPage();
    const resize = async (width, height = 900) => {
      await page.setViewportSize({width,height});
      await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
    };
    const requests = [];
    page.on('request', request => requests.push(request.url()));
    await page.goto(origin + route + '#app-shortlist');
    await page.locator('[data-app-filters]').waitFor({state:'visible'});
    await page.evaluate(() => document.fonts.ready);
    const section = page.locator('#app-shortlist');
    assert.ok(await section.evaluate(element => element.open));
    for (const width of widths) {
      await resize(width);
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `buyer ${width}`);
      for (const control of await section.locator('select, button').all()) {
        assert.ok((await control.boundingBox()).height >= 44);
      }
    }
    await resize(390, 844);
    await page.selectOption('#shortlist-device', 'android');
    await page.selectOption('#shortlist-task', 'lyrics');
    await page.selectOption('#shortlist-access', 'limited');
    assert.equal(await page.locator('[data-app-option]:visible').count(), 2);
    assert.ok(await page.locator('[data-app-option="cadence"]').isVisible());
    assert.ok(await page.locator('[data-app-option="songcage"]').isVisible());
    await section.evaluate(element => element.scrollIntoView({behavior:'instant',block:'start'}));
    await page.screenshot({path:path.join(output, 'shortlist-mobile.png')});
    await page.selectOption('#shortlist-access', 'free');
    assert.equal(await page.locator('[data-app-option]:visible').count(), 0);
    assert.ok(await page.locator('[data-app-empty]').isVisible());

    const reset = async () => {
      await page.getByRole('button', {name:'Clear filters'}).click();
      await page.waitForFunction(() => document.querySelectorAll('[data-app-option]:not([hidden])').length === 7);
      assert.equal(await page.locator('[data-app-option]:visible').count(), 7);
    };
    await reset();
    await page.selectOption('#shortlist-device', 'android');
    await page.selectOption('#shortlist-access', 'trial');
    assert.equal(await page.locator('[data-app-option]:visible').count(), 0);
    await page.selectOption('#shortlist-device', 'desktop');
    assert.equal(await page.locator('[data-app-option]:visible').count(), 1);
    assert.ok(await page.locator('[data-app-option="songcage"]').isVisible());
    await reset();
    await resize(1440, 1000);
    await section.evaluate(element => element.scrollIntoView({behavior:'instant',block:'start'}));
    await page.screenshot({path:path.join(output, 'shortlist-desktop.png')});
    assert.equal(await page.locator('#compare-apps tbody tr').count(), 13);
    assert.equal(await page.locator('.buyer-proof track[kind="captions"]').count(), 1);
    assert.ok(!requests.some(url => url.endsWith('.mp4')), 'No video fetch before play');
    assert.ok(!requests.some(url => url.includes('supabase')), 'No analytics without consent');
    await page.locator('#shortlist-device').focus();
    await page.keyboard.press('Tab');
    assert.equal(await page.evaluate(() => document.activeElement.id), 'shortlist-task');

    for (const target of ['/cadence/songwriting-app-android/', '/cadence/type-beat-songwriting-app/']) {
      await page.goto(origin + target);
      for (const width of widths) {
        await resize(width);
        assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `${target} ${width}`);
      }
      assert.equal(await page.locator('a[href$="choosing-a-songwriting-app/#app-shortlist"]').count(), 1);
    }
    const noJs = await browser.newContext({javaScriptEnabled:false});
    const staticPage = await noJs.newPage();
    await staticPage.goto(origin + route);
    await staticPage.locator('#app-shortlist > summary').click();
    assert.equal(await staticPage.locator('[data-app-option]:visible').count(), 7);
    assert.ok(await staticPage.locator('[data-app-filters]').isHidden());
    assert.equal(await staticPage.locator('.article-rail details').getAttribute('open'), null);
    await staticPage.getByRole('link', {name:'Free apps & plan limits',exact:true}).click();
    assert.ok(staticPage.url().endsWith('#free-songwriting-apps'));
    console.log('21 width checks; filters, offer/device constraints, empty/reset, keyboard, no-JS, captions and zero unsolicited video/analytics requests passed');
  } finally {
    await browser.close();
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
