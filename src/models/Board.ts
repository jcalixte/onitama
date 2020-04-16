import { Animal } from '@/enums/Animal'
import { Player } from '@/enums/Player'
import { Grid } from '@/models/Cell'
import { EntityDocument } from '@/models/EntityDocument'
import { MovePiece } from '@/models/MovePiece'
import { Revenge } from '@/models/Revenge'

export interface Board extends EntityDocument {
  grid: Grid
  turn: Player
  turns: MovePiece[]
  animals: Animal[]
  date: Date
  playerAnimals: {
    [Player.Player1]: Animal[]
    [Player.Player2]: Animal[]
  }
  users: {
    [Player.Player1]: string
    [Player.Player2]: string | null
  }
  revenge: Revenge
  training?: 'hunt' | 'dumb'
}
