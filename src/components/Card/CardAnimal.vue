<template>
  <div
    class="card-animal card"
    :class="{ selected, selectable }"
    @click="selectable && selectAnimal(card.animal)"
  >
    <div class="row">
      <div class="card-grid-move-container">
        <CardGridMove :moves="moves" />
      </div>
      <div class="card-content">
        <div class="columns">
          <div class="column">
            <p class="animal">
              {{ card.animal }}
            </p>
          </div>
          <div class="column">
            <i class="gg-profile player" :style="color"></i>
          </div>
        </div>
        <p class="subtitle card-description">
          {{ card.description }}
        </p>
        <button v-if="skipable" class="button is-warning" @click.prevent="skip">
          skip
        </button>
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
  @Prop({ type: Boolean, required: true })
  private skipable!: boolean
  @Prop({ type: String, default: null })
  private player!: Player | 'neutral' | null
  @Action
  private selectAnimal!: (card: Animal) => void
  @Getter
  private selectedAnimal!: Animal | null

  private skip() {
    this.$emit('skip', this.card.animal)
  }

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
    return this.card.animal === this.selectedAnimal
  }
}
</script>

<style scoped lang="scss">
@import '@/styles/variables';

@media screen and (max-width: 768px) {
  .card-description {
    visibility: hidden;
    display: none;
  }
}

.card {
  padding: 5px;
  border-radius: 5px;
}

.card-animal {
  .row {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .card-content {
    .column {
      display: flex;
      align-items: center;
    }
  }
  .animal {
    font-size: 2rem;
    text-align: left;
  }
  .card-content {
    display: flex;
    flex: 1;
    flex-direction: column;
    justify-content: center;
    padding: 0 1rem;
  }
  .card-description {
    padding: 6px 0;
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
