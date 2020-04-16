<template>
  <div class="board-grid" v-if="grid">
    <table>
      <tr v-for="(row, r) in grid" :key="r">
        <td v-for="(cell, c) in row" :key="c">
          <BoardCell
            :cell="cell"
            :is-valid-move="isValidMove(cell)"
            @move="callToMovePiece"
          />
        </td>
      </tr>
    </table>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import { Action, Getter } from 'vuex-class'
import { Grid, Cell } from '@/models/Cell'
import BoardCell from '@/components/Board/BoardCell.vue'
import { giveHuntMove } from '@/ais/hunt.ai'
import { getPossibleCellsFromMovesAndGrid } from '@/services/board.service'
import { getMovesFromAnimal } from '@/services/card.service'
import { areCellEquals } from '@/services/grid.service'
import { Animal } from '@/enums/Animal'
import { MovePiece } from '@/models/MovePiece'
import { Player } from '@/enums/Player'
import { Board } from '@/models/Board'

@Component({
  components: {
    BoardCell
  }
})
export default class BoardGrid extends Vue {
  @Prop({ type: Boolean, default: false })
  private playAgainstAI!: boolean
  @Prop({ type: Boolean, default: false })
  private trainAI!: boolean
  @Getter
  private board!: Board | null
  @Getter
  private grid!: Grid | null
  @Getter
  private userPlayer!: Player | null
  @Getter
  private turn!: Player | null
  @Getter
  private winner!: Player | null
  @Getter
  private selectedAnimal!: Animal | null
  @Getter
  private selectedCell!: Cell | null
  @Action
  private movePiece!: (props: MovePiece) => Promise<void>
  @Action
  private trainingData!: () => Promise<void>

  private async callToMovePiece(end: Cell) {
    if (!this.selectedCell || !this.selectedAnimal || !this.turn) {
      return
    }
    const pieceToMove: MovePiece = {
      start: this.selectedCell,
      end,
      player: this.turn,
      animal: this.selectedAnimal
    }
    await this.movePiece(pieceToMove)
    if (!this.winner && this.playAgainstAI && this.board) {
      const nextMove = giveHuntMove(this.turn, this.board)
      await this.movePiece(nextMove)
    }
  }

  private isValidMove(cell: Cell): boolean {
    return this.validCellMoves.some((validCell) =>
      areCellEquals(validCell, cell)
    )
  }

  private get validCellMoves(): Cell[] {
    if (!this.selectedCell || !this.grid || !this.turn) {
      return []
    }
    const moves = getMovesFromAnimal(this.selectedAnimal, this.turn)
    return getPossibleCellsFromMovesAndGrid(
      this.selectedCell,
      this.grid,
      ...moves
    )
  }

  @Watch('playAgainstAI')
  private async onPlayAgainstAIChange(playAgainstAI: boolean) {
    if (!this.board || !this.turn || !this.userPlayer) {
      return
    }
    if (playAgainstAI && this.turn !== this.userPlayer) {
      await this.movePiece(giveHuntMove(this.turn, this.board))
    }
  }

  @Watch('trainAI')
  private async onTrainAIChange(trainAI: boolean) {
    if (trainAI && this.board && this.turn) {
      await this.trainingData()

      while (!this.winner) {
        await this.movePiece(giveHuntMove(this.turn, this.board))
      }
    }
  }
}
</script>

<style scoped lang="scss">
.board-grid {
  table {
    margin: auto;
    border-collapse: collapse;

    td {
      border: 2px solid #2f3640;
    }
  }
}
</style>
