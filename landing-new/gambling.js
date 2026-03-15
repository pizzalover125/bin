var fetchedParts;
var selectedParts = [];
var rolled = false;

function removeItemByAttribute(arr, attr, value) {
  return arr.filter((item) => item[attr] !== value);
}

function addComponentsToPage(data) {
  document.querySelectorAll(".gambling-item-wrapper").forEach((element) => {
    var component = data[0];
    var spinnerItem = document.createElement("div");
    spinnerItem.className = "spinner-item";

    var spinnerInfo = document.createElement("div");
    spinnerInfo.className = "spinner-info";

    var spinnerImage = document.createElement("img");
    spinnerImage.src = "https://imgk.timesnownews.com/story/raccoon_GettyImages-914090712.jpg";
    spinnerImage.className = "spinner-item-image";

    var heading = document.createElement("h1");
    heading.classList.add("spinner-item-name");
    heading.innerText = component.name;

    var description = document.createElement("p");
    description.classList.add("spinner-item-description");
    description.innerText = component.flavorText;

    spinnerItem.appendChild(spinnerImage);
    spinnerInfo.appendChild(heading);
    spinnerInfo.appendChild(description);
    spinnerItem.appendChild(spinnerInfo);
    element.appendChild(spinnerItem);
  });
}

function sample(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function rollPartsAnimation(ms) {
  var duration = ms || 1000;
  for (var i = 0; i < duration; i += 100) {
    setTimeout(() => {
      randomizeParts();
    }, i);
  }
  setTimeout(() => {
    randomizeParts();
  }, duration + 200);
  setTimeout(() => {
    randomizeParts();
  }, duration + 500);
}

function randomizeParts() {
  var chosenParts = [];
  var inputParts = fetchedParts.filter((part) => part.type === "Input");
  var inputPart = sample(inputParts);
  chosenParts.push(inputPart);
  console.log("For the input part, we picked " + inputPart.name);

  var outputParts = fetchedParts.filter((part) => part.type === "Output");
  var outputPart = sample(outputParts);
  chosenParts.push(outputPart);
  console.log("For the output part, we picked " + outputPart.name);

  var unusedParts = fetchedParts.filter((part) => part.name !== inputPart.name && part.name !== outputPart.name);
  var thirdPart = sample(unusedParts);
  chosenParts.push(thirdPart);
  console.log("For the third part, we picked " + thirdPart.name);

  var chosenPartNames = [];
  document.querySelectorAll(".gambling-item-wrapper").forEach((element, key) => {
    var thisPart = chosenParts[key];
    var spinnerImage = element.childNodes[2].childNodes[0];
    var partTitle = element.childNodes[2].childNodes[1].childNodes[0];
    var flavorText = element.childNodes[2].childNodes[1].childNodes[1];
    spinnerImage.src = thisPart.imageUrl === "" || thisPart.imageUrl === undefined ? "https://awdev.codes/images/ww.gif" : thisPart.imageUrl;
    partTitle.innerText = thisPart.name;
    flavorText.innerText = thisPart.flavorText;
    chosenPartNames.push(thisPart.wokwiName);
  });
  selectedParts = chosenPartNames;
  var startButton = document.querySelector(".gambling-start");
  if (startButton) {
    startButton.classList.remove("disabled");
  }
}

var rollSound = new Howl({ src: "https://cloud-eclxkeatl-hack-club-bot.vercel.app/0mario-kart-item-box-sound-mp3cut_audio.mp4" });

function rollParts(el) {
  if (el.classList.contains("disabled")) {
    return;
  }
  if (!rolled) {
    document.querySelectorAll(".gambling-item-wrapper").forEach((element) => {
      element.removeChild(element.firstElementChild);
    });
    addComponentsToPage(fetchedParts);
    rolled = true;
  }
  var buildButton = document.querySelector(".gambling-build");
  if (buildButton) {
    buildButton.classList.remove("disabled");
  }
  rollSound.play();
  rollPartsAnimation(1200);
}

function goToSelectorWithParts(el) {
  if (el.classList.contains("disabled") || !rolled || selectedParts.length === 0) {
    return;
  }

  var selectorUrl = new URL("./selector/", window.location.href);
  selectorUrl.searchParams.set("modules", selectedParts.join("|"));
  window.location.href = selectorUrl.toString();
}

async function generateBuildLink(e) {
  if (!rolled) {
    return;
  }
  e.classList.add("disabled");
  e.classList.add("loading");

  var parts = encodeURI(selectedParts.join("|"));
  var origin = window.location.origin;
  var url = new URL(origin + "/api/bin/wokwi/new/" + parts);

  window.open(url, "_blank").focus();

  e.classList.remove("disabled");
  e.classList.remove("loading");
}

window.addEventListener("load", async () => {
  fetchedParts = (await partsData()).filter((p) => p.rollable);
  document.querySelector(".gambling-roll").classList.remove("disabled");
});

async function generateProjectIdea() {
  var ideaButton = document.querySelector("#generate-project-idea");
  var ideaOutput = document.querySelector("#project-idea");
  if (!ideaButton || !ideaOutput) {
    return;
  }

  if (ideaButton.classList.contains("disabled")) {
    return;
  }

  ideaOutput.innerHTML = "Bin has ended! Thanks for participating.";
}
