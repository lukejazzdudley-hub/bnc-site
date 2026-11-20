// Run against a local preview or the released product page using installed Chrome.
const assert = require('node:assert/strict');
const { chromium } = require(process.env.BNC_PLAYWRIGHT_PATH || 'playwright');

async function verify() {
  const browser = await chromium.launch({ channel: 'chrome', args: ['--enable-unsafe-swiftshader'] });
  try {
    const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
    const recordings = new Set();
    page.on('request', request => {
      const pathname = new URL(request.url()).pathname;
      if (pathname.includes('/screens/') && pathname.endsWith('.mp4')) recordings.add(pathname);
    });
    await page.goto(new URL('/cadence/', process.env.BNC_PREVIEW_URL || 'http://localhost:8000').href);
    const chapters = page.locator('[data-phone-chapter]');
    let firstVisit = true;
    for (const index of [0, 1, 2, 3, 0]) {
      const chapter = chapters.nth(index);
      await chapter.scrollIntoViewIfNeeded();
      const clip = (await chapter.getAttribute('data-screen-video')).split('/').pop();
      await page.waitForFunction(name => document.querySelector('[data-live-phone]').dataset.screenFrame?.includes(name), clip);
      if (firstVisit) {
        assert.equal(recordings.size, 1, 'load only the active chapter');
        firstVisit = false;
      }
    }
    assert.equal(recordings.size, 4);
    const idleSeeks = await page.evaluate(async () => {
      let count = 0;
      const observe = () => count++;
      document.addEventListener('seeked', observe, true);
      await new Promise(resolve => setTimeout(resolve, 500));
      document.removeEventListener('seeked', observe, true);
      return count;
    });
    assert.ok(idleSeeks <= 2, 'a stationary chapter must settle after the outstanding and queued seeks');
    console.log('Forward and reverse chapters render. The stationary decoder settles.');
  } finally {
    await browser.close();
  }
}

verify().catch(error => { console.error(error); process.exitCode = 1; });
