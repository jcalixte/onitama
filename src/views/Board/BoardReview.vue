<template>
  <div class="board-review" v-if="board">
    <h1>{{ name }}</h1>
    <BoardGrid />
    <nav class="pagination is-medium" role="navigation" aria-label="pagination">
      <a class="pagination-previous" @click="goTo(current - 1)">previous</a>
      <a class="pagination-next" @click="goTo(current + 1)">next</a>
      <ul class="pagination-list">
        <li v-for="(turn, t) in board.turns" :key="t">
          <a
            class="pagination-link"
            :class="{ 'is-current': t === current }"
            :aria-label="`Goto turn ${t + 1}`"
            @click.prevent="goTo(t)"
          >
            {{ t + 1 }}
            {{ turn.animal }}
          </a>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { Action, Getter } from 'vuex-class'
import { Board } from '@/models/Board'
import { repository } from '@/services/repository'
import { rewindMovePiece, initFromBoard } from '@/services/board.service'
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
  private current = 0

  private async mounted() {
    const board = await repository.get(this.id)
    if (board) {
      this.reviewBoard(initFromBoard(board))
    }
  }

  private goTo(toTurn: number) {
    if (!this.board) {
      return
    }
    if (toTurn < 0 || toTurn > this.board.turns.length - 1) {
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
.board-review {
}
</style>
