'use strict';
// Release evidence only. Never deploy, tag, close issues, or mutate production accounts.
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const { execFileSync } = require('node:child_process');
const assert = require('node:assert/strict');
const base = new URL(process.env.SMOKE_BASE_URL || 'https://worker.1106314996.workers.dev/');
const prefix = '/' + (process.env.SMOKE_PUBLIC_PREFIX || '/game/').replace(/^\/+|\/+$/g,'') + '/';
const publicPath = file => file ? (prefix.replace(/\/+/g,'/') + file.replace(/^game\//,'')) : '/';
const out = path.resolve(process.env.SMOKE_OUTPUT || 'artifacts/production-smoke');
const sha = process.env.GITHUB_SHA || execFileSync('git', ['rev-parse', 'HEAD'], {encoding:'utf8'}).trim();
const mode = process.argv[2] || '--all';
assert(['--all','--http-only','--browser-only'].includes(mode), 'Unknown mode');
fs.mkdirSync(out, {recursive:true});
const reportFile = path.join(out, 'report.json');
let report = {commit:sha, baseURL:base.href, publicPrefix:prefix.replace(/\/+/g,'/'), startedAt:new Date().toISOString(), http:[], browser:[], browserStatus:'not-run', manualVisualReview:'pending', releaseApproved:false};
const hash = data => crypto.createHash('sha256').update(data).digest('hex');
function save() {
  report.updatedAt = new Date().toISOString();
  report.automatedStatus = report.httpStatus === 'pass' && report.browserStatus === 'pass' ? 'pass' : 'not-passed';
  fs.writeFileSync(reportFile, JSON.stringify(report,null,2)+'\n');
  const rows = [...report.http,...report.browser].map(x=>`- ${x.status}: ${x.path||x.name}${x.error?' — '+x.error:''}`);
  fs.writeFileSync(path.join(out,'summary.md'), `# Production Smoke\n\nCommit: ${sha}\n\nSource: ${base.href}\n\nAutomated status: ${report.automatedStatus}\n\nManual visual review: pending. No release approval is implied.\n\n${rows.join('\n')}\n`);
}
function filesUnder(dir) {
  return fs.readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?filesUnder(path.join(dir,e.name)):[path.join(dir,e.name)]);
}
function runtimeFiles() {
  const index = fs.readFileSync('game/index.html','utf8');
  const refs = [...index.matchAll(/(?:src|href)=["'](\.[^"']+)["']/g)].map(m=>path.posix.normalize('game/'+m[1]));
  const images = filesUnder('game/assets').filter(p=>/\.(webp|png|jpe?g|svg)$/i.test(p));
  return [...new Set(['game/index.html','game/play.html',...refs,...images])];
}
async function probe(file) {
  const entry={path:publicPath(file),repositoryPath:file,status:'fail'};
  try {
    const response=await fetch(new URL(publicPath(file),base),{headers:{'Cache-Control':'no-cache'},signal:AbortSignal.timeout(20000)});
    entry.httpStatus=response.status; entry.finalURL=response.url;
    assert.equal(new URL(response.url).origin,base.origin,'Unexpected cross-origin redirect');
    assert.equal(response.status,200,`HTTP ${response.status}`);
    entry.contentType=response.headers.get('content-type')||'';
    const bytes=Buffer.from(await response.arrayBuffer());
    assert(bytes.length>0,'Empty body');
    const ext=path.extname(file);
    const mime={'.html':/text\/html/i,'.css':/text\/css/i,'.js':/(javascript|ecmascript)/i,'.webp':/image\/webp/i,'.png':/image\/png/i,'.svg':/image\/svg\+xml/i};
    if(mime[ext])assert(mime[ext].test(entry.contentType),'Unexpected MIME: '+entry.contentType);
    if(file){entry.expectedSHA256=hash(fs.readFileSync(file));entry.actualSHA256=hash(bytes);assert.equal(entry.actualSHA256,entry.expectedSHA256,'Deployed content differs from candidate');}
    entry.status='pass';
  } catch(e) {entry.error=String(e.cause?.code||e.message);}
  return entry;
}
async function httpChecks() {
  // Sequential batches limit requests and retain individual failure evidence.
  const files=['',...runtimeFiles()];
  for(let i=0;i<files.length;i+=4){report.http.push(...await Promise.all(files.slice(i,i+4).map(probe)));save();}
  report.httpStatus=report.http.every(x=>x.status==='pass')?'pass':'fail';save();
}
async function browserChecks() {
  const {chromium}=require(process.env.PLAYWRIGHT_MODULE || 'playwright');
  const browser=await chromium.launch();
  try {
    // Root route: require the actual game entry, not merely a non-empty HTTP 200.
    const rootContext=await browser.newContext();
    try {
      const root=await rootContext.newPage(); await root.goto(base.href,{waitUntil:'networkidle'});
      let found=false;
      for(const f of root.frames())if(await f.locator('#go').count())found=true;
      assert(found,'Root route did not expose the game entry');
      report.browser.push({name:'root-game-entry',status:'pass'});
    } catch(e){report.browser.push({name:'root-game-entry',status:'fail',error:e.message});}
    finally{await rootContext.close();save();}
    for(const viewport of [{width:360,height:640},{width:390,height:844}]) {
      for(const route of ['game/index.html','game/play.html']) {
        const name=`${path.basename(route,'.html')}-${viewport.width}x${viewport.height}`;
        const dir=path.join(out,name);fs.mkdirSync(dir,{recursive:true});
        const context=await browser.newContext({viewport,isMobile:true,hasTouch:true,recordVideo:{dir,size:viewport}});
        const page=await context.newPage(); const errors=[]; const checks=[];
        page.on('pageerror',e=>errors.push('pageerror: '+e.message));
        page.on('console',m=>{if(m.type()==='error')errors.push('console: '+m.text());});
        page.on('requestfailed',r=>errors.push('requestfailed: '+r.url()+' '+r.failure()?.errorText));
        page.on('response',r=>{if(r.status()>=400)errors.push(`HTTP ${r.status()}: ${r.url()}`);});
        let frame; let navigations=0;
        page.on('framenavigated',()=>navigations++);
        try {
          page.setDefaultTimeout(10000);
          await page.goto(new URL(publicPath(route),base).href,{waitUntil:'networkidle'});
          frame=page.mainFrame();
          if(route.endsWith('play.html'))frame=await (await page.locator('iframe').elementHandle()).contentFrame();
          assert(frame,'Missing embedded game frame');
          await frame.locator('#go').click();
          await frame.locator('#fridge [data-ing]').first().waitFor();
          assert.equal(await frame.locator('#fridge [data-ing]').count(),7);
          const layout=await frame.evaluate(()=>{
            const r=document.querySelector('#fire').getBoundingClientRect();
            const h=document.querySelector('.game-head').getBoundingClientRect();
            return {overflow:document.documentElement.scrollWidth>innerWidth,fireVisible:r.top>=0&&r.bottom<=innerHeight,headerVisible:h.top>=0&&h.bottom<=innerHeight};
          });
          assert.deepEqual(layout,{overflow:false,fireVisible:true,headerVisible:true});
          assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
          await page.screenshot({path:path.join(dir,'01-fridge.png')});checks.push('first-screen-layout');
          // Decode real image URLs, including CSS backgrounds and inline SVG <image> assets.
          await frame.evaluate(async()=>{
            const urls=new Set();
            for(const el of document.querySelectorAll('*')){
              if(el instanceof HTMLImageElement && el.src)urls.add(el.src);
              if(el.tagName.toLowerCase()==='image'){const u=el.getAttribute('href')||el.getAttribute('xlink:href');if(u)urls.add(u);}
              for(const m of getComputedStyle(el).backgroundImage.matchAll(/url\(["']?([^"')]+)["']?\)/g))urls.add(m[1]);
            }
            await Promise.all([...urls].map(u=>new Promise((resolve,reject)=>{const im=new Image();im.onload=()=>im.naturalWidth?resolve():reject(Error('zero-width image'));im.onerror=()=>reject(Error('image decode failure'));im.src=u;})));
          });checks.push('visible-images-decode');
          // Fresh profile: zero dishes must not unlock DAY 2.
          await frame.locator('#finish').click();await frame.locator('#confirmFinish').click();
          assert.equal(await frame.evaluate(()=>P.un),1);
          assert.match(await frame.locator('.unlock-note').innerText(),/至少完成 1 道菜/);
          await frame.locator('#retryLevel').click();checks.push('zero-dish-progression');
          const initial=await frame.evaluate(()=>JSON.stringify(S.inv));
          await frame.locator('[data-ing="egg"]').click();
          assert.equal(await frame.evaluate(()=>S.inv.egg),3);
          assert.equal(await frame.evaluate(()=>S.sel.length),1);
          await frame.locator('#clear').click();
          assert.equal(await frame.evaluate(()=>S.sel.length),0);
          await frame.locator('[data-ing="milk"]').click();await frame.locator('[data-ing="carrot"]').click();
          await frame.locator('#fire').click();
          assert.equal(await frame.evaluate(()=>JSON.stringify(S.inv)),initial);
          assert.equal(await frame.evaluate(()=>S.done.length),0);
          await frame.locator('#clear').click();checks.push('reserve-withdraw-invalid');
          const cook=async(id,items)=>{
            for(const ing of items)await frame.locator(`[data-ing="${ing}"]`).click();
            await frame.locator('#fire').click();
            await frame.waitForFunction(id=>S.done.includes(id)&&!S.cooking,id);
            assert(await frame.evaluate(()=>Object.values(S.inv).every(n=>n>=0)));
          };
          const te=['tomato','tomato','egg'], fr=['rice','egg','carrot'];
          await cook('te',te);await cook('fr',fr);await cook('oe',['onion','egg']);
          await frame.locator('#finish').click();await frame.locator('#confirmFinish').click();
          assert.equal(await frame.locator('.score').innerText(),'75%');
          assert.match(await frame.locator('#modal').innerText(),/¥4\.80/);
          assert.match(await frame.locator('.leftover').innerText(),/牛奶/);
          await page.screenshot({path:path.join(dir,'02-result-75.png')});checks.push('75-percent-milk-waste');
          const before=navigations;await frame.locator('#retryLevel').click();
          assert.equal(navigations,before);assert.equal(await frame.evaluate(()=>S.inv.egg),3);
          assert.equal(await frame.evaluate(()=>P.tutorial.basicDone),true);checks.push('replay-no-navigation');
          await cook('te',te);await cook('fr',fr);await cook('me',['milk','egg']);
          await frame.locator('#finish').click();
          assert.equal(await frame.locator('.score').innerText(),'100%');
          assert.match(await frame.locator('#modal').innerText(),/¥0\.00/);
          assert.match(await frame.locator('#modal').innerText(),/精算规划型/);
          assert.equal(await frame.evaluate(()=>P.un),2);
          await page.screenshot({path:path.join(dir,'03-result-100.png')});checks.push('100-percent-result');
          await frame.locator('#nextLevel').click();assert.equal(await frame.evaluate(()=>Q[0]),2);
          await page.screenshot({path:path.join(dir,'04-day2.png')});checks.push('next-level');
          assert.equal(errors.length,0,errors.join('\n'));
          report.browser.push({name,status:'pass',checks,errors});
        } catch(e) {
          await page.screenshot({path:path.join(dir,'failure.png')}).catch(()=>{});
          report.browser.push({name,status:'fail',checks,error:e.message,errors});
        } finally {await context.close();save();}
      }
    }
  } finally {await browser.close();}
  report.browserStatus=report.browser.length===5&&report.browser.every(x=>x.status==='pass')?'pass':'fail';save();
}
(async()=>{
  if(mode==='--browser-only'){
    report=JSON.parse(fs.readFileSync(reportFile,'utf8'));
    assert.equal(report.commit,sha,'HTTP report belongs to a different commit');
    assert.equal(report.baseURL,base.href,'HTTP report belongs to a different origin');
    assert.equal(report.publicPrefix,prefix.replace(/\/+/g,'/'),'HTTP report uses another mount point');
  } else await httpChecks();
  if(mode!=='--http-only' && report.httpStatus==='pass')await browserChecks();
  save(); console.log(fs.readFileSync(path.join(out,'summary.md'),'utf8'));
  process.exitCode=report.httpStatus==='pass' && (mode==='--http-only'||report.browserStatus==='pass')?0:1;
})().catch(e=>{report.fatal=e.stack;save();console.error(e);process.exitCode=1;});
