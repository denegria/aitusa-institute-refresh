import { createServer } from "node:http";
import { existsSync } from "node:fs";
import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { spawn } from "node:child_process";

const baseUrl = (process.env.VERIFY_BASE_URL || "http://127.0.0.1:3000").replace(/\/$/, "");
const outputDir = path.resolve(process.env.VERIFY_SCREENSHOTS_DIR || "artifacts/release-surfaces");
const chrome = [
  process.env.VERIFY_CHROME_PATH,
  "/usr/bin/google-chrome-stable", "/usr/bin/google-chrome", "/usr/bin/chromium", "/usr/bin/chromium-browser",
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
].find((candidate) => candidate && existsSync(candidate));

if (!chrome) throw new Error("Chrome or Chromium is required for release-surface verification.");
await mkdir(outputDir, { recursive: true });
const profileDir = await mkdtemp(path.join(tmpdir(), "aitusa-release-surfaces-"));

const probe = createServer();
await new Promise((resolve) => probe.listen(0, "127.0.0.1", resolve));
const port = probe.address().port;
await new Promise((resolve) => probe.close(resolve));

const browser = spawn(chrome, [
  "--headless=new",
  "--no-sandbox",
  "--disable-dev-shm-usage",
  "--hide-scrollbars",
  "--disable-extensions",
  "--disable-background-networking",
  "--no-first-run",
  "--no-default-browser-check",
  `--remote-debugging-port=${port}`,
  `--user-data-dir=${profileDir}`,
  "about:blank",
], { stdio: ["ignore", "ignore", "pipe"], windowsHide: true });

let browserError = "";
browser.stderr.on("data", (chunk) => { browserError += chunk.toString(); });
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

try {
  let webSocketUrl;
  const startupDeadline = Date.now() + 30000;
  while (Date.now() < startupDeadline) {
    if (browser.exitCode !== null) break;
    try {
      const response = await fetch(`http://127.0.0.1:${port}/json/list`, { signal: AbortSignal.timeout(1000) });
      const targets = await response.json();
      webSocketUrl = targets.find((target) => target.type === "page")?.webSocketDebuggerUrl;
      if (webSocketUrl) break;
    } catch {
      await sleep(100);
    }
  }
  if (!webSocketUrl) throw new Error(`Chrome DevTools did not start. ${browserError}`);

  const socket = new WebSocket(webSocketUrl);
  await new Promise((resolve, reject) => {
    socket.addEventListener("open", resolve, { once: true });
    socket.addEventListener("error", reject, { once: true });
  });

  let nextId = 1;
  const pending = new Map();
  const exceptions = [];
  socket.addEventListener("message", (event) => {
    const message = JSON.parse(event.data);
    if (message.id && pending.has(message.id)) {
      const request = pending.get(message.id);
      pending.delete(message.id);
      clearTimeout(request.timer);
      if (message.error) request.reject(new Error(message.error.message));
      else request.resolve(message.result);
    }
    if (message.method === "Runtime.exceptionThrown") {
      exceptions.push(message.params.exceptionDetails?.exception?.description || message.params.exceptionDetails?.text || "runtime exception");
    }
  });

  const send = (method, params = {}, timeoutMs = 20000) => new Promise((resolve, reject) => {
    const id = nextId++;
    const timer = setTimeout(() => {
      pending.delete(id);
      reject(new Error(`Timed out waiting for ${method}`));
    }, timeoutMs);
    pending.set(id, { resolve, reject, timer });
    socket.send(JSON.stringify({ id, method, params }));
  });
  const evaluate = async (expression) => {
    const response = await send("Runtime.evaluate", { expression, returnByValue: true, awaitPromise: true });
    if (response.exceptionDetails) throw new Error(response.exceptionDetails.text || "evaluation failed");
    return response.result.value;
  };

  await send("Page.enable");
  await send("Runtime.enable");
  await send("Emulation.setEmulatedMedia", { features: [{ name: "prefers-reduced-motion", value: "reduce" }] });

  const fixture = (() => {
      const originalFetch = window.fetch.bind(window);
      window.__quoteRequests = [];
      window.fetch = async (url, options = {}) => {
        const path = String(url);
        if (path.includes('/api/registration/prefill')) return new Response(JSON.stringify({authenticated:false}), {status:200});
        if (path.includes('/api/registration/quote')) {
          const selection = JSON.parse(options.body);
          window.__quoteRequests.push(selection.includeTuitionPrepayment);
          if (selection.includeTuitionPrepayment && sessionStorage.getItem('qa-optional-unavailable')) return new Response(JSON.stringify({error:{message:'Optional price unavailable'}}),{status:503});
          const lines=[{code:'registration_book_bundle',label:'Inscripción y libro',amount:'95.00',currency:'USD'}];
          if(selection.includeTuitionPrepayment) lines.push({code:'tuition_prepayment_four_week',label:'Anticipo',amount:'140.00',currency:'USD'});
          return new Response(JSON.stringify({state:'quoted',quote:{lines,currency:'USD',total:selection.includeTuitionPrepayment?'235.00':'95.00'},fulfillment:{deliveryMode:'pickup'}}),{status:200});
        }
        if (options.method && options.method !== 'GET') throw new Error('QA blocks all real submissions');
        return originalFetch(url,options);
      };
    });
  await send('Page.addScriptToEvaluateOnNewDocument',{source: '('+fixture.toString()+')()'});
  const evidence=[];
  const waitFor=async expression=>{for(let i=0;i<300;i++){if(await evaluate(expression))return;await sleep(100);}throw Error('UI did not settle: '+expression+' '+JSON.stringify({exceptions,state:await evaluate('({url:location.href,text:document.body.innerText,requests:window.__quoteRequests,ready:document.readyState,button:document.querySelector(".registration-next")?.disabled})')}));};
  const capture=async(name)=>{
    const layout=await evaluate('({width:innerWidth,scrollWidth:document.documentElement.scrollWidth,text:document.body.innerText})');
    if(layout.scrollWidth>layout.width+2)throw Error(name+' overflows');
    const shot=await send('Page.captureScreenshot',{format:'png',captureBeyondViewport:false});
    await writeFile(path.join(outputDir,name+'.png'),Buffer.from(shot.data,'base64'));
    evidence.push({name,width:layout.width,scrollWidth:layout.scrollWidth});
    return layout.text;
  };
  for(const width of [1440,390,320]){
    await send('Emulation.setDeviceMetricsOverride',{width,height:width===1440?900:844,deviceScaleFactor:1,mobile:width<500});
    await send('Page.navigate',{url:baseUrl+'/inscribete/'});
    await waitFor('Boolean(document.querySelector(".registration-check--tuition input:not(:disabled)"))');
    await evaluate('sessionStorage.clear(); location.reload()');
    await waitFor('Boolean(document.querySelector(".registration-check--tuition input:not(:disabled)"))');
    const initial=await evaluate('({checked:document.querySelector(".registration-check--tuition input").checked,reveal:[...document.querySelectorAll("button")].some(b=>b.textContent.includes("Consultar anticipo")),requests:window.__quoteRequests})');
    if(initial.checked||initial.reveal||JSON.stringify(initial.requests)!=='[false,true]')throw Error('Step-one default or direct choice failed');
    await capture('registration-step1-'+width);
    await evaluate('document.querySelector(".registration-check--tuition input").click()');
    await sleep(100);
    await evaluate('document.querySelector(".registration-next").click()');
    await waitFor('Boolean(document.querySelector(".registration-shell--step-2"))');
    if(await evaluate('Boolean(document.querySelector(".registration-check--tuition"))'))throw Error('Tuition purchase choice leaked into step two');
    if(!await evaluate('document.querySelector(".registration-order").textContent.includes("235.00")'))throw Error('Optional selection was lost');
    await capture('registration-step2-optional-'+width);
    await evaluate('[...document.querySelectorAll("button")].find(b=>b.textContent==="Atrás").click()');
    await waitFor('Boolean(document.querySelector(".registration-check--tuition input:not(:disabled)"))');
    if(!await evaluate('document.querySelector(".registration-check--tuition input").checked'))throw Error('Back lost explicit purchase choice');
    await evaluate('document.querySelector(".registration-check--tuition input").click()');
    await sleep(100);
    await evaluate('document.querySelector(".registration-next").click()');
    await waitFor('Boolean(document.querySelector(".registration-shell--step-2"))');
    if(!await evaluate('document.querySelector(".registration-order").textContent.includes("95.00")&&!document.querySelector(".registration-order").textContent.includes("235.00")'))throw Error('Base-only selection retained tuition');
    await capture('registration-step2-base-'+width);
    await evaluate('sessionStorage.clear();sessionStorage.setItem("qa-optional-unavailable","1");location.reload()');
    await waitFor('Boolean(document.querySelector(".registration-next:not(:disabled)"))');
    if(!await evaluate('document.querySelector(".registration-check--tuition input").disabled&&!document.querySelector(".registration-check--tuition input").checked'))throw Error('Unavailable optional pricing became selectable');
    await evaluate('document.querySelector(".registration-next").click()');
    await waitFor('Boolean(document.querySelector(".registration-shell--step-2"))');
    await capture('registration-optional-unavailable-'+width);
    await evaluate('sessionStorage.clear()');
    for(const slug of ['ingles-jovenes-adultos','ingles-hibrido-adultos','ingles-online-adultos','espanol-extranjeros','ged','tutorias-matematicas','computacion-basica','computacion-oficina']){
      await send('Page.navigate',{url:baseUrl+'/cursos/'+slug+'/'});
      await waitFor('Boolean(document.querySelector("#course-program-title")) && document.readyState==="complete"');
      const text=await capture('course-'+slug+'-'+width);
      if(/horario de verano|Eastern Time|\d{1,2}:\d{2}\s*(?:am|pm)/i.test(text))throw Error('Unconfirmed course times remain on '+slug);
      if(!text.includes('Llamar a admisiones')||!text.includes('Solicitar información'))throw Error('Course admissions options missing');
      await evaluate('document.querySelector("#horarios").scrollIntoView({block:"start",behavior:"instant"})');
      await sleep(150);await capture('course-'+slug+'-office-inquiry-'+width);
    }
  }
  if (exceptions.length) throw new Error(`runtime exceptions: ${exceptions.join(" | ")}`);
  await writeFile(path.join(outputDir, "manifest.json"), `${JSON.stringify(evidence, null, 2)}\n`);
  console.log(`release surfaces passed (${evidence.length} screenshots)`);
  socket.close();
} finally {
  browser.kill("SIGTERM");
  if (browser.exitCode === null) {
    await Promise.race([
      new Promise((resolve) => browser.once("exit", resolve)),
      sleep(3000),
    ]);
  }
  await rm(profileDir, {
    recursive: true,
    force: true,
    maxRetries: 5,
    retryDelay: 100,
  });
}
