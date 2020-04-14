<template>
  <div
    class="card-animal card"
    :class="{ selected, selectable }"
    @click="selectable && selectCard(card.animal)"
  >
    <div class="columns is-mobile">
      <div class="column is-one-third card-grid-move-container">
        <CardGridMove :moves="moves" />
      </div>
      <div class="column">
        <div class="card-content">
          <p class="title">
            {{ card.animal }}
            <i class="gg-profile player" :style="color"></i>
          </p>
          <p class="subtitle card-description">
            {{ card.description }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { Action, Getter } from 'vuex-class'
import { Card } from '@/models/Card'
import { Animal } from '@/enums/Animal'
import CardGridMove from '@/components/Card/CardGridMove.vue'
import { Player } from '@/enums/Player'

@Component({
  components: {
    CardGridMove
  }
})
export default class CardAnimal extends Vue {
  @Prop({ type: Object, required: true })
  private card!: Card
  @Prop({ type: Boolean, required: true })
  private selectable!: boolean
  @Prop({ type: String, default: null })
  private player!: Player | 'neutral' | null
  @Action
  private selectCard!: (card: Animal) => void
  @Getter
  private selectedCard!: Animal | null

  private get moves() {
    return this.player !== Player.Player2
      ? this.card.moves
      : this.card.reverseMoves
  }

  private get color() {
    return {
      color: this.card.player
    }
  }

  private get selected() {
    return this.card.animal === this.selectedCard
  }
}
</script>

<style scoped lang="scss">
@import '@/styles/variables';

@media screen and (max-width: 600px) {
  .card-description {
    visibility: hidden;
    display: none;
  }
}

.card-animal {
  p.title {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .card-content {
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
  .subtitle {
    font-family: 'Charmonman', cursive;
    text-align: justify;
    &.neutral-title {
      margin-top: 15px;
      margin-bottom: 0;
      text-align: center;
    }
  }
  &.selectable:hover {
    cursor: pointer;
  }
  &.selected {
    background-color: #6ab04c;
  }
  .card-grid-move-container {
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>
