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
import { Component, Vue } from 'vue-property-decorator'
import { Action, Getter } from 'vuex-class'
import { Grid, Cell } from '@/models/Cell'
import BoardCell from '@/components/Board/BoardCell.vue'
import {
  getPossibleCellsFromMovesAndGrid,
  areCellEquals
} from '@/services/board.service'
import { getMovesFromAnimal } from '@/services/card.service'
import { Animal } from '@/enums/Animal'
import { MovePiece } from '@/models/MovePiece'
import { Player } from '@/enums/Player'

@Component({
  components: {
    BoardCell
  }
})
export default class BoardGrid extends Vue {
  @Getter
  private grid!: Grid | null
  @Getter
  private turn!: Player
  @Getter
  private selectedCard!: Animal | null
  @Getter
  private selectedCell!: Cell | null
  @Action
  private movePiece!: (movePiece: MovePiece) => void

  private callToMovePiece(end: Cell) {
    if (!this.selectedCell || !this.selectedCard) {
      return
    }
    const movePiece: MovePiece = {
      start: this.selectedCell,
      end,
      player: this.turn,
      card: this.selectedCard
    }
    this.movePiece(movePiece)
  }

  private isValidMove(cell: Cell): boolean {
    return this.validCellMoves.some((validCell) =>
      areCellEquals(validCell, cell)
    )
  }

  private get validCellMoves(): Cell[] {
    if (!this.selectedCell || !this.grid) {
      return []
    }
    const moves = getMovesFromAnimal(
      this.selectedCard,
      this.turn === Player.Player1
    )
    return getPossibleCellsFromMovesAndGrid(
      this.selectedCell,
      this.grid,
      ...moves
    )
  }
}
</script>

<style scoped lang="scss">
.board-grid {
  table {
    margin: auto;
    border-collapse: collapse;

    td {
      border: 1px solid black;
    }
  }
}
</style>
