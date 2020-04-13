<template>
  <div class="board-cell" :class="cellClass" @click="clickCell">
    <i v-if="cell && cell.piece" :class="piece" :style="color"></i>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { Action, Getter } from 'vuex-class'
import { Cell } from '@/models/Cell'
import { PieceType } from '@/enums/PieceType'
import { Player } from '@/enums/Player'
import { Row } from '../../enums/Row'
import { Column } from '../../enums/Column'

@Component
export default class BoardCell extends Vue {
  @Prop({ type: Object, required: true })
  private cell!: Cell
  @Prop({ type: Boolean, required: true })
  private isValidMove!: boolean
  @Getter
  private selectedCell!: Cell | null
  @Getter
  private winner!: Player | null
  @Getter
  private turn!: Player
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

  private get piece() {
    if (!this.cell?.piece?.player) {
      return null
    }
    return {
      'gg-hashtag': this.cell.piece.type === PieceType.Master,
      'gg-pin-alt': this.cell.piece.type === PieceType.Student
    }
  }

  private get color() {
    if (!this.cell?.piece?.player) {
      return null
    }
    return {
      color: this.cell.piece.player
    }
  }

  private get cellClass() {
    return {
      'is-selected': this.cell === this.selectedCell,
      'is-valid-move': this.isValidMove,
      'is-stream-cell': this.isStreamCell
    }
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
$cell-size: 50px;

.board-cell {
  width: $cell-size;
  height: $cell-size;
  display: flex;
  justify-content: center;
  align-items: center;

  &.is-selected {
    background-color: #6ab04c;
  }
  &.is-valid-move {
    background-color: #ffbe76;
  }
  &.is-stream-cell {
    background-image: url('../../assets/bridge.png');
    background-size: $cell-size;
  }
}
</style>
