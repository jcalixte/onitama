import { GetterTree } from 'vuex'
import { State } from './state'
import { Player } from '@/enums/Player'

export const getters: GetterTree<State, State> = {
  grid: ({ board }) => board?.grid ?? null,
  turn: ({ board }) => board?.turn ?? null,
  cards: ({ board }) => board?.cards ?? [],
  selectedCard: ({ board }) => board?.selectedCard ?? null,
  selectedCell: ({ board }) => board?.selectedCell ?? null,
  isPlayer1: ({ user, board }) =>
    board?.users[Player.Player1] === user ?? false,
  isPlayer2: ({ user, board }) =>
    board?.users[Player.Player2] === user ?? false,
  player1Cards: ({ board }) => board?.playerCards[Player.Player1] ?? [],
  player2Cards: ({ board }) => board?.playerCards[Player.Player2] ?? [],
  neutralCard: ({ board }) => {
    if (!board) {
      return null
    }
    const cardPlayers = Object.values(board.playerCards).flat()
    return board.cards.find((card) => !cardPlayers.includes(card))
  }
}
