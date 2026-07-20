let width = "800";
let height = "800";
let clicked = false;

const Spearmaster = {
  image: '.\\Scugs\\Spearmaster.png',
  fillColor: '#61267a',
  rotate: true,
};
const Artificer = {
  image: '.\\Scugs\\Artificer.png',
  fillColor: '#761000',
  rotate: true,
};
const Hunter = {
  image: '.\\Scugs\\Hunter.png',
  fillColor: '#cd6d9b',
  rotate: true,
};
const Gourmand = {
  image: '.\\Scugs\\Gourmand.png',
  fillColor: '#ffd7ab',
  rotate: true,
};
const Survivor = {
  image: '.\\Scugs\\Survivor.png',
  fillColor: '#000000',
  rotate: true,
};
const Monk = {
  image: '.\\Scugs\\Monk.png',
  fillColor: '#ffe669',
  rotate: true,
};
const Rivulet = {
  image: '.\\Scugs\\Rivulet.png',
  fillColor: '#92c5d5',
  rotate: true,
};
const Saint = {
  image: '.\\Scugs\\Saint.png',
  fillColor: '#69bf5a',
  rotate: true,
};
const Watcher = {
  image: '.\\Scugs\\Watcher.png',
  fillColor: '#8F94C1',
  rotate: true,
};
const Slugpup = {
  image: '.\\Scugs\\Slugpup.png',
  fillColor: '#91637E',
  rotate: true,
};
const Inv = {
  image: '.\\Scugs\\Inv.png',
  fillColor: '#B1FDFA',
  rotate: true,
};

const Slugcats = [
  Spearmaster,
  Artificer,
  Hunter,
  Gourmand,
  Survivor,
  Monk,
  Rivulet,
  Saint,
  Watcher,
  Slugpup,
  Inv
]

CustomEase.create("customBack", "M0,0 C0.023,0 0.033,-0.03 0.058,-0.03 0.087,-0.03 0.138,0.516 0.301,0.724 0.399,0.85 0.478,0.932 0.622,0.967 0.712,0.989 0.886,0.999 1,1 ");

const IdleAnimation = {
  'type': 'custom',
  'duration': 10,
  'easing': 'linear',
  'callbackAfter' : drawOverWheel,
  'rotationAngle': 0,
  'propertyName': 'rotationAngle',
  'propertyValue': 360,
  'repeat': -1
}
const RollAnimation = {
  'type': "spinToStop",
  'spins': 15,
  'duration': 15,
  'easing': 'customBack',
  'callbackAfter' : drawOverWheel,
  'callbackFinished': scugSelection,
  'stopAngle': null,
  'repeat': 0
}

let wheelData = defaultWheel;
let enforceSpacing = false;
if (enforceSpacing)
  spaceListElements(wheelData)

let theWheel = new Winwheel({
  'canvasId': 'canvas',
  'numSegments': wheelData.length,
  'textAlignment': 'inner',
  'textMargin': 100,
  'lineWidth': 0,
  'pointerAngle': 90,
  'drawMode': 'image',
  'wheelImage': "Scugs\\wheel.png",
  'segments': getScugSegments(wheelData),
  'animation': IdleAnimation
});

let overWheel = new Winwheel({
  'canvasId':'over',
  'drawMode': 'image',
  'wheelImage': "Scugs\\wheel_over.png",
});

let audioResult1 = new Audio('.\\Sfx\\Karma_KarmaPitchDiscovery.wav');
let audioResult2 = new Audio('.\\Sfx\\Karma_capBell1.wav');
let audioResult3 = new Audio('.\\Sfx\\Karma_GhostPingBase.wav');
audioResult1.volume = 0.2;
audioResult2.volume = 0.2;
audioResult3.volume = 0.2;
let audioSpinQueue = [];
let audioSpinState = 0;

let loadedImg = new Image();
loadedImg.onload = function () {
  theWheel.wheelImage = loadedImg;    // Make wheelImage equal the loaded image object.
  theWheel.draw();                    // Also call draw function to render the wheel.
}
loadedImg.src = "wheel.png";

let loadedImgOver = new Image();
loadedImgOver.onload = function () {
  overWheel.wheelImage = loadedImgOver;    // Make wheelImage equal the loaded image object.
  overWheel.draw();                    // Also call draw function to render the wheel.
}
loadedImgOver.src = "wheel_over.png";

addEventListener("load", () => {
  theWheel.startAnimation();
  document.getElementById("result").addEventListener("animationend", closeResult);
})



// --- HELPER FUNCTIONS --- //

function toggleSpacing(obj) {
  if ($(obj).is(":checked")) {
    enforceSpacing = true;
    spaceWheelSegments();
    resizeImageSegments(theWheel);
  } else { enforceSpacing = false; }
}

function getScugSegments() {
  let wheelScug = []

  for (let i = 0; i < wheelData.length; i++) {
    let s = getScugData(wheelData[i])
    wheelScug.push({ 'image': s.image })
  }
  return wheelScug
}

function getBgSegments() {
  let wheelBg = []

  for (let i = 0; i < wheelData.length; i++) {
    let s = getScugData(wheelData[i])
    wheelBg.push({ 'fillStyle': s.fillColor })
  }
  return wheelBg
}

function spaceListElements(list) {
  // Count each element in the input list
  let elCountMap = new Map()
  for (i = 0; i < list.length; i++) {
    if (elCountMap.has(list[i]))
      elCountMap.set(list[i], elCountMap.get(list[i]) + 1)
    else
      elCountMap.set(list[i], 1)
  }

  // Get these counts into an array and sort descending
  let elCountArr = []
  for (const [key, value] of elCountMap) {
    elCountArr.push({ 'scug': key, 'count': value })
  }
  elCountArr.sort((scugCountA, scugCountB) => scugCountB.count - scugCountA.count)
  let scugsCounts = []
  while (elCountArr.length > 0) {
    let c = elCountArr[0].count
    let scugCount = { 'scugs': [elCountArr.splice(0, 1)[0].scug], 'count': c }
    while (elCountArr.length > 0 && c === elCountArr[0].count)
      scugCount.scugs.push(elCountArr.splice(0, 1)[0].scug)
    scugsCounts.push(scugCount)
  }

  // Black magic maths
  let redirect = [...Array(list.length).keys()]
  for (scugCount of scugsCounts) {
    let openSpace = redirect.length
    let spacesToFill = scugCount.count * scugCount.scugs.length
    for (i = spacesToFill - 1; i >= 0; i--)
      list[redirect.splice(openSpace * i / spacesToFill, 1)[0]] = scugCount.scugs[i % scugCount.scugs.length]
  }
}

function spinSound() {
  let audioSpin = new Audio(audioSpinState ? '.\\Sfx\\Rain_tick.wav' : '.\\Sfx\\Rain_tock.wav');
  audioSpinQueue.push(audioSpin);
  audioSpin.addEventListener("ended", () => audioSpinQueue.shift());

  let p = audioSpin.play();
  p.catch(() => audioSpinQueue.pop());
  p.then(() => {
    for (audio of audioSpinQueue)
      audio.volume = 0.7 / Math.log(2.2 + audioSpinQueue.length * 0.5);
    audioSpinState = (audioSpinState + 1) % 2;
  });
}

function resultSound(sound) {
  if (sound == 1) {
    audioResult1.pause();
    audioResult1.currentTime = 0;
    audioResult1.play();
  } else if (sound == 2) {
    audioResult2.pause();
    audioResult2.currentTime = 0;
    audioResult2.play();
  } else if (sound == 3) {
    audioResult3.pause();
    audioResult3.currentTime = 0;
    audioResult3.play();
  }
}

function spinWheel() {
  theWheel.stopAnimation();
  clicked = true;
  theWheel.animation = RollAnimation;
  wheelSpinning = true;
  theWheel.startAnimation();
  document.getElementById("wheel").removeAttribute("onclick");
  const pointerAnimation = Animations[1 + Math.floor(Math.random() * (Animations.length - 1))];
  //const pointerAnimation = Animations[12];
  document.getElementById("over").setAttribute("class", pointerAnimation.pinPos);
  const pointerImg = document.createElement("img");
  pointerImg.id = "pointer-animation";
  pointerImg.src = pointerAnimation.animation + "?a=" + Math.random();
  theWheel.pointerAngle = PinInfos[pointerAnimation.pinPos].angle;
  setTimeout(() => {
    document.getElementById("canvas").after(pointerImg);
    pointerAnimation.audio.play();
  }, RollAnimation.duration * 1000 - pointerAnimation.timeToPin);
}

function scugSelection() {
  if (!clicked) {
    theWheel.rotationAngle = 0;
    theWheel.startAnimation();
    theWheel.draw(true)
  } else {
    resultSound(1);
    wheelSpinning = false;
    theWheel.stopAnimation(false);
    let chosenScug = (theWheel.getIndicatedSegment()).image.split('\\').pop().slice(0, -4);
    let scugData = getScugData(chosenScug)
    console.log(scugData)

    document.documentElement.style.setProperty('--scugColor', `${scugData.fillColor}`);


    if (backgroundBrightness(scugData.fillColor) == 'light') {
      document.getElementById("resultText").classList.add("textDark")
    } else { document.getElementById("resultText").classList.add("textLight") }

    document.getElementById("scugResult").src = scugData.image

    if (scugData.rotate) {
      document.getElementById("scugResult").style.transform = 'rotate(90deg)'
    } else { document.getElementById("scugResult").style.transform = 'rotate(0deg)' }

    document.getElementById("resultText").innerHTML = "Selected Character is <br/>" + chosenScug

    document.getElementById("pointer").style.top = "-52px";
    //document.getElementById("overlay").style.display = "block";
    document.getElementById("result").style.display = "flex";
    theWheel.stopAnimation(false);
  }
}

function selectionAdjust(originalStop) {
  let howBad = Math.round(Math.floor(Math.random() * 100) + 1)
  if (howBad > 10) {
    resultSound(2)
    let offset = Math.round(Math.floor((Math.random() * 41) + 10))
    return originalStop + (Math.random() < 0.5 ? -offset : offset)
  } else {
    resultSound(3)
    return -originalStop
  }
}

function closeResult() {
  document.getElementById("pointer").style.top = "354px"
  document.getElementById("overlay").style.display = "none";
  document.getElementById("result").style.display = "none";
  document.getElementById("resultText").classList.remove("textLight", "textDark");
}

function resetSpin() {
  if (document.getElementById("pointer-animation"))
    document.getElementById("pointer-animation").remove();
  theWheel.stopAnimation(false);
  theWheel.rotationAngle %= 360;
  IdleAnimation.rotationAngle = theWheel.rotationAngle;
  IdleAnimation.propertyValue = theWheel.rotationAngle + 360;
  theWheel.animation = IdleAnimation;
  theWheel.startAnimation();
  document.getElementById("wheel").setAttribute('onclick', "spinWheel()");
  clicked = false;
}

function drawOverWheel () {
  overWheel.rotationAngle = theWheel.rotationAngle;
  let canvas = document.getElementById("over").getContext("2d");
  canvas.clearRect(0, 0, 1000, 1000);
  overWheel.draw(false);
}

function resizeImageSegments(wheel) {
  for (var i = 1; i <= wheel.numSegments; i++) {
    let srcImage = imageProps(theWheel.segments[i].imgData.src)

    resizeImage(srcImage, wheel.segments[i].imgData, wheel.numSegments)
  }
}

function resizeImage(srcImage, segmentImage, num) {
  let maxWidth = getMaxWidth(num)
  let maxHeight = 170

  if (maxWidth <= srcImage.width && (maxHeight >= (srcImage.height * (maxWidth / srcImage.width)))) {
    segmentImage.width = maxWidth
    segmentImage.height = srcImage.height * (maxWidth / srcImage.width)
  }
  else {
    segmentImage.width = srcImage.width * (maxHeight / srcImage.height)
    segmentImage.height = maxHeight
  }
}

function imageProps(srcImage) {
  origImage = new Image()
  origImage.src = srcImage

  return origImage
}

function getMaxWidth(num) {
  //I can't believe I tricked myself into trig

  const pi = Math.PI;
  let radians = Math.floor(((360 / num) * pi / 180) * 100)
  let w = width / 2;
  let h = height / 2;
  let radius = h / 2

  let arcLength = (radians / 100) * radius

  let arcChord = Math.floor(2 * radius * Math.sin(arcLength / (2 * radius)))

  return arcChord
}

function getScugData(scug) {
  return Slugcats.find((element) => element.image.split('\\').pop().slice(0, -4) == scug)
}

function removeScug(scugName) {
  let scugSearch = wheelData.indexOf(scugName)

  if (scugSearch >= 0 && wheelData.length > 1) {
    wheelData.splice(scugSearch, 1)
    // apparently wheels have a phantom segment, so indexing starts at 1. Go figure.
    theWheel.deleteSegment(scugSearch + 1)
    if (enforceSpacing)
      spaceWheelSegments()
    resizeImageSegments(theWheel)
  }
}

function addScug(scugName) {
  wheelData.push(scugName)
  let scugData = getScugData(scugName)
  let newWheelSegment = theWheel.addSegment()

  newWheelSegment.image = scugData.image
  newWheelSegment.imgData = new Image();
  newWheelSegment.imgData.onload = winwheelLoadedImage;
  newWheelSegment.imgData.src = newWheelSegment.image

  if (enforceSpacing)
    spaceWheelSegments()

  resizeImageSegments(theWheel)
}

function spaceWheelSegments() {
  spaceListElements(wheelData)
  for (i = theWheel.numSegments - 1; i >= 1; i--) {
    theWheel.deleteSegment(i)
  }
  for (i = 0; i < wheelData.length; i++) {
    let scugData = getScugData(wheelData[i])
    let newWheelSegment = theWheel.addSegment()

    newWheelSegment.image = scugData.image
    newWheelSegment.imgData = new Image();
    newWheelSegment.imgData.onload = winwheelLoadedImage;
    newWheelSegment.imgData.src = newWheelSegment.image

  }
  theWheel.deleteSegment(1)
}

// returns either 'light' or 'dark'
// 'light' if black text has better readability on the given background color
// 'dark' if white text has better readability on the given background color
// https://colorjs.io/docs/contrast#accessible-perceptual-contrast-algorithm-apca
function backgroundBrightness(color) {
  const backgroundColor = new Color(color)
  const blackText = new Color('#000000')
  const whiteText = new Color('#FFFFFF')

  const darkContrast = Math.abs(backgroundColor.contrastAPCA(whiteText))
  const lightContrast = Math.abs(backgroundColor.contrastAPCA(blackText))

  return darkContrast > lightContrast ? 'dark' : 'light'
}
