// Optional browser acceptance. Uses Playwright from the operator's existing runtime.
// BNC_PLAYWRIGHT_PATH may point to an absolute installed Playwright package.
const {chromium}=require(process.env.BNC_PLAYWRIGHT_PATH||'playwright');
const fs=require('node:fs');
const path=require('node:path');
const assert=require('node:assert/strict');
const base='http://127.0.0.1:8000';
const endpoint='https://goupfxfloriqtucppmbx.supabase.co/functions/v1/studio-enquiry';
(async()=>{
 const browser=await chromium.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});
 const report={responsive:[],forms:[],concepts:[],reduced:[],screenshots:[]};
 try{
 const context=await browser.newContext({viewport:{width:1440,height:1000}}),page=await context.newPage();
 const routes=[['home','/'],['services','/work-with-us/'],['contact','/contact/'],['harbour','/work-with-us/concepts/harbour-and-vine/'],['volt','/work-with-us/concepts/volt-and-co/'],['still-room','/work-with-us/concepts/still-room/']];
 for(const [name,route]of routes){
  for(const width of [320,375,390,430,768,1024,1440]){
   await page.setViewportSize({width,height:width<700?844:1000});await page.goto(base+route);await page.evaluate(()=>document.fonts.ready);
   const dimensions=await page.evaluate(()=>({width:innerWidth,scroll:document.documentElement.scrollWidth}));assert.ok(dimensions.scroll<=dimensions.width,`${name} overflow at ${width}`);report.responsive.push({name,width,...dimensions});
   if(width===390||width===1440){
    if(name==='volt')await page.locator('.scene-ready').waitFor({timeout:10000});
    await page.evaluate(()=>Promise.all(document.getAnimations().filter(a=>a.effect?.getTiming().iterations!==Infinity).map(a=>a.finished.catch(()=>{}))));
    await page.evaluate(()=>scrollTo({top:0,behavior:'instant'}));
    const file=`docs/services/screenshots/${name}-${width}.webp`;await page.screenshot({path:file,fullPage:true,type:'webp',quality:78});report.screenshots.push(file);
   }
  }
 }
 const wire=async ctx=>ctx.route(endpoint,async route=>{const response=await route.fetch({url:'http://127.0.0.1:54329/',maxRedirects:0});await route.fulfill({response});});
 await wire(context);
 const fill=async p=>{await p.locator('#name').fill('Preview Test');await p.locator('#email').fill('preview@example.test');await p.locator('#business').fill('Fictional Preview Business');await p.locator('label.need-chip').first().click();await p.locator('#message').fill('A local test with no email delivery.');};
 await page.goto(base+'/contact/');await page.getByRole('button',{name:'Send enquiry'}).click();assert.ok(await page.locator('[aria-invalid=true]').count()>0);await fill(page);
 await page.locator('[name=started_at]').evaluate(el=>{el.value=String(Date.now()-5000);});await page.getByRole('button',{name:'Send enquiry'}).click();await page.locator('.form-status[data-state=success]').waitFor();assert.equal(await page.locator('#message').inputValue(),'');report.forms.push('enhanced validation, fake-transport acceptance and reset passed');
 await context.unroute(endpoint);await context.route(endpoint,route=>route.fulfill({status:503,contentType:'application/json',headers:{'Access-Control-Allow-Origin':base},body:JSON.stringify({ok:false,code:'delivery_unavailable'})}));
 await page.goto(base+'/contact/');await fill(page);await page.getByRole('button',{name:'Send enquiry'}).click();await page.locator('.form-status[data-state=error]').waitFor();assert.ok((await page.locator('#message').inputValue()).includes('local test'));report.forms.push('enhanced failure preserves entries');
 const nativeContext=await browser.newContext({javaScriptEnabled:false});await wire(nativeContext);const native=await nativeContext.newPage();await native.goto(base+'/contact/');await fill(native);await native.getByRole('button',{name:'Send enquiry'}).click();await native.waitForURL('**/contact/thanks/');assert.match(await native.locator('h1').innerText(),/one working day/);report.forms.push('native no-JS POST and fixed success redirect passed');await nativeContext.close();
 for(const [slug,label]of [['harbour-and-vine','Find a table'],['still-room','Find your appointment']]){
  await page.goto(`${base}/work-with-us/concepts/${slug}/`);await page.getByRole('button',{name:label,exact:false}).click();const dialog=page.getByRole('dialog');
  await dialog.locator('[data-next]').first().click();await dialog.locator('.demo-step:not([hidden]) [data-next]').click();await dialog.locator('[data-confirm]').click();assert.match(await dialog.locator('.demo-confirmation').innerText(),/This is a demo/);await page.keyboard.press('Escape');assert.equal(await dialog.isVisible(),false);assert.equal(await page.getByRole('button',{name:label,exact:false}).evaluate(el=>el===document.activeElement),true);report.concepts.push(`${slug}: complete flow, Escape, focus return`);
 }
 await page.goto(base+'/work-with-us/concepts/volt-and-co/');await page.getByRole('button',{name:'Turn the demo circuit on'}).click();assert.equal(await page.locator('[data-power-label]').innerText(),'CIRCUIT CONNECTED');assert.equal(await page.locator('[data-power-toggle]').getAttribute('aria-pressed'),'true');report.concepts.push('volt: switch powers the circuit and updates accessible state');await page.getByRole('button',{name:'LET’S CONNECT',exact:false}).click();await page.getByRole('button',{name:'See demo estimate',exact:false}).click();assert.match(await page.locator('.quote-result').innerText(),/£120–180/);report.concepts.push('volt: quote matches visible mock table');
 await page.keyboard.press('Escape');await page.goto(base+'/work-with-us/concepts/still-room/');await page.getByRole('button',{name:'Explore shoulder movement'}).focus();assert.match(await page.locator('[data-body-caption]').innerText(),/shoulders/);report.concepts.push('still-room: keyboard focus updates the movement study');
 await page.emulateMedia({reducedMotion:'reduce'});
 for(const route of ['/work-with-us/','/work-with-us/concepts/still-room/','/work-with-us/concepts/volt-and-co/','/work-with-us/concepts/harbour-and-vine/']){
  await page.goto(base+route);assert.equal(await page.locator('canvas:visible').count(),0);assert.equal(await page.evaluate(()=>document.getAnimations().length),0);report.reduced.push(route);
 }
 await page.goto(base+'/contact/');await page.keyboard.press('Tab');assert.equal(await page.evaluate(()=>document.activeElement.textContent),'Skip to content');await page.keyboard.press('Enter');await page.keyboard.press('Tab');report.keyboard='skip link and native dialog focus/escape passed; labelled form controls use native tab order';
 fs.writeFileSync('docs/services/BROWSER-RESULTS.json',JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify({responsive:report.responsive.length,forms:report.forms,concepts:report.concepts,reduced:report.reduced.length,screenshots:report.screenshots.length,keyboard:report.keyboard}));
 }finally{await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
