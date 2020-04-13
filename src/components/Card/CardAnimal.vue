<template>
  <div
    class="card-animal card"
    :class="{ selected, selectable }"
    @click="selectable && selectCard(card.animal)"
  >
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
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { Action, Getter } from 'vuex-class'
import { Card } from '@/models/Card'
import { Animal } from '@/enums/Animal'

@Component
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
}
</style>
