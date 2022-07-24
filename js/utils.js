import { getPlayAgainButton, getTimerElement } from './selectors.js'

function shuffle(arr) {
  if (!Array.isArray(arr) || arr.length < 2) return arr
  for (let index = arr.length - 1; index > 1; index--) {
    const j = Math.floor(Math.random() * index)

    let temp = arr[index]
    arr[index] = arr[j]
    arr[j] = temp
  }
}

export const getRandomColorPairs = (count) => {
  // receive count --> return count * 2 random colors
  // using lib: https://github.com/davidmerfield/randomColor
  const colorList = []
  const hueList = ['red', 'orange', 'yellow', 'green', 'blue', 'purple', 'pink', 'monochrome']

  //random "count" colors
  for (let index = 0; index < count; index++) {
    //random Color function is provided by https://github.com/davidmerfield/randomColor
    const color = window.randomColor({
      luminosity: 'dark',
      hue: hueList[index % hueList.length],
    })
    colorList.push(color)
  }
  // double current color list
  const fullColorList = [...colorList, ...colorList]

  shuffle(fullColorList)
  return fullColorList
}

export function showPlayAgainButton() {
  const playAgainButton = getPlayAgainButton()
  if (playAgainButton) playAgainButton.classList.add('show')
}

export function hidePlayAgainButton() {
  const playAgainButton = getPlayAgainButton()
  if (playAgainButton) playAgainButton.classList.remove('show')
}

export function setTimerText(text) {
  const timerElement = getTimerElement()
  if (timerElement) timerElement.textContent = text
}

export function createTimer({ seconds, onChange, onFinish }) {
  let intervalId = null

  function start() {
    clear()
    let currentSecond = seconds

    intervalId = setInterval(() => {
      onChange?.(currentSecond)

      currentSecond--
      if (currentSecond < 0) {
        clear()
        onFinish?.()
      }
    }, 1000)
  }
  function clear() {
    clearInterval(intervalId)
  }

  return {
    start,
    clear,
  }
}
