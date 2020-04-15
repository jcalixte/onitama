import { Player } from '@/enums/Player'
import { Revenge } from '@/models/Revenge'
import { getPossibleCellsFromMoves, getWinner } from '@/services/board.service'
import { getMovesFromAnimal } from '@/services/card.service'
import { getPlayerCells } from '@/services/grid.service'
import { GetterTree } from 'vuex'
import { State } from './state'

const DEBUG = false

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
  winner: ({ board }): Player | null => getWinner(board),
  mustSkipTurn: (
    { board },
    { userPlayer }: { userPlayer: Player | null }
  ): boolean => {
    if (!board || userPlayer !== board.turn) {
      return false
    }
    const animals = board.playerAnimals[userPlayer]
    const moves = animals
      .map((animal) =>
        getMovesFromAnimal(animal, userPlayer === Player.Player1)
      )
      .flat()
    const pieces = getPlayerCells(userPlayer, board.grid)
    for (const piece of pieces) {
      const possibleMoves = getPossibleCellsFromMoves(piece, ...moves)
      if (possibleMoves.length) {
        return false
      }
    }
    return true
  },
  revenge: ({ board }): Revenge | null => board?.revenge ?? null,
  nextBoardId: ({ board }): string | null => board?.revenge.nextBoardId ?? null
}
