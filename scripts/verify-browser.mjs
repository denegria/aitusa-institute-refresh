import { mkdir, writeFile, rm } from "node:fs/promises";
import { existsSync } from "node:fs";
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

const appUrl = process.env.VERIFY_BASE_URL || "http://127.0.0.1:4173/";

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
        return {
          readyState: document.readyState,
          location: location.href,
          title: document.title,
          bodyLength: document.body?.innerHTML?.length || 0,
          scripts: [...document.scripts].map((script) => script.src || script.type || "inline").slice(-4),
          h1: document.querySelector('h1')?.innerText || null,
          programs: document.querySelectorAll('.program-card').length,
          offerNodes: document.querySelectorAll('.offer-node').length,
          faqs: document.querySelectorAll('.faq-list details').length,
          unresolvedIconPlaceholders: document.querySelectorAll('i[data-lucide]').length,
        };
      })()`);

      if (
        lastState.h1
        && (lastState.programs > 0 || lastState.offerNodes > 0)
        && lastState.faqs > 0
        && lastState.unresolvedIconPlaceholders === 0
      ) {
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
      [...document.querySelectorAll('.method-editorial__video')].map(async (video) => {
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
    const methodVideos = [...document.querySelectorAll('.method-editorial__video')];
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
    const methodFrameIssues = [...document.querySelectorAll('.method-video-frame')]
      .flatMap((media) => {
        const video = media.querySelector('.method-editorial__video');
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
    const sectionHeightLimit = innerWidth <= 719 ? innerHeight : availableSectionHeight;
    const intentionallyScrollableMobileSections = new Set(['cursos']);
    const sectionRhythmIssues = sectionRhythm
      .filter((section) => (
        section.height > sectionHeightLimit + 2
        && !(innerWidth <= 719 && intentionallyScrollableMobileSections.has(section.id))
      ))
      .map((section) => ({
        type: 'section-exceeds-viewport',
        ...section,
        viewportHeight: innerHeight,
        stickyHeaderHeight,
        availableSectionHeight,
      }));
    const mobileHeroIssues = [];
    const methodFullscreenIssues = [];
    const methodIconIssues = [];
    if (innerWidth <= 719) {
      const hero = document.querySelector('.hero');
      const heroVisual = document.querySelector('.hero__visual');
      const modalities = document.querySelector('.hero__modalities');
      const actions = [...document.querySelectorAll('.hero__actions .button')];
      const headlineLead = document.querySelector('.hero__headline-lead');
      const headlineEmphasis = document.querySelector('.hero__headline-emphasis');
      const headlineText = document.querySelector('.hero h1')?.innerText || '';
      const accentText = document.querySelector('.hero__headline-accent')?.innerText || '';
      const summaryText = document.querySelector('.hero__summary')?.innerText || '';
      const normalizedPromise = [headlineText, accentText, summaryText].join(' ').toLocaleLowerCase('es');
      const heroHeight = Math.round(hero?.getBoundingClientRect().height || 0);
      const visualHeight = Math.round(heroVisual?.getBoundingClientRect().height || 0);
      if (getComputedStyle(modalities).display !== 'none') {
        mobileHeroIssues.push({ type: 'mobile-hero-modalities-visible' });
      }
      if (actions.length !== 2 || actions.some((action) => action.getBoundingClientRect().height < 44)) {
        mobileHeroIssues.push({
          type: 'mobile-hero-actions-invalid',
          count: actions.length,
          heights: actions.map((action) => Math.round(action.getBoundingClientRect().height)),
        });
      }
      if (headlineLead && headlineEmphasis) {
        const leadRect = headlineLead.getBoundingClientRect();
        const emphasisRect = headlineEmphasis.getBoundingClientRect();
        const headlineLineGap = Math.round((emphasisRect.top - leadRect.bottom) * 100) / 100;
        if (headlineLineGap < 4) {
          mobileHeroIssues.push({
            type: 'mobile-hero-headline-lines-too-tight',
            headlineLineGap,
          });
        }
      }
      if (visualHeight < 340) {
        mobileHeroIssues.push({ type: 'mobile-hero-image-too-small', visualHeight });
      }
      if (heroHeight > availableSectionHeight + 2) {
        mobileHeroIssues.push({
          type: 'mobile-hero-exceeds-viewport',
          heroHeight,
          availableSectionHeight,
        });
      }
      if (
        !normalizedPromise.includes('comprende el inglés')
        || !normalizedPromise.includes('exprésate con confianza')
        || !normalizedPromise.includes('graphic concept')
        || !normalizedPromise.includes('trabajo, los estudios y la vida diaria')
      ) {
        mobileHeroIssues.push({
          type: 'mobile-hero-core-promise-missing',
          headlineText,
          accentText,
          summaryText,
        });
      }

      const methodIcons = [...document.querySelectorAll('#metodo .method-reason__icon')];
      if (methodIcons.length !== 3) {
        methodIconIssues.push({
          type: 'mobile-method-icon-count-invalid',
          count: methodIcons.length,
        });
      }
      methodIcons.forEach((icon, index) => {
        const rect = icon.getBoundingClientRect();
        if (
          !icon.querySelector('svg')
          || icon.getAttribute('aria-hidden') !== 'true'
          || rect.width < 34
          || rect.height < 34
        ) {
          methodIconIssues.push({
            type: 'mobile-method-icon-invalid',
            index,
            hasSvg: Boolean(icon.querySelector('svg')),
            ariaHidden: icon.getAttribute('aria-hidden'),
            width: Math.round(rect.width),
            height: Math.round(rect.height),
          });
        }
      });

      const methodVideo = document.querySelector('[data-method-video]');
      if (!methodVideo) {
        methodFullscreenIssues.push({ type: 'mobile-method-video-missing' });
      } else {
        let fullscreenRequested = false;
        const originalRequestFullscreen = methodVideo.requestFullscreen;
        const originalWebkitEnterFullscreen = methodVideo.webkitEnterFullscreen;
        methodVideo.requestFullscreen = () => {
          fullscreenRequested = true;
          return Promise.resolve();
        };
        if (originalWebkitEnterFullscreen) {
          methodVideo.webkitEnterFullscreen = () => {
            fullscreenRequested = true;
          };
        }
        methodVideo.dispatchEvent(new Event('play'));
        await Promise.resolve();
        if (originalRequestFullscreen) {
          methodVideo.requestFullscreen = originalRequestFullscreen;
        } else {
          delete methodVideo.requestFullscreen;
        }
        if (originalWebkitEnterFullscreen) {
          methodVideo.webkitEnterFullscreen = originalWebkitEnterFullscreen;
        }
        if (!fullscreenRequested) {
          methodFullscreenIssues.push({ type: 'mobile-method-fullscreen-not-requested' });
        }
      }
    }
    const footerHeight = Math.round(document.querySelector('.site-footer')?.getBoundingClientRect().height || 0);
    const footerHeightLimit = innerWidth <= 719 ? 240 : 200;
    const footerHeightIssues = footerHeight > footerHeightLimit
      ? [{
          type: 'footer-exceeds-compact-height',
          footerHeight,
          footerHeightLimit,
          viewportWidth: innerWidth,
        }]
      : [];
    const finalCta = document.querySelector('.final-cta-section');
    const footer = document.querySelector('.site-footer');
    const contactGrid = document.querySelector('.site-footer__contact');
    const navGrid = document.querySelector('.site-footer__nav');
    const closingSurfaceIssues = [];
    const finalCtaBackground = finalCta ? getComputedStyle(finalCta).backgroundColor : '';
    const footerBackground = footer ? getComputedStyle(footer).backgroundColor : '';
    const finalCtaHeight = Math.round(finalCta?.getBoundingClientRect().height || 0);
    if (!finalCta || !footer || finalCtaBackground !== footerBackground) {
      closingSurfaceIssues.push({
        type: 'closing-surface-color-mismatch',
        finalCtaBackground,
        footerBackground,
      });
    }
    if (innerWidth <= 719 && finalCtaHeight < 430) {
      closingSurfaceIssues.push({
        type: 'mobile-final-cta-too-compact',
        finalCtaHeight,
        minimumHeight: 430,
      });
    }
    const footerLabels = [...document.querySelectorAll('.site-footer__group-label')]
      .map((label) => label.textContent.trim());
    const footerNavLinks = [...document.querySelectorAll('.site-footer__nav a')];
    const finalCtaSecondaryActions = [...document.querySelectorAll('.final-cta-contact-row .final-cta-contact-link')];
    if (
      finalCtaSecondaryActions.length !== 1
      || finalCtaSecondaryActions[0]?.tagName !== 'BUTTON'
      || !finalCtaSecondaryActions[0]?.textContent.includes('Solicitar llamada')
    ) {
      closingSurfaceIssues.push({
        type: 'final-cta-secondary-action-duplicated',
        actions: finalCtaSecondaryActions.map((action) => ({
          tagName: action.tagName,
          text: action.textContent.trim(),
          href: action.href || '',
        })),
      });
    }
    if (!contactGrid || !navGrid || footerLabels.join('|') !== 'Contacto|Explora') {
      closingSurfaceIssues.push({
        type: 'footer-link-groups-missing',
        footerLabels,
      });
    }
    if (
      footerNavLinks.length !== 3
      || footerNavLinks.some((link) => !link.querySelector('svg'))
      || footerNavLinks.some((link) => link.href.includes('wa.me'))
    ) {
      closingSurfaceIssues.push({
        type: 'footer-page-navigation-unclear',
        linkCount: footerNavLinks.length,
        links: footerNavLinks.map((link) => ({
          text: link.textContent.trim(),
          href: link.href,
          hasIcon: Boolean(link.querySelector('svg')),
        })),
      });
    }
    const parseColor = (value) => {
      const channels = value.match(/[\\d.]+/g)?.map(Number) || [];
      return {
        red: channels[0] || 0,
        green: channels[1] || 0,
        blue: channels[2] || 0,
        alpha: channels.length > 3 ? channels[3] : 1,
      };
    };
    const composite = (foreground, background) => ({
      red: (foreground.red * foreground.alpha) + (background.red * (1 - foreground.alpha)),
      green: (foreground.green * foreground.alpha) + (background.green * (1 - foreground.alpha)),
      blue: (foreground.blue * foreground.alpha) + (background.blue * (1 - foreground.alpha)),
      alpha: 1,
    });
    const luminance = (color) => {
      const channel = (value) => {
        const normalized = value / 255;
        return normalized <= 0.04045
          ? normalized / 12.92
          : ((normalized + 0.055) / 1.055) ** 2.4;
      };
      return (0.2126 * channel(color.red)) + (0.7152 * channel(color.green)) + (0.0722 * channel(color.blue));
    };
    const contrastRatio = (foregroundValue, backgroundValue) => {
      const background = parseColor(backgroundValue);
      const foreground = composite(parseColor(foregroundValue), background);
      const foregroundLuminance = luminance(foreground);
      const backgroundLuminance = luminance(background);
      return (Math.max(foregroundLuminance, backgroundLuminance) + 0.05)
        / (Math.min(foregroundLuminance, backgroundLuminance) + 0.05);
    };
    const paletteIssues = [];
    const designConsistencyIssues = [];
    const headerSurface = document.querySelector('.site-header');
    const headerBackground = headerSurface ? parseColor(getComputedStyle(headerSurface).backgroundColor) : null;
    if (
      !headerBackground
      || headerBackground.alpha !== 1
      || headerBackground.red !== 255
      || headerBackground.green !== 255
      || headerBackground.blue !== 255
    ) {
      designConsistencyIssues.push({
        type: 'header-surface-not-opaque-white',
        background: headerSurface ? getComputedStyle(headerSurface).backgroundColor : '',
      });
    }

    const locationRows = [...document.querySelectorAll('#sedes .compact-location-row')];
    const locationHours = document.querySelector('#sedes .location-hours-panel');
    const locationPins = [...document.querySelectorAll('#sedes .real-map-pin')];
    const locationFocusButtons = [...document.querySelectorAll('#sedes .compact-location-row__focus')];
    const locationOverview = document.querySelector('#sedes .real-map-card__overview');
    const externalMapLauncher = document.querySelector('#sedes .real-map-card__expand');
    const locationHourGroups = [...document.querySelectorAll('#sedes .location-hours-panel__group')];
    const locationHourEntries = [...document.querySelectorAll('#sedes [data-schedule-slot]')];
    const locationHoursTitle = document.querySelector('#location-hours-title')?.textContent.trim() || '';
    const locationHourTimes = locationHourEntries
      .map((entry) => entry.querySelector('dd')?.textContent.trim() || '');
    const expectedLocationHourTimes = [
      '8:30 am–10 pm',
      '9:30 am–8 pm',
      '9:30 am–6 pm',
      '10 am–1 pm',
    ];
    const locationHoursDisclosure = document.querySelector('#sedes .location-hours-panel :is(details, summary)');
    if (
      locationRows.length !== 4
      || locationPins.length !== 4
      || locationFocusButtons.length !== 4
      || !locationOverview
      || externalMapLauncher
      || !locationHours
      || locationHours.tagName !== 'SECTION'
      || locationHourGroups.length !== 2
      || locationHourEntries.length !== 4
      || locationHoursTitle !== 'Bound Brook · Sede principal'
      || locationHourTimes.some((time, index) => time !== expectedLocationHourTimes[index])
      || locationHourEntries.some((entry) => entry.getBoundingClientRect().height <= 0)
      || locationHoursDisclosure
    ) {
      designConsistencyIssues.push({
        type: 'physical-location-lookup-invalid',
        rowCount: locationRows.length,
        pinCount: locationPins.length,
        focusButtonCount: locationFocusButtons.length,
        hasOverviewControl: Boolean(locationOverview),
        hasExternalMapLauncher: Boolean(externalMapLauncher),
        hasHoursPanel: Boolean(locationHours),
        hoursPanelTag: locationHours?.tagName || '',
        hourGroupCount: locationHourGroups.length,
        hourEntryCount: locationHourEntries.length,
        hoursTitle: locationHoursTitle,
        hourTimes: locationHourTimes,
        hasHoursDisclosure: Boolean(locationHoursDisclosure),
      });
    }

    if (innerWidth <= 719) {
      [
        ['hero', '#inicio', 'rgb(255, 255, 255)'],
        ['method', '#metodo', 'rgb(247, 242, 232)'],
        ['testimonials', '#experiencia', 'rgb(0, 26, 61)'],
        ['study-options', '#cursos', 'rgb(255, 255, 255)'],
        ['locations', '#sedes', 'rgb(247, 242, 232)'],
        ['faq', '.faq-section', 'rgb(245, 247, 250)'],
        ['final-cta', '#contacto', 'rgb(0, 26, 61)'],
      ].forEach(([label, selector, expected]) => {
        const element = document.querySelector(selector);
        const actual = element ? getComputedStyle(element).backgroundColor : '';
        if (!element || actual !== expected) {
          paletteIssues.push({
            type: 'mobile-section-surface-mismatch',
            label,
            expected,
            actual,
          });
        }
      });

      [
        ['method', '#metodo .method-editorial__intro h2'],
        ['testimonials', '#experiencia .proof-shelf__heading h2'],
        ['study-options', '#cursos .section-heading h2'],
        ['locations', '#sedes .section-heading h2'],
        ['faq', '.faq-section .section-heading h2'],
      ].forEach(([label, selector]) => {
        const element = document.querySelector(selector);
        const fontWeight = element ? getComputedStyle(element).fontWeight : '';
        if (!element || fontWeight !== '700') {
          paletteIssues.push({
            type: 'mobile-section-heading-weight-mismatch',
            label,
            fontWeight,
          });
        }
      });

      [
        ['hero-body', '#inicio .hero__summary', '#inicio'],
        ['method-body', '#metodo .method-editorial__intro > p:last-child', '#metodo'],
        ['testimonials-body', '#experiencia .proof-shelf__heading > div:first-child > p:last-child', '#experiencia'],
        ['study-options-body', '#cursos .section-heading > p:not(.section-kicker)', '#cursos'],
        ['locations-body', '#sedes .section-heading > p:not(.section-kicker)', '#sedes'],
        ['faq-body', '.faq-section .section-heading > p:not(.section-kicker)', '.faq-section'],
        ['method-icon', '#metodo .method-reason__icon', '#metodo'],
        ['header-phone-icon', '.header-cta svg', '.site-header'],
      ].forEach(([label, selector, backgroundSelector]) => {
        const element = document.querySelector(selector);
        const backgroundElement = document.querySelector(backgroundSelector);
        if (!element || !backgroundElement) {
          paletteIssues.push({ type: 'mobile-palette-element-missing', label });
          return;
        }
        const color = getComputedStyle(element).color;
        const background = label === 'header-phone-icon'
          ? 'rgb(255, 255, 255)'
          : getComputedStyle(backgroundElement).backgroundColor;
        const ratio = Math.round(contrastRatio(color, background) * 100) / 100;
        if (ratio < 4.5) {
          paletteIssues.push({
            type: 'mobile-palette-low-contrast',
            label,
            ratio,
            color,
            background,
          });
        }
      });

      const methodReason = document.querySelector('#metodo .method-reasons p');
      const methodReasonSize = parseFloat(methodReason ? getComputedStyle(methodReason).fontSize : '0');
      if (!methodReason || methodReasonSize < 12) {
        paletteIssues.push({
          type: 'mobile-method-copy-too-small',
          fontSize: methodReasonSize,
        });
      }

      const attribution = document.querySelector('.real-map-card__attribution');
      const attributionHeight = Math.round(attribution?.getBoundingClientRect().height || 0);
      const attributionFontSize = parseFloat(attribution ? getComputedStyle(attribution).fontSize : '0');
      if (!attribution || attributionHeight > 32 || attributionFontSize > 9) {
        paletteIssues.push({
          type: 'mobile-map-attribution-not-compact',
          height: attributionHeight,
          fontSize: attributionFontSize,
        });
      }

      [
        ['study-options', '#cursos .offer-map'],
        ['supporting-programs', '#cursos .catalog-programs__links'],
      ].forEach(([label, selector]) => {
        const element = document.querySelector(selector);
        if (!element || element.scrollWidth > element.clientWidth + 2) {
          designConsistencyIssues.push({
            type: 'mobile-hidden-horizontal-content',
            label,
            clientWidth: element?.clientWidth || 0,
            scrollWidth: element?.scrollWidth || 0,
          });
        }
      });

      const methodHeading = document.querySelector('#metodo .method-editorial__intro h2');
      const methodHeadingSize = parseFloat(methodHeading ? getComputedStyle(methodHeading).fontSize : '0');
      if (!methodHeading || methodHeadingSize < 30) {
        designConsistencyIssues.push({
          type: 'mobile-method-heading-too-small',
          fontSize: methodHeadingSize,
        });
      }

      [
        ['method', '#metodo .method-editorial__intro', true],
        ['testimonials', '#experiencia .chapter-accent', false],
        ['study-options', '#cursos .section-heading', true],
        ['locations', '#sedes .section-heading', true],
        ['faq', '#faq .chapter-accent--mobile', false],
        ['final-cta', '#contacto .section-heading', true],
      ].forEach(([label, selector, pseudo]) => {
        const element = document.querySelector(selector);
        const marker = element ? getComputedStyle(element, pseudo ? '::before' : null) : null;
        const markerRect = !pseudo && element ? element.getBoundingClientRect() : null;
        const markerWidth = parseFloat(marker?.width || '0');
        const markerHeight = parseFloat(marker?.height || '0');
        if (
          !element
          || marker?.display === 'none'
          || marker?.visibility === 'hidden'
          || parseFloat(marker?.opacity || '1') === 0
          || markerWidth < 50
          || markerHeight < 4
          || (!pseudo && (!markerRect || markerRect.width < 50 || markerRect.height < 4))
          || marker?.backgroundImage === 'none'
        ) {
          designConsistencyIssues.push({
            type: 'mobile-chapter-marker-inconsistent',
            label,
            markerWidth,
            markerHeight,
            backgroundImage: marker?.backgroundImage || '',
          });
        }
      });

      const methodIntro = document.querySelector('#metodo .method-editorial__intro');
      const methodBorderWidth = parseFloat(methodIntro ? getComputedStyle(methodIntro).borderLeftWidth : '0');
      if (!methodIntro || methodBorderWidth !== 0) {
        designConsistencyIssues.push({
          type: 'mobile-method-vertical-rule-present',
          borderLeftWidth: methodBorderWidth,
        });
      }

      const supportingProgramHeights = [...document.querySelectorAll('#cursos .catalog-programs__link')]
        .map((link) => Math.round(link.getBoundingClientRect().height));
      if (
        supportingProgramHeights.length !== 5
        || supportingProgramHeights.some((height) => height < 44)
      ) {
        designConsistencyIssues.push({
          type: 'mobile-supporting-program-target-too-small',
          heights: supportingProgramHeights,
        });
      }

      const visibleHourGroups = [...(locationHours?.querySelectorAll('.location-hours-panel__group') || [])]
        .filter((entry) => entry.getBoundingClientRect().height > 0);
      const visibleHourEntries = [...(locationHours?.querySelectorAll('[data-schedule-slot]') || [])]
        .filter((entry) => entry.getBoundingClientRect().height > 0);
      const hoursCopySizes = visibleHourEntries
        .map((entry) => parseFloat(getComputedStyle(entry.querySelector('dd')).fontSize));
      if (
        visibleHourGroups.length !== 2
        || visibleHourEntries.length !== 4
        || hoursCopySizes.some((fontSize) => fontSize < 14)
        || locationHours?.querySelector('details, summary, button')
      ) {
        designConsistencyIssues.push({
          type: 'mobile-location-hours-panel-invalid',
          visibleGroupCount: visibleHourGroups.length,
          visibleEntryCount: visibleHourEntries.length,
          copyFontSizes: hoursCopySizes,
          hasDisclosureControl: Boolean(locationHours?.querySelector('details, summary, button')),
        });
      }

      const locationRail = document.querySelector('#sedes .location-compact-list');
      const locationCards = [...document.querySelectorAll('#sedes [data-location-card]')];
      const locationRailButtons = [...document.querySelectorAll('#sedes .location-rail-toolbar button')];
      const firstLocationCardWidth = Math.round(locationCards[0]?.getBoundingClientRect().width || 0);
      const locationRailWidth = Math.round(locationRail?.getBoundingClientRect().width || 0);
      if (
        !locationRail
        || locationRail.scrollWidth <= locationRail.clientWidth + 2
        || locationCards.length !== 4
        || firstLocationCardWidth >= locationRailWidth - 16
        || locationRailButtons.length !== 2
        || locationRailButtons.some((button) => button.getBoundingClientRect().height < 44)
      ) {
        designConsistencyIssues.push({
          type: 'mobile-location-rail-invalid',
          cardCount: locationCards.length,
          clientWidth: locationRail?.clientWidth || 0,
          scrollWidth: locationRail?.scrollWidth || 0,
          firstCardWidth: firstLocationCardWidth,
          railWidth: locationRailWidth,
          controlHeights: locationRailButtons.map((button) => Math.round(button.getBoundingClientRect().height)),
        });
      }
    }

    if (innerWidth >= 1041) {
      const standardGrid = document.querySelector('#cursos .section-inner')?.getBoundingClientRect();
      [
        ['method', document.querySelector('#metodo .method-editorial')?.getBoundingClientRect()],
        ['final-cta', document.querySelector('#contacto .final-cta-layout')?.getBoundingClientRect()],
        ['footer', document.querySelector('.site-footer__compact')?.getBoundingClientRect()],
      ].forEach(([label, grid]) => {
        const leftDelta = standardGrid && grid ? Math.abs(grid.left - standardGrid.left) : Infinity;
        const widthDelta = standardGrid && grid ? Math.abs(grid.width - standardGrid.width) : Infinity;
        if (!standardGrid || !grid || leftDelta > 2 || widthDelta > 2) {
          designConsistencyIssues.push({
            type: 'desktop-chapter-grid-mismatch',
            label,
            leftDelta,
            widthDelta,
          });
        }
      });

      const heroHeading = document.querySelector('#inicio h1');
      const desktopMethodHeading = document.querySelector('#metodo .method-editorial__intro h2');
      const heroHeadingSize = parseFloat(heroHeading ? getComputedStyle(heroHeading).fontSize : '0');
      const desktopMethodHeadingSize = parseFloat(
        desktopMethodHeading ? getComputedStyle(desktopMethodHeading).fontSize : '0',
      );
      const headingRatio = heroHeadingSize ? desktopMethodHeadingSize / heroHeadingSize : Infinity;
      if (!heroHeading || !desktopMethodHeading || headingRatio > 1.22) {
        designConsistencyIssues.push({
          type: 'desktop-method-heading-overtakes-hero',
          heroHeadingSize,
          methodHeadingSize: desktopMethodHeadingSize,
          ratio: Math.round(headingRatio * 100) / 100,
        });
      }

      const experienceAccent = document.querySelector('#experiencia .chapter-accent');
      const experienceAccentRect = experienceAccent?.getBoundingClientRect();
      const experienceAccentStyle = experienceAccent ? getComputedStyle(experienceAccent) : null;
      if (
        !experienceAccent
        || !experienceAccentRect
        || experienceAccentRect.width < 4
        || experienceAccentRect.height < 40
        || experienceAccentStyle?.backgroundImage === 'none'
      ) {
        designConsistencyIssues.push({
          type: 'desktop-experience-accent-missing',
          width: Math.round(experienceAccentRect?.width || 0),
          height: Math.round(experienceAccentRect?.height || 0),
          backgroundImage: experienceAccentStyle?.backgroundImage || '',
        });
      }
    }
    [
      ['final-cta-copy', '.final-cta-copy .section-heading > p:last-child', finalCtaBackground],
      ['final-cta-primary', '.final-cta-actions .button--primary', null],
      ['final-cta-contact', '.final-cta-contact-link', finalCtaBackground],
      ['footer-utility', '.site-footer__contact a', footerBackground],
      ['footer-navigation', '.site-footer__nav a', footerBackground],
      ['footer-group-label', '.site-footer__group-label', footerBackground],
      ['footer-legal', '.site-footer__identity', footerBackground],
      ['footer-legal-link', '.site-footer__legal a', footerBackground],
    ].forEach(([label, selector, forcedBackground]) => {
      const element = document.querySelector(selector);
      if (!element) {
        closingSurfaceIssues.push({ type: 'closing-surface-element-missing', label });
        return;
      }
      const style = getComputedStyle(element);
      const background = forcedBackground || style.backgroundColor;
      const ratio = Math.round(contrastRatio(style.color, background) * 100) / 100;
      if (ratio < 4.5) {
        closingSurfaceIssues.push({
          type: 'closing-surface-low-contrast',
          label,
          ratio,
          color: style.color,
          background,
        });
      }
    });
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
      mobileHeroIssues,
      methodFullscreenIssues,
      methodIconIssues,
      footerHeight,
      footerHeightIssues,
      closingSurfaceIssues,
      paletteIssues,
      designConsistencyIssues,
      availableSectionHeight,
      pageHeight: document.documentElement.scrollHeight,
    };
  })()`);

  let target = null;
  let secondaryTarget = null;
  let proofDialogCheck = null;
  let callbackDialogCheck = null;
  let locationMapCheck = null;
  let locationHoursCheck = null;
  let navigationCheck = null;
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
    await captureSection(".method-reasons", "method-reasons");
    await captureSection("#experiencia", "videos");
    await captureSection(".proof-shelf__rail", "story-controls");

    await evaluate(`document.querySelector('[data-proof-story]')?.click()`);
    await sleep(250);
    proofDialogCheck = await evaluate(`(async () => {
      const dialog = document.querySelector('[data-proof-dialog]');
      const video = document.querySelector('[data-proof-dialog-video]');
      const title = document.querySelector('[data-proof-dialog-title]');
      const firstTitle = title?.innerText || '';
      document.querySelector('[data-proof-dialog-next]')?.click();
      await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
      const nextTitle = title?.innerText || '';
      const issues = [];
      if (!dialog?.open) issues.push('dialog-did-not-open');
      if (!video?.currentSrc) issues.push('dialog-video-source-missing');
      if (!video?.paused) issues.push('dialog-video-autoplayed');
      if (!firstTitle || !nextTitle || firstTitle === nextTitle) issues.push('dialog-next-story-failed');
      return {
        open: Boolean(dialog?.open),
        videoSrc: video?.currentSrc || '',
        videoPaused: Boolean(video?.paused),
        firstTitle,
        nextTitle,
        issues,
      };
    })()`);
    await sleep(180);
    if (width === 390 || width === 1440) {
      const dialogShot = await captureViewport(`${name} story dialog`);
      const dialogTarget = path.join(screenshotsDir, `${name}-story-dialog.png`);
      await writeFile(dialogTarget, Buffer.from(dialogShot.data, "base64"));
      sectionScreenshots["story-dialog"] = dialogTarget;
    }
    await evaluate(`document.querySelector('[data-proof-dialog]')?.close()`);
    await sleep(120);

    await captureSection("#cursos", "courses");
    await captureSection(".catalog-programs", "programs");
    await captureSection("#sedes", "locations");
    const locationBeforeFocus = await evaluate("location.href");
    await evaluate(`document.querySelector('#sedes .real-map-pin--plainfield')?.click()`);
    await sleep(520);
    locationMapCheck = await evaluate(`(() => {
      const frame = document.querySelector('#sedes .real-map-card__frame');
      const stage = document.querySelector('#sedes .real-map-card__stage');
      const selectedCard = document.querySelector('#sedes [data-location-card].is-selected');
      const selectedCardButton = selectedCard?.querySelector('.compact-location-row__focus');
      const selectedPin = document.querySelector('#sedes .real-map-pin[aria-pressed="true"]');
      const action = selectedCard?.querySelector('.compact-location-row__action');
      const overview = document.querySelector('#sedes .real-map-card__overview');
      const issues = [];
      if (frame?.dataset.mapFocused !== 'true') issues.push('map-did-not-enter-focused-state');
      if (!stage?.style.transform || stage.style.transform === 'none') issues.push('map-stage-did-not-transform');
      if (selectedCard?.dataset.locationIndex !== '1') issues.push('plainfield-card-not-selected');
      if (selectedCardButton?.getAttribute('aria-pressed') !== 'true') issues.push('selected-card-state-not-announced');
      if (!selectedPin?.classList.contains('real-map-pin--plainfield')) issues.push('plainfield-pin-not-selected');
      if (!action?.href.includes('google.com/maps/search') || action.target !== '_blank') {
        issues.push('selected-location-cta-invalid');
      }
      if (!overview || overview.disabled) issues.push('map-overview-control-unavailable');
      if (document.querySelector('#sedes .real-map-card__expand')) issues.push('external-map-launcher-still-present');
      return {
        location: location.href,
        focused: frame?.dataset.mapFocused || '',
        transform: stage?.style.transform || '',
        selectedCardIndex: selectedCard?.dataset.locationIndex || '',
        selectedPin: selectedPin?.className || '',
        actionHref: action?.href || '',
        actionTarget: action?.target || '',
        issues,
      };
    })()`);
    if (locationMapCheck.location !== locationBeforeFocus) {
      locationMapCheck.issues.push('location-focus-navigated-away');
    }
    if (width === 390 || width === 1440) {
      const focusedMapShot = await captureViewport(`${name} focused location map`);
      const focusedMapTarget = path.join(screenshotsDir, `${name}-location-map-focused.png`);
      await writeFile(focusedMapTarget, Buffer.from(focusedMapShot.data, "base64"));
      sectionScreenshots["location-map-focused"] = focusedMapTarget;
    }
    if (mobile) {
      await evaluate(`document.querySelector('#sedes .location-rail-toolbar button:last-child')?.click()`);
      await sleep(620);
      const railCheck = await evaluate(`(() => {
        const rail = document.querySelector('#sedes .location-compact-list');
        const selectedCard = document.querySelector('#sedes [data-location-card].is-selected');
        const counter = document.querySelector('#sedes .location-rail-toolbar > span')?.textContent.trim() || '';
        return {
          scrollLeft: Math.round(rail?.scrollLeft || 0),
          selectedCardIndex: selectedCard?.dataset.locationIndex || '',
          counter,
        };
      })()`);
      locationMapCheck.rail = railCheck;
      if (railCheck.scrollLeft <= 0 || railCheck.selectedCardIndex !== "2" || !railCheck.counter.includes("3")) {
        locationMapCheck.issues.push('mobile-location-rail-controls-failed');
      }
    }
    await evaluate(`document.querySelector('#sedes .real-map-card__overview')?.click()`);
    await sleep(260);
    const resetMapCheck = await evaluate(`(() => {
      const frame = document.querySelector('#sedes .real-map-card__frame');
      const stage = document.querySelector('#sedes .real-map-card__stage');
      return {
        focused: frame?.dataset.mapFocused || '',
        transform: stage?.style.transform || '',
        selectedCards: document.querySelectorAll('#sedes [data-location-card].is-selected').length,
        selectedPins: document.querySelectorAll('#sedes .real-map-pin[aria-pressed="true"]').length,
      };
    })()`);
    locationMapCheck.reset = resetMapCheck;
    if (
      resetMapCheck.focused !== "false"
      || resetMapCheck.transform
      || resetMapCheck.selectedCards
      || resetMapCheck.selectedPins
    ) {
      locationMapCheck.issues.push('map-overview-reset-failed');
    }
    locationHoursCheck = await evaluate(`(() => {
      const panel = document.querySelector('#sedes .location-hours-panel');
      const groups = [...(panel?.querySelectorAll('.location-hours-panel__group') || [])];
      const hours = [...(panel?.querySelectorAll('[data-schedule-slot]') || [])];
      const title = panel?.querySelector('#location-hours-title')?.textContent.trim() || '';
      const times = hours.map((hour) => hour.querySelector('dd')?.textContent.trim() || '');
      const expectedTimes = ['8:30 am–10 pm', '9:30 am–8 pm', '9:30 am–6 pm', '10 am–1 pm'];
      const visibleGroups = groups.filter((group) => group.getBoundingClientRect().height > 0);
      const visibleHours = hours.filter((hour) => hour.getBoundingClientRect().height > 0);
      const issues = [];
      if (panel?.tagName !== 'SECTION') issues.push('location-hours-not-static-section');
      if (title !== 'Bound Brook · Sede principal') issues.push('location-hours-scope-invalid');
      if (groups.length !== 2 || visibleGroups.length !== 2) issues.push('location-hours-groups-not-visible');
      if (hours.length !== 4 || visibleHours.length !== 4) issues.push('location-hours-not-permanently-visible');
      if (times.some((time, index) => time !== expectedTimes[index])) issues.push('location-hours-copy-invalid');
      if (panel?.querySelector('details, summary, button')) issues.push('location-hours-disclosure-control-present');
      return {
        panelTag: panel?.tagName || '',
        groupCount: groups.length,
        visibleGroupCount: visibleGroups.length,
        hourCount: hours.length,
        visibleHourCount: visibleHours.length,
        title,
        times,
        hasDisclosureControl: Boolean(panel?.querySelector('details, summary, button')),
        issues,
      };
    })()`);
    if (width === 390 || width === 1440) {
      const hoursShot = await captureViewport(`${name} visible location hours`);
      const hoursTarget = path.join(screenshotsDir, `${name}-location-hours-visible.png`);
      await writeFile(hoursTarget, Buffer.from(hoursShot.data, "base64"));
      sectionScreenshots["location-hours-visible"] = hoursTarget;
    }
    await captureSection(".faq-section", "faq");
    navigationCheck = await evaluate(`(() => {
      const activeLabel = document.querySelector('.site-nav [aria-current="location"]')?.innerText || '';
      return {
        faqActiveNavLabel: activeLabel,
        issues: activeLabel ? [\`faq-retains-active-nav:\${activeLabel}\`] : [],
      };
    })()`);
    await captureSection("footer.site-footer", "footer");

    await evaluate(`document.querySelector('[data-callback-dialog-open]')?.click()`);
    await sleep(120);
    callbackDialogCheck = await evaluate(`(() => {
      const dialog = document.querySelector('[data-callback-dialog]');
      const closeButton = document.querySelector('[data-callback-dialog-close]');
      const issues = [];
      if (!dialog?.open) issues.push('callback-dialog-did-not-open');
      if (document.activeElement !== closeButton) issues.push('callback-dialog-close-not-focused');
      return {
        open: Boolean(dialog?.open),
        closeFocused: document.activeElement === closeButton,
        issues,
      };
    })()`);
    const contactDialogShot = await captureViewport(`${name} contact dialog`);
    const contactDialogTarget = path.join(screenshotsDir, `${name}-contact-open.png`);
    await writeFile(contactDialogTarget, Buffer.from(contactDialogShot.data, "base64"));
    sectionScreenshots["contact-open"] = contactDialogTarget;

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
      document.querySelector('[data-callback-dialog]')?.close();
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
    contactDialogOpen: Boolean(document.querySelector('[data-callback-dialog]')?.open),
    contactSectionHeight: Math.round(document.querySelector('#contacto')?.getBoundingClientRect().height || 0),
    contactFieldNames: [...document.querySelectorAll('[data-lead-form] [name]')]
      .filter((field) => field.type !== 'hidden')
      .map((field) => field.name),
    menuButtonPresent: Boolean(document.querySelector('.menu-toggle')),
  }))()`);

  return {
    name,
    width,
    height,
    screenshot: target,
    secondaryScreenshot: secondaryTarget,
    sectionScreenshots,
    screenshotError,
    proofDialogCheck,
    callbackDialogCheck,
    locationMapCheck,
    locationHoursCheck,
    navigationCheck,
    ...summary,
    interactions,
  };
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
    const image = document.querySelector('.hero__visual img');
    const rect = (element) => element?.getBoundingClientRect() || null;
    const round = (value) => Math.round(value * 100) / 100;
    const headerRect = rect(header);
    const mainRect = rect(main);
    const imageRect = rect(image);
    const viewportIssues = [];

    if (!headerRect || !mainRect || !imageRect) {
      viewportIssues.push({ type: 'hero-elements-missing' });
    } else {
      if (mainRect.bottom > innerHeight + 1) {
        viewportIssues.push({
          type: 'hero-exceeds-viewport',
          heroBottom: round(mainRect.bottom),
          viewportHeight: innerHeight,
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

  await evaluate(`(async () => {
    const nextFrame = () => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
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
    await nextFrame();
    form.querySelector('[data-placement-next]').click();
    await nextFrame();
    [...form.querySelectorAll('.quiz-card')].forEach((card) => {
      const correct = [...card.querySelectorAll('input')].find((input) => input.value === '1');
      (correct || card.querySelector('input')).checked = true;
    });
    form.querySelector('[data-placement-next]').click();
    await nextFrame();
    form.querySelector('[name="writingSample"]').value = 'Bill is stronger than Jack. Jack is thinner than Bill. Both men are different.';
    form.querySelector('input[name="goal"]').checked = true;
    form.querySelector('[data-placement-next]').click();
    await nextFrame();
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

const verifyPublicShellRoute = async ({
  name,
  route,
  expectedHeading,
  width = 1280,
  height = 900,
  mobile = false,
  screenshot = false,
  expectContactForm = false,
  expectLegalToc = false,
}) => {
  console.log(`Checking ${name}...`);
  await send("Emulation.setDeviceMetricsOverride", {
    width,
    height,
    deviceScaleFactor: mobile ? 2 : 1,
    mobile,
  });

  const loaded = waitForLoad();
  const routeUrl = new URL(route, appUrl).toString();
  const nav = await send("Page.navigate", { url: routeUrl }, 30000);
  if (nav.errorText && nav.errorText !== "net::ERR_ABORTED") {
    throw new Error(`${name} navigation failed: ${nav.errorText}`);
  }
  await loaded;
  await waitForSelector("#main-content h1");
  await sleep(300);

  let screenshotPath = null;
  if (screenshot) {
    await stabilizeViewport();
    const shot = await captureViewport(name);
    screenshotPath = path.join(screenshotsDir, `${name}.png`);
    await writeFile(screenshotPath, Buffer.from(shot.data, "base64"));
  }

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
      location: location.href,
      title: document.title,
      heading: document.querySelector('#main-content h1')?.innerText || '',
      sharedHeader: document.querySelectorAll('.site-header').length,
      sharedFooter: document.querySelectorAll('.site-footer').length,
      hasSkipLink: Boolean(document.querySelector('.skip-link[href="#main-content"]')),
      hasContactForm: Boolean(document.querySelector('[data-lead-form]')),
      hasOptionalSmsConsent: Boolean(document.querySelector('[name="smsConsent"]:not([required])')),
      hasLegalToc: Boolean(document.querySelector('[aria-label^="Contenido de"]')),
      overflowing,
    };
  })()`);

  if (result.heading !== expectedHeading) {
    throw new Error(`${name} heading mismatch: ${JSON.stringify(result.heading)}`);
  }
  if (result.sharedHeader !== 1 || result.sharedFooter !== 1 || !result.hasSkipLink) {
    throw new Error(`${name} does not use the shared public shell: ${JSON.stringify(result)}`);
  }
  if (expectContactForm && (!result.hasContactForm || !result.hasOptionalSmsConsent)) {
    throw new Error(`${name} contact form contract is incomplete: ${JSON.stringify(result)}`);
  }
  if (expectLegalToc && !result.hasLegalToc) {
    throw new Error(`${name} legal table of contents is missing: ${JSON.stringify(result)}`);
  }
  if (result.overflowing.length) {
    throw new Error(`${name} has horizontal overflow: ${JSON.stringify(result.overflowing)}`);
  }

  return { name, screenshot: screenshotPath, ...result };
};

const verifyEditorialCourseRoute = async ({
  name,
  route,
  expectedHeading,
  expectedPathwayCount,
  expectedPrimaryHref,
  expectStory,
  width,
  height,
  mobile,
}) => {
  console.log(`Checking ${name}...`);
  await send("Emulation.setDeviceMetricsOverride", {
    width,
    height,
    deviceScaleFactor: mobile ? 2 : 1,
    mobile,
  });

  const loaded = waitForLoad();
  const routeUrl = new URL(route, appUrl).toString();
  const nav = await send("Page.navigate", { url: routeUrl }, 30000);
  if (nav.errorText && nav.errorText !== "net::ERR_ABORTED") {
    throw new Error(`${name} navigation failed: ${nav.errorText}`);
  }
  await loaded;
  await waitForSelector('[data-course-template="course-editorial-v1"]');
  await sleep(400);

  await evaluate(`(async () => {
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
    const firstFaq = document.querySelector('.course-faq-list details');
    firstFaq?.querySelector('summary')?.click();
    await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
  })()`);

  await stabilizeViewport();
  const shot = await captureViewport(name);
  const screenshot = path.join(screenshotsDir, `${name}.png`);
  await writeFile(screenshot, Buffer.from(shot.data, "base64"));

  const result = await evaluate(`(() => {
    const images = [...document.images];
    const primary = document.querySelector('.course-program-hero__actions .button--primary');
    const heroImage = document.querySelector('.course-program-hero__media');
    const heroActions = document.querySelector('.course-program-hero__actions');
    const ledger = document.querySelector('.course-program-ledger');
    const courseSchema = document.querySelector('script[data-schema="course"]')?.textContent || '{}';
    let parsedCourse = {};
    try {
      parsedCourse = JSON.parse(courseSchema);
    } catch {}
    const localOverflowing = [...document.querySelectorAll('body *')]
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
    const smallTargets = [...document.querySelectorAll('a, button, summary')]
      .filter((el) => {
        const rect = el.getBoundingClientRect();
        return rect.width > 0 && rect.height > 0 && rect.height < 44;
      })
      .slice(0, 12)
      .map((el) => ({
        tag: el.tagName.toLowerCase(),
        text: (el.innerText || el.getAttribute('aria-label') || '').trim().slice(0, 80),
        width: Math.round(el.getBoundingClientRect().width),
        height: Math.round(el.getBoundingClientRect().height),
      }));
    const pageScrollWidth = document.documentElement.scrollWidth;
    const pageClientWidth = document.documentElement.clientWidth;
    return {
      location: location.href,
      title: document.title,
      heading: document.querySelector('#main-content h1')?.innerText || '',
      canonical: document.querySelector('link[rel="canonical"]')?.href || '',
      courseSchemaName: parsedCourse.name || '',
      template: document.querySelector('[data-course-template]')?.dataset.courseTemplate || '',
      pathwayCount: document.querySelectorAll('.course-pathway-list > li').length,
      outcomesCount: document.querySelectorAll('.course-outcome-list > li').length,
      formatsCount: document.querySelectorAll('.course-format-list > article').length,
      scheduleCount: document.querySelectorAll('.course-schedule-panel dl > div').length,
      storyCount: document.querySelectorAll('.course-program-story').length,
      faqCount: document.querySelectorAll('.course-faq-list details').length,
      firstFaqOpen: document.querySelector('.course-faq-list details')?.open || false,
      primaryHref: primary?.href || '',
      primaryTarget: primary?.target || '',
      heroLedgerBottom: Math.round(ledger?.getBoundingClientRect().bottom || 0),
      mobileCtaBeforeImage: !heroActions || !heroImage
        ? false
        : heroActions.getBoundingClientRect().bottom <= heroImage.getBoundingClientRect().top,
      pageScrollWidth,
      pageClientWidth,
      missingImages: images
        .filter((img) => !img.complete || img.naturalWidth === 0)
        .map((img) => img.currentSrc || img.src),
      overflowing: pageScrollWidth > pageClientWidth + 2 ? localOverflowing : [],
      localOverflowing,
      smallTargets,
    };
  })()`);

  const issues = [];
  if (result.heading !== expectedHeading) issues.push(`heading=${JSON.stringify(result.heading)}`);
  if (result.template !== "course-editorial-v1") issues.push(`template=${result.template}`);
  if (result.pathwayCount !== expectedPathwayCount) issues.push(`pathwayCount=${result.pathwayCount}`);
  if (result.outcomesCount !== 3) issues.push(`outcomesCount=${result.outcomesCount}`);
  if (result.formatsCount !== 3) issues.push(`formatsCount=${result.formatsCount}`);
  if (result.faqCount !== 6 || !result.firstFaqOpen) {
    issues.push(`faq=${result.faqCount}/${result.firstFaqOpen}`);
  }
  if (!result.primaryHref.includes(expectedPrimaryHref)) issues.push(`primaryHref=${result.primaryHref}`);
  if (result.storyCount !== (expectStory ? 1 : 0)) issues.push(`storyCount=${result.storyCount}`);
  if (!result.canonical.endsWith(route)) issues.push(`canonical=${result.canonical}`);
  if (result.courseSchemaName !== expectedHeading) issues.push(`schema=${result.courseSchemaName}`);
  if (result.pageScrollWidth > result.pageClientWidth + 2) {
    issues.push(`pageOverflow=${result.pageScrollWidth}/${result.pageClientWidth}`);
  }
  if (result.missingImages.length) issues.push(`missingImages=${result.missingImages.length}`);
  if (result.smallTargets.length) issues.push(`smallTargets=${result.smallTargets.length}`);
  if (mobile && !result.mobileCtaBeforeImage) issues.push("mobileCtaAfterImage");
  if (!mobile && height === 900 && result.heroLedgerBottom > height) {
    issues.push(`heroLedgerBottom=${result.heroLedgerBottom}`);
  }
  if (issues.length) {
    throw new Error(`${name} failed: ${issues.join(", ")} ${JSON.stringify(result)}`);
  }

  return { name, width, height, mobile, screenshot, ...result };
};

const results = [];
const heroOnly = process.env.VERIFY_HERO_ONLY === "1";
const skipHero = process.env.VERIFY_SKIP_HERO === "1";
const auditOnly = process.env.VERIFY_AUDIT_ONLY === "1";
const mobileOnly = process.env.VERIFY_MOBILE_ONLY === "1";
const desktopOnly = process.env.VERIFY_DESKTOP_ONLY === "1";
const routesOnly = process.env.VERIFY_ROUTES_ONLY === "1";
const editorialCoursesOnly = process.env.VERIFY_EDITORIAL_COURSES_ONLY === "1";
try {
  if (!auditOnly && !skipHero && !mobileOnly && !desktopOnly && !routesOnly && !editorialCoursesOnly) {
    results.push(await verifyHeroViewport({ name: "hero-reference-1904x950", width: 1904, height: 950 }));
    results.push(await verifyHeroViewport({ name: "hero-short-1867x847", width: 1867, height: 847 }));
  }
  if (editorialCoursesOnly) {
    const editorialRoutes = [
      {
        route: "/courses/ingles-jovenes-adultos/",
        expectedHeading: "Inglés para jóvenes y adultos",
        expectedPathwayCount: 3,
        expectedPrimaryHref: "/placement-test/",
        expectStory: true,
        slug: "flagship",
      },
      {
        route: "/courses/ingles-online-adultos/",
        expectedHeading: "Inglés online para jóvenes y adultos",
        expectedPathwayCount: 3,
        expectedPrimaryHref: "/placement-test/",
        expectStory: false,
        slug: "online",
      },
      {
        route: "/courses/ged/",
        expectedHeading: "GED",
        expectedPathwayCount: 4,
        expectedPrimaryHref: "wa.me/17323790593",
        expectStory: false,
        slug: "ged",
      },
    ];
    for (const course of editorialRoutes) {
      results.push(await verifyEditorialCourseRoute({
        ...course,
        name: `course-${course.slug}-desktop-1440x900`,
        width: 1440,
        height: 900,
        mobile: false,
      }));
      results.push(await verifyEditorialCourseRoute({
        ...course,
        name: `course-${course.slug}-mobile-390x844`,
        width: 390,
        height: 844,
        mobile: true,
      }));
    }
  } else if (routesOnly) {
    results.push(await verifyCourseRoute());
    results.push(await verifyPlacementRoute());
    results.push(await verifyPublicShellRoute({
      name: "contact-route-mobile",
      route: "/contactanos",
      expectedHeading: "Cuéntanos qué necesitas.",
      width: 390,
      height: 844,
      mobile: true,
      screenshot: true,
      expectContactForm: true,
    }));
    results.push(await verifyPublicShellRoute({
      name: "privacy-route",
      route: "/privacy-policy",
      expectedHeading: "Política de Privacidad",
      expectLegalToc: true,
    }));
    results.push(await verifyPublicShellRoute({
      name: "terms-route",
      route: "/terms-and-conditions",
      expectedHeading: "Términos y Condiciones",
      expectLegalToc: true,
    }));
  } else if (desktopOnly) {
    results.push(await verifyViewport({ name: "desktop-home-1920x1080", width: 1920, height: 1080, mobile: false }));
    results.push(await verifyViewport({ name: "desktop-home-1536x864", width: 1536, height: 864, mobile: false }));
    results.push(await verifyViewport({ name: "desktop-home-1440x900", width: 1440, height: 900, mobile: false }));
    results.push(await verifyViewport({ name: "desktop-home-1366x768", width: 1366, height: 768, mobile: false }));
  } else if (mobileOnly) {
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
  (result.mobileHeroIssues && result.mobileHeroIssues.length) ||
  (result.methodFullscreenIssues && result.methodFullscreenIssues.length) ||
  (result.methodIconIssues && result.methodIconIssues.length) ||
  (result.footerHeightIssues && result.footerHeightIssues.length) ||
  (result.closingSurfaceIssues && result.closingSurfaceIssues.length) ||
  (result.paletteIssues && result.paletteIssues.length) ||
  (result.designConsistencyIssues && result.designConsistencyIssues.length) ||
  (result.viewportIssues && result.viewportIssues.length) ||
  (result.methodPosterIssues && result.methodPosterIssues.length) ||
  (result.videoMetadataIssues && result.videoMetadataIssues.length) ||
  (result.videoVisualIssues && result.videoVisualIssues.length) ||
  (result.methodFrameIssues && result.methodFrameIssues.length) ||
  (result.proofDialogCheck?.issues && result.proofDialogCheck.issues.length) ||
  (result.callbackDialogCheck?.issues && result.callbackDialogCheck.issues.length) ||
  (result.locationMapCheck?.issues && result.locationMapCheck.issues.length) ||
  (result.locationHoursCheck?.issues && result.locationHoursCheck.issues.length) ||
  (result.navigationCheck?.issues && result.navigationCheck.issues.length)
);

if (exceptions.length || consoleMessages.length || blockingResults.length) {
  process.exitCode = 1;
}
