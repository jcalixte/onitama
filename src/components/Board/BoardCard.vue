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
          :player="player"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { Getter } from 'vuex-class'
import { Player } from '@/enums/Player'
import { Animal } from '@/enums/Animal'
import { cards } from '@/data/cards'

@Component({
  components: {
    CardAnimal: () => import('@/components/Card/CardAnimal.vue')
  }
})
export default class BoardCard extends Vue {
  @Getter
  private cards!: Animal[]
  @Getter
  private player1Animals!: Animal[]
  @Getter
  private player2Animals!: Animal[]
  @Getter
  private neutralAnimal!: Animal | null
  @Getter
  private winner!: Player | null
  @Getter
  private turn!: Player
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
    let animals: Animal[]

    switch (this.player) {
      case Player.Player1:
        animals = this.player1Animals
        break
      case Player.Player2:
        animals = this.player2Animals
        break
      case 'neutral':
        animals = this.neutralAnimal ? [this.neutralAnimal] : []
        break
      default:
        animals = []
        break
    }
    return cards.filter((card) => animals.includes(card.animal))
  }

  private get isNeutral() {
    return this.player === 'neutral' ? 'neutral-card' : ''
  }

  private get isSelectable() {
    if (this.winner) {
      return false
    }
    return (
      (this.isPlayer1 &&
        this.player === Player.Player1 &&
        this.player === this.turn) ||
      (this.isPlayer2 &&
        this.player === Player.Player2 &&
        this.player === this.turn)
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
