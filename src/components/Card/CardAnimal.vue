<template>
  <div
    class="card-animal card"
    :class="{ selected, selectable }"
    @click="selectable && selectCard(card.animal)"
  >
    <div class="columns is-mobile">
      <div class="column is-one-third card-grid-move-container">
        <CardGridMove :moves="card.moves" />
      </div>
      <div class="column">
        <div class="card-content">
          <p class="title">
            {{ card.animal }}
            <i class="gg-profile player" :style="color"></i>
          </p>
          <p class="subtitle">
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
  @Action
  private selectCard!: (card: Animal) => void
  @Getter
  private selectedCard!: Animal | null

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

.card-animal {
  .player {
    float: right;
  }
  .subtitle {
    font-family: 'Charmonman', cursive;
    text-align: justify;
  }
  &.selectable:hover {
    cursor: pointer;
  }
  &.selected {
    background-color: $primary;
  }
  .card-grid-move-container {
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>
