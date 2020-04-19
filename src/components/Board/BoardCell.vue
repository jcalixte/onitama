<template>
  <div class="board-cell" :class="cellClass" @click="clickCell">
    <PieceImage v-if="cell && cell.piece" :piece="cell.piece" />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { Action, Getter } from 'vuex-class'
import { Cell } from '@/models/Cell'
import { Player } from '@/enums/Player'
import { Row } from '@/enums/Row'
import { Column } from '@/enums/Column'
import PieceImage from '@/components/PieceImage.vue'
import { MovePiece } from '@/models/MovePiece'
import { areCellEquals } from '@/services/grid.service'

@Component({
  components: {
    PieceImage
  }
})
export default class BoardCell extends Vue {
  @Prop({ type: Object, required: true })
  private cell!: Cell
  @Prop({ type: Boolean, required: true })
  private isValidMove!: boolean
  @Prop({ type: Boolean, default: false })
  private displayLastMove!: boolean
  @Getter
  private selectedCell!: Cell | null
  @Getter
  private winner!: Player | null
  @Getter
  private turn!: Player
  @Getter
  private turns!: MovePiece[]
  @Getter
  private isPlayer1!: boolean
  @Getter
  private isPlayer2!: boolean
  @Action
  private selectCell!: (cell: Cell) => void

  private clickCell() {
    if (this.canSelectPiece) {
      this.selectCell(this.cell)
      return
    }
    if (this.isValidMove) {
      this.$emit('move', this.cell)
    }
  }

  private get canSelectPiece(): boolean {
    if (!this.cell.piece || this.winner) {
      return false
    }
    return (
      this.cell.piece.player === this.turn &&
      ((this.isPlayer1 && this.turn === Player.Player1) ||
        (this.isPlayer2 && this.turn === Player.Player2))
    )
  }

  private get cellClass() {
    return {
      'is-selected': this.cell === this.selectedCell,
      'is-valid-move': this.isValidMove,
      'is-stream-cell': this.isStreamCell,
      'is-start-last-turn': this.displayLastMove && this.isStartLastTurn,
      'is-end-last-turn': this.displayLastMove && this.isEndLastTurn
    }
  }

  private get isStartLastTurn() {
    const lastTurn = [...this.turns].pop()
    if (!lastTurn || !lastTurn.start) {
      return false
    }
    return areCellEquals(this.cell, lastTurn.start)
  }

  private get isEndLastTurn() {
    const lastTurn = [...this.turns].pop()
    if (!lastTurn || !lastTurn.end) {
      return false
    }
    return areCellEquals(this.cell, lastTurn.end)
  }

  private get isStreamCell() {
    return (
      (this.cell.row === Row.One || this.cell.row === Row.Five) &&
      this.cell.column === Column.C
    )
  }
}
</script>

<style scoped lang="scss">
$cell-size: 40px;

.board-cell {
  width: $cell-size;
  height: $cell-size;
  display: flex;
  justify-content: center;
  align-items: center;

  &.is-start-last-turn {
    background-color: #c6c6d1;
  }
  &.is-end-last-turn {
    background-color: #cae3f3;
  }
  &.is-selected {
    background-color: #6ab04c;
  }
  &.is-valid-move {
    background-color: #079992;
  }
  &.is-stream-cell {
    background-image: url('../../assets/bridge.png');
    background-size: $cell-size;
  }
}
</style>
