<template>
  <div class="home">
    <h1 class="title is-1">onitama</h1>
    <BoardNew />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import BoardNew from '@/components/Board/BoardNew.vue'
import BoardGrid from '@/components/Board/BoardGrid.vue'
import BoardCard from '@/components/Board/BoardCard.vue'

@Component({
  components: {
    BoardNew,
    BoardGrid,
    BoardCard
  }
})
export default class Home extends Vue {}
</script>
