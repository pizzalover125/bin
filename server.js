const http = require("http");
const fs = require("fs");
const fsp = require("fs/promises");
const path = require("path");

const PORT = process.env.PORT || 4173;
const ROOT = __dirname;
const PARTS_API_URL = "https://hackclub.com/api/bin/wokwi/parts/";
const WOKWI_SAVE_URL = "https://wokwi.com/api/projects/save";

const MIME_TYPES = {
  ".css": "text/css; charset=utf-8",
  ".gif": "image/gif",
  ".html": "text/html; charset=utf-8",
  ".ico": "image/x-icon",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".md": "text/markdown; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".ttf": "font/ttf",
  ".webp": "image/webp",
  ".woff": "font/woff"
};

const BOARD_CONFIGS = {
  "board-pi-pico": {
    diagramType: "board-pi-pico-w",
    initialX: 118,
    sketch: `// Now turn this trash into treasure!\n\nvoid setup() {\n  Serial.begin(115200);\n  Serial.println("Hello from The Bin!");\n}\n\nvoid loop() {\n  delay(10);\n}\n`
  },
  "board-pi-pico-w": {
    diagramType: "board-pi-pico-w",
    initialX: 118,
    sketch: `// Now turn this trash into treasure!\n\nvoid setup() {\n  Serial.begin(115200);\n  Serial.println("Hello from The Bin!");\n}\n\nvoid loop() {\n  delay(10);\n}\n`
  },
  "board-esp32-devkit-c-v4": {
    diagramType: "board-esp32-devkit-c-v4",
    initialX: 132,
    sketch: `// Now turn this trash into treasure!\n\nvoid setup() {\n  Serial.begin(115200);\n  Serial.println("Hello from The Bin ESP32!");\n}\n\nvoid loop() {\n  delay(10);\n}\n`
  }
};

let partsDataPromise = null;

async function getPartsData() {
  if (!partsDataPromise) {
    partsDataPromise = fetch(PARTS_API_URL).then(async (response) => {
      if (!response.ok) {
        throw new Error(`Failed to fetch parts data: ${response.status}`);
      }
      return response.json();
    });
  }
  return partsDataPromise;
}

function json(response, statusCode, payload) {
  response.writeHead(statusCode, { "Content-Type": "application/json; charset=utf-8" });
  response.end(JSON.stringify(payload));
}

function redirect(response, location) {
  response.writeHead(302, { Location: location });
  response.end();
}

function resolveStaticPath(urlPathname) {
  const cleanedPath = decodeURIComponent(urlPathname.split("?")[0]);
  const relativePath = cleanedPath === "/" ? "index.html" : cleanedPath.replace(/^\/+/, "");
  const candidate = path.join(ROOT, relativePath);
  const normalized = path.normalize(candidate);

  if (!normalized.startsWith(ROOT)) {
    return null;
  }

  return normalized;
}

async function sendStaticFile(response, filePath) {
  let resolvedPath = filePath;

  try {
    const stat = await fsp.stat(resolvedPath);
    if (stat.isDirectory()) {
      resolvedPath = path.join(resolvedPath, "index.html");
    }
  } catch {
    if (!path.extname(resolvedPath)) {
      resolvedPath = path.join(resolvedPath, "index.html");
    }
  }

  try {
    const contents = await fsp.readFile(resolvedPath);
    const contentType = MIME_TYPES[path.extname(resolvedPath).toLowerCase()] || "application/octet-stream";
    response.writeHead(200, { "Content-Type": contentType });
    response.end(contents);
  } catch {
    response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    response.end("Not Found");
  }
}

function slugify(value) {
  return value.replace(/[^a-z0-9]+/gi, "-").replace(/^-+|-+$/g, "").toLowerCase() || "part";
}

function buildDiagramParts(boardConfig, partsList, supportedParts) {
  const partMap = new Map(supportedParts.map((part) => [part.wokwiName, part]));
  const PADDING = 30;
  const MAX_WIDTH = 320;
  const ROW_HEIGHT = 215;
  const diagramParts = [
    { type: "wokwi-breadboard-half", id: "breadboard", top: 72, left: -168, attrs: {} },
    { type: boardConfig.diagramType, id: "board", top: 0, left: 0, attrs: {} }
  ];

  let x = boardConfig.initialX;
  let y = 0;

  partsList.forEach((selectedPartName) => {
    const part = partMap.get(selectedPartName);
    if (!part) {
      return;
    }

    const partTypes = String(part.wokwiName || "")
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
    const width = Number(part.wokwiXOffset) || 80;

    if ((x + width + PADDING) > MAX_WIDTH) {
      x = 0;
      y += ROW_HEIGHT;
    }

    partTypes.forEach((type, index) => {
      diagramParts.push({
        type,
        id: `${slugify(type)}-${diagramParts.length}-${index}`,
        left: x,
        top: y,
        attrs: part.attrs || {}
      });
    });

    x += width + PADDING;
  });

  return diagramParts;
}

async function createWokwiProject(selectedItems) {
  const boardOption =
    BOARD_CONFIGS[selectedItems.find((item) => BOARD_CONFIGS[item])] || BOARD_CONFIGS["board-pi-pico"];
  const moduleSelections = selectedItems.filter((item) => !BOARD_CONFIGS[item]);
  const supportedParts = await getPartsData();
  const diagramParts = buildDiagramParts(boardOption, moduleSelections, supportedParts);

  const payload = {
    name: "The Bin!",
    unlisted: true,
    files: [
      {
        name: "sketch.ino",
        content: boardOption.sketch
      },
      {
        name: "diagram.json",
        content: JSON.stringify(
          {
            version: 1,
            author: "The Bin - Hack Club",
            editor: "wokwi",
            parts: diagramParts,
            connections: [],
            dependencies: {}
          },
          null,
          2
        )
      }
    ]
  };

  const response = await fetch(WOKWI_SAVE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    throw new Error(`Wokwi save failed with ${response.status}`);
  }

  const data = await response.json();
  return `https://wokwi.com/projects/${data.projectId}`;
}

async function handleApiRoute(request, response, url) {
  const prefix = "/api/bin/wokwi/new/";
  const rawParts = url.pathname.slice(prefix.length);
  const selectedItems = decodeURIComponent(rawParts)
    .split("|")
    .map((item) => item.trim())
    .filter(Boolean);

  if (selectedItems.length === 0) {
    return json(response, 400, { error: "No parts selected" });
  }

  try {
    const shareLink = await createWokwiProject(selectedItems);
    return redirect(response, shareLink);
  } catch (error) {
    return json(response, 500, { error: error.message || "Failed to create Wokwi project" });
  }
}

const server = http.createServer(async (request, response) => {
  const url = new URL(request.url, `http://${request.headers.host}`);

  if ((request.method === "GET" || request.method === "HEAD") && url.pathname.startsWith("/api/bin/wokwi/new/")) {
    return handleApiRoute(request, response, url);
  }

  if (request.method !== "GET" && request.method !== "HEAD") {
    response.writeHead(405, { "Content-Type": "text/plain; charset=utf-8" });
    response.end("Method Not Allowed");
    return;
  }

  const staticPath = resolveStaticPath(url.pathname);
  if (!staticPath) {
    response.writeHead(403, { "Content-Type": "text/plain; charset=utf-8" });
    response.end("Forbidden");
    return;
  }

  return sendStaticFile(response, staticPath);
});

server.listen(PORT, () => {
  console.log(`Bin server listening on http://127.0.0.1:${PORT}`);
});
