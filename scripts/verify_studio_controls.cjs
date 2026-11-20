const assert = require('node:assert/strict');
const { chromium } = require(process.env.BNC_PLAYWRIGHT_PATH || 'playwright');

async function verify() {
  const browser = await chromium.launch({ channel: 'chrome' });
  try {
    for (const touch of [false, true]) {
      const page = await browser.newPage({
        hasTouch: touch, viewport: { width: touch ? 390 : 1440, height: 900 },
        reducedMotion: touch ? 'reduce' : 'no-preference',
      });
      const errors = [];
      page.on('pageerror', error => errors.push(error.message));
      await page.goto(process.env.BNC_PRODUCT_URL || 'http://localhost:8768/cadence/');
      const listen = page.getByRole('button', { name: 'Listen', exact: true });
      if (touch) await listen.tap();
      else {
        await listen.focus();
        await page.keyboard.press('Enter');
      }
      await page.waitForFunction(() => document.querySelector('.studio-featured').currentSrc.endsWith('/listen-gallery.webp'));
      assert.equal(await listen.getAttribute('aria-pressed'), 'true');
      if (touch) assert.equal(await page.evaluate(() => typeof window.Motion), 'undefined');
      else await page.waitForFunction(() => typeof window.Motion?.animate === 'function');
      const cards = page.locator('.instrument-card');
      assert.equal(await cards.count(), 3);
      for (const card of await cards.all()) {
        assert.ok((await card.boundingBox()).height >= 44);
        const response = await page.request.get(new URL(await card.getAttribute('href'), page.url()).href);
        assert.equal(response.status(), 200);
      }
      await cards.first().focus();
      await page.keyboard.press('Enter');
      await page.waitForURL('**/cadence/type-beat-songwriting-app/');
      assert.deepEqual(errors, []);
      await page.close();
    }
  } finally {
    await browser.close();
  }
}

verify().catch(error => { console.error(error); process.exitCode = 1; });
