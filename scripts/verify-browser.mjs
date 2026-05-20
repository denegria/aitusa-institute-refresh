import { mkdir, writeFile, rm } from "node:fs/promises";
import { createReadStream, existsSync, statSync } from "node:fs";
import { createServer } from "node:http";
import path from "node:path";
import { spawn } from "node:child_process";

const root = process.cwd();
const screenshotsDir = path.join(root, "screenshots");
const profileDir = path.join(root, ".chrome-profile");
const chromeCandidates = [
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
];

const chrome = chromeCandidates.find((candidate) => existsSync(candidate));
if (!chrome) {
  throw new Error("No Chrome or Edge executable found.");
}

await mkdir(screenshotsDir, { recursive: true });
await rm(profileDir, { recursive: true, force: true });

const types = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".webmanifest": "application/manifest+json; charset=utf-8",
  ".xml": "application/xml; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
};

const appServer = createServer((request, response) => {
  const url = new URL(request.url, "http://127.0.0.1");
  const requested = decodeURIComponent(url.pathname === "/" ? "/index.html" : url.pathname);
  const target = path.resolve(root, `.${requested}`);

  if (!target.startsWith(root) || !existsSync(target) || !statSync(target).isFile()) {
    response.writeHead(404, { "content-type": "text/plain; charset=utf-8" });
    response.end("Not found");
    return;
  }

  response.writeHead(200, {
    "content-type": types[path.extname(target).toLowerCase()] || "application/octet-stream",
  });
  createReadStream(target).pipe(response);
});

await new Promise((resolve) => appServer.listen(0, "127.0.0.1", resolve));
const appPort = appServer.address().port;
const appUrl = `http://127.0.0.1:${appPort}/index.html`;
const port = 9223;
const browser = spawn(
  chrome,
  [
    "--headless",
    "--disable-gpu",
    "--disable-gpu-compositing",
    "--disable-software-rasterizer",
    "--in-process-gpu",
    "--no-sandbox",
    "--allow-file-access-from-files",
    "--disable-extensions",
    "--disable-component-extensions-with-background-pages",
    "--hide-scrollbars",
    `--remote-debugging-port=${port}`,
    `--user-data-dir=${profileDir}`,
    "about:blank",
  ],
  { stdio: ["ignore", "pipe", "pipe"], windowsHide: true },
);

let stderr = "";
browser.stdout.on("data", () => {});
browser.stderr.on("data", (chunk) => {
  stderr += chunk.toString();
});

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const fetchJson = async (url) => {
  const response = await fetch(url, { signal: AbortSignal.timeout(500) });
  if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
  return response.json();
};

let wsUrl;
console.log("Starting headless browser verification...");
for (let i = 0; i < 80; i += 1) {
  try {
    const pages = await fetchJson(`http://127.0.0.1:${port}/json/list`);
    wsUrl = pages.find((page) => page.type === "page")?.webSocketDebuggerUrl;
    if (wsUrl) break;
  } catch {
    await sleep(100);
  }
}

if (!wsUrl) {
  browser.kill();
  throw new Error(`Chrome did not expose a DevTools target.\n${stderr}`);
}

const socket = new WebSocket(wsUrl);
let openTimer;
await new Promise((resolve, reject) => {
  openTimer = setTimeout(() => reject(new Error("Timed out opening DevTools WebSocket")), 5000);
  socket.addEventListener("open", resolve, { once: true });
  socket.addEventListener("error", reject, { once: true });
}).finally(() => {
  clearTimeout(openTimer);
});

let nextId = 1;
const pending = new Map();
const consoleMessages = [];
const exceptions = [];

socket.addEventListener("message", (event) => {
  const message = JSON.parse(event.data);
  if (message.id && pending.has(message.id)) {
    const { resolve, reject } = pending.get(message.id);
    pending.delete(message.id);
    if (message.error) reject(new Error(message.error.message));
    else resolve(message.result);
    return;
  }

  if (message.method === "Runtime.consoleAPICalled") {
    consoleMessages.push(message.params);
  }

  if (message.method === "Runtime.exceptionThrown") {
    const details = message.params.exceptionDetails;
    exceptions.push({
      text: details?.text || "Runtime exception",
      description: details?.exception?.description || details?.exception?.value || null,
      url: details?.url || null,
      lineNumber: details?.lineNumber,
      columnNumber: details?.columnNumber,
    });
  }
});

const send = (method, params = {}) =>
  new Promise((resolve, reject) => {
    const id = nextId;
    nextId += 1;
    const timer = setTimeout(() => {
      pending.delete(id);
      reject(new Error(`Timed out waiting for ${method}`));
    }, 8000);
    pending.set(id, {
      resolve: (value) => {
        clearTimeout(timer);
        resolve(value);
      },
      reject: (error) => {
        clearTimeout(timer);
        reject(error);
      },
    });
    socket.send(JSON.stringify({ id, method, params }));
  });

const waitForLoad = () =>
  new Promise((resolve) => {
    const timer = setTimeout(() => {
      socket.removeEventListener("message", handler);
      resolve();
    }, 2500);
    const handler = (event) => {
      const message = JSON.parse(event.data);
      if (message.method === "Page.loadEventFired") {
        clearTimeout(timer);
        socket.removeEventListener("message", handler);
        resolve();
      }
    };
    socket.addEventListener("message", handler);
  });

await send("Page.enable");
await send("Runtime.enable");

const evaluate = async (expression) => {
  const result = await send("Runtime.evaluate", {
    expression,
    returnByValue: true,
    awaitPromise: true,
  });
  return result.result.value;
};

const verifyViewport = async ({ name, width, height, mobile }) => {
  console.log(`Checking ${name}...`);
  await send("Emulation.setDeviceMetricsOverride", {
    width,
    height,
    deviceScaleFactor: mobile ? 2 : 1,
    mobile,
  });

  const loaded = waitForLoad();
  const nav = await send("Page.navigate", { url: appUrl });
  if (nav.errorText && nav.errorText !== "net::ERR_ABORTED") {
    throw new Error(`Navigation failed: ${nav.errorText}`);
  }
  await loaded;
  await sleep(700);

  const summary = await evaluate(`(async () => {
    const images = [...document.images];
    await Promise.all(images.map((img) => new Promise((resolve) => {
      img.loading = 'eager';
      if (img.complete && img.naturalWidth > 0) {
        resolve();
        return;
      }
      const done = () => resolve();
      img.addEventListener('load', done, { once: true });
      img.addEventListener('error', done, { once: true });
      img.src = img.currentSrc || img.src;
      setTimeout(done, 2500);
    })));
    const missingImages = images
      .filter((img) => !img.complete || img.naturalWidth === 0)
      .map((img) => img.currentSrc || img.src);
    const overflowing = [...document.querySelectorAll('body *')]
      .filter((el) => el.scrollWidth > el.clientWidth + 2 && getComputedStyle(el).overflowX === 'visible')
      .slice(0, 12)
      .map((el) => ({
        tag: el.tagName.toLowerCase(),
        text: (el.innerText || el.alt || '').trim().slice(0, 90),
        scrollWidth: el.scrollWidth,
        clientWidth: el.clientWidth,
      }));
    return {
      location: location.href,
      title: document.title,
      h1: document.querySelector('h1')?.innerText || null,
      programs: document.querySelectorAll('.program-card').length,
      visiblePrograms: [...document.querySelectorAll('.program-card')].filter((card) => !card.hidden).length,
      books: document.querySelectorAll('.book-card').length,
      products: document.querySelectorAll('.payment-card').length,
      variantLists: document.querySelectorAll('.variant-list').length,
      faqs: document.querySelectorAll('.faq-list details').length,
      missingImages,
      overflowing,
      pageHeight: document.documentElement.scrollHeight,
    };
  })()`);

  const interactions = await evaluate(`(() => {
    document.querySelector('[data-filter="tecnologia"]')?.click();
    const technologyVisible = [...document.querySelectorAll('.program-card')].filter((card) => !card.hidden).length;
    const form = document.querySelector('[data-lead-form]');
    form?.querySelector('[name="nombre"]').setAttribute('value', 'Maria');
    form?.querySelector('[name="apellido"]').setAttribute('value', 'Lopez');
    form?.querySelector('[name="email"]').setAttribute('value', 'maria@example.com');
    form?.querySelector('[name="telefono"]').setAttribute('value', '5551234');
    form?.querySelector('[name="ubicacion"]').setAttribute('value', 'New Jersey');
    form?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    return {
      technologyVisible,
      formStatus: document.querySelector('[data-form-status]')?.innerText || '',
      menuButtonPresent: Boolean(document.querySelector('.menu-toggle')),
    };
  })()`);

  let target = null;
  let productTarget = null;
  let screenshotError = null;
  try {
    const shot = await send("Page.captureScreenshot", {
      format: "png",
      captureBeyondViewport: false,
      fromSurface: true,
    });
    target = path.join(screenshotsDir, `${name}.png`);
    await writeFile(target, Buffer.from(shot.data, "base64"));

    await evaluate(`(() => {
      const title = document.querySelector('#pagos-title');
      if (!title) return;
      const y = title.getBoundingClientRect().top + window.scrollY - 96;
      window.scrollTo({ top: y, behavior: 'instant' });
    })()`);
    await sleep(400);
    const productShot = await send("Page.captureScreenshot", {
      format: "png",
      captureBeyondViewport: false,
      fromSurface: true,
    });
    productTarget = path.join(screenshotsDir, `${name}-products.png`);
    await writeFile(productTarget, Buffer.from(productShot.data, "base64"));
  } catch (error) {
    screenshotError = error.message;
  }

  return { name, width, height, screenshot: target, productScreenshot: productTarget, screenshotError, ...summary, interactions };
};

const results = [];
try {
  results.push(await verifyViewport({ name: "desktop-home", width: 1440, height: 1400, mobile: false }));
  results.push(await verifyViewport({ name: "tablet-home", width: 820, height: 1180, mobile: true }));
  results.push(await verifyViewport({ name: "mobile-home", width: 390, height: 1200, mobile: true }));
} finally {
  socket.close();
  browser.kill();
  appServer.close();
}

await writeFile(
  path.join(screenshotsDir, "verification.json"),
  JSON.stringify(
    {
      appUrl,
      chrome,
      results,
      consoleMessages: consoleMessages.map((item) => ({
        type: item.type,
        text: item.args?.map((arg) => arg.value || arg.description).join(" "),
      })),
      exceptions,
    },
    null,
    2,
  ),
);

console.log(JSON.stringify({ results, exceptions, consoleMessageCount: consoleMessages.length }, null, 2));
