import { mutations } from '@/store/mutations'
import { State, state } from '@/store/state'
import Vue from 'vue'
import Vuex from 'vuex'
import { actions } from './actions'
import { getters } from './getters'
import VuexPersistence from 'vuex-persist'

Vue.use(Vuex)

const vuexLocal = new VuexPersistence<State>({
  key: 'onitama',
  storage: window.localStorage,
  reducer: (state) => ({
    user: state.user
  })
})

export default new Vuex.Store<State>({
  state,
  mutations,
  actions,
  getters,
  plugins: [vuexLocal.plugin]
})
