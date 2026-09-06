'use strict';
// Real deployed UI capture; no injected state, hidden overlays, or fabricated results.
const fs=require('node:fs');
const path=require('node:path');
const assert=require('node:assert/strict');
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const out=path.resolve(process.env.SMOKE_OUTPUT||'artifacts/production-smoke','submission-capture');
const base=process.env.SMOKE_BASE_URL||'https://worker.1106314996.workers.dev/';
const prefix=(process.env.SMOKE_PUBLIC_PREFIX||'/').replace(/^\/+|\/+$/g,'');
fs.mkdirSync(out,{recursive:true});
(async()=>{
  const browser=await chromium.launch();
  const context=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true,recordVideo:{dir:out,size:{width:390,height:844}}});
  const page=await context.newPage();
  const errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
  page.on('requestfailed',r=>errors.push('request failed: '+r.url()));
  page.on('response',r=>{if(r.status()>=400)errors.push('HTTP '+r.status()+': '+r.url());});
  try {
    await page.goto(new URL((prefix?prefix+'/':'')+'play.html',base).href,{waitUntil:'networkidle'});
    const frame=await (await page.locator('iframe').elementHandle()).contentFrame();
    assert(frame,'Missing game frame');
    await page.screenshot({path:path.join(out,'00-home.png')});
    await page.waitForTimeout(2500); // Deliberate viewing time for the recording.
    await frame.locator('#go').click();
    await page.waitForTimeout(1000);
    await page.screenshot({path:path.join(out,'01-fridge.png')});
    await page.waitForTimeout(2500);
    async function cook(id,ingredients,saveSelection=false){
      for(const item of ingredients){await frame.locator(`[data-ing="${item}"]`).click();await page.waitForTimeout(250);}
      if(saveSelection){await page.screenshot({path:path.join(out,'02-selection.png')});await page.waitForTimeout(2000);}
      const button=frame.locator('#fire');
      assert(await button.isVisible()&&await button.isEnabled());
      assert(await button.evaluate(el=>{const b=el.getBoundingClientRect(),hit=document.elementFromPoint(b.x+b.width/2,b.y+b.height/2);return hit===el||el.contains(hit);}), 'Fire center obstructed');
      const b=await button.boundingBox();assert(b);
      await page.touchscreen.tap(b.x+b.width/2,b.y+b.height/2);
      await frame.waitForFunction(id=>S.done.includes(id)&&!S.cooking,id);
      await page.waitForTimeout(2800); // Let actual rewards/toasts finish; do not hide them.
    }
    async function result(expected,file){
      await frame.locator('#finish').click();
      if(expected==='75%')await frame.locator('#confirmFinish').click();
      assert.equal(await frame.locator('.score').innerText(),expected);
      await frame.waitForFunction(()=>[...document.querySelectorAll('.dish-reward,.toast')].every(el=>{const s=getComputedStyle(el);return s.display==='none'||s.visibility==='hidden'||Number(s.opacity)<0.01;}),null,{timeout:5000});
      await page.waitForTimeout(400);
      await page.screenshot({path:path.join(out,file)});
      await page.waitForTimeout(4000);
    }
    await cook('te',['tomato','tomato','egg'],true);
    await cook('fr',['rice','egg','carrot']);
    await cook('oe',['onion','egg']);
    await result('75%','03-result-75.png');
    assert.match(await frame.locator('#modal').innerText(),/¥4\.80/);
    await frame.locator('#retryLevel').click();
    await cook('te',['tomato','tomato','egg']);
    await cook('fr',['rice','egg','carrot']);
    await cook('me',['milk','egg']);
    await result('100%','04-result-100.png');
    assert.match(await frame.locator('#modal').innerText(),/精算规划型/);
    assert.equal(errors.length,0,errors.join('\n'));
    fs.writeFileSync(path.join(out,'capture.json'),JSON.stringify({commit:process.env.GITHUB_SHA,baseURL:base,createdAt:new Date().toISOString(),status:'captured',source:'real production UI',recording:'unedited browser capture; not a final promotional film',errors},null,2));
  } finally {await context.close();await browser.close();}
})().catch(e=>{fs.writeFileSync(path.join(out,'capture-error.txt'),e.stack||String(e));console.error(e);process.exitCode=1;});
