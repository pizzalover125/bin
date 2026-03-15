const computerGuides = [
  {
    name: "Pico",
    type: "Computer",
    imageUrl: "../parts/pico.png",
    summary: "The Pico is the reliable, beginner-friendly brain of a Bin build. It gives you GPIO, analog input, PWM, and common buses like I2C, SPI, and UART in a board that is easy to learn.",
    details: "Choose it when you want the smoothest MicroPython experience, lots of beginner examples, and simple wiring for sensors, buttons, displays, and motors.",
    flavorText: "Reliable + beginner-friendly",
    picoQuery: "Raspberry Pi Pico MicroPython getting started",
    esp32Query: "ESP32 vs Raspberry Pi Pico MicroPython getting started"
  },
  {
    name: "ESP32",
    type: "Computer",
    imageUrl: "../parts/esp32.png",
    summary: "The ESP32 is a more advanced board with built-in WiFi and Bluetooth. It is ideal for connected projects like dashboards, remote controls, web interfaces, and wireless sensors.",
    details: "Choose it when your project needs networking, more advanced integrations, or you want to build something that talks to a phone, browser, or another device.",
    flavorText: "Adds built-in WiFi and Bluetooth",
    picoQuery: "Raspberry Pi Pico MicroPython WiFi alternatives",
    esp32Query: "ESP32 MicroPython getting started"
  }
];

const partGuides = {
  "4 Digit Display": {
    summary: "A 4-digit display is perfect for showing short numbers like timers, scores, temperatures, or countdowns.",
    details: "Use it when you want a readable numeric output without the complexity of a full screen. It is especially good for clocks, stopwatches, and sensor dashboards.",
    docsName: "TM1637 4 digit display"
  },
  Accelerometer: {
    summary: "An accelerometer measures motion, tilt, and acceleration so your code can react to movement.",
    details: "It is useful for gesture controls, balancing projects, activity sensing, and understanding how something is being shaken, rotated, or moved.",
    docsName: "MPU6050 accelerometer"
  },
  Breadboard: {
    summary: "A breadboard lets you build and test circuits without soldering, which makes iteration much faster.",
    details: "Use it to connect your board, sensors, LEDs, resistors, and motors while you experiment. It is the easiest way to prototype before committing to a final layout.",
    docsName: "breadboard wiring basics"
  },
  Button: {
    summary: "A pushbutton is the simplest way to let a person send a yes-or-no input into a project.",
    details: "Use it for triggers, menu controls, games, reset actions, or any interaction where a press should start something or change state.",
    docsName: "pushbutton"
  },
  Buzzer: {
    summary: "A buzzer makes sound, tones, and simple melodies from digital signals or PWM.",
    details: "Use it for alarms, feedback sounds, timers, and playful projects that need audio output without a full speaker system.",
    docsName: "buzzer"
  },
  "Clock (RTC)": {
    summary: "A real-time clock keeps track of time and date, even when your main program resets or powers down temporarily.",
    details: "Use it for clocks, schedulers, reminders, data logging, and any project where accurate time matters across restarts.",
    docsName: "DS1307 RTC"
  },
  Encoder: {
    summary: "A rotary encoder gives you turn-by-turn input, usually with a pushbutton built into the knob as well.",
    details: "It works well for menus, value selection, volume-style controls, and projects where smooth rotation is more useful than a single button.",
    docsName: "rotary encoder"
  },
  Humidity: {
    summary: "A humidity sensor measures air humidity and often temperature too, making it useful for environmental monitoring.",
    details: "Use it in weather stations, plant care tools, room monitoring projects, and anything that needs to react to changes in the air.",
    docsName: "DHT22 humidity sensor"
  },
  "IR Reciever": {
    displayName: "IR Receiver",
    summary: "An IR receiver listens for infrared signals from remotes so your project can respond to button presses from across the room.",
    details: "Use it when you want remote control input for media gadgets, menu navigation, robot control, or custom handheld remotes.",
    docsName: "IR receiver remote"
  },
  Joystick: {
    summary: "A joystick gives you two-axis analog input plus a center pushbutton, making it great for directional control.",
    details: "Use it for games, menu navigation, robot steering, camera control, and any project where moving through X and Y matters.",
    docsName: "analog joystick"
  },
  Keypad: {
    summary: "A keypad gives you multiple buttons in a compact matrix layout for entering numbers or commands.",
    details: "Use it when your project needs a PIN pad, menu shortcuts, calculator input, or a simple way to send many commands with few wires.",
    docsName: "matrix keypad"
  },
  LCD: {
    summary: "A character LCD is good for showing text, labels, values, and status messages in a very readable format.",
    details: "Use it when you want menu text, instructions, or sensor readouts on a real display without dealing with graphics rendering.",
    docsName: "LCD1602"
  },
  LED: {
    summary: "A plain LED is the simplest visual output you can add to a project for status, feedback, or decoration.",
    details: "Use it to show on/off state, errors, mode changes, notifications, or to learn the basics of GPIO output and current limiting.",
    docsName: "LED"
  },
  "LED Bar Graph": {
    summary: "An LED bar graph gives you multiple LEDs in a row so you can show levels, progress, or signal strength at a glance.",
    details: "Use it for volume meters, battery indicators, timers, or any project where a visual scale is easier than raw numbers.",
    docsName: "LED bar graph"
  },
  "LED Matrix": {
    summary: "An LED matrix lets you draw patterns, icons, and short scrolling text on a grid of LEDs.",
    details: "Use it for animations, pixel art, indicators, counters, and small text messages in projects with a more playful display.",
    docsName: "MAX7219 LED matrix"
  },
  "LED Screen": {
    summary: "The LED screen is a small OLED display that can show text, icons, sensor values, and lightweight graphics.",
    details: "Use it when you want much more flexibility than a character LCD, especially for menus, charts, and compact UI feedback.",
    docsName: "SSD1306 OLED display"
  },
  "Motion Sensor": {
    summary: "A motion sensor detects when a warm moving body passes through its field of view using passive infrared sensing.",
    details: "Use it for alarms, automatic lights, occupancy sensing, and projects that should wake up or react when someone walks by.",
    docsName: "PIR motion sensor"
  },
  "Multicolor LED": {
    summary: "A multicolor LED combines red, green, and blue channels so you can mix colors and create richer feedback than a single LED.",
    details: "Use it for status indicators, mode colors, ambient light effects, and projects that need color-coded responses.",
    docsName: "RGB LED"
  },
  "Neopixel LED": {
    summary: "A Neopixel is an individually addressable RGB LED, which means you can control color and brightness with code.",
    details: "Use it for smooth animations, colorful indicators, wearable-style effects, and advanced lighting patterns that a normal LED cannot do.",
    docsName: "WS2812 neopixel"
  },
  Photoresistor: {
    summary: "A photoresistor measures ambient light by changing resistance based on how bright the environment is.",
    details: "Use it for night lights, brightness-reactive art, sunlight tracking, or any project that should respond to dark and bright conditions.",
    docsName: "photoresistor light sensor"
  },
  "Range finder": {
    summary: "A range finder measures distance, usually by sending out a signal and timing how long it takes to bounce back.",
    details: "Use it for parking sensors, obstacle avoidance, distance-triggered interactions, and projects that need to know how far away something is.",
    docsName: "HC-SR04 ultrasonic sensor"
  },
  Relay: {
    summary: "A relay is an electrically controlled switch that lets a small signal turn a bigger load on or off.",
    details: "Use it when your project needs to control lamps, pumps, or other higher-power circuits while keeping the microcontroller isolated.",
    docsName: "relay module"
  },
  Resistor: {
    displayName: "470 Ohm Resistor",
    summary: "A resistor limits current and helps set voltages, which protects components like LEDs and keeps circuits behaving predictably.",
    details: "Use it with LEDs, pull-up or pull-down inputs, voltage dividers, and anywhere you need to slow current flow down on purpose.",
    docsName: "470 ohm resistor"
  },
  Servo: {
    summary: "A servo moves to a commanded angle, which makes it great for precise mechanical positioning.",
    details: "Use it for pointing, steering, opening flaps, moving arms, and projects where you want predictable angular motion instead of continuous spinning.",
    docsName: "servo motor"
  },
  "Shift Register": {
    summary: "A shift register expands the number of outputs you can control by sending data serially and exposing it on many pins.",
    details: "Use it when you want to drive more LEDs or outputs than your board has convenient pins for, while keeping wiring manageable.",
    docsName: "74HC595 shift register"
  },
  Slider: {
    summary: "A slider gives you analog position input, which makes it useful for values that should move smoothly instead of in steps.",
    details: "Use it for brightness controls, menu values, synth-style controls, or any interface where a physical position should map to a number.",
    docsName: "slide potentiometer"
  },
  "Stepper Motor": {
    summary: "A stepper motor moves in precise steps, which makes it stronger and more repeatable than a simple hobby motor in many builds.",
    details: "Use it when you need controlled rotation, repeatable positioning, or more torque for motion-heavy projects like sliders, turntables, and mechanisms.",
    docsName: "stepper motor A4988 driver"
  },
  "Temp Sensor": {
    summary: "A temperature sensor measures temperature directly and reports it in a digital format your code can read.",
    details: "Use it for thermostats, weather displays, drink or room monitoring, and any project that should react to hot or cold conditions.",
    docsName: "DS18B20 temperature sensor"
  },
  Thermistor: {
    summary: "A thermistor changes resistance with temperature, giving you an analog way to sense hot and cold.",
    details: "Use it when you want a low-cost temperature input and are comfortable converting analog readings into approximate temperatures.",
    docsName: "thermistor"
  }
};

function normalizePartName(name) {
  return (name || "").trim();
}

function sortParts(parts) {
  return [...parts].sort((a, b) => normalizePartName(a.name).localeCompare(normalizePartName(b.name)));
}

function getPartMeta(partLike) {
  const rawName = normalizePartName(partLike.name);
  return partGuides[rawName] || {
    displayName: rawName,
    summary: partLike.flavorText || "This part adds a new capability to your build.",
    details: "Use this part when you want your project to sense, display, move, or respond in a new way.",
    docsName: rawName
  };
}

function getDisplayName(partLike) {
  return getPartMeta(partLike).displayName || normalizePartName(partLike.name);
}

function buildSearchUrl(query) {
  return `https://www.google.com/search?q=${encodeURIComponent(query)}`;
}

function buildDocLinks(partLike, displayName, docsName, isComputer) {
  if (isComputer && displayName === "Pico") {
    return [];
  }

  if (isComputer && displayName === "ESP32") {
    return [];
  }

  return [
    {
      label: `Using ${displayName} with MicroPython (Pico)`,
      href: buildSearchUrl(`Raspberry Pi Pico MicroPython ${docsName}`)
    },
    {
      label: `Using ${displayName} with ESP32`,
      href: buildSearchUrl(`ESP32 MicroPython ${docsName}`)
    }
  ];
}

function createImageNode(imageUrl, displayName) {
  const visual = document.createElement("div");
  visual.className = "guide-card-visual";

  if (imageUrl) {
    const image = document.createElement("img");
    image.src = imageUrl;
    image.alt = displayName;
    visual.appendChild(image);
    return visual;
  }

  const fallback = document.createElement("div");
  fallback.className = "guide-card-fallback";
  fallback.innerText = displayName;
  visual.appendChild(fallback);
  return visual;
}

function createGuideCard(partLike, categoryLabel, isComputer) {
  const meta = getPartMeta(partLike);
  const displayName = meta.displayName || normalizePartName(partLike.name);
  const flavorText = (partLike.flavorText || "").trim();
  const card = document.createElement("article");
  card.className = "guide-card";

  const title = document.createElement("h3");
  title.innerText = displayName;

  const summary = document.createElement("p");
  summary.className = "guide-card-summary";
  summary.innerText = meta.summary;

  const details = document.createElement("p");
  details.className = "guide-card-details";
  details.innerText = meta.details;

  card.appendChild(createImageNode(partLike.imageUrl, displayName));
  card.appendChild(title);

  if (flavorText) {
    const flavor = document.createElement("p");
    flavor.className = "guide-card-flavor";
    flavor.innerText = flavorText;
    card.appendChild(flavor);
  }

  card.appendChild(summary);
  card.appendChild(details);

  const docLinks = buildDocLinks(partLike, displayName, meta.docsName || displayName, isComputer);
  if (docLinks.length) {
    const links = document.createElement("div");
    links.className = "guide-card-links";

    docLinks.forEach((linkInfo) => {
      const link = document.createElement("a");
      link.className = "guide-card-link";
      link.href = linkInfo.href;
      link.target = "_blank";
      link.rel = "noreferrer";
      link.innerText = linkInfo.label;
      links.appendChild(link);
    });

    card.appendChild(links);
  }
  return card;
}

function mountEmptyState(container, message) {
  const empty = document.createElement("div");
  empty.className = "guide-empty";
  empty.innerText = message;
  container.appendChild(empty);
}

function mountGuideParts(parts) {
  const computerGrid = document.querySelector("#guide-computers");
  const inputGrid = document.querySelector("#guide-inputs");
  const outputGrid = document.querySelector("#guide-outputs");
  const otherGrid = document.querySelector("#guide-other");

  computerGuides.forEach((computer) => {
    computerGrid.appendChild(createGuideCard(computer, computer.type, true));
  });

  const hiddenGuideParts = new Set(["Breadboard", "Shift Register"]);
  const normalizedParts = parts
    .map((part) => ({
      ...part,
      name: normalizePartName(part.name)
    }))
    .filter((part) => !hiddenGuideParts.has(part.name));

  sortParts(normalizedParts.filter((part) => part.type === "Input")).forEach((part) => {
    inputGrid.appendChild(createGuideCard(part, "Input", false));
  });

  sortParts(normalizedParts.filter((part) => part.type === "Output")).forEach((part) => {
    outputGrid.appendChild(createGuideCard(part, "Output", false));
  });

  sortParts(normalizedParts.filter((part) => part.type !== "Input" && part.type !== "Output")).forEach((part) => {
    otherGrid.appendChild(createGuideCard(part, part.type || "Other", false));
  });

  if (!otherGrid.children.length) {
    mountEmptyState(otherGrid, "No helper parts available yet.");
  }
}

window.addEventListener("load", async () => {
  const parts = await partsData();
  mountGuideParts(parts.filter((part) => part.type !== "Microprocessor"));
});
