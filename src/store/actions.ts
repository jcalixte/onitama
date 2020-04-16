import { Animal } from '@/enums/Animal'
import { Board } from '@/models/Board'
import { Cell } from '@/models/Cell'
import { MovePiece } from '@/models/MovePiece'
import {
  initBoardAndLocalSave,
  joinBoard,
  movePieceAndSave,
  exchangeCardAndSave,
  saveLocalBoard,
  cloneBoard,
  saveBoard
} from '@/services/board.service'
import {
  INIT_USER,
  SELECT_ANIMAL,
  SELECT_CELL,
  UPDATE_BOARD
} from '@/store/mutations'
import { State } from '@/store/state'
import { v4 as uuid } from 'uuid'
import { ActionTree } from 'vuex'

export const actions: ActionTree<State, State> = {
  async initNewBoard({ state, commit }) {
    const userId = state.user || uuid()
    if (!state.user) {
      commit(INIT_USER, userId)
    }
    const board = await initBoardAndLocalSave(userId)
    if (board) {
      commit(UPDATE_BOARD, board)
    }
  },
  async reviewBoard({ commit }, board) {
    commit(UPDATE_BOARD, board)
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
  selectAnimal({ commit }, animal: Animal) {
    commit(SELECT_ANIMAL, animal)
  },
  selectCell({ commit }, cell: Cell) {
    commit(SELECT_CELL, cell)
  },
  async movePiece({ state, commit }, pieceToMove: MovePiece) {
    const board =
      !pieceToMove.start || !pieceToMove.end
        ? await exchangeCardAndSave(cloneBoard(state.board), pieceToMove)
        : await movePieceAndSave(cloneBoard(state.board), pieceToMove)
    if (board) {
      commit(UPDATE_BOARD, board)
    }
  },
  async trainingData({ state, commit }) {
    const board = cloneBoard(state.board)
    if (!board) {
      return
    }
    board.training = true
    const newBoard = await saveLocalBoard(board)
    commit(UPDATE_BOARD, newBoard)
  },
  async askRevenge({ state, commit }, ask: boolean) {
    const board = cloneBoard(state.board)
    if (!board) {
      return
    }
    board.revenge.ask = ask
    const newBoard = await saveLocalBoard(board)
    if (newBoard) {
      commit(UPDATE_BOARD, newBoard)
    }
  },
  async answerRevenge(
    { state },
    { answer, nextBoardId }: { answer: boolean; nextBoardId: string | null }
  ) {
    const board = cloneBoard(state.board)
    if (!board) {
      return
    }
    board.revenge.answer = answer
    board.revenge.nextBoardId = nextBoardId
    await saveBoard(board)
  }
}
