<template>
  <div class="board-review" v-if="board">
    <h1 class="title is-1">{{ name }}</h1>
    <h2 class="subtitle is-2" v-if="winnerLabel">{{ winnerLabel }} wins</h2>
    <h3 class="subtitle is-3">
      {{ new Date(board.date).toLocaleDateString() }}
    </h3>
    <BoardGrid />
    <hr />
    <div class="columns">
      <div class="column">
        <nav
          class="pagination is-centered"
          role="navigation"
          aria-label="pagination"
        >
          <a
            class="pagination-previous"
            @click="goTo(current - 1)"
            :disabled="current === -1"
            >previous</a
          >
          <a
            class="pagination-next"
            @click="goTo(current + 1)"
            :disabled="current === board.turns.length - 1"
            >next</a
          >
          <ul class="pagination-list">
            <li>
              <a
                class="pagination-link"
                :class="{ 'is-current': -1 === current }"
                :aria-label="`Goto turn 0`"
                @click.prevent="goTo(-1)"
              >
                initial
              </a>
            </li>
            <li v-for="(turn, t) in board.turns" :key="t">
              <a
                class="pagination-link"
                :class="{ 'is-current': t === current }"
                :aria-label="`Goto turn ${t}`"
                @click.prevent="goTo(t)"
              >
                {{ t + 1 }} –
                {{ turn.animal }}
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { Action, Getter } from 'vuex-class'
import { players } from '@/data/players'
import { Player } from '@/enums/Player'
import { Board } from '@/models/Board'
import { repository } from '@/services/repository'
import {
  rewindMovePiece,
  initFromBoard,
  getWinner
} from '@/services/board.service'
import BoardGrid from '@/components/Board/BoardGrid.vue'

@Component({
  components: {
    BoardGrid
  }
})
export default class BoardReview extends Vue {
  @Prop({ type: String, required: true })
  private id!: string
  @Action
  private reviewBoard!: (board: Board) => void
  @Getter
  private board!: Board | null
  private current = -1
  private winner: Player | null = null

  private get winnerLabel() {
    if (!this.winner) {
      return null
    }
    return players[this.winner]
  }

  private async mounted() {
    const board = await repository.get(this.id)
    if (board) {
      this.winner = getWinner(board)
      this.reviewBoard(initFromBoard(board))
    }
  }

  private goTo(toTurn: number) {
    if (!this.board) {
      return
    }
    if (toTurn < -1 || toTurn > this.board.turns.length - 1) {
      return
    }
    const newBoard = rewindMovePiece(this.current, toTurn, this.board)
    if (newBoard) {
      this.reviewBoard(newBoard)
      this.current = toTurn
    }
  }

  private get name() {
    if (!this.board) {
      return null
    }
    return this.board.animals.join(', ')
  }
}
</script>

<style scoped lang="scss">
@import '../../styles/variables';

.board-review {
  a.is-current {
    background-color: $primary;
    border-color: $primary;
  }
}
</style>