const PARTS_API_URL = "https://hackclub.com/api/bin/wokwi/parts/";
const WOKWI_SAVE_URL = "https://wokwi.com/api/projects/save";

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

function slugify(value) {
  return value.replace(/[^a-z0-9]+/gi, "-").replace(/^-+|-+$/g, "").toLowerCase() || "part";
}

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

function buildDiagramParts(boardConfig, partsList, supportedParts) {
  const partMap = new Map(supportedParts.map((part) => [part.wokwiName, part]));
  const padding = 30;
  const maxWidth = 320;
  const rowHeight = 215;
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

    if ((x + width + padding) > maxWidth) {
      x = 0;
      y += rowHeight;
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

    x += width + padding;
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

module.exports = async function handler(request, response) {
  if (request.method !== "GET" && request.method !== "HEAD") {
    response.status(405).send("Method Not Allowed");
    return;
  }

  const rawParts = Array.isArray(request.query.parts) ? request.query.parts.join("|") : request.query.parts;
  const selectedItems = decodeURIComponent(rawParts || "")
    .split("|")
    .map((item) => item.trim())
    .filter(Boolean);

  if (selectedItems.length === 0) {
    response.status(400).json({ error: "No parts selected" });
    return;
  }

  try {
    const shareLink = await createWokwiProject(selectedItems);
    response.redirect(302, shareLink);
  } catch (error) {
    response.status(500).json({ error: error.message || "Failed to create Wokwi project" });
  }
};
