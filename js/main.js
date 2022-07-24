import { GAME_STATUS, GAME_TIME, PAIRS_COUNT } from './constants.js'
import {
  getColorElement,
  getColorElementList,
  getPlayAgainButton,
  getInActiveColorList,
  getColorBackground,
} from './selectors.js'
import {
  getRandomColorPairs,
  hidePlayAgainButton,
  setTimerText,
  showPlayAgainButton,
  createTimer,
} from './utils.js'

// Global variables
let selections = []
let gameStatus = GAME_STATUS.PLAYING
let timer = createTimer({
  seconds: GAME_TIME,
  onChange: handleTimerChange,
  onFinish: handleTimerFinish,
})

function handleTimerFinish() {
  //end game
  gameStatus = GAME_STATUS.FINISHED
  setTimerText('Game Over')
  showPlayAgainButton()
}

function handleTimerChange(second) {
  const fullSecond = `0${second}`.slice(-2) + 's'
  setTimerText(fullSecond)
}

// TODOs
// 1. Generating colors using https://github.com/davidmerfield/randomColor
// 2. Attach item click for all li elements
// 3. Check win logic
// 4. Add timer
// 5. Handle replay click
// console.log(getRandomColorPairs(PAIRS_COUNT))

//handleColorClick 1
//handleColorClick 2
//handleColorClick 3
// setTimeout 2--> reset selections
// setTimeout 3--> errors here

function handleColorClick(liElement) {
  const shouldBlockClick = [GAME_STATUS.BLOCKING, GAME_STATUS.FINISHED].includes(gameStatus)
  const isClicked = liElement.classList.contains('active')
  if (!liElement || isClicked || shouldBlockClick) return

  liElement.classList.add('active')

  selections.push(liElement)
  if (selections.length < 2) return

  //check match
  const firstColor = selections[0].dataset.color
  const secondColor = selections[1].dataset.color
  const isMatch = firstColor === secondColor

  if (isMatch) {
    const colorBackground = getColorBackground()
    if (colorBackground) colorBackground.style.backgroundColor = selections[0].dataset.color
    //check win
    // console.log(getInActiveColorList().length)
    const isWin = getInActiveColorList().length === 0
    if (isWin) {
      //show replay
      showPlayAgainButton()
      //show You Win
      setTimerText('YOU WIN!')
      timer.clear()
      gameStatus = GAME_STATUS.FINISHED
    }

    selections = []
    return
  }

  gameStatus = GAME_STATUS.BLOCKING
  //in case of not match
  //remove active class for 2 li element

  setTimeout(() => {
    selections[0].classList.remove('active')
    selections[1].classList.remove('active')

    //reset selections for the next turn
    selections = []

    //race-condition check with handleTimerFins
    if (gameStatus !== GAME_STATUS.FINISHED) {
      gameStatus = GAME_STATUS.PLAYING
    }
  }, 500)
}

function initColors() {
  //random 8 pairs of colors
  const colorList = getRandomColorPairs(PAIRS_COUNT)
  //bind ti li >div.overlay
  const liList = getColorElementList()
  liList.forEach((liElement, index) => {
    liElement.dataset.color = colorList[index]

    const overlayElement = liElement.querySelector('.overlay')
    if (overlayElement) overlayElement.style.backgroundColor = colorList[index]
  })
}

function attachEventForColorList() {
  const ulElement = getColorElement()
  if (!ulElement) return

  ulElement.addEventListener('click', (event) => {
    // console.log(event.target)
    let li = event.target.closest('li') // (1)

    if (!li) return // (2)

    if (!ulElement.contains(li)) return

    handleColorClick(li)
  })
}

function resetGame() {
  //reset global vars
  gameStatus = GAME_STATUS.PLAYING
  selections = []

  //reset DOM elements
  // -remove active class from li
  //-hide replay button
  // clear you win /timeout text
  const colorElementList = getColorElementList()
  for (const colorElement of colorElementList) {
    colorElement.classList.remove('active')
  }

  hidePlayAgainButton()
  setTimerText('')

  //re-generate new colors
  initColors()

  startTimer()
}

function attachEventForPlayAgainButton() {
  const playAgainButton = getPlayAgainButton()

  if (!playAgainButton) return

  playAgainButton.addEventListener('click', resetGame)
}

function startTimer() {
  timer.start()
}

//main
;(() => {
  initColors()
  attachEventForColorList()

  attachEventForPlayAgainButton()
  startTimer()
})()
