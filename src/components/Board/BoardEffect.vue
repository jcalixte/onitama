<template>
  <div class="board-effect">
    <div class="modal" :class="{ 'is-active': openIntroModal && isFirstTurn }">
      <div class="modal-background"></div>
      <div class="modal-card">
        <section class="modal-card-body intro-body">{{ intro }}</section>
        <footer class="modal-card-foot">
          <button @click="openIntroModal = false" class="button">ok</button>
        </footer>
      </div>
    </div>
    <div class="modal" :class="{ 'is-active': openModal }">
      <div class="modal-background"></div>
      <div class="modal-card">
        <section
          v-if="won"
          class="modal-card-body win-content"
          :style="winStyle"
        >
          You win!
        </section>

        <section v-else-if="lost" class="modal-card-body">
          You lose.
        </section>

        <section v-else class="modal-card-body">
          Play ended. {{ winnerLabel }} wins
        </section>

        <footer v-if="userPlayer" class="modal-card-foot">
          <BoardNew />
          <button @click="openModal = false" class="button">ok</button>
        </footer>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import { Getter } from 'vuex-class'
import { Player } from '@/enums/Player'
import { players } from '@/data/players'
import BoardNew from '@/components/Board/BoardNew.vue'
import { MovePiece } from '@/models/MovePiece'

@Component({
  components: {
    BoardNew
  }
})
export default class BoardEffect extends Vue {
  @Getter
  private turns!: MovePiece[]
  @Getter
  private turn!: Player
  @Getter
  private userPlayer!: Player | null
  @Getter
  private isPlayer1!: boolean
  @Getter
  private isPlayer2!: boolean
  @Getter
  private winner!: Player | null
  private moveSound = new Audio(require('@/assets/sounds/move.mp3'))
  private victorySound = new Audio(require('@/assets/sounds/victory.mp3'))
  private defaultSound = new Audio(require('@/assets/sounds/default.mp3'))
  private openIntroModal = true
  private openModal = false

  private get isFirstTurn() {
    const firstTurns = [0, 1]
    return firstTurns.includes(this.turns.length)
  }

  private get intro() {
    switch (true) {
      case this.isPlayer1:
        return `You are player 1. You are an old wise emperor with his blue soldiers.`
      case this.isPlayer2:
        return `You are player 2. You are a young vigorous emperor with his red soldiers.`
      default:
        return `you are a spectator in this game.`
    }
  }

  private get won() {
    return this.winner && this.winner === this.userPlayer
  }

  private get lost() {
    return this.winner && this.userPlayer && this.winner !== this.userPlayer
  }

  private get winStyle() {
    return { backgroundColor: this.userPlayer }
  }

  private get winnerLabel() {
    if (!this.winner) {
      return null
    }
    return players[this.winner]
  }

  @Watch('turn')
  private onTurnChange() {
    this.moveSound.play()
  }

  @Watch('winner')
  private onWinnerChange(winner: Player | null) {
    if (!winner) {
      return
    }
    this.openModal = true
    if (winner === this.userPlayer) {
      this.victorySound.play()
    } else {
      this.defaultSound.play()
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../styles/variables';

.modal {
  .intro-body {
    font-family: 'Charmonman', cursive;
  }
  .modal-card-body {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 300px;
    font-size: 40px;
    border-radius: 5px 5px 0 0;
  }
  .win-content {
    color: white;
  }
  .lose-content {
    color: black;
  }
  .modal-card-foot {
    justify-content: flex-end;
  }
}
</style>
