<template>
  <div id="app">
    <div class="container">
    <h1>Саймон говорит</h1>
      <div class="simon">
        <ul ref="field" class="field" :class="{disabled: !isFieldEnabled}">
          <li 
            v-for="(item, index) in game.items" 
            :key="item" 
            @click="handleClick($event, index)" 
            class="field-item"
            :class="getClassName(index) "
          />
        </ul>
      </div>
      <div class="game-info">
        <h2>Раунд: <span >{{ game.round }}</span></h2>
        <button @click="game.startGame()">Начать</button>
        <p v-if="STATUS.LOSE === game.status">
          Ты проиграл спустя
          <span>
            {{game.latestRound}}  
          </span>
          раунд
        </p>
      </div>
      <div class="game-options">
        <h2>Выберете сложность</h2>
        <input 
          type="radio" 
          name="difficulty"  
          value="EASY" 
          checked=""
          @input="setGameDifficulty($event)"
        >Легкая<br>
        <input 
          type="radio" 
          name="difficulty" 
          value="NORMAL"
          @input="setGameDifficulty($event)"
        >Средняя<br>
        <input 
          type="radio" 
          name="difficulty" 
          value="HARD"
          @input="setGameDifficulty($event)"
          >Хардкор<br>
      </div>
    </div>
  </div>
</template>

<script>
import Game from '@/game'
import { STATUS, DELAY } from '@/constants'
import { sleep, asyncRemoveActiveClass, asyncAddActiveClass } from "@/utils"
import sound0 from '@/sounds/0.ogg'
import sound1 from '@/sounds/1.ogg'
import sound2 from '@/sounds/2.ogg'
import sound3 from '@/sounds/3.ogg'

export default {
  name: 'App',
  data: () => ({
    STATUS,
    game: new Game(),
    isFieldEnabled: true,
    sounds: [
      sound0,
      sound1,
      sound2,
      sound3,
    ]
  }),
  methods: {
    async playSound(index) {
      const audio = new Audio(this.sounds[index]);
      audio.play();
    },
    async disableField () {
      this.isFieldEnabled = false
    },
    async enableField () {
      this.isFieldEnabled = true
    },
    setGameDifficulty(event) {
      const difficultyKey = event.target.value
      this.game.setDifficulty(difficultyKey)
    },
    async showSequence() {
      const fieldNodes = this.$refs.field.childNodes
      const gameInterval = this.game.interval
      const computerSequence = this.game.computerSequence

      await sleep(DELAY);
      for (let index = 0; index < computerSequence.length; index++) {
        if (this.game.status === STATUS.LOSE) {
          return
        }

        await this.playSound(computerSequence[index])
        await this.disableField()
        await asyncAddActiveClass(fieldNodes, computerSequence[index])
        await sleep(gameInterval);
        await asyncRemoveActiveClass(fieldNodes, computerSequence[index])
        await sleep(DELAY);
        await this.enableField()
      }
    },
    handleClick($event, value) {
      if (STATUS.PROCESS === this.game.status && this.isFieldEnabled) {
        this.game.upPlayerSequence(value)
        this.playSound(value)
      }
    },
    getClassName(value) {
      switch(value) {
        case 0:
          return 'red'
        case 1:
          return 'blue'
        case 2:
          return 'yellow'
        case 3:
          return 'green'
      }
    }
  },
  watch: {
    'game.round' () {
        this.game.upComputerSequence()
        this.showSequence()
      },
  }
}
</script>

<style>
* {
  box-sizing: border-box;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

.container {
  width: 630px;
  margin: 0 auto;
}

.field.disabled{
  cursor: not-allowed;
}

h1 {    
  margin: 1em 0 2em;
  text-align: center;
}

.simon {
  background: #fff;
  position: relative;
  float: left;
  margin-right: 3em;
  width: 300px;
  height: 300px;
  border-radius: 150px 150px 150px 150px;
  box-shadow: 2px 1px 12px #aaa;
}

ul, li {
  padding: 0;
  margin: 0;
}


.field-item:hover {
  border: 2px solid black;
} 

.field-item:active{
  border: 2px solid rebeccapurple;
  opacity: 1;
}

.red, .blue, .yellow, .green {
  opacity: 0.4;
  height: 300px;
  -webkit-border-radius: 150px 150px 150px 150px;
  border-radius: 150px 150px 150px 150px;
  position: absolute;
  text-indent: 10000px;
}

.field-item.active {
    opacity: 1;
}

.red {
  background: #FF5643;
  clip: rect(0px, 300px, 150px, 150px);
  width: 300px;
}

.blue {
  background: dodgerblue;
  clip: rect(0px, 150px, 150px, 0px);
  width: 300px;
}

.yellow {
  background: #FEEF33;
  clip: rect(150px, 150px, 300px, 0px);
  width: 300px;
}

.green {
  background: #BEDE15;
  clip: rect(150px,300px, 300px, 150px);
  width: 300px;
}

.game-info {
  margin-top: 90px;
}

.game-info button {
  width: 5em;
  box-sizing: border-box;
  font-size: 1.4em;
  -webkit-border-radius: 10px 10px 10px 10px;
  border-radius: 10px 10px 10px 10px;
  background: #6DABE8;
  border: none;
  padding: 0.3em 0.6em;
}

p[data-action="lose"] {
  display: none;
}

.game-options h2 {
  margin-top: 30px;
  margin-bottom: 0;
}

.game-options input[type="radio"] {
    margin-right: 10px;
}
</style>
