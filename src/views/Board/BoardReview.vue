<template>
  <div class="board-review" v-if="board">
    <h1 class="title is-1">{{ name }}</h1>
    <h2 class="subtitle is-2" v-if="winnerLabel">{{ winnerLabel }} wins</h2>
    <router-link v-else :to="{ name: 'Board', params: { id } }">
      play
    </router-link>
    <h3 class="subtitle is-3">
      {{ new Date(board.date).toLocaleDateString() }}
    </h3>
    <div class="columns is-centered is-vcentered">
      <div class="column">
        <BoardCard :player="player2" :full="false" />
      </div>
      <div class="column">
        <div class="columns is-gapless is-centered is-vcentered">
          <div class="column">
            <BoardCard player="neutral" :full="false" />
          </div>
          <div class="column">
            <BoardGrid />
          </div>
        </div>
      </div>
      <div class="column">
        <BoardCard :player="player1" :full="false" />
      </div>
    </div>
    <div class="columns">
      <div class="column">
        <nav
          class="pagination is-centered"
          role="navigation"
          aria-label="pagination"
        >
          <a
            class="pagination-previous"
            @click="goTo(-1)"
            :disabled="current === -1"
          >
            <svg
              viewBox="0 0 24 24"
              width="24"
              height="24"
              stroke="currentColor"
              stroke-width="2"
              fill="none"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="css-i6dzq1"
            >
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 8 8 12 12 16"></polyline>
              <line x1="16" y1="12" x2="8" y2="12"></line>
            </svg>
          </a>
          <a
            class="pagination-previous"
            @click="goTo(current - 1)"
            :disabled="current === -1"
          >
            <svg
              viewBox="0 0 24 24"
              width="24"
              height="24"
              stroke="currentColor"
              stroke-width="2"
              fill="none"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="css-i6dzq1"
            >
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
          </a>
          <a
            class="pagination-next"
            @click="goTo(current + 1)"
            :disabled="current === board.turns.length - 1"
          >
            <svg
              viewBox="0 0 24 24"
              width="24"
              height="24"
              stroke="currentColor"
              stroke-width="2"
              fill="none"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="css-i6dzq1"
            >
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </a>
          <a
            class="pagination-next"
            @click="goTo(board ? board.turns.length - 1 : 0)"
            :disabled="current === board.turns.length - 1"
          >
            <svg
              viewBox="0 0 24 24"
              width="24"
              height="24"
              stroke="currentColor"
              stroke-width="2"
              fill="none"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="css-i6dzq1"
            >
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 16 16 12 12 8"></polyline>
              <line x1="8" y1="12" x2="16" y2="12"></line>
            </svg>
          </a>
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
    <BoardEffect :display-modal="false" :end-sound="false" />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { Action, Getter } from 'vuex-class'
import { players } from '@/data/players'
import { Player } from '@/enums/Player'
import { Board } from '@/models/Board'
import { repository } from '@/services/repository'
import { boardService } from '@/services/board.service'
import BoardGrid from '@/components/Board/BoardGrid.vue'
import BoardCard from '@/components/Board/BoardCard.vue'
import BoardEffect from '@/components/Board/BoardEffect.vue'

@Component({
  components: {
    BoardGrid,
    BoardCard,
    BoardEffect
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
  private player1 = Player.Player1
  private player2 = Player.Player2

  private get winnerLabel() {
    if (!this.winner) {
      return null
    }
    return players[this.winner]
  }

  private async mounted() {
    const board = await repository.get(this.id)
    if (board) {
      this.winner = boardService.getWinner(board.grid)
      const initialBoard = boardService.initFromBoard(board)
      this.reviewBoard(initialBoard)
    }
    window.addEventListener('keydown', this.changeTurn)
  }

  private beforeDestroy() {
    window.removeEventListener('keydown', this.changeTurn)
  }

  private changeTurn(e: KeyboardEvent) {
    switch (e.keyCode) {
      case 37: // left arrow
        this.goTo(this.current - 1)
        break
      case 39: // right arrow
        this.goTo(this.current + 1)
        break
    }
  }

  private goTo(toTurn: number) {
    if (!this.board) {
      return
    }
    if (toTurn < -1 || toTurn > this.board.turns.length - 1) {
      return
    }
    const newBoard = boardService.rewindMovePiece(
      this.current,
      toTurn,
      this.board
    )
    if (newBoard) {
      this.reviewBoard(newBoard)
      this.current = toTurn
    }
  }

  private get name() {
    if (!this.board) {
      return null
    }
    return [...this.board.animals].sort().join(', ')
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
