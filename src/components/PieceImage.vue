<template>
  <div class="emperor-piece">
    <img :src="imageSrc" alt="master" />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { Player } from '@/enums/Player'
import { PieceType } from '@/enums/PieceType'
import { Piece } from '@/models/Piece'

@Component
export default class PieceImage extends Vue {
  @Prop({ type: Object, required: true })
  private piece!: Piece

  private get isMaster() {
    return this.piece.type === PieceType.Master
  }

  private get imageSrc() {
    if (this.isMaster) {
      return this.piece.player === Player.Player1
        ? require('../assets/emperor.png')
        : require('../assets/son.png')
    }
    return this.piece.player === Player.Player1
      ? require('../assets/soldier-player1.png')
      : require('../assets/soldier-player2.png')
  }
}
</script>

<style scoped lang="scss">
.emperor-piece {
  flex: 1;
  display: flex;
  width: 100%;
  height: 100%;
  padding: 5px;
}
</style>
