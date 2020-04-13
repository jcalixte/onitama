<template>
  <div class="home">
    <BoardNew />
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
import { Component, Vue } from 'vue-property-decorator'
import BoardNew from '@/components/Board/BoardNew.vue'
import BoardGrid from '@/components/Board/BoardGrid.vue'
import BoardCard from '@/components/Board/BoardCard.vue'
import { Player } from '@/enums/Player'

@Component({
  components: {
    BoardNew,
    BoardGrid,
    BoardCard
  }
})
export default class Home extends Vue {
  private player1 = Player.Player1
  private player2 = Player.Player2
}
</script>

<style lang="scss" scoped>
.neutral-card-column {
  display: flex;
  align-items: center;
}
</style>
