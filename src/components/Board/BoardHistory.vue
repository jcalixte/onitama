<template>
  <div class="board-history" v-if="turns.length">turn {{ turns.length }}</div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { Getter } from 'vuex-class'
import { MovePiece } from '@/models/MovePiece'

@Component
export default class BoardHistory extends Vue {
  @Getter
  private turns!: MovePiece[]
}
</script>
