import { createServer } from "node:http";
import { existsSync } from "node:fs";
import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { spawn } from "node:child_process";

const baseUrl = (process.env.VERIFY_BASE_URL || "http://127.0.0.1:3000").replace(/\/$/, "");
const outputDir = path.resolve(process.env.VERIFY_SCREENSHOTS_DIR || "artifacts/release-surfaces");
const chrome = ["/usr/bin/google-chrome-stable", "/usr/bin/google-chrome", "/usr/bin/chromium", "/usr/bin/chromium-browser"]
  .find(existsSync);

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
  `--remote-debugging-port=${port}`,
  `--user-data-dir=${profileDir}`,
  "about:blank",
], { stdio: ["ignore", "ignore", "pipe"] });

let browserError = "";
browser.stderr.on("data", (chunk) => { browserError += chunk.toString(); });
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

try {
  let webSocketUrl;
  for (let attempt = 0; attempt < 60; attempt += 1) {
    try {
      const response = await fetch(`http://127.0.0.1:${port}/json/list`);
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
    { name: "portal-entry", pathname: "/portal/sign-in/", selector: "#portal-signin-title", anchor: null },
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
        style.textContent = '*,*::before,*::after{animation:none!important;transition:none!important;caret-color:transparent!important}';
        document.head.appendChild(style);
        const target = ${surface.anchor ? `document.querySelector(${JSON.stringify(surface.anchor)})` : "null"};
        if (target) target.scrollIntoView({ block: 'start' }); else window.scrollTo(0, 0);
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
  await rm(profileDir, { recursive: true, force: true });
}
