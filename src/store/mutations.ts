import { Animal } from '@/enums/Animal'
import { Board } from '@/models/Board'
import { Cell } from '@/models/Cell'
import { State } from '@/store/state'
import { MutationTree } from 'vuex'
import { areCellEquals } from '@/services/board.service'

export const INIT_USER = 'INIT_USER'
export const UPDATE_BOARD = 'UPDATE_BOARD'
export const SELECT_CARD = 'SELECT_CARD'
export const SELECT_CELL = 'SELECT_CELL'

export const mutations: MutationTree<State> = {
  [INIT_USER](state, user: string) {
    state.user = user
  },
  [UPDATE_BOARD](state, board: Board) {
    state.selectedCell = null
    state.selectedCard = null
    state.board = board
  },
  [SELECT_CARD](state, card: Animal) {
    if (!state.board) {
      return
    }
    state.selectedCard = card
  },
  [SELECT_CELL](state, cell: Cell) {
    if (!state.board || !cell.piece) {
      return
    }
    if (!state.selectedCell || !areCellEquals(state.selectedCell, cell)) {
      state.selectedCell = cell
    } else {
      state.selectedCell = null
    }
  }
}
