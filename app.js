// reviewed in 2020
document.addEventListener('DOMContentLoaded', () => {
  const squares = document.querySelectorAll('.grid div')
  const scoreDisplay = document.querySelector('#score')
  const startBtn = document.querySelector('.start')
  const pauseBtn = document.querySelector('.pause')
  const resumeBtn = document.querySelector('.resume')
  const restartBtn = document.querySelector('.restart')

  const width = 10
  let heartIndex = 0 //so first div in our grid
  let currentSnake = [2, 1, 0] // so the 3rd div in our grid being 2 (or the HEAD), and 0 being the end (TAIL, with all 1's being the body fro now on)
  let dirVal = 1
  let headRotation = 'rotate(90deg)'
  let score = 0
  let speed = 0.9
  let intervalTime = 0
  let interval = 0
  let joyInterval = 0
  let direction = 'E'


  //to start, and restart the game
  function startGame() {
    squares.forEach(function (e) {
      e.removeAttribute('class')
    })
    clearInterval(interval)
    score = 0
    randomheart()
    dirVal = 1
    headRotation = 'rotate(90deg)'
    scoreDisplay.innerText = score
    intervalTime = 1000
    currentSnake = [2, 1, 0]
    direction = 'E'
    currentSnake.forEach(index => squares[index].classList.add('snake'))
    squares[currentSnake[0]].classList.add('snakehead')
    squares[currentSnake[0]].style.transform = headRotation
    interval = setInterval(moveOutcomes, intervalTime)

    // Enable Control
    enableControl()

    // Change button to pause game
    enableButton(pauseBtn)
  }

  // enable button
  function enableButton(target) {
    startBtn.style.display = 'none'
    pauseBtn.style.display = 'none'
    resumeBtn.style.display = 'none'
    restartBtn.style.display = 'none'
    target.style.display = 'inline-block'
  }

  //pause game
  function pauseGame() {
    clearInterval(interval)
    disableControl()
    enableButton(resumeBtn)
  }

  //resume game
  function resumeGame() {
    enableControl()
    interval = setInterval(moveOutcomes, intervalTime)
    enableButton(pauseBtn)
  }

  function disableControl() {
    document.removeEventListener('keydown', control)
    clearInterval(joyInterval)
  }

  function enableControl() {
    document.addEventListener('keydown', control)
    joyInterval = setInterval(readJoyStick, 50)
  }


  //function that deals with ALL the ove outcomes of the Snake
  function moveOutcomes() {

    //deals with snake hitting border and snake hitting self
    if (
      (currentSnake[0] + width >= (width * width) && dirVal === width) || //if snake hits bottom
      (currentSnake[0] % width === width - 1 && dirVal === 1) || //if snake hits right wall
      (currentSnake[0] % width === 0 && dirVal === -1) || //if snake hits left wall
      (currentSnake[0] - width < 0 && dirVal === -width) ||  //if snake hits the top
      squares[currentSnake[0] + dirVal].classList.contains('snake') //if snake goes into itself
    ) {
      disableControl()
      enableButton(restartBtn)
      return clearInterval(interval) //this will clear the interval if any of the above happen
    }

    const tail = currentSnake.pop() //removes last ite of the array and shows it
    squares[tail].classList.remove('snake')  //removes class of snake from the TAIL
    currentSnake.unshift(currentSnake[0] + dirVal) //gives dirVal to the head of the array

    squares[currentSnake[0]].classList.add('snake')
    squares[currentSnake[1]].classList.remove('snakehead')
    squares[currentSnake[1]].style.transform = null
    squares[currentSnake[0]].classList.add('snakehead')
    squares[currentSnake[0]].style.transform = headRotation

    //deals with snake getting heart
    if (squares[currentSnake[0]].classList.contains('heart')) {
      squares[currentSnake[0]].classList.remove('heart')
      squares[tail].classList.add('snake')
      currentSnake.push(tail)
      randomheart()
      score++
      scoreDisplay.textContent = score
      clearInterval(interval)
      intervalTime = intervalTime * speed
      interval = setInterval(moveOutcomes, intervalTime)
    }
  }


  //generate new heart once heart is eaten
  function randomheart() {
    do {
      heartIndex = Math.floor(Math.random() * squares.length)
    } while (squares[heartIndex].classList.contains('snake')) //making sure hearts dont appear on the snake
    squares[heartIndex].classList.add('heart')
  }

  //set dirVal
  function setDirection(d) {
    switch (d) {
      case 'N':
        dirVal = -width // if we press the up arrow, the snake will go back ten divs, appearing to go up
        headRotation = 'rotate(0deg)'
        break
      case 'E':
        dirVal = 1 //if we press the right arrow on our keyboard, the snake will go right one
        headRotation = 'rotate(90deg)'
        break
      case 'S':
        dirVal = +width //if we press down, the snake head will instantly appear in the div ten divs 
        headRotation = 'rotate(180deg)'
        break
      case 'W':
        dirVal = -1 // if we press left, the snake will go left one div
        headRotation = 'rotate(-90deg)'
        break
    }
    squares[currentSnake[0]].style.transform = headRotation
  }

  //assign functions to keycodes
  function control(e) {

    if (e.keyCode === 39) {
      direction = 'E'
    } else if (e.keyCode === 38) {
      direction = 'N'
    } else if (e.keyCode === 37) {
      direction = 'W'
    } else if (e.keyCode === 40) {
      direction = 'S'
    }
    setDirection(direction)

  }

  //read JoyStick dirVal
  function readJoyStick() {
    let xyDiff = Math.abs(Joy1.GetX()) - Math.abs(Joy1.GetY())
    if (xyDiff > 0) {
      if (Joy1.GetX() > 0) {
        direction = 'E'
      } else {
        direction = 'W'
      }
    } else if (xyDiff < 0) {
      if (Joy1.GetY() > 0) {
        direction = 'N'
      } else {
        direction = 'S'
      }
    }
    setDirection(direction)
  }

  startBtn.addEventListener('click', startGame)
  pauseBtn.addEventListener('click', pauseGame)
  resumeBtn.addEventListener('click', resumeGame)
  restartBtn.addEventListener('click', startGame)

  enableButton(startBtn)

  // Create JoyStick object into the DIV 'joy1Div'
  const Joy1 = new JoyStick('joy1Div');


})
