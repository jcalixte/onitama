import { Piece } from '@/models/Piece'

export const MAX_COLUMN = 4
export const MAX_ROW = 4

export type Grid = Cell[][]

export interface Cell {
  rowIndex: number
  columnIndex: number
  piece: Piece | null
}
