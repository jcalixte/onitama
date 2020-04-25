<template>
  <div class="card-grid-move">
    <table>
      <tr v-for="(row, r) in grid" :key="r">
        <td
          v-for="(cell, c) in row"
          :key="c"
          :class="{
            'is-center': isCenter(cell),
            'is-possible-cell': isPossibleMoveCell(cell)
          }"
        ></td>
      </tr>
    </table>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { CardMove } from '@/models/CardMove'
import { Grid, Cell } from '@/models/Cell'
import { boardService } from '@/services/board.service'
import { gridService } from '@/services/grid.service'
import { Row } from '@/enums/Row'
import { Column } from '@/enums/Column'

@Component
export default class CardGridMove extends Vue {
  @Prop({ type: Array, required: true })
  private moves!: CardMove[]
  private grid: Grid = gridService.createGrid(false)

  private isCenter(cell: Cell) {
    return cell.rowIndex === Row.Three && cell.columnIndex === Column.C
  }

  private isPossibleMoveCell(cell: Cell): boolean {
    return this.possibleMoveCells.some((moveCell) =>
      gridService.areCellEquals(cell, moveCell)
    )
  }

  private get possibleMoveCells(): Cell[] {
    return boardService.getPossibleCellsFromMoves(
      {
        rowIndex: Row.Three,
        columnIndex: Column.C,
        piece: null
      },
      ...this.moves
    )
  }
}
</script>

<style scoped lang="scss">
$cell-size: 20px;
$mobile-cell-size: $cell-size / 1.5;

.card-grid-move {
  table {
    margin: auto;
    border-collapse: collapse;

    td {
      min-width: $cell-size;
      min-height: $cell-size;
      width: $cell-size;
      height: $cell-size;
      border: 2px solid #2f3640;

      &.is-center {
        background-color: #2f3640;
      }
      &.is-possible-cell {
        background-color: #95afc0;
      }
    }
  }
}

@media screen and (max-width: 768px) {
  .card-grid-move {
    table {
      td {
        min-width: $mobile-cell-size;
        min-height: $mobile-cell-size;
        width: $mobile-cell-size;
        height: $mobile-cell-size;
      }
    }
  }
}
</style>
