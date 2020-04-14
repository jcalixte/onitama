import { GetterTree } from 'vuex'
import { State } from './state'
import { Player } from '@/enums/Player'
import { PieceType } from '@/enums/PieceType'
import { Column } from '@/enums/Column'

const DEBUG = true

export const getters: GetterTree<State, State> = {
  selectedCard: ({ selectedCard }) => selectedCard ?? null,
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
  winner: ({ board }): Player | null => {
    if (!board) {
      return null
    }
    const player1WayoftheStone = !board.grid.some((row) =>
      row.some(
        (cell) =>
          cell.piece?.player === Player.Player2 &&
          cell.piece.type === PieceType.Master
      )
    )
    const player1WayoftheStream =
      board.grid[0][Column.C].piece?.player === Player.Player1 &&
      board.grid[0][Column.C].piece?.type === PieceType.Master
    const hasPlayer1Won = player1WayoftheStone || player1WayoftheStream
    if (hasPlayer1Won) {
      return Player.Player1
    }

    const player2WayoftheStone = !board.grid.some((row) =>
      row.some(
        (cell) =>
          cell.piece?.player === Player.Player1 &&
          cell.piece.type === PieceType.Master
      )
    )
    const player2WayoftheStream =
      board.grid[board.grid.length - 1][Column.C].piece?.player ===
        Player.Player2 &&
      board.grid[board.grid.length - 1][Column.C].piece?.type ===
        PieceType.Master
    const hasPlayer2Won = player2WayoftheStone || player2WayoftheStream
    if (hasPlayer2Won) {
      return Player.Player2
    }

    return null
  }
}
