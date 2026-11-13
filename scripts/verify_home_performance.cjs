const {chromium}=require(process.env.BNC_PLAYWRIGHT_PATH||'playwright');
const assert=require('node:assert/strict');
const fs=require('node:fs/promises');
const path=require('node:path');
const base=process.env.BNC_PREVIEW_URL||'http://127.0.0.1:8000';
const reference=process.env.BNC_HOME_REFERENCE;
const out=process.env.BNC_PERF_OUTPUT||path.join(require('node:os').tmpdir(),'bnc-home-performance');
const snapshot=page=>page.evaluate(()=>Object.fromEntries(['.nav','.hero.home','.hero.home h1','.hero.home .actions','.home-showcase','.home-showcase img','.footer'].map(selector=>{const el=document.querySelector(selector),r=el.getBoundingClientRect(),s=getComputedStyle(el);return [selector,{x:r.x,y:r.y,width:r.width,height:r.height,font:s.fontFamily,size:s.fontSize,weight:s.fontWeight,line:s.lineHeight,color:s.color,display:s.display}]})));
(async()=>{await fs.mkdir(out,{recursive:true});const browser=await chromium.launch({executablePath:process.env.BNC_CHROME_PATH||'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});const results=[];try{
 for(const javaScriptEnabled of [true,false]){
  const context=await browser.newContext({javaScriptEnabled,reducedMotion:'reduce'});
  for(const width of [320,375,390,430,768,1024,1440]){
   const page=await context.newPage(),requests=[];await page.setViewportSize({width,height:1000});assert.equal(await page.evaluate(()=>innerWidth),width);page.on('request',r=>requests.push(r.url()));
   await page.goto(base+'/');await page.evaluate(()=>document.fonts.ready);if(javaScriptEnabled)await page.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))));
   assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`overflow ${width}`);
   assert.equal(requests.filter(url=>new URL(url).pathname.endsWith('.css')).length,0);
   const current=await snapshot(page);
   if(reference){const prior=await context.newPage();await prior.setViewportSize({width,height:1000});await prior.goto(reference+'/');await prior.evaluate(()=>document.fonts.ready);const expected=await snapshot(prior);for(const selector of Object.keys(current)){for(const key of Object.keys(current[selector])){const a=current[selector][key],b=expected[selector][key];if(typeof a==='number')assert.ok(Math.abs(a-b)<.6,`${width}/${javaScriptEnabled} ${selector} ${key}: ${a} != ${b}`);else assert.equal(a,b,`${width}/${javaScriptEnabled} ${selector} ${key}`);}}await prior.close();}
   if(width===390||width===1440)await page.screenshot({path:path.join(out,`home-${width}-${javaScriptEnabled?'js':'no-js'}.png`)});
   if(javaScriptEnabled&&width===390){await page.locator('.nav-toggle').click();assert.equal(await page.locator('.nav-toggle').getAttribute('aria-expanded'),'true');await page.keyboard.press('Escape');assert.equal(await page.locator('.nav-toggle').getAttribute('aria-expanded'),'false');}
   if(javaScriptEnabled&&width===1440){await page.locator('[data-project="volt"]').click();assert.equal(await page.locator('[data-project="volt"]').getAttribute('aria-pressed'),'true');await page.waitForFunction(()=>document.querySelector('[data-project-name]').textContent==='Volt & Co.');await page.locator('[data-project="wine"]').click();assert.equal(await page.locator('[data-project-name]').textContent(),'Harbour & Vine');}
   results.push({width,javaScriptEnabled,externalStylesheets:0,referenceParity:Boolean(reference)});console.log(`Checked ${width}px / JS=${javaScriptEnabled}`);await page.close();
  }await context.close();
 }
 await fs.writeFile(path.join(out,'browser-verification.json'),JSON.stringify(results,null,2));console.log(`PASS: ${results.length} responsive/no-JS states; no stylesheet requests, preserved menu, project switcher${reference?' and reference layout/type parity':''}.`);
}finally{await browser.close();}})().catch(error=>{console.error(error);process.exitCode=1;});
