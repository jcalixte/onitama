<template>
  <div class="board-view" v-if="board">
    <h1 v-if="winnerLabel">{{ winnerLabel }} wins!</h1>
    <br />
    <BoardCard :player="player2" />
    <br />
    <div class="columns is-mobile">
      <div class="column is-half">
        <BoardGrid />
      </div>
      <div class="column is-half neutral-card-column">
        <BoardCard player="neutral" />
      </div>
    </div>
    <br />
    <BoardCard :player="player1" />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { Getter, Action } from 'vuex-class'
import BoardNew from '@/components/Board/BoardNew.vue'
import BoardGrid from '@/components/Board/BoardGrid.vue'
import BoardCard from '@/components/Board/BoardCard.vue'
import { Board } from '@/models/Board'
import { Player } from '@/enums/Player'
import { players } from '@/data/players'
import { busService } from '@/services/bus.service'

@Component({
  components: {
    BoardNew,
    BoardGrid,
    BoardCard
  }
})
export default class BoardView extends Vue {
  @Prop({ type: String, required: true })
  private id!: string
  @Getter
  private board!: Board | null
  @Getter
  private winner!: Player | null
  @Action
  private joinBoard!: (id: string) => Promise<void>
  @Action
  private updateBoard!: (board: Board) => Promise<void>

  private player1 = Player.Player1
  private player2 = Player.Player2

  private async mounted() {
    await this.joinBoard(this.id)
    busService.on('update', this.update)
  }

  private beforeDestroy() {
    busService.off('update', this.update)
  }

  private update(board: Board) {
    this.updateBoard(board)
  }

  private get winnerLabel() {
    if (!this.winner) {
      return null
    }
    return players[this.winner]
  }
}
</script>

<style scoped lang="scss">
.board-view {
  .neutral-card-column {
    display: flex;
    align-items: center;
  }
}
</style>
