import { mkdir, readdir, writeFile } from "node:fs/promises";
import { existsSync, statSync } from "node:fs";
import { createServer } from "node:http";
import path from "node:path";
import { spawn } from "node:child_process";

const root = process.cwd();
const videoDir = path.join(root, "public", "assets", "wix", "videos");
const posterDir = path.join(videoDir, "posters");
const chromeCandidates = [
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
];

const chrome = chromeCandidates.find((candidate) => existsSync(candidate));
if (!chrome) {
  throw new Error("No Chrome or Edge executable found.");
}

await mkdir(posterDir, { recursive: true });

const videos = (await readdir(videoDir))
  .filter((name) => name.toLowerCase().endsWith(".mp4"))
  .sort();

if (!videos.length) {
  throw new Error(`No mp4 videos found in ${videoDir}`);
}

const types = {
  ".html": "text/html; charset=utf-8",
  ".mp4": "video/mp4",
};

const appServer = createServer(async (request, response) => {
  const url = new URL(request.url, "http://127.0.0.1");
  const requested = decodeURIComponent(url.pathname === "/" ? "/index.html" : url.pathname);
  const target = path.resolve(root, requested === "/index.html" ? "./index.html" : `.${requested}`);

  if (!target.startsWith(root) || !existsSync(target) || !statSync(target).isFile()) {
    response.writeHead(404, { "content-type": "text/plain; charset=utf-8" });
    response.end("Not found");
    return;
  }

  response.writeHead(200, {
    "content-type": types[path.extname(target).toLowerCase()] || "application/octet-stream",
  });
  const { createReadStream } = await import("node:fs");
  createReadStream(target).pipe(response);
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
    "--headless",
    "--disable-gpu",
    "--no-sandbox",
    "--disable-extensions",
    "--autoplay-policy=no-user-gesture-required",
    `--remote-debugging-port=${port}`,
    "about:blank",
  ],
  { stdio: ["ignore", "pipe", "pipe"], windowsHide: true },
);

let stderr = "";
browser.stderr.on("data", (chunk) => {
  stderr += chunk.toString();
});

let wsUrl;
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

const evaluate = async (expression, timeoutMs = 30000) => {
  const result = await send(
    "Runtime.evaluate",
    {
      expression,
      returnByValue: true,
      awaitPromise: true,
    },
    timeoutMs,
  );
  if (result.exceptionDetails) {
    throw new Error(result.exceptionDetails.exception?.description || result.exceptionDetails.text);
  }
  return result.result.value;
};

try {
  await send("Page.enable");
  await send("Runtime.enable");
  await send("Page.navigate", { url: `http://127.0.0.1:${appPort}/index.html` });
  await sleep(500);

  for (const video of videos) {
    const videoUrl = `http://127.0.0.1:${appPort}/public/assets/wix/videos/${encodeURIComponent(video)}`;
    const posterName = video.replace(/\.mp4$/i, ".jpg");
    const posterPath = path.join(posterDir, posterName);
    const dataUrl = await evaluate(
      `(async () => {
        const video = document.createElement('video');
        video.muted = true;
        video.playsInline = true;
        video.preload = 'auto';
        video.src = ${JSON.stringify(videoUrl)};
        video.style.position = 'fixed';
        video.style.left = '-9999px';
        document.body.appendChild(video);

        await new Promise((resolve, reject) => {
          const timer = setTimeout(() => reject(new Error('metadata timeout')), 12000);
          video.addEventListener('loadedmetadata', () => {
            clearTimeout(timer);
            resolve();
          }, { once: true });
          video.addEventListener('error', () => reject(new Error(video.error?.message || 'video load error')), { once: true });
          video.load();
        });

        const maxWidth = 1280;
        const scale = video.videoWidth > maxWidth ? maxWidth / video.videoWidth : 1;
        const canvas = document.createElement('canvas');
        canvas.width = Math.max(1, Math.round(video.videoWidth * scale));
        canvas.height = Math.max(1, Math.round(video.videoHeight * scale));
        const context = canvas.getContext('2d');
        const seek = (time) => new Promise((resolve, reject) => {
          const timer = setTimeout(() => reject(new Error('seek timeout')), 12000);
          video.addEventListener('seeked', () => {
            clearTimeout(timer);
            resolve();
          }, { once: true });
          video.currentTime = time;
        });
        const duration = Number.isFinite(video.duration) && video.duration > 0 ? video.duration : 8;
        const sampleTimes = [0.7, 1.4, 2.5, 4, duration * 0.25, duration * 0.5, duration * 0.75]
          .map((time) => Math.min(Math.max(0.2, time), Math.max(0.2, duration - 0.25)))
          .filter((time, index, all) => all.findIndex((candidate) => Math.abs(candidate - time) < 0.2) === index);
        let best = null;
        for (const time of sampleTimes) {
          await seek(time);
          context.drawImage(video, 0, 0, canvas.width, canvas.height);
          const { data, width, height } = context.getImageData(0, 0, canvas.width, canvas.height);
          let luminance = 0;
          let color = 0;
          let nonDark = 0;
          const step = Math.max(4, Math.floor((width * height) / 12000)) * 4;
          let count = 0;
          for (let i = 0; i < data.length; i += step) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];
            const high = Math.max(r, g, b);
            const low = Math.min(r, g, b);
            const luma = (0.2126 * r) + (0.7152 * g) + (0.0722 * b);
            luminance += luma;
            color += high - low;
            if (luma > 28) nonDark += 1;
            count += 1;
          }
          const score = (luminance / count) + ((color / count) * 0.35) + ((nonDark / count) * 95);
          const dataUrl = canvas.toDataURL('image/jpeg', 0.84);
          if (!best || score > best.score) best = { score, dataUrl };
        }
        video.remove();
        return best.dataUrl;
      })()`,
      40000,
    );

    const base64 = dataUrl.split(",")[1] || "";
    await writeFile(posterPath, Buffer.from(base64, "base64"));
    console.log(`created ${path.relative(root, posterPath)}`);
  }
} finally {
  socket.close();
  browser.kill();
  appServer.close();
}
