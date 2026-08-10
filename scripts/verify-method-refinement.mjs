import { createServer } from "node:http";
import { mkdtemp, mkdir, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { spawn } from "node:child_process";

const appUrl = process.env.VERIFY_BASE_URL || "http://127.0.0.1:3000/";
const screenshotsDir = path.resolve(
  process.env.VERIFY_SCREENSHOTS_DIR || path.join(tmpdir(), "aitusa-method-refinement"),
);
const chromePath = process.env.CHROME_PATH || "/usr/bin/google-chrome-stable";
const profileDir = await mkdtemp(path.join(tmpdir(), "aitusa-method-chrome-"));
await mkdir(screenshotsDir, { recursive: true });

const getOpenPort = async () => {
  const probe = createServer();
  await new Promise((resolve) => probe.listen(0, "127.0.0.1", resolve));
  const port = probe.address().port;
  await new Promise((resolve) => probe.close(resolve));
  return port;
};

const port = await getOpenPort();
const browser = spawn(chromePath, [
  "--headless",
  "--disable-gpu",
  "--no-sandbox",
  "--disable-extensions",
  "--hide-scrollbars",
  `--remote-debugging-port=${port}`,
  `--user-data-dir=${profileDir}`,
  "about:blank",
], { stdio: ["ignore", "ignore", "pipe"] });

let browserStderr = "";
browser.stderr.on("data", (chunk) => { browserStderr += chunk.toString(); });

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const fetchJson = async (url) => {
  const response = await fetch(url, { signal: AbortSignal.timeout(750) });
  if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
  return response.json();
};

let socket;
let nextId = 1;
const pending = new Map();
const consoleErrors = [];
const exceptions = [];

const send = (method, params = {}, timeoutMs = 15000) => new Promise((resolve, reject) => {
  const id = nextId;
  nextId += 1;
  const timer = setTimeout(() => {
    pending.delete(id);
    reject(new Error(`Timed out waiting for ${method}`));
  }, timeoutMs);
  pending.set(id, {
    resolve: (value) => { clearTimeout(timer); resolve(value); },
    reject: (error) => { clearTimeout(timer); reject(error); },
  });
  socket.send(JSON.stringify({ id, method, params }));
});

const evaluate = async (expression) => {
  const response = await send("Runtime.evaluate", {
    expression,
    returnByValue: true,
    awaitPromise: true,
  });
  if (response.exceptionDetails) {
    throw new Error(response.exceptionDetails.exception?.description || response.exceptionDetails.text);
  }
  return response.result.value;
};

const waitForApp = async () => {
  const deadline = Date.now() + 15000;
  while (Date.now() < deadline) {
    const ready = await evaluate(`({
      state: document.readyState,
      heading: document.querySelector('#method-title')?.textContent.trim() || '',
      overlay: Boolean(document.querySelector('[data-nextjs-dialog], .vite-error-overlay')),
    })`);
    if (ready.state === "complete" && ready.heading && !ready.overlay) return;
    await sleep(200);
  }
  throw new Error("Method section did not become ready within 15 seconds.");
};

const captureElement = async (selector, target) => {
  const clip = await evaluate(`(() => {
    const rect = document.querySelector(${JSON.stringify(selector)})?.getBoundingClientRect();
    if (!rect) return null;
    return {
      x: Math.max(0, rect.left + scrollX),
      y: Math.max(0, rect.top + scrollY),
      width: rect.width,
      height: rect.height,
      scale: 1,
    };
  })()`);
  if (!clip) throw new Error(`Missing screenshot target: ${selector}`);
  const shot = await send("Page.captureScreenshot", {
    format: "png",
    captureBeyondViewport: true,
    fromSurface: true,
    clip,
  }, 30000);
  await writeFile(target, Buffer.from(shot.data, "base64"));
};

const viewports = [
  { name: "desktop-primary", width: 1440, height: 900, mobile: false },
  { name: "desktop-regression", width: 1280, height: 720, mobile: false },
  { name: "tablet", width: 768, height: 1024, mobile: false },
  { name: "mobile", width: 390, height: 844, mobile: true },
];

const results = [];

try {
  let wsUrl;
  for (let attempt = 0; attempt < 80 && !wsUrl; attempt += 1) {
    try {
      const pages = await fetchJson(`http://127.0.0.1:${port}/json/list`);
      wsUrl = pages.find((page) => page.type === "page")?.webSocketDebuggerUrl;
    } catch {
      await sleep(100);
    }
  }
  if (!wsUrl) throw new Error(`Chrome did not expose DevTools. ${browserStderr}`);

  socket = new WebSocket(wsUrl);
  await new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error("Timed out opening DevTools")), 5000);
    socket.addEventListener("open", () => { clearTimeout(timer); resolve(); }, { once: true });
    socket.addEventListener("error", reject, { once: true });
  });
  socket.addEventListener("message", (event) => {
    const message = JSON.parse(event.data);
    if (message.id && pending.has(message.id)) {
      const waiter = pending.get(message.id);
      pending.delete(message.id);
      if (message.error) waiter.reject(new Error(message.error.message));
      else waiter.resolve(message.result);
      return;
    }
    if (message.method === "Runtime.exceptionThrown") {
      exceptions.push(message.params.exceptionDetails?.text || "Runtime exception");
    }
    if (message.method === "Runtime.consoleAPICalled" && message.params.type === "error") {
      consoleErrors.push(message.params.args?.map((arg) => arg.value || arg.description).join(" ") || "Console error");
    }
  });

  await send("Page.enable");
  await send("Runtime.enable");

  for (const viewport of viewports) {
    await send("Emulation.setDeviceMetricsOverride", {
      width: viewport.width,
      height: viewport.height,
      deviceScaleFactor: 1,
      mobile: viewport.mobile,
    });
    const nav = await send("Page.navigate", { url: appUrl }, 30000);
    if (nav.errorText && nav.errorText !== "net::ERR_ABORTED") {
      throw new Error(`${viewport.name} navigation failed: ${nav.errorText}`);
    }
    await waitForApp();
    await evaluate("document.fonts.ready");
    await sleep(300);

    const summary = await evaluate(`(async () => {
      const method = document.querySelector('#metodo');
      const intro = document.querySelector('.method-story__intro');
      const community = document.querySelector('.method-story__community');
      const conclusion = document.querySelector('.method-story__conclusion');
      const media = document.querySelector('.method-story__media');
      const video = document.querySelector('#metodo video');
      const introCopy = document.querySelector('.method-story__intro-copy');
      const questionItems = [...document.querySelectorAll('.method-story__questions > li')];
      const books = document.querySelector('#libros');
      const bookHeading = document.querySelector('#libros .books-section__heading');
      const bookGallery = document.querySelector('#libros .books-gallery');
      const bookFigures = [...document.querySelectorAll('#libros .books-gallery > figure')];
      const bookImages = [...document.querySelectorAll('#libros .books-gallery img')];
      const rect = (element) => {
        const value = element?.getBoundingClientRect();
        return value ? {
          x: Math.round(value.x * 100) / 100,
          y: Math.round(value.y * 100) / 100,
          width: Math.round(value.width * 100) / 100,
          height: Math.round(value.height * 100) / 100,
          bottom: Math.round(value.bottom * 100) / 100,
        } : null;
      };
      if (video && video.readyState < 1 && !video.error) {
        await new Promise((resolve) => {
          const done = () => resolve();
          video.addEventListener('loadedmetadata', done, { once: true });
          video.addEventListener('error', done, { once: true });
          video.load();
          setTimeout(done, 3500);
        });
      }
      if (books) books.scrollIntoView({ block: 'center' });
      await Promise.all(bookImages.map((image) => image.complete
        ? Promise.resolve()
        : new Promise((resolve) => {
          image.addEventListener('load', resolve, { once: true });
          image.addEventListener('error', resolve, { once: true });
          setTimeout(resolve, 3500);
        })));
      const accent = getComputedStyle(intro, '::before');
      const bookAccent = getComputedStyle(bookHeading, '::before');
      const heroKicker = document.querySelector('.hero__kicker');
      const modalityIcon = document.querySelector('.hero__modalities svg');
      const communityKicker = document.querySelector('.method-story__community .method-story-kicker');
      const reasonIcons = [...document.querySelectorAll('.method-story__conclusion .method-reason__icon')];
      const methodOverflow = [...document.querySelectorAll('#metodo *')]
        .filter((element) => element.scrollWidth > element.clientWidth + 2 && getComputedStyle(element).overflowX === 'visible')
        .slice(0, 8)
        .map((element) => ({ className: element.className, scrollWidth: element.scrollWidth, clientWidth: element.clientWidth }));
      return {
        viewport: [innerWidth, innerHeight],
        dpr: devicePixelRatio,
        heading: document.querySelector('#method-title')?.textContent.trim() || '',
        openingCopy: document.querySelector('.method-story__intro-copy')?.textContent.trim() || '',
        communityHeading: document.querySelector('#method-community-title')?.textContent.trim() || '',
        responseHeading: document.querySelector('#method-principles-title')?.textContent.trim() || '',
        communityParagraphCount: document.querySelectorAll('.method-story__community-copy > p').length,
        questionCount: document.querySelectorAll('.method-story__questions > li').length,
        reasonCount: document.querySelectorAll('.method-reasons > li').length,
        bridgeCount: document.querySelectorAll('.method-story__bridge').length,
        promiseCount: document.querySelectorAll('.method-story__promise').length,
        videoCount: document.querySelectorAll('#metodo video').length,
        videoReadyState: video?.readyState || 0,
        videoError: video?.error?.message || null,
        videoControls: Boolean(video?.controls),
        horizontalOverflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
        methodOverflow,
        heroKickerColor: heroKicker ? getComputedStyle(heroKicker).color : '',
        modalityIconColor: modalityIcon ? getComputedStyle(modalityIcon).color : null,
        communityKickerColor: communityKicker ? getComputedStyle(communityKicker).color : '',
        reasonIconCount: reasonIcons.length,
        reasonIcons: reasonIcons.map((icon) => ({
          ...rect(icon),
          hasSvg: Boolean(icon.querySelector('svg')),
          ariaHidden: icon.getAttribute('aria-hidden'),
        })),
        accent: { width: accent.width, height: accent.height, backgroundImage: accent.backgroundImage },
        questionsColumns: getComputedStyle(document.querySelector('.method-story__questions')).gridTemplateColumns,
        questionItems: questionItems.map(rect),
        conclusionAreas: getComputedStyle(conclusion).gridTemplateAreas,
        method: rect(method),
        intro: rect(intro),
        introCopy: rect(introCopy),
        community: rect(community),
        conclusion: rect(conclusion),
        media: rect(media),
        books: rect(books),
        bookHeadingBorderLeftWidth: getComputedStyle(bookHeading).borderLeftWidth,
        bookAccent: {
          width: bookAccent.width,
          height: bookAccent.height,
          backgroundImage: bookAccent.backgroundImage,
        },
        bookColumns: getComputedStyle(bookGallery).gridTemplateColumns,
        bookCount: bookFigures.length,
        bookFigures: bookFigures.map((figure) => {
          const styles = getComputedStyle(figure);
          return {
            className: figure.className,
            ...rect(figure),
            gridColumnStart: styles.gridColumnStart,
            gridColumnEnd: styles.gridColumnEnd,
            gridRowStart: styles.gridRowStart,
            gridRowEnd: styles.gridRowEnd,
          };
        }),
        bookImages: bookImages.map((image) => ({
          ...rect(image),
          complete: image.complete,
          naturalWidth: image.naturalWidth,
          naturalHeight: image.naturalHeight,
        })),
        errorOverlay: Boolean(document.querySelector('[data-nextjs-dialog], .vite-error-overlay')),
      };
    })()`);

    const issues = [];
    if (summary.heading !== "Primero comprendes. Después hablas.") issues.push("method-heading-copy");
    if (!summary.openingCopy.includes("Durante más de 20 años") || !summary.openingCopy.includes("Graphic Concept")) issues.push("opening-story-copy");
    if (summary.communityHeading !== "¿Te suena familiar?") issues.push("community-heading-copy");
    if (summary.responseHeading !== "Lo que cambia cuando entiendes el método.") issues.push("response-heading-copy");
    if (summary.communityParagraphCount !== 1) issues.push("community-description-present");
    if (summary.questionCount !== 3 || summary.reasonCount !== 3) issues.push("story-item-count");
    if (summary.bridgeCount || summary.promiseCount) issues.push("retired-copy-chapter-present");
    if (summary.videoCount !== 1 || !summary.videoControls || summary.videoError) issues.push("method-video-invalid");
    if (summary.horizontalOverflow > 0 || summary.methodOverflow.length) issues.push("horizontal-overflow");
    if (summary.heroKickerColor !== "rgb(194, 138, 38)") issues.push("hero-gold-mismatch");
    if (summary.communityKickerColor !== "rgb(217, 180, 93)") issues.push("community-kicker-contrast");
    if (
      summary.reasonIconCount !== 3
      || summary.reasonIcons.some((icon) => !icon.hasSvg || icon.ariaHidden !== "true" || icon.width < 36 || icon.height < 36)
    ) issues.push("reason-icons-invalid");
    const accentWidth = parseFloat(summary.accent.width);
    const accentHeight = parseFloat(summary.accent.height);
    const accentSized = viewport.width <= 719
      ? accentWidth >= 50 && accentHeight >= 4
      : accentWidth >= 4 && accentHeight >= 40;
    if (!accentSized || summary.accent.backgroundImage === "none") issues.push("chapter-accent-invalid");
    if (!(summary.intro.y < summary.community.y && summary.community.y < summary.conclusion.y)) issues.push("chapter-order");
    if (viewport.width > 900 && summary.questionsColumns.split(" ").length !== 3) issues.push("desktop-question-columns");
    if (viewport.width <= 900 && summary.questionsColumns.split(" ").length !== 1) issues.push("compact-question-stack");
    if (summary.introCopy.width > 705) issues.push("opening-copy-measure");
    if (viewport.width > 900) {
      const questionHeights = summary.questionItems.map((item) => item.height);
      if (Math.max(...questionHeights) - Math.min(...questionHeights) > 38) issues.push("question-rhythm-imbalance");
    }
    if (summary.bookCount !== 7 || summary.bookImages.some((image) => !image.complete || image.naturalWidth <= 0)) {
      issues.push("book-assets-invalid");
    }
    if (summary.bookHeadingBorderLeftWidth !== "0px" || summary.bookAccent.backgroundImage === "none") {
      issues.push("duplicate-book-heading-accent");
    }
    const introBook = summary.bookFigures.find((figure) => figure.className.includes("books-gallery__intro"));
    const stepBooks = summary.bookFigures.filter((figure) => figure.className.includes("books-gallery__book--"));
    if (viewport.width > 719) {
      const expected = [
        ["2", "1"], ["3", "1"], ["4", "1"],
        ["2", "2"], ["3", "2"], ["4", "2"],
      ];
      if (
        introBook?.gridColumnStart !== "1"
        || introBook?.gridRowStart !== "1"
        || introBook?.gridRowEnd !== "span 2"
        || stepBooks.some((book, index) => book.gridColumnStart !== expected[index][0] || book.gridRowStart !== expected[index][1])
      ) issues.push("desktop-book-sequence");
    } else if (introBook?.gridColumnStart !== "1" || introBook?.gridColumnEnd !== "-1") {
      issues.push("mobile-intro-feature");
    }
    const stepImageWidths = summary.bookImages.slice(1).map((image) => image.width);
    const minStepWidth = viewport.width >= 1041 ? 185 : viewport.width >= 720 ? 130 : 125;
    const minIntroWidth = viewport.width >= 720 ? 180 : 170;
    if (summary.bookImages[0]?.width < minIntroWidth || Math.min(...stepImageWidths) < minStepWidth) {
      issues.push("book-cover-scale");
    }
    if (summary.errorOverlay) issues.push("framework-error-overlay");

    const methodScreenshot = path.join(screenshotsDir, `${viewport.name}-method.png`);
    await captureElement("#metodo", methodScreenshot);
    let heroScreenshot = null;
    if (viewport.width === 1440) {
      heroScreenshot = path.join(screenshotsDir, `${viewport.name}-hero.png`);
      await captureElement("#inicio", heroScreenshot);
    }
    const booksScreenshot = path.join(screenshotsDir, `${viewport.name}-books.png`);
    await captureElement("#libros", booksScreenshot);
    results.push({ ...viewport, summary, issues, methodScreenshot, booksScreenshot, heroScreenshot });
  }

  const report = { appUrl, screenshotsDir, consoleErrors, exceptions, results };
  console.log(JSON.stringify(report, null, 2));
  if (consoleErrors.length || exceptions.length || results.some((result) => result.issues.length)) {
    process.exitCode = 1;
  }
} finally {
  if (socket?.readyState === WebSocket.OPEN) socket.close();
  browser.kill("SIGTERM");
  await Promise.race([
    new Promise((resolve) => browser.once("exit", resolve)),
    sleep(3000),
  ]);
  if (browser.exitCode === null) browser.kill("SIGKILL");
  await rm(profileDir, { recursive: true, force: true });
}
