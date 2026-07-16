//Use the name of the scug, segments will be made in written order.
//Duplicates are allowed. Minimum 1 segment.

const defaultWheel = [
  "Spearmaster",
  "Artificer",
  "Hunter",
  "Gourmand",
  "Survivor",
  "Monk",
  "Rivulet",
  "Saint",
  "Watcher"
]

//Load array to global variable so that it can be accessed by main JS
addEventListener('load', () => {
 window.defaultWheel = defaultWheel
})