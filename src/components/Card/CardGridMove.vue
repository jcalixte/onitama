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
import {
  createGrid,
  getPossibleCellsFromMoves,
  areCellEquals
} from '@/services/board.service'
import { Row } from '@/enums/Row'
import { Column } from '@/enums/Column'

@Component
export default class CardGridMove extends Vue {
  @Prop({ type: Array, required: true })
  private moves!: CardMove[]
  private grid: Grid = createGrid(false)

  private isCenter(cell: Cell) {
    return cell.row === Row.Three && cell.column === Column.C
  }

  private isPossibleMoveCell(cell: Cell): boolean {
    return this.possibleMoveCells.some((moveCell) =>
      areCellEquals(cell, moveCell)
    )
  }

  private get possibleMoveCells(): Cell[] {
    return getPossibleCellsFromMoves(
      {
        row: Row.Three,
        column: Column.C,
        piece: null,
        selected: false
      },
      ...this.moves
    )
  }
}
</script>

<style scoped lang="scss">
$cell-size: 20px;

.card-grid-move {
  table {
    margin: auto;
    border-collapse: collapse;

    td {
      min-width: $cell-size;
      min-height: $cell-size;
      width: $cell-size;
      height: $cell-size;
      border: 1px solid #130f40;

      &.is-center {
        background-color: #130f40;
      }
      &.is-possible-cell {
        background-color: #95afc0;
      }
    }
  }
}
</style>
