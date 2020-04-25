import { Column } from '@/enums/Column'
import { PieceType } from '@/enums/PieceType'
import { Player } from '@/enums/Player'
import { Row } from '@/enums/Row'
import { Cell, Grid } from '@/models/Cell'
import { Piece } from '@/models/Piece'
import { MonitorTime } from '@/time-logger/performance-intercepor'

class GridService {
  public newCell(row: Row, column: Column, addPiece = true): Cell {
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

    return { rowIndex: row, columnIndex: column, piece }
  }

  public createGrid(addPiece = true): Grid {
    return [
      [
        this.newCell(Row.Five, Column.A, addPiece),
        this.newCell(Row.Five, Column.B, addPiece),
        this.newCell(Row.Five, Column.C, addPiece),
        this.newCell(Row.Five, Column.D, addPiece),
        this.newCell(Row.Five, Column.E, addPiece)
      ],
      [
        this.newCell(Row.Four, Column.A, addPiece),
        this.newCell(Row.Four, Column.B, addPiece),
        this.newCell(Row.Four, Column.C, addPiece),
        this.newCell(Row.Four, Column.D, addPiece),
        this.newCell(Row.Four, Column.E, addPiece)
      ],
      [
        this.newCell(Row.Three, Column.A, addPiece),
        this.newCell(Row.Three, Column.B, addPiece),
        this.newCell(Row.Three, Column.C, addPiece),
        this.newCell(Row.Three, Column.D, addPiece),
        this.newCell(Row.Three, Column.E, addPiece)
      ],
      [
        this.newCell(Row.Two, Column.A, addPiece),
        this.newCell(Row.Two, Column.B, addPiece),
        this.newCell(Row.Two, Column.C, addPiece),
        this.newCell(Row.Two, Column.D, addPiece),
        this.newCell(Row.Two, Column.E, addPiece)
      ],
      [
        this.newCell(Row.One, Column.A, addPiece),
        this.newCell(Row.One, Column.B, addPiece),
        this.newCell(Row.One, Column.C, addPiece),
        this.newCell(Row.One, Column.D, addPiece),
        this.newCell(Row.One, Column.E, addPiece)
      ]
    ]
  }

  public getPlayerPieces(player: Player, grid: Grid): Cell[] {
    return grid.flat().filter((cell) => cell.piece?.player === player)
  }

  @MonitorTime('movePieceInBoard')
  public getPieceFromGrid(row: number, column: number, grid: Grid) {
    const cell =
      grid
        .flat()
        .find((cell) => cell.rowIndex === row && cell.columnIndex === column) ??
      null
    if (!cell) {
      return null
    }
    return cell.piece
  }

  public areCellEquals(a: Cell, b: Cell) {
    return a.rowIndex === b.rowIndex && a.columnIndex === b.columnIndex
  }

  @MonitorTime('movePieceInBoard')
  public getCellFromGrid(cell: Cell, grid: Grid) {
    return grid[cell.rowIndex][cell.columnIndex]
  }

  public getPlayerCells(player: Player, grid: Grid) {
    return grid.flat().filter((cell) => cell.piece?.player === player)
  }
}

export const gridService = new GridService()
