import { STATUS, DIFFICULTY } from '@/constants'

export default class Game {
  constructor() {
    this.status = STATUS.NEW
    this.computerSequence = []
    this.playerSequence = []
    this.items = 4
    this.interval = 1500
    this.round = 0
    this.latestRound = 0
  }
  
  setDifficulty(key) {
    this.interval = DIFFICULTY[key]
  }

  upPlayerSequence(value) {
    this.playerSequence.push(value)
    this.loop()
  }

  checkSequence() {
    const playerSequenceLength = this.playerSequence.length
    const cuttedComputerSequence = this.computerSequence.slice(0, playerSequenceLength)
    const sequenceList = cuttedComputerSequence.filter((sequence, index) => {
      return this.playerSequence[index] !== sequence
    })

    return !sequenceList.length
  }

  upComputerSequence() {
    this.computerSequence.push(this.createRandomNumber())
  }

  createRandomNumber() {
    return Math.round(Math.random() * 0.3 * 10)
  }

  startGame() {
    if (this.status !== STATUS.PROCESS) {
      this.status = STATUS.PROCESS
      this.round += 1
      
    }
  }

  loop() {
    if (this.checkSequence()) {
      if (this.computerSequence.length === this.playerSequence.length) {
        this.playerSequence = []
        this.round += 1
      }
    } else {
      this.status = STATUS.LOSE
      this.playerSequence = []
      this.computerSequence = []
      this.latestRound = this.round
      this.round = 0
    }
  }
}