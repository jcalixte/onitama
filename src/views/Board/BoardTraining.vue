<template>
  <div class="board-training">
    <hr />
    <div class="columns is-centered">
      <div class="column is-half">
        <h2 class="subtitle is-2">Train AI</h2>
        <div v-if="!training">
          <div class="field is-horizontal">
            <div class="field-label is-normal">
              <label for="iterations" class="label">number of iterations</label>
            </div>
            <div class="field-body field has-addons">
              <div class="control">
                <input
                  id="iterations"
                  class="input"
                  type="number"
                  placeholder="iterations"
                  v-model.number="numberOfIterations"
                  min="1"
                />
              </div>
              <div class="control">
                <a class="button is-primary" @click.prevent="train">
                  train!
                </a>
              </div>
            </div>
          </div>
        </div>
        <div v-else>{{ current }} boards trained</div>
      </div>
    </div>
    <BoardTrainingList v-if="!training" />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { Getter } from 'vuex-class'
import BoardTrainingList from '@/components/Board/BoardTrainingList.vue'
import { boardService } from '@/services/board.service'
import { repository } from '@/services/repository'
import { Board } from '@/models/Board'
import { MovePiece } from '@/models/MovePiece'
import { zhugeMove, ZhugeMove } from '@/bots/zhuge-liang.bot'

@Component({
  components: {
    BoardTrainingList
  }
})
export default class BoardTraining extends Vue {
  @Getter
  private user!: string
  private numberOfIterations = 0
  private current = 0
  private training = false

  private async train() {
    if (this.training) {
      return
    }
    this.training = true
    try {
      this.current = 0
      for (let i = 0; i < this.numberOfIterations; i++) {
        await this.trainOneBoard()
        this.current++
      }
    } catch (error) {
      console.error(error)
    } finally {
      this.current = 0
      this.training = false
    }
  }

  private async trainOneBoard() {
    let board: Board | null = boardService.initBoard(this.user)
    if (!board) {
      return
    }
    board.training = 'hunt'

    while (board && !boardService.getWinner(board.grid)) {
      if (!board) {
        break
      }
      const pieceToMove: MovePiece = await zhugeMove.move(board.turn, board)
      board =
        !pieceToMove.start || !pieceToMove.end
          ? boardService.exchangeCard(board, pieceToMove)
          : boardService.movePieceInBoard(board, pieceToMove)
    }
    if (board) {
      await repository.save(board)
    }
  }
}
</script>

<style lang="scss" scoped>
.field-body {
  flex-grow: 2;
}
</style>
