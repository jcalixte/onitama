<template>
  <div class="board-grid" v-if="grid">
    <div v-if="botThinking" class="loading">
      <i class="gg-loadbar-alt"></i>
    </div>
    <table>
      <tr v-for="(row, r) in grid" :key="r">
        <td v-if="true" class="cell-number">
          {{ row.length - row[0].rowIndex }}
        </td>
        <td v-for="(cell, c) in row" :key="c">
          <BoardCell
            :cell="cell"
            :is-valid-move="isValidMove(cell)"
            :display-last-move="displayLastMove"
            @move="callToMovePiece"
          />
        </td>
      </tr>
      <tr v-if="true">
        <td></td>
        <td v-for="(cell, c) in grid[0]" :key="c" class="cell-number">
          {{ column[cell.columnIndex] }}
        </td>
      </tr>
    </table>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import { Action, Getter } from 'vuex-class'
import { Cell, Grid } from '@/models/Cell'
import BoardCell from '@/components/Board/BoardCell.vue'
import { boardService } from '@/services/board.service'
import { getMovesFromAnimal } from '@/services/card.service'
import { gridService } from '@/services/grid.service'
import { Animal } from '@/enums/Animal'
import { MovePiece } from '@/models/MovePiece'
import { Column } from '@/enums/Column'
import { Player } from '@/enums/Player'
import { Board } from '@/models/Board'
import { zhugeLiang } from '@/bots/zhuge-liang.bot'
import { simaYi } from '@/bots/sima-yi.bot'

@Component({
  components: {
    BoardCell
  }
})
export default class BoardGrid extends Vue {
  @Prop({ type: String, default: '' })
  private playAgainstAI!: 'zhuge' | 'sima' | ''
  @Prop({ type: Boolean, default: false })
  private trainAI!: boolean
  @Prop({ type: Boolean, default: false })
  private displayNumbers!: boolean
  @Prop({ type: Boolean, default: false })
  private displayLastMove!: boolean
  @Getter
  private board!: Board | null
  @Getter
  private grid!: Grid | null
  @Getter
  private userPlayer!: Player | null
  @Getter
  private turn!: Player | null
  @Getter
  private winner!: Player | null
  @Getter
  private selectedAnimal!: Animal | null
  @Getter
  private selectedCell!: Cell | null
  @Action
  private movePiece!: (props: MovePiece) => Promise<void>
  @Action
  private trainingData!: () => Promise<void>
  private botThinking = false
  private column = Column

  private async playBot() {
    switch (this.playAgainstAI) {
      case 'zhuge':
        await this.zhuge()
        break
      case 'sima':
        await this.sima()
        break
    }
  }

  private async zhuge() {
    this.botThinking = true
    if (!this.winner && this.turn && this.board) {
      const nextMove = await zhugeLiang.move(this.turn, this.board)
      await this.movePiece(nextMove)
    }
    this.botThinking = false
  }

  private async sima() {
    this.botThinking = true
    if (!this.winner && this.turn && this.board) {
      const nextMove = await simaYi.move(this.turn, this.board)
      await this.movePiece(nextMove)
    }
    this.botThinking = false
  }

  private async callToMovePiece(end: Cell) {
    if (!this.selectedCell || !this.selectedAnimal || !this.turn) {
      return
    }
    const pieceToMove: MovePiece = {
      start: this.selectedCell,
      end,
      player: this.turn,
      animal: this.selectedAnimal
    }
    await this.movePiece(pieceToMove)
    if (this.playAgainstAI) {
      await this.playBot()
    }
  }

  private isValidMove(cell: Cell): boolean {
    return this.validCellMoves.some((validCell) =>
      gridService.areCellEquals(validCell, cell)
    )
  }

  private get validCellMoves(): Cell[] {
    if (!this.selectedCell || !this.grid || !this.turn) {
      return []
    }
    const moves = getMovesFromAnimal(this.selectedAnimal, this.turn)
    return boardService.getPossibleCellsFromMovesAndGrid(
      this.selectedCell,
      this.grid,
      ...moves
    )
  }

  @Watch('playAgainstAI', { immediate: true })
  private async onPlayAgainstAIChange(playAgainstAI: boolean) {
    if (!this.board || !this.turn || !this.userPlayer) {
      return
    }
    if (playAgainstAI && this.turn !== this.userPlayer) {
      await this.playBot()
    }
  }

  @Watch('trainAI')
  private async onTrainAIChange(trainAI: boolean) {
    if (trainAI && this.board && this.turn) {
      await this.trainingData()

      while (!this.winner) {
        await this.playBot()
      }
    }
  }
}
</script>

<style scoped lang="scss">
.board-grid {
  display: flex;
  flex-direction: column;
  table {
    margin: auto;
    border-collapse: collapse;

    td {
      border: 2px solid #2f3640;
      &.cell-number {
        text-align: center;
        vertical-align: middle;
        min-width: 30px;
      }
    }
  }

  .loading {
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 10px 0;
  }
}
</style>
