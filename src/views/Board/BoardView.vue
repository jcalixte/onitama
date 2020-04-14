<template>
  <div class="board-view" v-if="board">
    <hr v-if="!playersSet" />
    <div class="columns is-centered" v-if="!playersSet">
      <div class="column is-half">
        <BoardShare />
      </div>
    </div>
    <br />
    <div class="columns card-board">
      <div class="column">
        <h5 class="subtitle is-5 card-owner">Player 2's cards</h5>
        <BoardCard :player="player2" />
      </div>
    </div>
    <div class="columns play-board">
      <div class="column is-half neutral-card-column" v-if="isPlayer1">
        <h5 class="subtitle is-5 card-owner">Neutral card</h5>
        <BoardCard player="neutral" />
      </div>
      <div class="column is-half">
        <h3 v-if="winnerLabel" class="subtitle is-3">
          {{ winnerLabel }} wins!
        </h3>
        <h3 v-else-if="turn" class="subtitle is-4">{{ turnLabel }}'s turn</h3>
        <BoardHistory />
        <BoardGrid />
      </div>
      <div class="column is-half neutral-card-column" v-if="!isPlayer1">
        <h5 class="subtitle is-5 card-owner">Neutral card</h5>
        <BoardCard player="neutral" />
      </div>
    </div>
    <div class="columns card-board">
      <div class="column">
        <h5 class="subtitle is-5 card-owner">Player 1's cards</h5>
        <BoardCard :player="player1" />
      </div>
    </div>
    <BoardEffect />
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
    BoardEffect
  }
})
export default class BoardView extends Vue {
  @Prop({ type: String, required: true })
  private id!: string
  @Getter
  private board!: Board | null
  @Getter
  private winner!: Player | null
  @Getter
  private turn!: Player | null
  @Getter
  private playersSet!: boolean
  @Getter
  private isPlayer1!: boolean
  @Getter
  private isPlayer2!: boolean
  @Action
  private joinBoard!: (id: string) => Promise<void>
  @Action
  private updateBoard!: (board: Board) => Promise<void>

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
@import '@/styles/variables';

.board-view {
  .neutral-card-column {
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
  .card-owner {
    font-style: italic;
    text-align: left;
    text-decoration: underline;
    color: $primary;
  }
  .play-board {
    margin: 15px 0;
    background-color: #d7ccc8;
  }
}
</style>
