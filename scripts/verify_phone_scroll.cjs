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
    for (const index of [0, 1, 2, 3, 0]) {
      const chapter = chapters.nth(index);
      await chapter.scrollIntoViewIfNeeded();
      const clip = (await chapter.getAttribute('data-screen-image')).split('/').pop();
      await page.waitForFunction(name => document.querySelector('[data-live-phone]').dataset.screenFrame?.includes(name), clip);
    }
    assert.equal(recordings.size, 0, 'the product story uses native stills');
    console.log('All four native screens appear and reverse scrolling restores the first.');
  } finally {
    await browser.close();
  }
}

verify().catch(error => { console.error(error); process.exitCode = 1; });
