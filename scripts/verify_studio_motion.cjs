// Real-renderer acceptance: visible changes, stopped off-screen work, and complete fallbacks.
const {chromium}=require(process.env.BNC_PLAYWRIGHT_PATH||'playwright');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const base=process.env.BNC_PREVIEW_URL||'http://127.0.0.1:8000';
(async()=>{
 const browser=await chromium.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});
 const report={motion:[],fallbacks:[]};
 try{
  const context=await browser.newContext({viewport:{width:1440,height:1000},recordVideo:{dir:'.gstack/redesign-previews',size:{width:1440,height:1000}}});
  await context.addInitScript(()=>{window.__motionDraws=0;const original=WebGLRenderingContext.prototype.drawArrays;WebGLRenderingContext.prototype.drawArrays=function(...args){window.__motionDraws++;return original.apply(this,args);};});
  const page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto(base+'/');await page.locator('.home-showcase').scrollIntoViewIfNeeded();assert.equal(await page.locator('canvas:visible').count(),0);await page.locator('[data-project=volt]').click();await page.locator('.home-showcase-image[data-motion-state=ready]').waitFor();assert.match(await page.locator('[data-project-link]').getAttribute('href'),/volt-and-co/);report.motion.push('home: static first paint; motion starts on interaction; project link follows selection');
  for(const [slug,selector]of [['harbour-and-vine','.wine-image-wrap'],['volt-and-co','.electric-light-scene'],['still-room','.clinic-movement']]){
   await page.goto(`${base}/work-with-us/concepts/${slug}/`);const host=page.locator(selector);await host.scrollIntoViewIfNeeded();await page.locator(`${selector}[data-motion-state=ready]`).waitFor();await page.waitForTimeout(300);
   const before=await host.screenshot();
   if(slug==='harbour-and-vine'){const box=await host.boundingBox();await page.mouse.move(box.x+box.width*.25,box.y+box.height*.6);await page.mouse.move(box.x+box.width*.75,box.y+box.height*.4,{steps:30});}
   if(slug==='volt-and-co'){await page.locator('#light-level').fill('0');await page.locator('#light-level').dispatchEvent('input');}
   if(slug==='still-room')await page.locator('[data-movement=release]').click();
   await page.waitForTimeout(1600);const after=await host.screenshot();assert.notDeepEqual(before,after,`${slug} needs a visible rendered change`);
   await page.evaluate(()=>scrollTo(0,document.documentElement.scrollHeight));await page.waitForTimeout(200);const stopped=await page.evaluate(()=>window.__motionDraws);await page.waitForTimeout(300);assert.equal(await page.evaluate(()=>window.__motionDraws),stopped,`${slug} renders offscreen`);
   report.motion.push(`${slug}: rendered pixels change; offscreen drawing stops`);
  }
  await page.goto(base+'/work-with-us/');const study=page.locator('.design-comparison');await study.scrollIntoViewIfNeeded();await study.locator('img').evaluateAll(es=>Promise.all(es.map(e=>e.decode())));for(const value of ['0','100']){await page.locator('#design-reveal').fill(value);await page.locator('#design-reveal').dispatchEvent('input');await study.screenshot({path:`.gstack/redesign-previews/comparison-${value}.png`});}
  assert.deepEqual(errors,[]);report.pageErrors=errors;await context.close();
  for(const fallback of ['reduced','no-webgl','save-data']){
   const ctx=await browser.newContext({reducedMotion:fallback==='reduced'?'reduce':'no-preference'});
   if(fallback==='no-webgl')await ctx.addInitScript(()=>{const original=HTMLCanvasElement.prototype.getContext;HTMLCanvasElement.prototype.getContext=function(type,...args){return type.includes('webgl')?null:original.call(this,type,...args);};});
   if(fallback==='save-data')await ctx.addInitScript(()=>Object.defineProperty(navigator,'connection',{value:{saveData:true}}));
   const p=await ctx.newPage();for(const slug of ['harbour-and-vine','volt-and-co','still-room']){await p.goto(`${base}/work-with-us/concepts/${slug}/`);assert.equal(await p.locator('canvas:visible').count(),0);const image=p.locator('.wine-image,.electric-light-scene>img,.clinic-movement>img');await image.evaluate(e=>e.decode());assert.ok(await image.isVisible());await p.locator('[data-open-demo]').first().click();assert.ok(await p.getByRole('dialog').isVisible());}
   report.fallbacks.push(`${fallback}: three complete poster layouts and working dialogs`);await ctx.close();
  }
  fs.writeFileSync('docs/services/MOTION-RESULTS.json',JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report));
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
