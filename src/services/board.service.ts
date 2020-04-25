import { Column } from '@/enums/Column'
import { PieceType } from '@/enums/PieceType'
import { Player } from '@/enums/Player'
import { Row } from '@/enums/Row'
import { Board } from '@/models/Board'
import { Card } from '@/models/Card'
import { CardMove } from '@/models/CardMove'
import { Cell, Grid, MAX_COLUMN, MAX_ROW } from '@/models/Cell'
import { MovePiece } from '@/models/MovePiece'
import { getCardFromAnimal, selectAnimals } from '@/services/card.service'
import { gridService } from '@/services/grid.service'
import { repository } from '@/services/repository'
import { MonitorTime } from '@/time-logger/performance-intercepor'
import { BoardUtils } from '@/utils/board.utils'

class BoardService {
  public initFromBoard(board: Board): Board {
    const grid = gridService.createGrid()
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

  public initBoard(user: string): Board {
    const grid = gridService.createGrid()

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

  public async initBoardAndLocalSave(user: string): Promise<Board | null> {
    return await repository.saveLocal(this.initBoard(user))
  }

  public async initBoardAndSave(user: string): Promise<Board | null> {
    return await repository.save(this.initBoard(user))
  }

  public async joinBoard(id: string, userId: string) {
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

  public isInBoard(cell: Cell) {
    return (
      cell.columnIndex >= 0 &&
      cell.columnIndex <= MAX_COLUMN &&
      cell.rowIndex >= 0 &&
      cell.rowIndex <= MAX_ROW
    )
  }

  @MonitorTime('movePieceInBoard')
  public exchangeCard(
    board: Board | null,
    movePiece: MovePiece,
    force = false,
    pure = true
  ): Board | null {
    if (pure) {
      board = BoardUtils.cloneBoard(board)
    }
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

  public getPossibleCellsFromMovesAndGrid(
    startCell: Cell,
    grid: Grid,
    ...moves: CardMove[]
  ) {
    const possibleCells: Cell[] = []
    moves.forEach((move) => {
      const possibleCell: Cell =
        grid[startCell.rowIndex + move.vertical]?.[
          startCell.columnIndex + move.horizontal
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

  public getPossibleCellsFromMoves(
    startCell: Cell,
    ...moves: CardMove[]
  ): Cell[] {
    const possibleCells: Cell[] = []
    moves.forEach((move: CardMove) => {
      const possibleCell: Cell = {
        columnIndex: startCell.columnIndex + move.horizontal,
        rowIndex: startCell.rowIndex + move.vertical,
        piece: null
      }

      const isCellFreeToGo =
        !startCell.piece ||
        !possibleCell.piece ||
        startCell.piece.player !== possibleCell.piece.player

      if (this.isInBoard(possibleCell) && isCellFreeToGo) {
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
  @MonitorTime('buildDecisionTrees')
  public movePieceInBoard(board: Board, movePiece: MovePiece, force = false) {
    board = BoardUtils.cloneBoard(board) as Board
    if (movePiece.start && movePiece.end) {
      if (!movePiece.start.piece) {
        const piece = gridService.getPieceFromGrid(
          movePiece.start.rowIndex,
          movePiece.start.columnIndex,
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
      const startCellFromGrid = gridService.getCellFromGrid(
        movePiece.start,
        board.grid
      )
      const endCellFromGrid = gridService.getCellFromGrid(
        movePiece.end,
        board.grid
      )

      if (!startCellFromGrid || !endCellFromGrid) {
        return null
      }
      endCellFromGrid.piece = startCellFromGrid.piece
      startCellFromGrid.piece = null
    }

    return this.exchangeCard(board, movePiece, force, false)
  }

  public rewindMovePiece(
    fromTurn: number,
    toTurn: number,
    boardFromTurn: Board
  ) {
    // some validation
    if (fromTurn > toTurn) {
      fromTurn = -1
      boardFromTurn = this.initFromBoard(boardFromTurn)
    }

    if (!boardFromTurn.turns[toTurn]) {
      return boardFromTurn
    }

    let boardToTurn = boardFromTurn

    for (let turn = fromTurn + 1; turn <= toTurn; turn++) {
      const board = this.movePieceInBoard(
        boardToTurn,
        boardFromTurn.turns[turn],
        true
      )
      if (board) {
        boardToTurn = board
      }
    }

    return boardToTurn
  }

  public async saveBoard(board: Board) {
    return await repository.save(board)
  }

  public async saveLocalBoard(board: Board) {
    return await repository.saveLocal(board)
  }

  public async movePieceAndSave(
    board: Board | null,
    movePiece: MovePiece,
    force = false
  ): Promise<Board | null> {
    if (!board) {
      return null
    }
    const newBoard = this.movePieceInBoard(board, movePiece, force)
    if (!newBoard) {
      return null
    }
    return await this.saveLocalBoard(newBoard)
  }

  public async exchangeCardAndSave(
    board: Board | null,
    movePiece: MovePiece
  ): Promise<Board | null> {
    if (!board) {
      return null
    }
    const newBoard = this.exchangeCard(board, movePiece)
    if (!newBoard) {
      return null
    }
    return await repository.saveLocal(newBoard)
  }

  public getWinner(grid: Grid) {
    const flattenGrid = grid.flat()
    const player1WayoftheStone = !flattenGrid.some(
      (cell) =>
        cell.piece?.player === Player.Player2 &&
        cell.piece.type === PieceType.Master
    )

    if (player1WayoftheStone) {
      return Player.Player1
    }

    const player1WayoftheStream =
      grid[0][Column.C].piece?.player === Player.Player1 &&
      grid[0][Column.C].piece?.type === PieceType.Master

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
      grid[grid.length - 1][Column.C].piece?.player === Player.Player2 &&
      grid[grid.length - 1][Column.C].piece?.type === PieceType.Master

    if (player2WayoftheStream) {
      return Player.Player2
    }

    return null
  }

  public getCellStream(player: Player): Cell {
    switch (player) {
      case Player.Player1:
        return {
          columnIndex: Column.C,
          rowIndex: Row.One,
          piece: null
        }
      case Player.Player2:
        return {
          columnIndex: Column.C,
          rowIndex: Row.Five,
          piece: null
        }
    }
  }
}

export const boardService = new BoardService()
