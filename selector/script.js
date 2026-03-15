const moduleLimit = 8;
const ALWAYS_INCLUDED_PARTS = new Set(["Breadboard"]);

const computerOptions = [
  {
    id: "board-pi-pico",
    name: "Pico",
    subtitle: "Raspberry Pi Pico W",
    description: "Reliable + beginner-friendly",
    imageUrl: "../parts/pico.png",
    badge: "Default"
  },
  {
    id: "board-esp32-devkit-c-v4",
    name: "ESP32",
    subtitle: "ESP32 DevKit V4",
    description: "Adds built-in WiFi and Bluetooth",
    badge: "Advanced",
    imageUrl: "../parts/esp32.png"
  }
];

let selectedComputerId = null;
const selectedModules = new Set();

function getRequestedSelections() {
  const params = new URLSearchParams(window.location.search);
  return (params.get("modules") || "")
    .split("|")
    .map((moduleId) => moduleId.trim())
    .filter(Boolean);
}

function sortParts(parts) {
  return [...parts].sort((a, b) => a.name.localeCompare(b.name));
}

function getModuleSelections() {
  return Array.from(selectedModules);
}

function getSelectionsForUrl() {
  const parts = [selectedComputerId, ...getModuleSelections()].filter(Boolean);
  return parts.sort().join("|");
}

function renderComputerCard(option) {
  const card = document.createElement("button");
  card.type = "button";
  card.className = "selector-card selector-card-computer";
  card.dataset.partName = option.id;
  card.dataset.kind = "computer";

  const visual = document.createElement("div");
  visual.className = "selector-card-visual";

  if (option.imageUrl) {
    const image = document.createElement("img");
    image.src = option.imageUrl;
    image.alt = option.subtitle;
    if (option.id === "board-esp32-devkit-c-v4") {
      image.classList.add("selector-card-image-esp32");
    }
    visual.appendChild(image);
  }

  const badge = document.createElement("div");
  badge.className = "selector-card-badge";
  badge.innerText = option.badge;

  const title = document.createElement("h3");
  title.className = "selector-card-title";
  title.innerText = option.name;

  const subtitle = document.createElement("p");
  subtitle.className = "selector-card-subtitle";
  subtitle.innerText = option.subtitle;

  const description = document.createElement("p");
  description.className = "selector-card-description";
  description.innerText = option.description;

  card.appendChild(badge);
  card.appendChild(visual);
  card.appendChild(title);
  card.appendChild(subtitle);
  card.appendChild(description);

  card.addEventListener("click", () => {
    selectedComputerId = option.id;
    syncSelectionUi();
  });

  return card;
}

function buildBadge(label) {
  const badge = document.createElement("div");
  badge.className = "selector-card-badge";
  badge.innerText = label;
  return badge;
}

function normalizePart(part) {
  if ((part.name || "").trim() === "Breadboard") {
    return {
      ...part,
      type: "Other",
      name: "Breadboard",
      imageUrl: "../parts/breadboard.png",
      flavorText: "Always included to connect everything together.",
      isAlwaysIncluded: true
    };
  }

  if ((part.wokwiName || "") === "wokwi-resistor") {
    return {
      ...part,
      type: "Other",
      name: "470 Ohm Resistor",
      flavorText: "470 ohm resistor. Limit of 10."
    };
  }

  if ((part.name || "").trim() === "Stepper Motor") {
    return {
      ...part,
      name: "Stepper Motor",
      flavorText: "Move stuff with more power"
    };
  }

  return {
    ...part,
    name: (part.name || "").trim(),
    flavorText: (part.flavorText || "").trim()
  };
}

function renderPartCard(part) {
  const normalizedPart = normalizePart(part);
  const card = document.createElement("button");
  card.type = "button";
  card.className = "selector-card selector-card-module";
  card.dataset.partName = normalizedPart.wokwiName || normalizedPart.name;
  card.dataset.kind = (normalizedPart.type || "Other").toLowerCase();
  if (normalizedPart.isAlwaysIncluded) {
    card.classList.add("selected", "selector-card-locked");
    card.disabled = true;
  }

  const visual = document.createElement("div");
  visual.className = "selector-card-visual";

  if (normalizedPart.imageUrl) {
    const image = document.createElement("img");
    image.src = normalizedPart.imageUrl;
    image.alt = normalizedPart.name;
    visual.appendChild(image);
  } else {
    const fallback = document.createElement("div");
    fallback.className = "selector-card-fallback";
    fallback.innerText = normalizedPart.name;
    visual.appendChild(fallback);
  }

  const title = document.createElement("h3");
  title.className = "selector-card-title";
  title.innerText = normalizedPart.name;

  const description = document.createElement("p");
  description.className = "selector-card-description";
  description.innerText = normalizedPart.flavorText;

  card.appendChild(visual);

  if (normalizedPart.isAlwaysIncluded) {
    card.appendChild(buildBadge("Included"));
  } else if (normalizedPart.outOfStock) {
    card.appendChild(buildBadge("Limited"));
  } else if (normalizedPart.displayAmount && normalizedPart.currentStockIncludingNonFulfilled < 6) {
    card.appendChild(buildBadge(`${normalizedPart.currentStockIncludingNonFulfilled} left`));
  }

  card.appendChild(title);
  card.appendChild(description);

  if (normalizedPart.isAlwaysIncluded) {
    return card;
  }

  card.addEventListener("click", () => {
    const isSelected = selectedModules.has(normalizedPart.wokwiName);
    if (isSelected) {
      selectedModules.delete(normalizedPart.wokwiName);
      syncSelectionUi();
      return;
    }

    if (selectedModules.size >= moduleLimit) {
      syncSelectionUi();
      return;
    }

    selectedModules.add(normalizedPart.wokwiName);
    syncSelectionUi();
  });

  return card;
}

function syncSelectionUi() {
  const moduleCount = selectedModules.size;
  const remaining = moduleLimit - moduleCount;
  const allCards = document.querySelectorAll(".selector-card");
  const continueButton = document.querySelector("#continue-button");
  const selectionSummary = document.querySelector("#selection-summary");
  const selectionDetail = document.querySelector("#selection-detail");

  allCards.forEach((card) => {
    const kind = card.dataset.kind;
    const partName = card.dataset.partName;
    const isAlwaysIncluded = ALWAYS_INCLUDED_PARTS.has(partName);

    if (kind === "computer") {
      card.classList.toggle("selected", partName === selectedComputerId);
      return;
    }

    const isSelected = isAlwaysIncluded || selectedModules.has(partName);
    const shouldDisable = remaining === 0 && !isSelected;
    card.classList.toggle("selected", isSelected);
    card.classList.toggle("disabled", isAlwaysIncluded ? false : shouldDisable);
  });

  const selectedComputer = computerOptions.find((option) => option.id === selectedComputerId);

  if (!selectedComputerId) {
    selectionSummary.innerText = "Select a computer and at least 1 module";
  } else if (moduleCount === 0) {
    selectionSummary.innerText = `Computer ready: ${selectedComputer.name}`;
  } else {
    selectionSummary.innerText = `${selectedComputer.name} + ${moduleCount} module${moduleCount === 1 ? "" : "s"} selected`;
  }

  selectionDetail.innerText = `Inputs, outputs, and other parts share the ${moduleLimit}-module cap. A breadboard is always included.`;
  continueButton.disabled = !(selectedComputerId && moduleCount > 0);
}

function mountCards(parts) {
  const inputGrid = document.querySelector("#inputs-grid");
  const outputGrid = document.querySelector("#outputs-grid");
  const otherGrid = document.querySelector("#other-grid");
  const computerGrid = document.querySelector("#computer-grid");

  computerOptions.forEach((option) => {
    computerGrid.appendChild(renderComputerCard(option));
  });

  sortParts(parts.filter((part) => part.type === "Input" && part.imageUrl)).forEach((part) => {
    inputGrid.appendChild(renderPartCard(part));
  });

  sortParts(parts.filter((part) => part.type === "Output" && part.imageUrl)).forEach((part) => {
    outputGrid.appendChild(renderPartCard(part));
  });

  sortParts(
    parts.filter(
      (part) => (part.imageUrl && (part.wokwiName || "") === "wokwi-resistor") || ALWAYS_INCLUDED_PARTS.has((part.name || "").trim())
    )
  ).forEach((part) => {
    otherGrid.appendChild(renderPartCard(part));
  });
}

function applySelectionsFromUrl(parts) {
  const requestedModules = getRequestedSelections();
  const validModuleIds = new Set(
    parts
      .filter((part) => part.imageUrl)
      .map((part) => normalizePart(part).wokwiName)
      .filter(Boolean)
  );

  requestedModules.slice(0, moduleLimit).forEach((moduleId) => {
    if (validModuleIds.has(moduleId)) {
      selectedModules.add(moduleId);
    }
  });
}

window.addEventListener("load", async () => {
  const parts = await partsData();
  applySelectionsFromUrl(parts);
  mountCards(parts);
  syncSelectionUi();

  document.querySelector("#continue-button").addEventListener("click", () => {
    if (!selectedComputerId || selectedModules.size === 0) {
      return;
    }

    const partsList = encodeURI(getSelectionsForUrl());
    window.location.href = `${window.location.origin}/api/bin/wokwi/new/${partsList}`;
  });
});
