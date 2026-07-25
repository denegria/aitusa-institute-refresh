import { mkdir, readFile, writeFile, rm } from "node:fs/promises";
import { existsSync, statSync } from "node:fs";
import { createServer } from "node:http";
import path from "node:path";
import { spawn } from "node:child_process";

const root = process.cwd();
const screenshotsDir = process.env.VERIFY_SCREENSHOTS_DIR
  ? path.resolve(process.env.VERIFY_SCREENSHOTS_DIR)
  : path.join(root, "screenshots");
const profileDir = path.join(root, ".chrome-profile");
const chromeCandidates = [
  "/usr/bin/google-chrome-stable",
  "/usr/bin/google-chrome",
  "/usr/bin/chromium",
  "/usr/bin/chromium-browser",
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
  ".mp4": "video/mp4",
  ".webm": "video/webm",
};

const appServer = createServer(async (request, response) => {
  const url = new URL(request.url, "http://127.0.0.1");
  const requested = decodeURIComponent(url.pathname === "/" ? "/index.html" : url.pathname);
  const routeFallback =
    /^\/placement-test\/?$/.test(requested) ||
    /^\/placement-test\/index\.html$/.test(requested) ||
    /^\/cursos\/[^/]+\/?$/.test(requested) ||
    /^\/cursos\/[^/]+\/index\.html$/.test(requested);
  const target = path.resolve(root, routeFallback ? "./index.html" : `.${requested}`);

  if (!target.startsWith(root) || !existsSync(target) || !statSync(target).isFile()) {
    response.writeHead(404, { "content-type": "text/plain; charset=utf-8" });
    response.end("Not found");
    return;
  }

  const body = await readFile(target);
  response.writeHead(200, {
    "content-type": types[path.extname(target).toLowerCase()] || "application/octet-stream",
    "content-length": body.length,
  });
  response.end(body);
});

await new Promise((resolve) => appServer.listen(0, "127.0.0.1", resolve));
const appPort = appServer.address().port;
const appUrl = `http://127.0.0.1:${appPort}/index.html`;

const getOpenPort = async () => {
  const probe = createServer();
  await new Promise((resolve) => probe.listen(0, "127.0.0.1", resolve));
  const freePort = probe.address().port;
  await new Promise((resolve) => probe.close(resolve));
  return freePort;
};

const port = await getOpenPort();
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
const networkEvents = [];

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

  if (message.method === "Network.requestWillBeSent") {
    const url = message.params?.request?.url || "";
    if (url.includes("/src/") || url.endsWith("/index.html")) {
      networkEvents.push({
        type: "request",
        id: message.params.requestId,
        url,
      });
    }
  }

  if (message.method === "Network.responseReceived") {
    const url = message.params?.response?.url || "";
    if (url.includes("/src/") || url.endsWith("/index.html")) {
      networkEvents.push({
        type: "response",
        id: message.params.requestId,
        url,
        status: message.params.response.status,
        mimeType: message.params.response.mimeType,
      });
    }
  }

  if (message.method === "Network.loadingFinished") {
    networkEvents.push({
      type: "finished",
      id: message.params.requestId,
      encodedDataLength: message.params.encodedDataLength,
    });
  }

  if (message.method === "Network.loadingFailed") {
    networkEvents.push({
      type: "failed",
      id: message.params.requestId,
      errorText: message.params.errorText,
      canceled: message.params.canceled,
    });
  }
});

const send = (method, params = {}, timeoutMs = 8000) =>
  new Promise((resolve, reject) => {
    const id = nextId;
    nextId += 1;
    const timer = setTimeout(() => {
      pending.delete(id);
      reject(new Error(`Timed out waiting for ${method}`));
    }, timeoutMs);
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
await send("Network.enable");

const evaluate = async (expression) => {
  const result = await send("Runtime.evaluate", {
    expression,
    returnByValue: true,
    awaitPromise: true,
  });
  return result.result.value;
};

const waitForAppReady = async () => {
  let lastState = null;
  const deadline = Date.now() + 10000;

  while (Date.now() < deadline) {
    try {
      lastState = await evaluate(`(() => {
        const app = document.querySelector('#app');
        return {
          readyState: document.readyState,
          location: location.href,
          title: document.title,
          bodyLength: document.body?.innerHTML?.length || 0,
          scripts: [...document.scripts].map((script) => script.src || script.type || "inline").slice(-4),
          aitData: Boolean(window.AITUSA_DATA),
          aitProgramCount: window.AITUSA_DATA?.programs?.length || 0,
          appChildren: app?.children?.length || 0,
          appTextLength: app?.innerText?.length || 0,
          h1: document.querySelector('h1')?.innerText || null,
          programs: document.querySelectorAll('.program-card').length,
          offerNodes: document.querySelectorAll('.offer-node').length,
          faqs: document.querySelectorAll('.faq-list details').length,
        };
      })()`);

      if (lastState.h1 && (lastState.programs > 0 || lastState.offerNodes > 0) && lastState.faqs > 0) {
        return lastState;
      }
    } catch {
      // Navigation can briefly make the runtime unavailable.
    }

    await sleep(250);
  }

  throw new Error(
    `App did not finish rendering: ${JSON.stringify({
      lastState,
      exceptions,
      consoleMessages: consoleMessages.map((item) => ({
        type: item.type,
        text: item.args?.map((arg) => arg.value || arg.description).join(" "),
      })),
      networkEvents: networkEvents.slice(-20),
    })}`,
  );
};

const stabilizeViewport = async () => {
  await evaluate(`(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    document.querySelectorAll('video').forEach((video) => {
      video.pause();
      if (video.currentTime > 0.01) {
        try {
          video.currentTime = 0;
        } catch {}
      }
    });
  })()`);
  await sleep(250);
};

const captureViewport = async (name) => {
  const capture = (fromSurface) =>
    send(
      "Page.captureScreenshot",
      {
        format: "png",
        captureBeyondViewport: false,
        fromSurface,
      },
      20000,
    );

  try {
    return await capture(true);
  } catch (error) {
    console.warn(`Retrying ${name} screenshot without fromSurface: ${error.message}`);
    return capture(false);
  }
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
  const nav = await send("Page.navigate", { url: appUrl }, 30000);
  if (nav.errorText && nav.errorText !== "net::ERR_ABORTED") {
    throw new Error(`Navigation failed: ${nav.errorText}`);
  }
  await loaded;
  await waitForAppReady();
  await sleep(400);

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
    const methodPosterIssues = (await Promise.all(
      [...document.querySelectorAll('.method-panel__video')].map(async (video) => {
        const poster = new Image();
        poster.src = video.poster;
        await new Promise((resolve) => {
          if (poster.complete) {
            resolve();
            return;
          }
          poster.addEventListener('load', resolve, { once: true });
          poster.addEventListener('error', resolve, { once: true });
          setTimeout(resolve, 2500);
        });
        const expectedWidth = Number(video.getAttribute('width'));
        const expectedHeight = Number(video.getAttribute('height'));
        const expectedRatio = expectedWidth / expectedHeight;
        const actualRatio = poster.naturalWidth / poster.naturalHeight;
        if (
          !poster.naturalWidth ||
          !poster.naturalHeight ||
          !Number.isFinite(expectedRatio) ||
          Math.abs(actualRatio - expectedRatio) > 0.015
        ) {
          return {
            poster: video.poster,
            expected: [expectedWidth, expectedHeight],
            actual: [poster.naturalWidth, poster.naturalHeight],
          };
        }
        return null;
      }),
    )).filter(Boolean);
    const methodVideos = [...document.querySelectorAll('.clip-card__media-player')];
    await Promise.all(methodVideos.map((video) => new Promise((resolve) => {
      if (video.readyState >= 1 || video.error) {
        resolve();
        return;
      }
      const done = () => resolve();
      video.preload = 'metadata';
      video.addEventListener('loadedmetadata', done, { once: true });
      video.addEventListener('error', done, { once: true });
      video.load();
      setTimeout(done, 3500);
    })));
    const videoMetadataIssues = methodVideos
      .filter((video) => video.readyState < 1 || video.error)
      .map((video) => ({
        src: video.currentSrc || video.getAttribute('src'),
        readyState: video.readyState,
        networkState: video.networkState,
        error: video.error ? { code: video.error.code, message: video.error.message } : null,
      }));
    const inspectVideoFrame = async (video) => {
      if (video.readyState < 1 || video.error) return null;
      const canvas = document.createElement('canvas');
      const scale = video.videoWidth > 360 ? 360 / video.videoWidth : 1;
      canvas.width = Math.max(1, Math.round(video.videoWidth * scale));
      canvas.height = Math.max(1, Math.round(video.videoHeight * scale));
      const context = canvas.getContext('2d', { willReadFrequently: true });
      const duration = Number.isFinite(video.duration) && video.duration > 0 ? video.duration : 4;
      const sampleTime = Math.min(Math.max(0.7, duration * 0.35), Math.max(0.7, duration - 0.3));
      await new Promise((resolve) => {
        const done = () => resolve();
        const timer = setTimeout(done, 3500);
        video.addEventListener('seeked', () => {
          clearTimeout(timer);
          done();
        }, { once: true });
        video.currentTime = sampleTime;
      });
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      const { data, width, height } = context.getImageData(0, 0, canvas.width, canvas.height);
      let luminance = 0;
      let nonDark = 0;
      let count = 0;
      const step = Math.max(4, Math.floor((width * height) / 6000)) * 4;
      for (let i = 0; i < data.length; i += step) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        const luma = (0.2126 * r) + (0.7152 * g) + (0.0722 * b);
        luminance += luma;
        if (luma > 30) nonDark += 1;
        count += 1;
      }
      const averageLuminance = count ? luminance / count : 0;
      const nonDarkRatio = count ? nonDark / count : 0;
      if (averageLuminance < 8 && nonDarkRatio < 0.04) {
        return {
          src: video.currentSrc || video.getAttribute('src'),
          sampleTime,
          averageLuminance,
          nonDarkRatio,
        };
      }
      return null;
    };
    const videoVisualIssues = (await Promise.all(methodVideos.map(inspectVideoFrame))).filter(Boolean);
    const methodFrameIssues = [...document.querySelectorAll('.method-panel:not([hidden]) .method-panel__media')]
      .flatMap((media) => {
        const video = media.querySelector('.method-panel__video');
        if (!video) {
          return [{ reason: 'missing-video' }];
        }
        const mediaRect = media.getBoundingClientRect();
        const videoRect = video.getBoundingClientRect();
        const frameInset = parseFloat(getComputedStyle(media).paddingTop);
        const gaps = {
          top: videoRect.top - mediaRect.top,
          right: mediaRect.right - videoRect.right,
          bottom: mediaRect.bottom - videoRect.bottom,
          left: videoRect.left - mediaRect.left,
        };
        const tolerance = 1.5;
        const aligned = Number.isFinite(frameInset) && Object.values(gaps)
          .every((gap) => Math.abs(gap - frameInset) <= tolerance);
        return aligned ? [] : [{
          reason: 'video-outside-frame',
          frameInset,
          gaps: Object.fromEntries(
            Object.entries(gaps).map(([side, gap]) => [side, Math.round(gap * 100) / 100]),
          ),
        }];
      });
    const overflowing = [...document.querySelectorAll('body *')]
      .filter((el) => el.scrollWidth > el.clientWidth + 2 && getComputedStyle(el).overflowX === 'visible')
      .slice(0, 12)
      .map((el) => ({
        tag: el.tagName.toLowerCase(),
        id: el.id || null,
        className: typeof el.className === 'string' ? el.className : null,
        text: (el.innerText || el.alt || '').trim().slice(0, 90),
        scrollWidth: el.scrollWidth,
        clientWidth: el.clientWidth,
      }));
    const sectionRhythm = [...document.querySelectorAll('main > section')]
      .map((section) => {
        const height = Math.round(section.getBoundingClientRect().height);
        return {
          id: section.id || null,
          className: section.className || null,
          height,
          viewportRatio: Math.round((height / innerHeight) * 100) / 100,
        };
      });
    const stickyHeaderHeight = Math.round(document.querySelector('.site-header')?.getBoundingClientRect().height || 0);
    const availableSectionHeight = innerHeight - stickyHeaderHeight;
    const sectionRhythmIssues = sectionRhythm
      .filter((section) => section.height > availableSectionHeight + 2)
      .map((section) => ({
        type: 'section-exceeds-viewport',
        ...section,
        viewportHeight: innerHeight,
        stickyHeaderHeight,
        availableSectionHeight,
      }));
    return {
      location: location.href,
      title: document.title,
      h1: document.querySelector('h1')?.innerText || null,
      programs: document.querySelectorAll('.program-card').length,
      visiblePrograms: [...document.querySelectorAll('.program-card')].filter((card) => !card.hidden).length,
      courseDetails: document.querySelectorAll('[data-course-detail]').length,
      courseDetailLinks: document.querySelectorAll('[data-course-detail-link]').length,
      videoCards: document.querySelectorAll('.clip-card, .testimonial-card video, [data-hero-player]').length,
      locations: document.querySelectorAll('.compact-location-row').length,
      mapPins: document.querySelectorAll('.real-map-pin').length,
      realMapSrc: document.querySelector('.real-map-card__image')?.currentSrc || '',
      locationSectionHeight: Math.round(document.querySelector('#sedes')?.getBoundingClientRect().height || 0),
      variantLists: document.querySelectorAll('.variant-list').length,
      faqs: document.querySelectorAll('.faq-list details').length,
      missingImages,
      methodPosterIssues,
      videoMetadataIssues,
      videoVisualIssues,
      methodFrameIssues,
      overflowing,
      sectionRhythm,
      sectionRhythmIssues,
      availableSectionHeight,
      pageHeight: document.documentElement.scrollHeight,
    };
  })()`);

  let target = null;
  let secondaryTarget = null;
  const sectionScreenshots = {};
  let screenshotError = null;
  try {
    await stabilizeViewport();
    const shot = await captureViewport(`${name} home`);
    target = path.join(screenshotsDir, `${name}.png`);
    await writeFile(target, Buffer.from(shot.data, "base64"));

    const captureSection = async (selector, label) => {
      await evaluate(`(() => {
        const target = document.querySelector(${JSON.stringify(selector)});
        if (!target) return;
        const y = target.getBoundingClientRect().top + window.scrollY - 96;
        window.scrollTo({ top: y, behavior: 'instant' });
      })()`);
      await sleep(400);
      const sectionShot = await captureViewport(`${name} ${label}`);
      const sectionTarget = path.join(screenshotsDir, `${name}-${label}.png`);
      await writeFile(sectionTarget, Buffer.from(sectionShot.data, "base64"));
      sectionScreenshots[label] = sectionTarget;
    };

    await captureSection("#metodo", "method");
    await captureSection(".method-tabs", "method-tabs");
    await captureSection("#experiencia", "videos");
    await captureSection(".proof-editorial__tabs", "story-controls");
    await captureSection("#cursos", "courses");
    await captureSection(".faq-section", "faq");
    await captureSection("footer.site-footer", "footer");

    await evaluate(`(() => {
      const contactCard = document.querySelector('.contact-card--secondary');
      if (contactCard) contactCard.open = true;
    })()`);
    await captureSection("#contacto", "contact-open");

    await evaluate(`(() => {
      document.querySelector('[data-filter="tecnologia"]')?.click();
      const form = document.querySelector('[data-lead-form]');
      const nameInput = form?.querySelector('[name="nombre"]');
      const emailInput = form?.querySelector('[name="email"]');
      const phoneInput = form?.querySelector('[name="telefono"]');
      const locationInput = form?.querySelector('[name="ubicacion"]');
      const scheduleInput = form?.querySelector('[name="mejorHorario"]');
      const contactPermission = form?.querySelector('[name="contactPermission"]');
      if (nameInput) nameInput.value = 'Maria';
      if (emailInput) emailInput.value = 'maria@example.com';
      if (phoneInput) phoneInput.value = '5551234';
      if (locationInput) locationInput.value = 'Bound Brook';
      if (scheduleInput) scheduleInput.value = 'Noche';
      if (contactPermission) contactPermission.checked = true;
      form?.requestSubmit();
      document.querySelector('[data-course-detail-link="computacion-oficina"]')?.click();
    })()`);

    await evaluate(`(() => {
      const title = document.querySelector('#sedes-title');
      if (!title) return;
      const y = title.getBoundingClientRect().top + window.scrollY - 96;
      window.scrollTo({ top: y, behavior: 'instant' });
    })()`);
    await sleep(400);
    const secondaryShot = await captureViewport(`${name} secondary`);
    secondaryTarget = path.join(screenshotsDir, `${name}-secondary.png`);
    await writeFile(secondaryTarget, Buffer.from(secondaryShot.data, "base64"));
  } catch (error) {
    screenshotError = error.message;
  }

  const interactions = await evaluate(`(() => ({
    technologyVisible: [...document.querySelectorAll('.program-card')].filter((card) => !card.hidden).length,
    courseDetails: document.querySelectorAll('[data-course-detail]').length,
    courseRoutePath: location.pathname,
    openCourseDetail: document.querySelector('[data-course-detail][open]')?.dataset.courseDetail || '',
    officeDetailHasExcel: document.querySelector('[data-course-detail="computacion-oficina"]')?.innerText.includes('Excel') || false,
    formStatus: document.querySelector('[data-form-status]')?.innerText || '',
    activeNavLabel: document.querySelector('.site-nav [aria-current="location"]')?.innerText || '',
    contactCardOpen: Boolean(document.querySelector('.contact-card--secondary')?.open),
    contactSectionHeight: Math.round(document.querySelector('#contacto')?.getBoundingClientRect().height || 0),
    contactFieldNames: [...document.querySelectorAll('[data-lead-form] [name]')]
      .filter((field) => field.type !== 'hidden')
      .map((field) => field.name),
    menuButtonPresent: Boolean(document.querySelector('.menu-toggle')),
  }))()`);

  return { name, width, height, screenshot: target, secondaryScreenshot: secondaryTarget, sectionScreenshots, screenshotError, ...summary, interactions };
};

const verifyHeroViewport = async ({ name, width, height }) => {
  console.log(`Checking ${name}...`);
  await send("Emulation.setDeviceMetricsOverride", {
    width,
    height,
    deviceScaleFactor: 1,
    mobile: false,
  });

  const loaded = waitForLoad();
  const nav = await send("Page.navigate", { url: appUrl }, 30000);
  if (nav.errorText && nav.errorText !== "net::ERR_ABORTED") {
    throw new Error(`Navigation failed: ${nav.errorText}`);
  }
  await loaded;
  await waitForAppReady();
  await sleep(400);

  await evaluate(`(async () => {
    const image = document.querySelector('.hero__visual img');
    if (!image) return;
    image.loading = 'eager';
    if (image.complete && image.naturalWidth > 0) return;
    await new Promise((resolve) => {
      const done = () => resolve();
      image.addEventListener('load', done, { once: true });
      image.addEventListener('error', done, { once: true });
      setTimeout(done, 2500);
    });
  })()`);
  await stabilizeViewport();

  const metrics = await evaluate(`(() => {
    const header = document.querySelector('.site-header');
    const main = document.querySelector('.hero__main');
    const proof = document.querySelector('.hero__proof-band');
    const community = document.querySelector('.hero__community-line');
    const image = document.querySelector('.hero__visual img');
    const rect = (element) => element?.getBoundingClientRect() || null;
    const round = (value) => Math.round(value * 100) / 100;
    const headerRect = rect(header);
    const mainRect = rect(main);
    const proofRect = rect(proof);
    const communityRect = rect(community);
    const imageRect = rect(image);
    const viewportIssues = [];

    if (!headerRect || !mainRect || !proofRect || !communityRect || !imageRect) {
      viewportIssues.push({ type: 'hero-elements-missing' });
    } else {
      if (communityRect.bottom > innerHeight + 1) {
        viewportIssues.push({
          type: 'hero-exceeds-viewport',
          communityBottom: round(communityRect.bottom),
          viewportHeight: innerHeight,
        });
      }
      if (Math.abs(proofRect.top - mainRect.bottom) > 1) {
        viewportIssues.push({
          type: 'hero-proof-gap',
          mainBottom: round(mainRect.bottom),
          proofTop: round(proofRect.top),
        });
      }
      if (Math.abs(imageRect.width - innerWidth) > 2) {
        viewportIssues.push({
          type: 'hero-image-overzoomed',
          imageWidth: round(imageRect.width),
          viewportWidth: innerWidth,
        });
      }
      const expectedImageTop = mainRect.top - (imageRect.height * 0.025);
      if (Math.abs(imageRect.left) > 2 || Math.abs(imageRect.top - expectedImageTop) > 2) {
        viewportIssues.push({
          type: 'hero-image-offset',
          imageLeft: round(imageRect.left),
          imageTop: round(imageRect.top),
          expectedImageTop: round(expectedImageTop),
          mainTop: round(mainRect.top),
        });
      }
      if (imageRect.bottom < mainRect.bottom - 1) {
        viewportIssues.push({
          type: 'hero-image-does-not-cover-stage',
          imageBottom: round(imageRect.bottom),
          mainBottom: round(mainRect.bottom),
        });
      }
    }

    return {
      viewportHeight: innerHeight,
      header: headerRect && { top: round(headerRect.top), bottom: round(headerRect.bottom), height: round(headerRect.height) },
      main: mainRect && { top: round(mainRect.top), bottom: round(mainRect.bottom), height: round(mainRect.height) },
      proof: proofRect && { top: round(proofRect.top), bottom: round(proofRect.bottom), height: round(proofRect.height) },
      community: communityRect && { top: round(communityRect.top), bottom: round(communityRect.bottom), height: round(communityRect.height) },
      image: imageRect && {
        left: round(imageRect.left),
        top: round(imageRect.top),
        width: round(imageRect.width),
        height: round(imageRect.height),
        naturalWidth: image.naturalWidth,
        naturalHeight: image.naturalHeight,
      },
      viewportIssues,
    };
  })()`);

  const shot = await captureViewport(`${name} hero`);
  const screenshot = path.join(screenshotsDir, `${name}.png`);
  await writeFile(screenshot, Buffer.from(shot.data, "base64"));

  return { name, width, height, screenshot, ...metrics };
};

const verifyCourseRoute = async () => {
  console.log("Checking course-route...");
  await send("Emulation.setDeviceMetricsOverride", {
    width: 1280,
    height: 1000,
    deviceScaleFactor: 1,
    mobile: false,
  });

  const loaded = waitForLoad();
  const courseUrl = new URL("/cursos/computacion-oficina/", appUrl).toString();
  const nav = await send("Page.navigate", { url: courseUrl }, 30000);
  if (nav.errorText && nav.errorText !== "net::ERR_ABORTED") {
    throw new Error(`Course route navigation failed: ${nav.errorText}`);
  }
  await loaded;
  await waitForAppReady();
  await sleep(400);

  return evaluate(`(async () => {
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
    const courseSchema = document.querySelector('script[data-schema="course"]')?.textContent || '{}';
    let parsedCourse = {};
    try {
      parsedCourse = JSON.parse(courseSchema);
    } catch {}

    return {
      name: 'course-route-computacion-oficina',
      location: location.href,
      title: document.title,
      canonical: document.querySelector('link[rel="canonical"]')?.href || '',
      openCourseDetail: document.querySelector('[data-course-detail][open]')?.dataset.courseDetail || '',
      officeDetailHasExcel: document.querySelector('[data-course-detail="computacion-oficina"]')?.innerText.includes('Excel') || false,
      courseSchemaName: parsedCourse.name || '',
      missingImages: images.filter((img) => !img.complete || img.naturalWidth === 0).map((img) => img.currentSrc || img.src),
    };
  })()`);
};

const waitForSelector = async (selector, timeoutMs = 10000) => {
  const deadline = Date.now() + timeoutMs;
  let found = false;

  while (Date.now() < deadline) {
    found = await evaluate(`Boolean(document.querySelector(${JSON.stringify(selector)}))`);
    if (found) return true;
    await sleep(250);
  }

  throw new Error(`Timed out waiting for selector ${selector}`);
};

const verifyPlacementRoute = async () => {
  console.log("Checking placement-route...");
  await send("Emulation.setDeviceMetricsOverride", {
    width: 390,
    height: 1200,
    deviceScaleFactor: 2,
    mobile: true,
  });

  const loaded = waitForLoad();
  const placementUrl = new URL("/placement-test/", appUrl).toString();
  const nav = await send("Page.navigate", { url: placementUrl }, 30000);
  if (nav.errorText && nav.errorText !== "net::ERR_ABORTED") {
    throw new Error(`Placement route navigation failed: ${nav.errorText}`);
  }
  await loaded;
  await waitForSelector("[data-placement-form]");
  await sleep(400);

  const initial = await evaluate(`(() => ({
    name: 'placement-route-mobile',
    location: location.href,
    title: document.title,
    h1: document.querySelector('h1')?.innerText || '',
    levelGroups: document.querySelectorAll('.quiz-level').length,
    quizCards: document.querySelectorAll('.quiz-card').length,
    hasWritingPrompt: Boolean(document.querySelector('[name="writingSample"]')),
    externalGoogleRefs: document.body.innerHTML.includes('docs.google.com') || document.body.innerText.includes('Google Form'),
  }))()`);

  await evaluate(`(() => {
    const form = document.querySelector('[data-placement-form]');
    form.querySelector('[name="name"]').value = 'Maria Lopez';
    form.querySelector('[name="phone"]').value = '+17325550123';
    form.querySelector('[name="email"]').value = 'maria@example.com';
    form.querySelector('[name="city"]').value = 'Bound Brook';
    form.querySelector('[name="ageGroup"]').value = 'Adulto';
    ['speaking', 'listening', 'reading', 'writing'].forEach((name) => {
      form.querySelector(\`input[name="\${name}"][value="2"]\`).checked = true;
    });
    form.querySelector('[data-placement-next]').click();
    form.querySelector('[data-placement-next]').click();
    [...form.querySelectorAll('.quiz-card')].forEach((card) => {
      const correct = [...card.querySelectorAll('input')].find((input) => input.value === '1');
      (correct || card.querySelector('input')).checked = true;
    });
    form.querySelector('[data-placement-next]').click();
    form.querySelector('[name="writingSample"]').value = 'Bill is stronger than Jack. Jack is thinner than Bill. Both men are different.';
    form.querySelector('input[name="goal"]').checked = true;
    form.querySelector('[data-placement-next]').click();
  })()`);

  await waitForSelector("[data-placement-result] h3");
  await sleep(500);

  await stabilizeViewport();
  await evaluate(`(() => {
    const result = document.querySelector('[data-placement-result]');
    const y = result.getBoundingClientRect().top + window.scrollY - 160;
    window.scrollTo({ top: y, behavior: 'instant' });
  })()`);
  await sleep(250);
  const shot = await captureViewport("placement route mobile");
  const screenshot = path.join(screenshotsDir, "placement-route-mobile.png");
  await writeFile(screenshot, Buffer.from(shot.data, "base64"));

  const result = await evaluate(`(() => {
    const overflowing = [...document.querySelectorAll('body *')]
      .filter((el) => el.scrollWidth > el.clientWidth + 2 && getComputedStyle(el).overflowX === 'visible')
      .slice(0, 12)
      .map((el) => ({
        tag: el.tagName.toLowerCase(),
        id: el.id || null,
        className: typeof el.className === 'string' ? el.className : null,
        text: (el.innerText || el.alt || '').trim().slice(0, 90),
        scrollWidth: el.scrollWidth,
        clientWidth: el.clientWidth,
      }));
    return {
      resultHeading: document.querySelector('[data-placement-result] h3')?.innerText || '',
      resultText: document.querySelector('[data-placement-result]')?.innerText || '',
      whatsappHref: document.querySelector('[data-placement-whatsapp]')?.href || '',
      actionsVisible: !document.querySelector('[data-placement-actions]')?.hidden,
      overflowing,
    };
  })()`);

  return { ...initial, screenshot, ...result };
};

const results = [];
const heroOnly = process.env.VERIFY_HERO_ONLY === "1";
const skipHero = process.env.VERIFY_SKIP_HERO === "1";
const auditOnly = process.env.VERIFY_AUDIT_ONLY === "1";
const mobileOnly = process.env.VERIFY_MOBILE_ONLY === "1";
try {
  if (!auditOnly && !skipHero && !mobileOnly) {
    results.push(await verifyHeroViewport({ name: "hero-reference-1904x950", width: 1904, height: 950 }));
    results.push(await verifyHeroViewport({ name: "hero-short-1867x847", width: 1867, height: 847 }));
  }
  if (mobileOnly) {
    results.push(await verifyViewport({ name: "mobile-home-360", width: 360, height: 800, mobile: true }));
    results.push(await verifyViewport({ name: "mobile-home-390", width: 390, height: 844, mobile: true }));
    results.push(await verifyViewport({ name: "mobile-home-430", width: 430, height: 932, mobile: true }));
  } else if (auditOnly) {
    results.push(await verifyViewport({ name: "audit-desktop-1920x1080", width: 1920, height: 1080, mobile: false }));
    results.push(await verifyViewport({ name: "audit-desktop-1440x900", width: 1440, height: 900, mobile: false }));
    results.push(await verifyViewport({ name: "audit-mobile-390x844", width: 390, height: 844, mobile: true }));
  } else if (!heroOnly) {
    results.push(await verifyViewport({ name: "desktop-home", width: 1440, height: 1400, mobile: false }));
    results.push(await verifyViewport({ name: "tablet-home", width: 820, height: 1180, mobile: true }));
    results.push(await verifyViewport({ name: "mobile-home-360", width: 360, height: 1200, mobile: true }));
    results.push(await verifyViewport({ name: "mobile-home-390", width: 390, height: 1200, mobile: true }));
    results.push(await verifyViewport({ name: "mobile-home-430", width: 430, height: 1200, mobile: true }));
    results.push(await verifyCourseRoute());
    results.push(await verifyPlacementRoute());
  }
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

const blockingResults = results.filter((result) =>
  (result.missingImages && result.missingImages.length) ||
  (result.overflowing && result.overflowing.length) ||
  (result.sectionRhythmIssues && result.sectionRhythmIssues.length) ||
  (result.viewportIssues && result.viewportIssues.length) ||
  (result.methodPosterIssues && result.methodPosterIssues.length) ||
  (result.videoMetadataIssues && result.videoMetadataIssues.length) ||
  (result.videoVisualIssues && result.videoVisualIssues.length) ||
  (result.methodFrameIssues && result.methodFrameIssues.length)
);

if (exceptions.length || consoleMessages.length || blockingResults.length) {
  process.exitCode = 1;
}
