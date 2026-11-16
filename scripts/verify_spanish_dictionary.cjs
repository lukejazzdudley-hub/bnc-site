const {chromium}=require(process.env.BNC_PLAYWRIGHT_PATH || 'playwright');
const assert=require('node:assert/strict');
const fs=require('node:fs/promises');
const path=require('node:path');
(async()=>{
 const out=process.env.BNC_SPANISH_OUTPUT || path.join(require('node:os').tmpdir(),'cadence-spanish-dictionary');
 await fs.mkdir(out,{recursive:true});
 const browser=await chromium.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});
 try{
  const origin=process.env.BNC_PREVIEW_URL||'http://127.0.0.1:8000';
  const route='/cadence/es/diccionario-rimas/';
  const page=await browser.newPage({viewport:{width:1282,height:713},reducedMotion:'reduce'});
  let packs=0;page.on('request',r=>{if(r.url().includes('public-es.json'))packs++});
  await page.goto(origin+route);await page.locator('#romance-form').waitFor({state:'visible'});
  assert.equal(packs,0,'dictionary remains lazy');
  const sizes=[];
  for(const width of [320,375,390,430,768,1024,1282,1440]){
   await page.setViewportSize({width,height:713});
   const size=await page.evaluate(()=>({width:innerWidth,overflow:document.documentElement.scrollWidth>innerWidth,submit:document.querySelector('#romance-form button[type=submit]').getBoundingClientRect().bottom,targets:[...document.querySelectorAll('.spanish-example-actions button,.dictionary-store-links a,.examples button')].map(e=>e.getBoundingClientRect().height)}));
   assert.equal(size.overflow,false,`overflow at ${width}`);
   assert.ok(size.targets.every(h=>h>=44),`targets at ${width}`);
   if(width>=1024)assert.ok(size.submit<713,`search button below fold at ${width}`);
   sizes.push(size);
  }
  await page.setViewportSize({width:1440,height:900});await page.screenshot({path:path.join(out,'desktop.png')});
  await page.locator('#rhyme-examples').scrollIntoViewIfNeeded();await page.screenshot({path:path.join(out,'desktop-examples.png')});
  await page.locator('#rimas-con-vida [data-romance-mode=perfect]').click();
  await page.waitForFunction(()=>document.querySelector('#romance-results').textContent.includes('herida'));
  assert.equal(await page.locator('#mode').inputValue(),'perfect');
  await page.locator('#rimas-con-vida [data-romance-mode=assonance]').click();
  await page.waitForFunction(()=>document.querySelector('#romance-results').textContent.includes('risa'));
  assert.equal(await page.locator('#mode').inputValue(),'assonance');
  await page.locator('.romance-filters summary').click();await page.locator('#prefix').fill('b');await page.locator('#sort').selectOption('alphabetical');await page.locator('#romance-form button[type=submit]').click();
  await page.waitForFunction(()=>document.querySelector('#romance-results li')&&document.querySelector('#romance-results').getAttribute('aria-busy')==='false');
  assert.ok((await page.locator('#romance-results li>span').allTextContents()).every(w=>w.startsWith('b')));
  await page.locator('#rimas-con-amor [data-romance-mode=perfect]').click();
  await page.waitForFunction(()=>document.querySelector('#romance-results').textContent.includes('dolor'));
  assert.equal(await page.locator('#prefix').inputValue(),'');assert.equal(await page.locator('#sort').inputValue(),'frequency');
  const before=await page.locator('#romance-results').textContent();
  await page.locator('.dictionary-app-jump a').click();await page.locator('#cadence-app a[href="#romance-form"]').click();
  assert.equal(await page.locator('#romance-results').textContent(),before);
  await page.setViewportSize({width:390,height:844});await page.evaluate(()=>scrollTo(0,0));await page.screenshot({path:path.join(out,'mobile.png')});
  await page.goto(origin+route);await page.locator('#romance-form').waitFor({state:'visible'});await page.screenshot({path:path.join(out,'mobile-initial.png')});
  // Check enlarged root text separately from the viewport-size checks.
  await page.addStyleTag({content:'html{font-size:200%}'});assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
  const plain=await browser.newPage({javaScriptEnabled:false,viewport:{width:390,height:844}});
  await plain.goto(origin+route);assert.equal(await plain.locator('.spanish-rhyme-card').count(),6);
  assert.equal(await plain.locator('.spanish-rhyme-card li').count(),36);
  assert.equal(await plain.locator('[data-romance-example]:visible').count(),0);
  assert.equal(await plain.locator('.dictionary-store-links a:visible').count(),2);
  const broken=await browser.newPage();await broken.route('**/romance-worker.mjs*',r=>r.abort());await broken.goto(origin+route);
  await broken.locator('#rimas-con-amor button').first().click();await broken.waitForFunction(()=>document.querySelector('#romance-status').textContent.includes('No se pudo'));
  assert.equal(await broken.locator('.spanish-rhyme-card li').count(),36);
  await fs.writeFile(path.join(out,'browser.json'),JSON.stringify({sizes,lazyDictionary:true,realSearchModes:true,filters:true,preservedResults:true,noJs:true,failedWorker:true},null,2));
  console.log('PASS: eight widths, desktop search above fold, lazy dictionary, both real rhyme modes, filters/reset, app return, large text, no-JS results and failed-worker fallback.');
 }finally{await browser.close()}
})().catch(error=>{console.error(error);process.exitCode=1});
