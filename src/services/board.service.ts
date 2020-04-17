import { Column } from '@/enums/Column'
import { PieceType } from '@/enums/PieceType'
import { Player } from '@/enums/Player'
import { Row } from '@/enums/Row'
import { Board } from '@/models/Board'
import { Card } from '@/models/Card'
import { CardMove } from '@/models/CardMove'
import { Cell, Grid } from '@/models/Cell'
import { MovePiece } from '@/models/MovePiece'
import { getCardFromAnimal, selectAnimals } from '@/services/card.service'
import {
  createGrid,
  getPieceFromGrid,
  getCellFromGrid
} from '@/services/grid.service'
import { repository } from '@/services/repository'

export const cloneBoard = (board: Board | null): Board | null => {
  if (!board) {
    return null
  }
  return JSON.parse(JSON.stringify(board))
}

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

export const initBoard = (user: string): Board => {
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
    },
    revenge: {
      ask: null,
      answer: null,
      nextBoardId: null
    }
  }
  return board
}

export const initBoardAndLocalSave = async (
  user: string
): Promise<Board | null> => {
  return await repository.saveLocal(initBoard(user))
}

export const initBoardAndSave = async (user: string): Promise<Board | null> => {
  return await repository.save(initBoard(user))
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

export const exchangeCard = (
  board: Board | null,
  movePiece: MovePiece,
  force = false
): Board | null => {
  board = cloneBoard(board)
  if (!board) {
    return null
  }
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

  if (!force) {
    // save the turn
    board.turns.push(movePiece)
  }

  return board
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
      piece: null
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

/**
 * Move piece in the board givent in parameters,
 * handles all side effects.
 * @param board board of the play
 * @param movePiece desired move to do
 * @param force useful when the player is forced to skip. Also for rewind.
 */
export const movePieceInBoard = (
  board: Board,
  movePiece: MovePiece,
  force = false
) => {
  board = cloneBoard(board) as Board
  if (movePiece.start && movePiece.end) {
    if (!movePiece.start.piece) {
      const piece = getPieceFromGrid(
        movePiece.start.row,
        movePiece.start.column,
        board.grid
      )
      if (piece) {
        movePiece.start.piece = piece
      } else {
        return null
      }
    }
    // if there is already a ally piece, we stop
    if (
      !force &&
      movePiece.end.piece?.player === movePiece.start.piece?.player
    ) {
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
  }

  return exchangeCard(board, movePiece, force)
}

export const rewindMovePiece = (
  fromTurn: number,
  toTurn: number,
  boardFromTurn: Board
) => {
  // some validation
  if (fromTurn > toTurn) {
    fromTurn = -1
    boardFromTurn = initFromBoard(boardFromTurn)
  }

  if (!boardFromTurn.turns[toTurn]) {
    return boardFromTurn
  }

  let boardToTurn = boardFromTurn

  for (let turn = fromTurn + 1; turn <= toTurn; turn++) {
    const board = movePieceInBoard(boardToTurn, boardFromTurn.turns[turn], true)
    if (board) {
      boardToTurn = board
    }
  }

  return boardToTurn
}

export const saveBoard = async (board: Board) => {
  return await repository.save(board)
}

export const saveLocalBoard = async (board: Board) => {
  return await repository.saveLocal(board)
}

export const movePieceAndSave = async (
  board: Board | null,
  movePiece: MovePiece,
  force = false
): Promise<Board | null> => {
  if (!board) {
    return null
  }
  const newBoard = movePieceInBoard(board, movePiece, force)
  if (!newBoard) {
    return null
  }
  return await saveLocalBoard(newBoard)
}

export const exchangeCardAndSave = async (
  board: Board | null,
  movePiece: MovePiece
): Promise<Board | null> => {
  if (!board) {
    return null
  }
  const newBoard = exchangeCard(board, movePiece)
  if (!newBoard) {
    return null
  }
  return await repository.saveLocal(newBoard)
}

export const getWinner = (board: Board | null) => {
  if (!board) {
    return null
  }
  const flattenGrid = board.grid.flat()
  const player1WayoftheStone = !flattenGrid.some(
    (cell) =>
      cell.piece?.player === Player.Player2 &&
      cell.piece.type === PieceType.Master
  )

  if (player1WayoftheStone) {
    return Player.Player1
  }

  const player1WayoftheStream =
    board.grid[0][Column.C].piece?.player === Player.Player1 &&
    board.grid[0][Column.C].piece?.type === PieceType.Master

  if (player1WayoftheStream) {
    return Player.Player1
  }

  const player2WayoftheStone = !flattenGrid.some(
    (cell) =>
      cell.piece?.player === Player.Player1 &&
      cell.piece.type === PieceType.Master
  )

  if (player2WayoftheStone) {
    return Player.Player2
  }

  const player2WayoftheStream =
    board.grid[board.grid.length - 1][Column.C].piece?.player ===
      Player.Player2 &&
    board.grid[board.grid.length - 1][Column.C].piece?.type === PieceType.Master

  if (player2WayoftheStream) {
    return Player.Player2
  }

  return null
}

export const getCellStream = (player: Player): Cell => {
  switch (player) {
    case Player.Player1:
      return {
        column: Column.C,
        row: Row.Five,
        piece: null
      }
    case Player.Player2:
      return {
        column: Column.C,
        row: Row.One,
        piece: null
      }
  }
}
