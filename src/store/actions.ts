import { Animal } from '@/enums/Animal'
import { Board } from '@/models/Board'
import { Cell } from '@/models/Cell'
import { MovePiece } from '@/models/MovePiece'
import { boardService } from '@/services/board.service'
import {
  INIT_USER,
  SELECT_ANIMAL,
  SELECT_CELL,
  UPDATE_BOARD
} from '@/store/mutations'
import { State } from '@/store/state'
import { BoarUtils } from '@/utils/board.utils'
import { v4 as uuid } from 'uuid'
import { ActionTree } from 'vuex'

export const actions: ActionTree<State, State> = {
  async initNewBoard({ state, commit }) {
    const userId = state.user || uuid()
    if (!state.user) {
      commit(INIT_USER, userId)
    }
    const board = await boardService.initBoardAndLocalSave(userId)
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
    const board = await boardService.joinBoard(id, state.user)
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
        ? await boardService.exchangeCardAndSave(state.board, pieceToMove)
        : await boardService.movePieceAndSave(state.board, pieceToMove)

    if (board) {
      commit(UPDATE_BOARD, board)
    }
  },
  async trainingData({ state, commit }) {
    const board = BoarUtils.cloneBoard(state.board)
    if (!board) {
      return
    }
    board.training = 'hunt'
    const newBoard = await boardService.saveLocalBoard(board)
    commit(UPDATE_BOARD, newBoard)
  },
  async askRevenge({ state, commit }, ask: boolean) {
    const board = BoarUtils.cloneBoard(state.board)
    if (!board) {
      return
    }
    board.revenge.ask = ask
    const newBoard = await boardService.saveLocalBoard(board)
    if (newBoard) {
      commit(UPDATE_BOARD, newBoard)
    }
  },
  async answerRevenge(
    { state },
    { answer, nextBoardId }: { answer: boolean; nextBoardId: string | null }
  ) {
    const board = BoarUtils.cloneBoard(state.board)
    if (!board) {
      return
    }
    board.revenge.answer = answer
    board.revenge.nextBoardId = nextBoardId
    await boardService.saveBoard(board)
  }
}
