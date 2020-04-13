import { Animal } from '@/enums/Animal'
import { Cell } from '@/models/Cell'
import { initBoard } from '@/services/board.service'
import {
  INIT_BOARD,
  SELECT_CARD,
  SELECT_CELL,
  MOVE_PIECE
} from '@/store/mutations'
import { State } from '@/store/state'
import { ActionTree } from 'vuex'
import { MovePiece } from '@/models/MovePiece'

export const actions: ActionTree<State, State> = {
  initNewBoard({ state, commit }) {
    commit(INIT_BOARD, initBoard(state.user))
  },
  selectCard({ commit }, card: Animal) {
    commit(SELECT_CARD, card)
  },
  selectCell({ commit }, cell: Cell) {
    commit(SELECT_CELL, cell)
  },
  movePiece({ commit }, movePiece: MovePiece) {
    commit(MOVE_PIECE, movePiece)
  }
}
