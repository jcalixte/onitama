<template>
  <div class="board-cell">
    <i v-if="cell && cell.piece" :class="piece" :style="color"></i>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { Cell } from '@/models/Cell'
import { PieceType } from '../../enums/PieceType'

@Component
export default class BoardCell extends Vue {
  @Prop() private cell!: Cell

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
}
</style>
