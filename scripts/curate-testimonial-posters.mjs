import { mkdir, readFile, rm } from "node:fs/promises";
import { existsSync, statSync } from "node:fs";
import { createServer } from "node:http";
import path from "node:path";
import { spawn } from "node:child_process";
import sharp from "sharp";

const root = process.cwd();
const videoDir = path.join(root, "public", "assets", "wix", "videos");
const posterDir = path.join(videoDir, "posters");
const reviewDir = path.join(root, "artifacts", "gallery-poster-candidates");
const chromeCandidates = [
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
];
const videos = [
  "student-interview-jessica-great.mp4",
  "student-interview-eric-great.mp4",
  "international-student-testimonial.mp4",
];
const chosenTimes = JSON.parse(process.env.TESTIMONIAL_POSTER_TIMES || "{}");
const shouldWritePosters = process.argv.includes("--write");

const chrome = chromeCandidates.find((candidate) => existsSync(candidate));
if (!chrome) throw new Error("No Chrome or Edge executable found.");

await rm(reviewDir, { recursive: true, force: true });
await mkdir(reviewDir, { recursive: true });
await mkdir(posterDir, { recursive: true });

const types = { ".html": "text/html; charset=utf-8", ".mp4": "video/mp4" };
const appServer = createServer(async (request, response) => {
  const url = new URL(request.url, "http://127.0.0.1");
  const requested = decodeURIComponent(url.pathname === "/" ? "/index.html" : url.pathname);
  const target = path.resolve(root, requested === "/index.html" ? "./index.html" : `.${requested}`);
  if (!target.startsWith(root) || !existsSync(target) || !statSync(target).isFile()) {
    response.writeHead(404, { "content-type": "text/plain; charset=utf-8" });
    response.end("Not found");
    return;
  }
  const body = await readFile(target);
  const headers = {
    "content-type": types[path.extname(target).toLowerCase()] || "application/octet-stream",
    "accept-ranges": "bytes",
  };
  const range = request.headers.range;
  if (range && path.extname(target).toLowerCase() === ".mp4") {
    const match = /^bytes=(\d+)-(\d*)$/.exec(range);
    if (match) {
      const start = Number(match[1]);
      const end = match[2] ? Math.min(Number(match[2]), body.length - 1) : body.length - 1;
      const chunk = body.subarray(start, end + 1);
      response.writeHead(206, {
        ...headers,
        "content-length": chunk.length,
        "content-range": `bytes ${start}-${end}/${body.length}`,
      });
      response.end(chunk);
      return;
    }
  }
  response.writeHead(200, { ...headers, "content-length": body.length });
  response.end(body);
});

await new Promise((resolve) => appServer.listen(0, "127.0.0.1", resolve));
const appPort = appServer.address().port;

const getOpenPort = async () => {
  const probe = createServer();
  await new Promise((resolve) => probe.listen(0, "127.0.0.1", resolve));
  const freePort = probe.address().port;
  await new Promise((resolve) => probe.close(resolve));
  return freePort;
};

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const fetchJson = async (url) => {
  const response = await fetch(url, { signal: AbortSignal.timeout(800) });
  if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
  return response.json();
};

const port = await getOpenPort();
const browser = spawn(
  chrome,
  [
    "--headless=new",
    "--use-angle=swiftshader",
    "--no-sandbox",
    "--disable-extensions",
    `--remote-debugging-port=${port}`,
    "about:blank",
  ],
  { stdio: ["ignore", "pipe", "pipe"], windowsHide: true },
);

let stderr = "";
browser.stderr.on("data", (chunk) => { stderr += chunk.toString(); });

let wsUrl;
for (let index = 0; index < 80; index += 1) {
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
  appServer.close();
  throw new Error(`Chrome did not expose a DevTools target.\n${stderr}`);
}

const socket = new WebSocket(wsUrl);
await new Promise((resolve, reject) => {
  const timer = setTimeout(() => reject(new Error("Timed out opening DevTools WebSocket")), 5000);
  socket.addEventListener("open", resolve, { once: true });
  socket.addEventListener("error", reject, { once: true });
  socket.addEventListener("open", () => clearTimeout(timer), { once: true });
});

let nextId = 1;
const pending = new Map();
socket.addEventListener("message", (event) => {
  const message = JSON.parse(event.data);
  if (!message.id || !pending.has(message.id)) return;
  const { resolve, reject, timer } = pending.get(message.id);
  pending.delete(message.id);
  clearTimeout(timer);
  if (message.error) reject(new Error(message.error.message));
  else resolve(message.result);
});

const send = (method, params = {}, timeoutMs = 12000) =>
  new Promise((resolve, reject) => {
    const id = nextId;
    nextId += 1;
    const timer = setTimeout(() => {
      pending.delete(id);
      reject(new Error(`Timed out waiting for ${method}`));
    }, timeoutMs);
    pending.set(id, { resolve, reject, timer });
    socket.send(JSON.stringify({ id, method, params }));
  });

const evaluate = async (expression, timeoutMs = 90000) => {
  const result = await send("Runtime.evaluate", {
    expression,
    returnByValue: true,
    awaitPromise: true,
  }, timeoutMs);
  if (result.exceptionDetails) {
    throw new Error(result.exceptionDetails.exception?.description || result.exceptionDetails.text);
  }
  return result.result.value;
};

const slugFor = (video) => video.replace(/\.mp4$/i, "");

try {
  await send("Page.enable");
  await send("Runtime.enable");
  await send("Page.navigate", { url: `http://127.0.0.1:${appPort}/index.html` });
  await sleep(500);

  for (const video of videos) {
    const videoUrl = `http://127.0.0.1:${appPort}/public/assets/wix/videos/${encodeURIComponent(video)}`;
    const selectedTime = Number(chosenTimes[video]);
    const capture = await evaluate(`(async () => {
      document.documentElement.style.background = '#000';
      document.body.replaceChildren();
      document.body.style.margin = '0';
      document.body.style.overflow = 'hidden';
      const player = document.createElement('video');
      player.muted = true;
      player.playsInline = true;
      player.preload = 'auto';
      player.src = ${JSON.stringify(videoUrl)};
      player.style.display = 'block';
      player.style.width = '100vw';
      player.style.height = '100vh';
      player.style.objectFit = 'contain';
      document.body.appendChild(player);
      await new Promise((resolve, reject) => {
        const timer = setTimeout(() => reject(new Error('metadata timeout')), 25000);
        player.addEventListener('loadedmetadata', () => { clearTimeout(timer); resolve(); }, { once: true });
        player.addEventListener('error', () => reject(new Error(player.error?.message || 'video load error')), { once: true });
        player.load();
      });
      const maxWidth = 1080;
      const scale = player.videoWidth > maxWidth ? maxWidth / player.videoWidth : 1;
      window.__seekTestimonial = (time) => new Promise((resolve, reject) => {
        const timer = setTimeout(() => reject(new Error('seek timeout')), 15000);
        const finish = async () => {
          clearTimeout(timer);
          try {
            await player.play();
            await new Promise((frameReady) => {
              const frameTimer = setTimeout(frameReady, 500);
              if (typeof player.requestVideoFrameCallback === 'function') {
                player.requestVideoFrameCallback(() => { clearTimeout(frameTimer); frameReady(); });
              }
            });
            player.pause();
            resolve(player.currentTime);
          } catch (error) {
            reject(error);
          }
        };
        player.addEventListener('seeked', finish, { once: true });
        player.currentTime = time;
      });
      return {
        duration: player.duration,
        width: Math.max(1, Math.round(player.videoWidth * scale)),
        height: Math.max(1, Math.round(player.videoHeight * scale)),
      };
    })()`);

    const slug = slugFor(video);
    const ratios = [0.06, 0.14, 0.22, 0.30, 0.38, 0.46, 0.54, 0.62, 0.70, 0.78, 0.86, 0.94];
    const times = ratios.map((ratio) => capture.duration * ratio);
    if (Number.isFinite(selectedTime)) times.push(selectedTime);
    const uniqueTimes = times
      .map((time) => Math.min(Math.max(0.2, time), Math.max(0.2, capture.duration - 0.25)))
      .filter((time, index, all) => all.findIndex((candidate) => Math.abs(candidate - time) < 0.04) === index);

    await send("Emulation.setDeviceMetricsOverride", {
      width: capture.width,
      height: capture.height,
      deviceScaleFactor: 1,
      mobile: false,
    });
    const sampleFiles = [];
    for (const time of uniqueTimes) {
      const actualTime = await evaluate(`window.__seekTestimonial(${time})`, 30000);
      const screenshot = await send("Page.captureScreenshot", {
        format: "jpeg",
        quality: 90,
        fromSurface: true,
        captureBeyondViewport: false,
      }, 30000);
      const data = Buffer.from(screenshot.data, "base64");
      sampleFiles.push({ time: actualTime, data });
    }

    const cellWidth = 260;
    const cellHeight = Math.round(cellWidth * (capture.height / capture.width));
    const labelHeight = 28;
    const columns = 4;
    const rows = Math.ceil(sampleFiles.length / columns);
    const composites = [];
    for (let index = 0; index < sampleFiles.length; index += 1) {
      const sample = sampleFiles[index];
      const left = (index % columns) * cellWidth;
      const top = Math.floor(index / columns) * (cellHeight + labelHeight);
      const frame = await sharp(sample.data).resize(cellWidth, cellHeight, { fit: "cover" }).jpeg({ quality: 86 }).toBuffer();
      const label = Buffer.from(`<svg width="${cellWidth}" height="${labelHeight}" xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="#001a3d"/><text x="12" y="19" fill="#ffffff" font-size="14" font-family="Arial, sans-serif">${sample.time.toFixed(2)}s</text></svg>`);
      composites.push({ input: frame, left, top });
      composites.push({ input: label, left, top: top + cellHeight });
    }
    const contactPath = path.join(reviewDir, `${slug}-contact.jpg`);
    await sharp({
      create: {
        width: cellWidth * columns,
        height: (cellHeight + labelHeight) * rows,
        channels: 3,
        background: "#07172d",
      },
    }).composite(composites).jpeg({ quality: 88 }).toFile(contactPath);

    if (shouldWritePosters) {
      if (!Number.isFinite(selectedTime)) throw new Error(`Missing curated time for ${video}`);
      const selected = sampleFiles.reduce((best, sample) => (
        Math.abs(sample.time - selectedTime) < Math.abs(best.time - selectedTime) ? sample : best
      ));
      const posterPath = path.join(posterDir, `${slug}-curated.jpg`);
      await sharp(selected.data)
        .modulate({ brightness: 1.035, saturation: 0.96 })
        .linear(1.035, -3)
        .sharpen({ sigma: 0.45 })
        .jpeg({ quality: 90, chromaSubsampling: "4:4:4" })
        .toFile(posterPath);
      console.log(`poster ${path.relative(root, posterPath)} <- ${selected.time.toFixed(2)}s`);
    }

    console.log(`review ${path.relative(root, contactPath)} (${capture.duration.toFixed(2)}s)`);
  }
} finally {
  socket.close();
  browser.kill();
  appServer.close();
}
