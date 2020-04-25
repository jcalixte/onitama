import { Player } from '@/enums/Player'
import { Board } from '@/models/Board'
import { Cell } from '@/models/Cell'
import { MovePiece } from '@/models/MovePiece'
import { MonitorTime } from '@/time-logger/performance-intercepor'

export class BoardUtils {
  @MonitorTime('movePieceInBoard')
  public static cloneBoard(board: Board | null): Board | null {
    if (!board) {
      return null
    }

    return {
      turns: board.turns.map((movePiece: MovePiece) => {
        return {
          player: movePiece.player,
          start: movePiece.start
            ? {
                rowIndex: movePiece.start.rowIndex,
                columnIndex: movePiece.start.columnIndex,
                piece: movePiece.start.piece
                  ? {
                      type: movePiece.start.piece.type,
                      player: movePiece.start.piece.player
                    }
                  : null
              }
            : null,
          end: movePiece.end
            ? {
                rowIndex: movePiece.end.rowIndex,
                columnIndex: movePiece.end.columnIndex,
                piece: movePiece.end.piece
                  ? {
                      type: movePiece.end.piece.type,
                      player: movePiece.end.piece.player
                    }
                  : null
              }
            : null,
          animal: movePiece.animal
        }
      }),
      date: board.date,
      users: {
        [Player.Player1]: board.users[Player.Player1],
        [Player.Player2]: board.users[Player.Player2]
      },
      revenge: {
        ask: board.revenge.ask,
        answer: board.revenge.answer,
        nextBoardId: board.revenge.nextBoardId
      },
      training: board.training,
      grid: board.grid.map((row: Cell[]) => {
        return row.map((cell: Cell) => {
          return {
            rowIndex: cell.rowIndex,
            columnIndex: cell.columnIndex,
            piece: cell.piece
          }
        })
      }),
      turn: board.turn,
      animals: [...board.animals],
      playerAnimals: {
        [Player.Player1]: [...board.playerAnimals[Player.Player1]],
        [Player.Player2]: [...board.playerAnimals[Player.Player2]]
      }
    }
  }
}
