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

  const viewports = [
    { name: "desktop", width: 1440, height: 1000, mobile: false, scale: 1 },
    { name: "mobile", width: 390, height: 844, mobile: true, scale: 2 },
  ];
  const surfaces = [
    { name: "homepage", pathname: "/", selector: "main h1", anchor: null },
    { name: "method", pathname: "/#metodo", selector: "#metodo", anchor: "#metodo" },
    { name: "catalog", pathname: "/cursos/", selector: "#catalog-title", anchor: null },
    { name: "catalog-computing", pathname: "/cursos/?grupo=digital-technical", selector: "#catalog-subgroup-digital-technical", anchor: null },
    { name: "course-office", pathname: "/cursos/computacion-oficina/?grupo=digital-technical", selector: "#course-program-title", anchor: null },
    { name: "portal-entry", pathname: "/portal/sign-in/", selector: "#portal-signin-title", anchor: null },
    { name: "employee-entry", pathname: "/employee/sign-in/", selector: "#portal-signin-title", anchor: null },
  ];
  const evidence = [];

  for (const viewport of viewports) {
    await send("Emulation.setDeviceMetricsOverride", {
      width: viewport.width,
      height: viewport.height,
      deviceScaleFactor: viewport.scale,
      mobile: viewport.mobile,
    });
    for (const surface of surfaces) {
      const url = `${baseUrl}${surface.pathname}`;
      const navigation = await send("Page.navigate", { url }, 30000);
      if (navigation.errorText) throw new Error(`${surface.name} navigation failed: ${navigation.errorText}`);

      let state;
      const deadline = Date.now() + 15000;
      while (Date.now() < deadline) {
        state = await evaluate(`(() => ({
          ready: document.readyState === 'complete',
          found: Boolean(document.querySelector(${JSON.stringify(surface.selector)})),
          title: document.title,
          statusText: document.body?.innerText?.slice(0, 120) || ''
        }))()`);
        if (state.ready && state.found) break;
        await sleep(200);
      }
      if (!state?.found) throw new Error(`${surface.name} did not render ${surface.selector}: ${JSON.stringify(state)}`);

      await evaluate(`(() => {
        const style = document.createElement('style');
        style.textContent = 'html{scroll-behavior:auto!important}*,*::before,*::after{animation:none!important;transition:none!important;caret-color:transparent!important}';
        document.head.appendChild(style);
        const target = ${surface.anchor ? `document.querySelector(${JSON.stringify(surface.anchor)})` : "null"};
        if (target) target.scrollIntoView({ block: 'start', behavior: 'instant' }); else window.scrollTo({top:0,behavior:'instant'});
        document.querySelectorAll('video').forEach((video) => video.pause());
      })()`);
      await sleep(300);

      const layout = await evaluate(`(() => ({
        width: innerWidth,
        scrollWidth: document.documentElement.scrollWidth,
        heading: document.querySelector(${JSON.stringify(surface.selector)})?.textContent?.trim().slice(0, 120),
        portalLink: document.querySelector('a.student-portal-entry')?.getAttribute('href') || null
      }))()`);
      if (layout.scrollWidth > layout.width + 2) {
        throw new Error(`${surface.name}/${viewport.name} horizontally overflows: ${layout.scrollWidth} > ${layout.width}`);
      }
      if (surface.name === "homepage" && layout.portalLink !== "/portal/sign-in/") {
        throw new Error(`homepage portal entry is missing or incorrect: ${layout.portalLink}`);
      }

      if (surface.name === "catalog-computing") {
        const catalogState = await evaluate(`(() => ({
          selected: document.querySelector('.catalog-tabs [aria-selected="true"]')?.textContent,
          count: document.querySelector('.catalog-result-count')?.textContent,
          placement: document.querySelectorAll('main a[href*="placement-test"]').length,
          tabs: [...document.querySelectorAll('.catalog-tabs button')].map(button => {
            const rect = button.getBoundingClientRect();
            return { left: rect.left, right: rect.right, height: rect.height };
          })
        }))()`);
        if (catalogState.selected !== "Computación" || catalogState.count !== "2 cursos" || catalogState.placement !== 0 ||
            catalogState.tabs.some(tab => tab.left < 0 || tab.right > viewport.width || tab.height < 44)) {
          throw new Error(`catalog discovery contract failed: ${JSON.stringify(catalogState)}`);
        }
        // Exercise native history and keyboard state without sending any forms.
        await evaluate(`document.querySelector('#catalog-tab-english-paths').click()`);
        await sleep(150);
        const englishState = await evaluate(`(() => ({
          url: location.search,
          placement: document.querySelectorAll('main a[href*="placement-test"]').length,
          copy: document.querySelector('#orientacion-catalogo').textContent
        }))()`);
        if (!englishState.url.includes("grupo=english-paths") || englishState.placement !== 1 ||
            !englishState.copy.includes("62 preguntas") || !englishState.copy.includes("10–15 minutos")) {
          throw new Error("English guidance lost its context or assessment effort.");
        }
        await evaluate(`document.querySelector('#catalog-tab-english-paths').focus()`);
        await send("Input.dispatchKeyEvent", { type: "keyDown", key: "ArrowRight", code: "ArrowRight" });
        await send("Input.dispatchKeyEvent", { type: "keyUp", key: "ArrowRight", code: "ArrowRight" });
        await sleep(150);
        const keyboardState = await evaluate(`(() => ({
          selected: document.querySelector('.catalog-tabs [aria-selected="true"]')?.id,
          focused: document.activeElement.id
        }))()`);
        if (keyboardState.selected !== "catalog-tab-academic-support" || keyboardState.focused !== keyboardState.selected) {
          throw new Error(`Catalog keyboard navigation failed: ${JSON.stringify(keyboardState)}`);
        }
        const history = await send("Page.getNavigationHistory");
        await send("Page.navigateToHistoryEntry", { entryId: history.entries[history.currentIndex - 1].id });
        await sleep(300);
        if (await evaluate(`document.querySelector('.catalog-tabs [aria-selected="true"]')?.id`) !== "catalog-tab-english-paths") {
          throw new Error("Browser Back did not restore the English filter.");
        }
        await evaluate(`document.querySelector('#catalog-tab-digital-technical').click()`);
        await sleep(150);
        await evaluate(`document.querySelector('[data-course-detail-link="computacion-oficina"]').scrollIntoView({block:'center',behavior:'instant'})`);
        const beforeDetailY = await evaluate("scrollY");
        await evaluate(`document.querySelector('[data-course-detail-link="computacion-oficina"]').click()`);
        for (let attempt = 0; attempt < 50; attempt += 1) {
          if (await evaluate(`Boolean(document.querySelector('#course-program-title'))`)) break;
          await sleep(100);
        }
        if (!await evaluate(`location.pathname.includes('computacion-oficina') && location.search.includes('digital-technical')`)) {
          throw new Error("Course handoff lost the selected category.");
        }
        const courseHistory = await send("Page.getNavigationHistory");
        await send("Page.navigateToHistoryEntry", { entryId: courseHistory.entries[courseHistory.currentIndex - 1].id });
        await sleep(600);
        const restored = await evaluate(`(() => ({selected:document.querySelector('.catalog-tabs [aria-selected="true"]')?.textContent,y:scrollY}))()`);
        if (restored.selected !== "Computación" || Math.abs(restored.y - beforeDetailY) > 100) {
          throw new Error(`Course Back failed to restore category and scroll: ${JSON.stringify({beforeDetailY,...restored})}`);
        }
        await evaluate("window.scrollTo({top:0,behavior:'instant'})");
      }

      if (surface.name === "course-office") {
        const readingOrder = await evaluate(`(() => ({
          title:document.querySelector('#course-program-title').getBoundingClientRect().top,
          facts:document.querySelector('.course-quick-facts').getBoundingClientRect().top
        }))()`);
        if (readingOrder.facts <= readingOrder.title) throw new Error("Course facts appear before the course title.");
        await evaluate(`document.querySelector('[data-callback-dialog-open]').click()`);
        await sleep(150);
        const inquiry = await evaluate(`(() => ({
          subject: document.querySelector('dialog[open] select[name="programa"]')?.value,
          consent: document.querySelector('dialog[open] [name="contactPermission"]')?.checked,
          close: Boolean(document.querySelector('dialog[open] [data-callback-dialog-close]'))
        }))()`);
        if (inquiry.subject !== "computacion-oficina" || inquiry.consent !== false || !inquiry.close) {
          throw new Error(`Course inquiry context failed: ${JSON.stringify(inquiry)}`);
        }
        await send("Input.dispatchKeyEvent", { type: "keyDown", key: "Escape", code: "Escape", windowsVirtualKeyCode: 27, nativeVirtualKeyCode: 27 });
        await send("Input.dispatchKeyEvent", { type: "keyUp", key: "Escape", code: "Escape", windowsVirtualKeyCode: 27, nativeVirtualKeyCode: 27 });
        await sleep(150);
        const closedInquiry = await evaluate(`(() => ({open:Boolean(document.querySelector('dialog[open]')),focusReturned:document.activeElement.hasAttribute('data-callback-dialog-open')}))()`);
        if (closedInquiry.open || !closedInquiry.focusReturned) {
          throw new Error(`Inquiry Escape/focus return failed: ${JSON.stringify(closedInquiry)}`);
        }
        await evaluate("window.scrollTo({top:0,behavior:'instant'})");
      }

      if (surface.name === "homepage" && viewport.mobile) {
        await evaluate(`document.querySelector('.menu-toggle')?.click()`);
        await sleep(50);
        const openedMenu = await evaluate(`(() => {
          const trigger = document.querySelector('.menu-toggle');
          const links = Array.from(document.querySelectorAll('#site-nav a')).map((link) => ({
            label: link.textContent.trim(),
            href: link.getAttribute('href'),
          }));
          return {
            expanded: trigger?.getAttribute('aria-expanded'),
            open: document.querySelector('#site-nav')?.classList.contains('is-open'),
            links,
          };
        })()`);
        const expectedLinks = [
          { label: "Inicio", href: "/" },
          { label: "Cursos", href: "/cursos/" },
          { label: "Examen de nivel", href: "/placement-test/" },
        ];
        if (
          openedMenu.expanded !== "true" ||
          !openedMenu.open ||
          JSON.stringify(openedMenu.links) !== JSON.stringify(expectedLinks)
        ) {
          throw new Error(`mobile menu contract failed: ${JSON.stringify(openedMenu)}`);
        }
        await send("Input.dispatchKeyEvent", { type: "keyDown", key: "Escape", code: "Escape", windowsVirtualKeyCode: 27, nativeVirtualKeyCode: 27 });
        await send("Input.dispatchKeyEvent", { type: "keyUp", key: "Escape", code: "Escape", windowsVirtualKeyCode: 27, nativeVirtualKeyCode: 27 });
        await sleep(50);
        const escapedMenu = await evaluate(`(() => ({
          expanded: document.querySelector('.menu-toggle')?.getAttribute('aria-expanded'),
          focused: document.activeElement?.classList.contains('menu-toggle') || false,
        }))()`);
        if (escapedMenu.expanded !== "false" || !escapedMenu.focused) {
          throw new Error(`mobile menu Escape contract failed: ${JSON.stringify(escapedMenu)}`);
        }
        await evaluate(`document.querySelector('.menu-toggle')?.click()`);
        await sleep(50);
        await evaluate(`document.querySelector('main')?.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }))`);
        await sleep(50);
        const outsideMenu = await evaluate(`document.querySelector('.menu-toggle')?.getAttribute('aria-expanded')`);
        if (outsideMenu !== "false") {
          throw new Error(`mobile menu outside-click contract failed: ${outsideMenu}`);
        }
      }

      if (surface.name === "portal-entry" || surface.name === "employee-entry") {
        const employee = surface.name === "employee-entry";
        const passwordState = await evaluate(`(() => ({
          heading: document.querySelector('#portal-signin-title')?.textContent?.trim(),
          password: Boolean(document.querySelector('input[type="password"]')),
          passwordSelected: document.querySelector('.portal-signin__methods button')?.getAttribute('aria-pressed'),
          newStudent: Boolean(document.querySelector('.portal-signin__new-student')),
        }))()`);
        if (
          !passwordState.password ||
          passwordState.passwordSelected !== "true" ||
          passwordState.newStudent === employee ||
          (employee && passwordState.heading !== "Entra al Portal de empleados") ||
          (!employee && passwordState.heading !== "Entra a tu Portal")
        ) {
          throw new Error(`${surface.name} password contract failed: ${JSON.stringify(passwordState)}`);
        }
        await evaluate(`(() => {
          const buttons = Array.from(document.querySelectorAll('.portal-signin__methods button'));
          buttons.find((button) => button.textContent.includes('Código'))?.click();
        })()`);
        await sleep(50);
        const codeState = await evaluate(`(() => {
          const buttons = Array.from(document.querySelectorAll('.portal-signin__methods button'));
          return {
            password: Boolean(document.querySelector('input[type="password"]')),
            codeSelected: buttons[1]?.getAttribute('aria-pressed'),
            copy: document.querySelector('.portal-access__card > p:not(.portal-eyebrow)')?.textContent?.trim(),
          };
        })()`);
        if (codeState.password || codeState.codeSelected !== "true" || !codeState.copy?.includes("código de seis dígitos")) {
          throw new Error(`${surface.name} code fallback contract failed: ${JSON.stringify(codeState)}`);
        }
        await evaluate(`document.querySelector('.portal-signin__methods button')?.click()`);
        await sleep(50);
      }

      const screenshot = await send("Page.captureScreenshot", { format: "png", captureBeyondViewport: false }, 30000);
      const filename = `${surface.name}-${viewport.name}.png`;
      await writeFile(path.join(outputDir, filename), Buffer.from(screenshot.data, "base64"));
      evidence.push({ surface: surface.name, viewport: viewport.name, url, file: filename, heading: layout.heading });
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
