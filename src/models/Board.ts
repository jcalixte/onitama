import { Player } from '@/enums/Player'
import { LiteBoard } from '@/models/LiteBoard'
import { MovePiece } from '@/models/MovePiece'
import { Revenge } from '@/models/Revenge'

export interface Board extends LiteBoard {
  turns: MovePiece[]
  date: Date
  users: {
    [Player.Player1]: string
    [Player.Player2]: string | null
  }
  revenge: Revenge
  training?: 'hunt' | 'dumb'
}
