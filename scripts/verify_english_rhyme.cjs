const {chromium}=require(process.env.BNC_PLAYWRIGHT_PATH || 'playwright');
const assert=require('node:assert/strict');const fs=require('node:fs/promises');
(async()=>{
const out=process.env.BNC_RHYME_OUTPUT || require('node:path').join(require('node:os').tmpdir(),'cadence-english-rhyme');await fs.mkdir(out,{recursive:true});
const browser=await chromium.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});
const origin=process.env.BNC_PREVIEW_URL||'http://127.0.0.1:8000';
const page=await browser.newPage({viewport:{width:390,height:844},reducedMotion:'reduce'});let packs=0;page.on('request',r=>{if(r.url().includes('pack-en.json'))packs++});
await page.goto(origin+'/cadence/rhyme-finder/');await page.locator('#tool-controls').waitFor({state:'visible'});assert.equal(packs,0);
const results=page.locator('#results');
await page.locator('[data-example="ice cream"]').first().click();await page.waitForFunction(()=>document.querySelector('#results').textContent.includes('i scream'));assert.equal(await page.locator('#mode').inputValue(),'phrase');
await page.locator('.examples [data-example="motion"]').click();await page.waitForFunction(()=>document.querySelector('#results').textContent.includes('ocean'));assert.equal(await page.locator('#mode').inputValue(),'perfect');
for(const [mode,word] of [['perfect','night'],['multi','ocean'],['slant','like'],['phrase','i scream']]){await page.locator(`[data-worked-example][data-mode="${mode}"]`).click();await page.waitForFunction(w=>document.querySelector('#results').textContent.includes(w),word);assert.equal(await page.locator('#mode').inputValue(),mode);}
for(const width of [320,375,390,430,768,1024,1440]){await page.setViewportSize({width,height:900});await page.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))));assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`overflow ${width}`);const buttons=await page.locator('[data-worked-example]').evaluateAll(bs=>bs.map(b=>b.getBoundingClientRect().height));assert.ok(buttons.every(h=>h>=44));}
await page.setViewportSize({width:390,height:844});await page.locator('#english-rhyme-examples').scrollIntoViewIfNeeded();await page.screenshot({path:out+'/mobile-examples.png'});
await page.setViewportSize({width:1440,height:1000});await page.locator('#english-rhyme-examples').scrollIntoViewIfNeeded();await page.screenshot({path:out+'/desktop-examples.png'});
const nojs=await browser.newContext({javaScriptEnabled:false,viewport:{width:390,height:844}});const plain=await nojs.newPage();await plain.goto(origin+'/cadence/rhyme-finder/');assert.equal(await plain.locator('.rhyme-example').count(),4);assert.equal(await plain.locator('.rhyme-example li').count(),25);assert.equal(await plain.locator('[data-worked-example]:visible').count(),0);assert.equal(await plain.locator('#tool-controls').isVisible(),false);assert.ok(await plain.locator('#english-rhyme-examples').textContent().then(t=>t.includes('i scream')));
const broken=await browser.newPage();await broken.route('**/cadence/search/worker.mjs',r=>r.abort());await broken.goto(origin+'/cadence/rhyme-finder/');await broken.locator('.examples [data-example="motion"]').click();await broken.waitForFunction(()=>document.querySelector('#results-status').textContent.includes('could not load'));assert.equal(await broken.locator('.rhyme-example').count(),4);assert.equal(await broken.locator('#results').getAttribute('aria-busy'),'false');
console.log('PASS: lazy dictionary, four live modes, phrase→word reset, seven widths, 44px targets, no-JS static results, failed-worker fallback.');await browser.close();
})().catch(e=>{console.error(e);process.exitCode=1});
