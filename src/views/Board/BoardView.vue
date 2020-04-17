<template>
  <div class="board-view" v-if="board" :key="id">
    <router-link
      v-if="winner"
      class="button is-primary is-light"
      :to="{ name: 'BoardReview', params: { id: board._id } }"
    >
      review
    </router-link>
    <hr v-if="!playersSet && !(playAgainstAI || trainAI)" />
    <div
      class="columns is-centered"
      v-if="!playersSet && !(playAgainstAI || trainAI)"
    >
      <div class="column is-half">
        <BoardShare
          @play-against-ai="playAgainstAI = true"
          @train-ai="trainAI = true"
        />
      </div>
    </div>
    <div
      class="columns is-centered"
      v-if="winner && !(playAgainstAI || trainAI)"
    >
      <div class="column is-half">
        <BoardRevenge />
      </div>
    </div>
    <br />
    <div class="columns card-board">
      <div class="column">
        <BoardCard :player="player2" />
      </div>
    </div>
    <div class="columns play-board">
      <div class="column is-half neutral-card-column" v-if="isPlayer1">
        <BoardCard player="neutral" />
      </div>
      <div class="column is-half">
        <h3 v-if="winnerLabel" class="subtitle is-3">
          {{ winnerLabel }} wins!
        </h3>
        <h3 v-else-if="turn" class="subtitle is-4">{{ turnLabel }}'s turn</h3>
        <BoardHistory />
        <BoardGrid
          :play-against-a-i="playAgainstAI"
          :train-a-i="trainAI"
          :key="id"
        />
      </div>
      <div class="column is-half neutral-card-column" v-if="!isPlayer1">
        <h5 class="subtitle is-5 card-owner">Neutral card</h5>
        <BoardCard player="neutral" />
      </div>
    </div>
    <div class="columns card-board">
      <div class="column">
        <BoardCard :player="player1" />
      </div>
    </div>
    <BoardEffect :display-modal="!trainAI" />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { Getter, Action } from 'vuex-class'
import BoardNew from '@/components/Board/BoardNew.vue'
import BoardHistory from '@/components/Board/BoardHistory.vue'
import BoardGrid from '@/components/Board/BoardGrid.vue'
import BoardCard from '@/components/Board/BoardCard.vue'
import BoardShare from '@/components/Board/BoardShare.vue'
import BoardRevenge from '@/components/Board/BoardRevenge.vue'
import BoardEffect from '@/components/Board/BoardEffect.vue'
import { Board } from '@/models/Board'
import { Player } from '@/enums/Player'
import { players } from '@/data/players'
import { busService } from '@/services/bus.service'

@Component({
  components: {
    BoardNew,
    BoardHistory,
    BoardGrid,
    BoardCard,
    BoardShare,
    BoardRevenge,
    BoardEffect
  }
})
export default class BoardView extends Vue {
  @Prop({ type: String, required: true })
  private id!: string
  @Getter
  private readonly board!: Board | null
  @Getter
  private readonly winner!: Player | null
  @Getter
  private readonly turn!: Player | null
  @Getter
  private readonly playersSet!: boolean
  @Getter
  private readonly isPlayer1!: boolean
  @Getter
  private readonly isPlayer2!: boolean
  @Action
  private joinBoard!: (id: string) => Promise<void>
  @Action
  private updateBoard!: (board: Board) => Promise<void>

  private playAgainstAI = false
  private trainAI = false

  private player1 = Player.Player1
  private player2 = Player.Player2

  private async mounted() {
    await this.joinBoard(this.id)
    busService.on('update', this.update)
  }

  private beforeDestroy() {
    busService.off('update', this.update)
  }

  private update(board: Board) {
    this.updateBoard(board)
  }

  private get winnerLabel() {
    if (!this.winner) {
      return null
    }
    return players[this.winner]
  }

  private get userPlayer() {
    if (this.isPlayer1) {
      return players[Player.Player1]
    }
    if (this.isPlayer2) {
      return players[Player.Player2]
    }
    return 'spectator'
  }

  private get turnLabel() {
    if (!this.turn) {
      return null
    }
    return players[this.turn]
  }
}
</script>

<style scoped lang="scss">
.board-view {
  .neutral-card-column {
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
  .play-board {
    margin: 15px 0;
    background-color: #d7ccc8;
  }
}
</style>
