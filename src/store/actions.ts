import { initBoard } from '@/services/board.service'
import { INIT_BOARD, SELECT_CARD } from '@/store/mutations'
import { State } from '@/store/state'
import { ActionTree } from 'vuex'
import { Animal } from '@/enums/Animal'

export const actions: ActionTree<State, State> = {
  initNewBoard({ state, commit }) {
    commit(INIT_BOARD, initBoard(state.user))
  },
  selectCard({ commit }, card: Animal) {
    commit(SELECT_CARD, card)
  }
}
