<template>
  <div class="board-card">
    <div class="columns is-centered is-multiline">
      <div
        class="column card-animal-column"
        v-for="card in localCards"
        :key="card.animal"
      >
        <CardAnimal
          class="card-animal"
          :class="isNeutral"
          :card="card"
          :selectable="isSelectable"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { Getter } from 'vuex-class'
import { Card } from '@/models/Card'
import { Player } from '@/enums/Player'

@Component({
  components: {
    CardAnimal: () => import('@/components/Card/CardAnimal.vue')
  }
})
export default class BoardCard extends Vue {
  @Getter
  private cards!: Card[]
  @Getter
  private player1Cards!: Card[]
  @Getter
  private player2Cards!: Card[]
  @Getter
  private neutralCard!: Card | null
  @Getter
  private isPlayer1!: boolean
  @Getter
  private isPlayer2!: boolean
  @Prop({ type: String, default: null })
  private player!: Player | 'neutral' | null

  private get localCards() {
    if (!this.player) {
      return this.cards
    }

    switch (this.player) {
      case Player.Player1:
        return this.player1Cards
      case Player.Player2:
        return this.player2Cards
      case 'neutral':
        return this.neutralCard ? [this.neutralCard] : []
      default:
        return []
    }
  }

  private get isNeutral() {
    return this.player === 'neutral' ? 'neutral-card' : ''
  }

  private get isSelectable() {
    return (
      (this.isPlayer1 && this.player === Player.Player1) ||
      (this.isPlayer2 && this.player === Player.Player2)
    )
  }
}
</script>

<style scoped lang="scss">
.board-card {
  .card-animal-column {
    display: flex;
  }
  .card-animal {
    flex: 1;
  }
  // .neutral-card {
  //   transform: rotate(-90deg);
  // }
}
</style>
