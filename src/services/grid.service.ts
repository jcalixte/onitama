import { Column } from '@/enums/Column'
import { PieceType } from '@/enums/PieceType'
import { Player } from '@/enums/Player'
import { Row } from '@/enums/Row'
import { Cell, Grid } from '@/models/Cell'
import { Piece } from '@/models/Piece'

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
