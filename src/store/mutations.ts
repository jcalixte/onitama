import { Board } from '@/models/Board'
import { State } from '@/store/state'
import { MutationTree } from 'vuex'
import { Animal } from '@/enums/Animal'

export const INIT_BOARD = 'INIT_BOARD'
export const SELECT_CARD = 'SELECT_CARD'

export const mutations: MutationTree<State> = {
  [INIT_BOARD](state, board: Board) {
    state.board = board
  },
  [SELECT_CARD](state, card: Animal) {
    if (!state.board) {
      return
    }
    state.board.selectedCard = card
  }
}
