import { Player } from '@/enums/Player'
import { Board } from '@/models/Board'
import { Cell } from '@/models/Cell'
import { MovePiece } from '@/models/MovePiece'
import { MonitorTime } from '@/time-logger/performance-intercepor'

export class BoarUtils {
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
                row: movePiece.start.row,
                column: movePiece.start.column,
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
                row: movePiece.end.row,
                column: movePiece.end.column,
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
      grid: board.grid.map((line: Cell[]) => {
        return line.map((cell: Cell) => {
          return {
            row: cell.row,
            column: cell.column,
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
