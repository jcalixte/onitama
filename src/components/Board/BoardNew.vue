<template>
  <div class="board-new">
    <button @click="createBoard" class="button is-primary">nouveau jeu</button>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { Action, Getter } from 'vuex-class'
import { Board } from '../../models/Board'

@Component
export default class BoardNew extends Vue {
  @Action
  private initNewBoard!: () => Promise<void>
  @Getter
  private board!: Board | null

  private async createBoard() {
    await this.initNewBoard()
    if (!this.board || !this.board._id) {
      return
    }
    this.$router.push({
      name: 'Board',
      params: {
        id: this.board._id
      }
    })
  }
}
</script>

<style scoped lang="scss">
.board-new {
}
</style>
