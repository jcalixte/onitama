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
          :class="isNeutralClass"
          :card="card"
          :selectable="isSelectable"
          :skipable="isNeutral && mustSkipTurn"
          @skip="skip"
          :player="player"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { Action, Getter } from 'vuex-class'
import { Player } from '@/enums/Player'
import { Animal } from '@/enums/Animal'
import { cards } from '@/data/cards'
import { MovePiece } from '@/models/MovePiece'

@Component({
  components: {
    CardAnimal: () => import('@/components/Card/CardAnimal.vue')
  }
})
export default class BoardCard extends Vue {
  @Prop({ type: String, default: null })
  private player!: Player | 'neutral' | null
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
  @Getter
  private mustSkipTurn!: boolean
  @Action
  private movePiece!: (props: MovePiece) => void

  private skip(animal: Animal) {
    const pieceToMove: MovePiece = {
      start: null,
      end: null,
      player: this.turn,
      animal: animal
    }
    this.movePiece(pieceToMove)
  }

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
    return this.player === 'neutral'
  }

  private get isNeutralClass() {
    return this.isNeutral ? 'neutral-card' : ''
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
