<template>
  <div class="board-revenge" v-if="won || lost">
    <div v-if="nextBoardId">
      <router-link :to="{ name: 'Board', params: { id: nextBoardId } }"
        >next board</router-link
      >
    </div>
    <div v-else-if="won">
      <div v-if="revenge">
        <div v-if="revenge.ask && revenge.answer === null">
          He want to revenge himself! Accept?
          <div class="buttons is-centered">
            <button class="button is-primary is-light" @click="answer(true)">
              yes
            </button>
            <button class="button" @click="answer(false)">
              no
            </button>
          </div>
        </div>
        <div v-else-if="revenge.answer === true">
          You accepted. A new battle begins...
        </div>
        <div v-else-if="revenge.answer === false">
          You declined a new battle.
        </div>
        <div v-else>
          He may ask for revenge..
        </div>
      </div>
    </div>
    <div v-else-if="lost">
      <div v-if="revenge">
        <div v-if="revenge.ask === null">
          Do you want revenge?
          <div class="buttons is-centered">
            <button
              class="button is-primary is-light"
              @click="askRevenge(true)"
            >
              yes
            </button>
            <button class="button" @click="askRevenge(false)">
              no
            </button>
          </div>
        </div>
        <div v-else-if="revenge.ask">
          <div v-if="revenge.answer">
            He accepted. A new battle begins...
          </div>
          <div v-else-if="revenge.answer === false">
            He declined a new battle.
          </div>
          <div v-else>
            Waiting for his answer...
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import { Action, Getter } from 'vuex-class'
import { Player } from '@/enums/Player'
import { Revenge } from '@/models/Revenge'
import { initBoardAndSave } from '@/services/board.service'

@Component
export default class BoardRevenge extends Vue {
  @Getter
  private readonly user!: string
  @Getter
  private readonly winner!: Player | null
  @Getter
  private readonly userPlayer!: Player | null
  @Getter
  private readonly revenge!: Revenge | null
  @Getter
  private readonly nextBoardId!: string | null
  @Action
  private askRevenge!: (ask: boolean) => Promise<void>
  @Action
  private answerRevenge!: ({
    answer,
    nextBoardId
  }: {
    answer: boolean
    nextBoardId: string | null
  }) => Promise<void>

  private async answer(answer: boolean) {
    let nextBoardId: string | null = null
    if (answer) {
      const nextBoard = await initBoardAndSave(this.user)
      if (nextBoard) {
        nextBoardId = nextBoard._id || null
      }
    }
    await this.answerRevenge({
      answer,
      nextBoardId: nextBoardId
    })
  }

  private get won() {
    return this.winner && this.winner === this.userPlayer
  }

  private get lost() {
    return this.winner && this.userPlayer && this.winner !== this.userPlayer
  }

  @Watch('nextBoardId')
  private onNextBoardIdChange(nextBoardId: string | null) {
    if (nextBoardId) {
      this.$router.push({
        name: 'Board',
        params: {
          id: nextBoardId
        }
      })
    }
  }
}
</script>

<style scoped lang="scss">
.board-revenge {
}
</style>
