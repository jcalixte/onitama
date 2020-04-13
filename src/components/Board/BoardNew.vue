<template>
  <div class="board-new">
    <button @click="initNewBoard" class="button is-primary">nouveau jeu</button>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { Action } from 'vuex-class'

@Component
export default class BoardNew extends Vue {
  @Action
  private initNewBoard!: () => void
}
</script>

<style scoped lang="scss">
.board-new {
}
</style>
