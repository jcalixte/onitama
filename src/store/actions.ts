import { Animal } from '@/enums/Animal'
import { Cell } from '@/models/Cell'
import { initBoard, joinBoard, movePiece } from '@/services/board.service'
import { SELECT_CARD, SELECT_CELL, UPDATE_BOARD } from '@/store/mutations'
import { State } from '@/store/state'
import { ActionTree } from 'vuex'
import { MovePiece } from '@/models/MovePiece'
import { Board } from '@/models/Board'

export const actions: ActionTree<State, State> = {
  async initNewBoard({ state, commit }) {
    const board = await initBoard(state.user)
    if (board) {
      commit(UPDATE_BOARD, board)
    }
  },
  async joinBoard({ state, commit }, id: string) {
    const board = await joinBoard(id, state.user)
    commit(UPDATE_BOARD, board)
  },
  updateBoard({ commit }, board: Board) {
    commit(UPDATE_BOARD, board)
  },
  selectCard({ commit }, card: Animal) {
    commit(SELECT_CARD, card)
  },
  selectCell({ commit }, cell: Cell) {
    commit(SELECT_CELL, cell)
  },
  async movePiece({ state, commit }, pieceToMove: MovePiece) {
    const board = await movePiece(state.board, pieceToMove)
    if (board) {
      commit(UPDATE_BOARD, board)
    }
  }
}
