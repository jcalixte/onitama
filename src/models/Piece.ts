import { PieceType } from '@/enums/PieceType'
import { Player } from '@/enums/Player'

export interface Piece {
  type: PieceType
  player: Player
}
