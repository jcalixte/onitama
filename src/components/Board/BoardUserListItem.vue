<template>
  <router-link :to="{ name: 'BoardReview', params: { id: board._id } }">
    {{ new Date(board.date).toLocaleDateString() }} –
    {{ name }}
  </router-link>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { Board } from '@/models/Board'

@Component
export default class BoardUserListItem extends Vue {
  @Prop({ type: Object, required: true })
  private readonly board!: Board

  private get name() {
    return this.board.animals.sort().join(', ')
  }
}
</script>
