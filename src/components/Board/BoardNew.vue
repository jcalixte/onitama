<template>
  <button
    @click="createBoard"
    class="board-new button is-primary"
    :class="playAgainstAI ? 'is-danger' : 'is-primary'"
  >
    new play
  </button>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { Action, Getter } from 'vuex-class'
import { Board } from '../../models/Board'

@Component
export default class BoardNew extends Vue {
  @Prop({ type: Boolean, default: false })
  private playAgainstAI!: boolean
  @Action
  private initNewBoard!: () => Promise<void>
  @Getter
  private board!: Board | null

  private async createBoard() {
    await this.initNewBoard()
    if (!this.board || !this.board._id) {
      return
    }
    if (this.playAgainstAI) {
      this.$router.push({
        name: 'BoardZhuge',
        params: {
          id: this.board._id
        }
      })
    } else {
      this.$router.push({
        name: 'Board',
        params: {
          id: this.board._id
        }
      })
    }
  }
}
</script>
