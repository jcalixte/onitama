import { Column } from '@/enums/Column'
import { Player } from '@/enums/Player'
import { Row } from '@/enums/Row'
import { Board } from '@/models/Board'
import { CardMove } from '@/models/CardMove'
import { Cell, Grid } from '@/models/Cell'
import { MovePiece } from '@/models/MovePiece'
import { selectAnimals, getCardFromAnimal } from '@/services/card.service'
import { repository } from '@/services/repository'
import { createGrid } from '@/services/grid.service'
import { Card } from '@/models/Card'

export const initFromBoard = (board: Board): Board => {
  const grid = createGrid()
  const cards = board.animals.map(getCardFromAnimal) as Card[]
  const [firstCard, secondCard, thirdCard, fourthCard, neutralCard] = cards
  const player1Animals = [firstCard, secondCard].map((card) => card.animal)
  const player2Animals = [thirdCard, fourthCard].map((card) => card.animal)

  return {
    ...board,
    turn: neutralCard.player,
    playerAnimals: {
      [Player.Player1]: player1Animals,
      [Player.Player2]: player2Animals
    },
    grid
  }
}

export const initBoard = async (user: string): Promise<Board | null> => {
  const grid = createGrid()

  const cards = selectAnimals()
  const [firstCard, secondCard, thirdCard, fourthCard, neutralCard] = cards
  const player1Animals = [firstCard, secondCard].map((card) => card.animal)
  const player2Animals = [thirdCard, fourthCard].map((card) => card.animal)

  const board: Board = {
    grid,
    date: new Date(),
    turn: neutralCard.player,
    turns: [],
    animals: cards.map((card) => card.animal),
    playerAnimals: {
      [Player.Player1]: player1Animals,
      [Player.Player2]: player2Animals
    },
    users: {
      [Player.Player1]: user,
      [Player.Player2]: null
    }
  }
  return await repository.saveLocal(board)
}

export const joinBoard = async (id: string, userId: string) => {
  try {
    let board = await repository.getLocal(id)

    if (!board) {
      board = await repository.get(id)
      if (!board) {
        return null
      }
    }

    repository.initLive(id)

    if (
      !board.users[Player.Player2] &&
      board.users[Player.Player1] !== userId
    ) {
      board.users[Player.Player2] = userId
      return await repository.save(board)
    }
    return board
  } catch (error) {
    return null
  }
}

const isInBoard = (cell: Cell) => {
  return (
    cell.column >= Column.A &&
    cell.column <= Column.E &&
    cell.row >= Row.One &&
    cell.row <= Row.Five
  )
}

export const getPossibleCellsFromMovesAndGrid = (
  startCell: Cell,
  grid: Grid,
  ...moves: CardMove[]
) => {
  const possibleCells: Cell[] = []
  moves.forEach((move) => {
    const possibleCell: Cell =
      grid[Row.Five - startCell.row - move.vertical]?.[
        startCell.column + move.horizontal
      ]

    if (!possibleCell) {
      return
    }

    const isCellFreeToGo =
      !startCell.piece ||
      !possibleCell.piece ||
      startCell.piece.player !== possibleCell.piece.player

    if (isCellFreeToGo) {
      possibleCells.push(possibleCell)
    }
  })
  return possibleCells
}

export const getPossibleCellsFromMoves = (
  startCell: Cell,
  ...moves: CardMove[]
): Cell[] => {
  const possibleCells: Cell[] = []
  moves.forEach((move) => {
    const possibleCell: Cell = {
      column: startCell.column + move.horizontal,
      row: startCell.row + move.vertical,
      piece: null,
      selected: false
    }

    const isCellFreeToGo =
      !startCell.piece ||
      !possibleCell.piece ||
      startCell.piece.player !== possibleCell.piece.player

    if (isInBoard(possibleCell) && isCellFreeToGo) {
      possibleCells.push(possibleCell)
    }
  })
  return possibleCells
}

export const areCellEquals = (a: Cell, b: Cell) => {
  return a.row === b.row && a.column === b.column
}

export const getCellFromGrid = (cell: Cell, grid: Grid) => {
  for (const row of grid) {
    for (const c of row) {
      if (areCellEquals(cell, c)) {
        return c
      }
    }
  }

  return null
}

const movePieceInBoard = (board: Board, movePiece: MovePiece) => {
  if (!movePiece.start.piece) {
    return null
  }
  // if there is already a ally piece, we stop
  if (movePiece.end.piece?.player === movePiece.start.piece.player) {
    return null
  }
  // Otherwise we can move the piece and swap the player card with
  // the neutral card
  const startCellFromGrid = getCellFromGrid(movePiece.start, board.grid)
  const endCellFromGrid = getCellFromGrid(movePiece.end, board.grid)

  if (!startCellFromGrid || !endCellFromGrid) {
    return null
  }
  endCellFromGrid.piece = startCellFromGrid.piece
  startCellFromGrid.piece = null
  const playersCards = Object.values(board.playerAnimals).flat()
  const neutralAnimal = board.animals.find(
    (card) => !playersCards.includes(card)
  )

  if (!neutralAnimal) {
    return null
  }
  const playerCards = board.playerAnimals[movePiece.player]
  const indexCard = playerCards.findIndex((card) => card === movePiece.animal)
  if (indexCard === 0) {
    playerCards.shift()
    playerCards.unshift(neutralAnimal)
  } else if (indexCard === playerCards.length - 1) {
    playerCards.pop()
    playerCards.push(neutralAnimal)
  }

  // other player turn
  board.turn = board.turn === Player.Player1 ? Player.Player2 : Player.Player1

  // save the turn
  board.turns.push(movePiece)
  return board
}

export const rewindMovePiece = (
  fromTurn: number,
  toTurn: number,
  boardFromTurn: Board
) => {
  // some validation
  if (fromTurn > toTurn) {
    fromTurn = 0
  }

  if (!boardFromTurn.turns[fromTurn] || !boardFromTurn.turns[toTurn]) {
    return boardFromTurn
  }

  let boardToTurn = boardFromTurn

  for (let turn = fromTurn + 1; turn <= toTurn; turn++) {
    const board = movePieceInBoard(boardToTurn, boardFromTurn.turns[turn])
    if (board) {
      boardToTurn = board
    }
  }

  return boardToTurn
}

export const movePieceAndSave = async (
  board: Board | null,
  movePiece: MovePiece
): Promise<Board | null> => {
  if (!board) {
    return null
  }
  const newBoard = movePieceInBoard(board, movePiece)
  if (!newBoard) {
    return null
  }
  return await repository.saveLocal(newBoard)
}
