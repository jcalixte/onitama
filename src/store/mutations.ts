import { Animal } from '@/enums/Animal'
import { Board } from '@/models/Board'
import { Cell } from '@/models/Cell'
import { State } from '@/store/state'
import { MutationTree } from 'vuex'
import { areCellEquals } from '@/services/board.service'

export const UPDATE_BOARD = 'UPDATE_BOARD'
export const SELECT_CARD = 'SELECT_CARD'
export const SELECT_CELL = 'SELECT_CELL'

export const mutations: MutationTree<State> = {
  [UPDATE_BOARD](state, board: Board) {
    state.board = board
  },
  [SELECT_CARD](state, card: Animal) {
    if (!state.board) {
      return
    }
    state.board.selectedCard = card
  },
  [SELECT_CELL](state, cell: Cell) {
    if (!state.board || !cell.piece) {
      return
    }
    if (
      !state.board.selectedCell ||
      !areCellEquals(state.board.selectedCell, cell)
    ) {
      state.board.selectedCell = cell
    } else {
      state.board.selectedCell = null
    }
  }
}
