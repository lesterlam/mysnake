document.addEventListener('DOMContentLoaded', () => {
  const squares = document.querySelectorAll('.grid div')
  const scoreDisplay = document.querySelector('#score')
  const startBtn = document.querySelector('.start')
  const pauseBtn = document.querySelector('.pause')
  const resumeBtn = document.querySelector('.resume')
  const restartBtn = document.querySelector('.restart')

  const width = 10
  let currentIndex = 0 //so first div in our grid
  let heartIndex = 0 //so first div in our grid
  let currentSnake = [2, 1, 0] // so the 3rd div in our grid being 2 (or the HEAD), and 0 being the end (TAIL, with all 1's being the body fro now on)
  let direction = 1
  let headRotation = 'rotate(90deg)'
  let score = 0
  let speed = 0.9
  let intervalTime = 0
  let interval = 0


  //to start, and restart the game
  function startGame() {
    squares.forEach(function(e) {
      e.removeAttribute('class')
    })
    clearInterval(interval)
    score = 0
    randomheart()
    direction = 1
    headRotation = 'rotate(90deg)'
    scoreDisplay.innerText = score
    intervalTime = 1000
    currentSnake = [2, 1, 0]
    currentIndex = 0
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
    document.removeEventListener('keyup', control)
  }

  function enableControl() {
    document.addEventListener('keyup', control)
  }


  //function that deals with ALL the ove outcomes of the Snake
  function moveOutcomes() {

    //deals with snake hitting border and snake hitting self
    if (
      (currentSnake[0] + width >= (width * width) && direction === width) || //if snake hits bottom
      (currentSnake[0] % width === width - 1 && direction === 1) || //if snake hits right wall
      (currentSnake[0] % width === 0 && direction === -1) || //if snake hits left wall
      (currentSnake[0] - width < 0 && direction === -width) ||  //if snake hits the top
      squares[currentSnake[0] + direction].classList.contains('snake') //if snake goes into itself
    ) {
      disableControl()
      enableButton(restartBtn)
      return clearInterval(interval) //this will clear the interval if any of the above happen
    }

    const tail = currentSnake.pop() //removes last ite of the array and shows it
    squares[tail].classList.remove('snake')  //removes class of snake from the TAIL
    currentSnake.unshift(currentSnake[0] + direction) //gives direction to the head of the array

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
    squares[currentSnake[0]].classList.add('snake')
    squares[currentSnake[1]].classList.remove('snakehead')
    squares[currentSnake[1]].style.transform = null
    squares[currentSnake[0]].classList.add('snakehead')
    squares[currentSnake[0]].style.transform = headRotation
  }


  //generate new heart once heart is eaten
  function randomheart() {
    do {
      heartIndex = Math.floor(Math.random() * squares.length)
    } while (squares[heartIndex].classList.contains('snake')) //making sure hearts dont appear on the snake
    squares[heartIndex].classList.add('heart')
  }


  //assign functions to keycodes
  function control(e) {
    squares[currentIndex].classList.remove('snake') //we are removing the class of snake from ALL the squares.

    if (e.keyCode === 39) {
      direction = 1 //if we press the right arrow on our keyboard, the snake will go right one
      headRotation = 'rotate(90deg)'
    } else if (e.keyCode === 38) {
      direction = -width // if we press the up arrow, the snake will go back ten divs, appearing to go up
      headRotation = 'rotate(0deg)'
    } else if (e.keyCode === 37) {
      direction = -1 // if we press left, the snake will go left one div
      headRotation = 'rotate(-90deg)'
    } else if (e.keyCode === 40) {
      direction = +width //if we press down, the snake head will instantly appear in the div ten divs from where you are now
      headRotation = 'rotate(180deg)'
    }
    squares[currentSnake[0]].style.transform = headRotation
  }

  startBtn.addEventListener('click', startGame)
  pauseBtn.addEventListener('click', pauseGame)
  resumeBtn.addEventListener('click', resumeGame)
  restartBtn.addEventListener('click', startGame)

  enableButton(startBtn)

})
