<template>
  <div
    class="card-animal card"
    :class="{ selected, selectable }"
    @click="selectable && selectAnimal(card.animal)"
  >
    <div class="row">
      <div class="card-content">
        <div class="card-grid-move-container">
          <div class="row">
            <p class="animal">
              {{ card.animal }}
            </p>
            <i class="gg-profile player" :style="color"></i>
          </div>
          <CardGridMove :moves="moves" />
        </div>
        <p class="subtitle card-description" v-if="full">
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
import { Player } from '@/enums/Player'
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
  @Prop({ type: Boolean, required: true })
  private skipable!: boolean
  @Prop({ type: Boolean, default: true })
  private full!: boolean
  @Prop({ type: String, default: null })
  private player!: Player | 'neutral' | null
  @Action
  private selectAnimal!: (card: Animal) => void
  @Getter
  private selectedAnimal!: Animal | null
  @Getter
  private userPlayer!: Player | null

  private skip() {
    this.$emit('skip', this.card.animal)
  }

  private get moves() {
    const player = this.player === 'neutral' ? this.userPlayer : this.player

    return player === Player.Player1 ? this.card.reverseMoves : this.card.moves
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
  margin: 0 0 5px;
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
    font-size: 1.3rem;
    margin: 0 5px;
  }
  .card-content {
    display: flex;
    flex: 1;
    justify-content: center;
    align-items: flex-end;
    padding: 0 1rem;
  }
  .card-description {
    padding: 6px;
    font-family: 'Charmonman', cursive;
    text-align: justify;
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
    flex-direction: column;
    flex: 1;
  }
}
</style>
