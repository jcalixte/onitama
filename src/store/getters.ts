import { GetterTree } from 'vuex'
import { State } from './state'
import { Player } from '@/enums/Player'
import { PieceType } from '@/enums/PieceType'
import { Column } from '@/enums/Column'
import { getWinner } from '@/services/board.service'

const DEBUG = true

export const getters: GetterTree<State, State> = {
  selectedAnimal: ({ selectedAnimal }) => selectedAnimal ?? null,
  selectedCell: ({ selectedCell }) => selectedCell ?? null,
  user: ({ user }) => user,
  board: ({ board }) => board,
  grid: ({ board }) => board?.grid ?? null,
  turn: ({ board }) => board?.turn ?? null,
  turns: ({ board }) => board?.turns ?? [],
  cards: ({ board }) => board?.animals ?? [],
  playersSet: ({ board }) =>
    Object.values(board?.users ?? {}).filter((user) => !!user).length === 2,
  isPlayer1: ({ user, board }) => {
    if (DEBUG && process.env.NODE_ENV === 'development') {
      return board?.turn === Player.Player1 ?? false
    }
    return board?.users[Player.Player1] === user ?? false
  },
  isPlayer2: ({ user, board }) => {
    if (DEBUG && process.env.NODE_ENV === 'development') {
      return board?.turn === Player.Player2 ?? false
    }
    return board?.users[Player.Player2] === user ?? false
  },
  userPlayer: ({ user, board }) => {
    if (board?.users[Player.Player1] === user) {
      return Player.Player1
    }
    if (board?.users[Player.Player2] === user) {
      return Player.Player2
    }
    return null
  },
  player1Animals: ({ board }) => board?.playerAnimals[Player.Player1] ?? [],
  player2Animals: ({ board }) => board?.playerAnimals[Player.Player2] ?? [],
  neutralAnimal: ({ board }) => {
    if (!board) {
      return null
    }
    const animalPlayers = Object.values(board.playerAnimals).flat()
    return (
      board.animals.find((animal) => !animalPlayers.includes(animal)) ?? null
    )
  },
  winner: ({ board }): Player | null => getWinner(board)
}
