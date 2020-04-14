import { cards } from '@/data/cards'
import { Column } from '@/enums/Column'
import { PieceType } from '@/enums/PieceType'
import { Player } from '@/enums/Player'
import { PlayStatus } from '@/enums/PlayStatus'
import { Row } from '@/enums/Row'
import { Board } from '@/models/Board'
import { CardMove } from '@/models/CardMove'
import { Cell, Grid } from '@/models/Cell'
import { Piece } from '@/models/Piece'
import { repository } from './repository'
import { MovePiece } from '@/models/MovePiece'

const newCell = (row: Row, column: Column, addPiece = true): Cell => {
  let piece: Piece | null = null
  if (addPiece) {
    switch (row) {
      case Row.One:
        piece = {
          player: Player.Player1,
          type: column === Column.C ? PieceType.Master : PieceType.Student
        }
        break
      case Row.Five:
        piece = {
          player: Player.Player2,
          type: column === Column.C ? PieceType.Master : PieceType.Student
        }
        break
    }
  }

  return { row, column, piece, selected: false }
}

const selectCards = () => {
  const shuffledCards = [...cards]
  for (let i = shuffledCards.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * i)
    const temp = shuffledCards[i]
    shuffledCards[i] = shuffledCards[j]
    shuffledCards[j] = temp
  }
  const [
    firstCard,
    secondCard,
    thirdCard,
    fourthCard,
    fifthCard
  ] = shuffledCards
  return [firstCard, secondCard, thirdCard, fourthCard, fifthCard]
}

export const createGrid = (addPiece = true): Grid => {
  return [
    [
      newCell(Row.Five, Column.A, addPiece),
      newCell(Row.Five, Column.B, addPiece),
      newCell(Row.Five, Column.C, addPiece),
      newCell(Row.Five, Column.D, addPiece),
      newCell(Row.Five, Column.E, addPiece)
    ],
    [
      newCell(Row.Four, Column.A, addPiece),
      newCell(Row.Four, Column.B, addPiece),
      newCell(Row.Four, Column.C, addPiece),
      newCell(Row.Four, Column.D, addPiece),
      newCell(Row.Four, Column.E, addPiece)
    ],
    [
      newCell(Row.Three, Column.A, addPiece),
      newCell(Row.Three, Column.B, addPiece),
      newCell(Row.Three, Column.C, addPiece),
      newCell(Row.Three, Column.D, addPiece),
      newCell(Row.Three, Column.E, addPiece)
    ],
    [
      newCell(Row.Two, Column.A, addPiece),
      newCell(Row.Two, Column.B, addPiece),
      newCell(Row.Two, Column.C, addPiece),
      newCell(Row.Two, Column.D, addPiece),
      newCell(Row.Two, Column.E, addPiece)
    ],
    [
      newCell(Row.One, Column.A, addPiece),
      newCell(Row.One, Column.B, addPiece),
      newCell(Row.One, Column.C, addPiece),
      newCell(Row.One, Column.D, addPiece),
      newCell(Row.One, Column.E, addPiece)
    ]
  ]
}

export const initBoard = async (user: string): Promise<Board | null> => {
  const grid: Grid = createGrid()

  const cards = selectCards()
  const [firstCard, secondCard, thirdCard, fourthCard, neutralAnimal] = cards
  const player1Animals = [firstCard, secondCard].map((card) => card.animal)
  const player2Animals = [thirdCard, fourthCard].map((card) => card.animal)

  const board: Board = {
    grid,
    turn: neutralAnimal.player,
    turns: [],
    animals: cards.map((card) => card.animal),
    playerAnimals: {
      [Player.Player1]: player1Animals,
      [Player.Player2]: player2Animals
    },
    users: {
      [Player.Player1]: user,
      [Player.Player2]: null
    },
    status: PlayStatus.Created
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
      board.status = PlayStatus.Playing
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

export const movePiece = async (
  board: Board | null,
  movePiece: MovePiece
): Promise<Board | null> => {
  if (!board || !movePiece.start.piece) {
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
  const indexCard = playerCards.findIndex((card) => card === movePiece.card)
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

  return await repository.saveLocal(board)
}
