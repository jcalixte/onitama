import { Animal } from '@/enums/Animal'
import { Board } from '@/models/Board'
import { Cell } from '@/models/Cell'
import { State } from '@/store/state'
import { MutationTree } from 'vuex'
import { areCellEquals, getCellFromGrid } from '@/services/board.service'
import { MovePiece } from '@/models/MovePiece'
import { Player } from '@/enums/Player'

export const INIT_BOARD = 'INIT_BOARD'
export const SELECT_CARD = 'SELECT_CARD'
export const SELECT_CELL = 'SELECT_CELL'
export const MOVE_PIECE = 'MOVE_PIECE'

export const mutations: MutationTree<State> = {
  [INIT_BOARD](state, board: Board) {
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
  },
  [MOVE_PIECE](state, movePiece: MovePiece) {
    if (!state.board || !movePiece.start.piece) {
      return
    }
    // if there is already a ally piece, we stop
    if (movePiece.end.piece?.player === movePiece.start.piece.player) {
      return
    }
    // Otherwise we can move the piece and swap the player card with
    // the neutral card
    const startCellFromGrid = getCellFromGrid(movePiece.start, state.board.grid)
    const endCellFromGrid = getCellFromGrid(movePiece.end, state.board.grid)

    if (!startCellFromGrid || !endCellFromGrid) {
      return
    }
    endCellFromGrid.piece = startCellFromGrid.piece
    startCellFromGrid.piece = null
    const playersCards = Object.values(state.board.playerCards).flat()
    const neutralCard = state.board.cards.find(
      (card) => !playersCards.includes(card)
    )

    if (!neutralCard) {
      return
    }
    const playerCards = state.board.playerCards[movePiece.player]
    const indexCard = playerCards.findIndex(
      (card) => card.animal === movePiece.card
    )
    if (indexCard === 0) {
      playerCards.shift()
      playerCards.unshift(neutralCard)
    } else if (indexCard === playerCards.length - 1) {
      playerCards.pop()
      playerCards.push(neutralCard)
    }

    // clear selections
    state.board.selectedCard = null
    state.board.selectedCell = null

    // other player turn
    state.board.turn =
      state.board.turn === Player.Player1 ? Player.Player2 : Player.Player1
  }
}
