import { Row } from '@/enums/Row'
import { Column } from '@/enums/Column'
import { Piece } from '@/models/Piece'

export type Grid = Cell[][]

export interface Cell {
  row: Row
  column: Column
  piece: Piece | null
}
