import { Animal } from '@/enums/Animal'
import { Cell } from '@/models/Cell'
import { initBoard, joinBoard, movePiece } from '@/services/board.service'
import {
  SELECT_CARD,
  SELECT_CELL,
  UPDATE_BOARD,
  INIT_USER
} from '@/store/mutations'
import { State } from '@/store/state'
import { ActionTree } from 'vuex'
import { MovePiece } from '@/models/MovePiece'
import { Board } from '@/models/Board'
import { v4 as uuid } from 'uuid'

export const actions: ActionTree<State, State> = {
  async initNewBoard({ state, commit }) {
    const userId = state.user || uuid()
    if (!state.user) {
      commit(INIT_USER, userId)
    }
    const board = await initBoard(userId)
    if (board) {
      commit(UPDATE_BOARD, board)
    }
  },
  async joinBoard({ state, commit }, id: string) {
    const userId = state.user || uuid()
    if (!state.user) {
      commit(INIT_USER, userId)
    }
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
