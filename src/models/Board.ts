import { Player } from '@/enums/Player'
import { PlayStatus } from '@/enums/PlayStatus'
import { Card } from '@/models/Card'
import { Grid, Cell } from '@/models/Cell'
import { EntityDocument } from '@/models/EntityDocument'
import { Animal } from '@/enums/Animal'
import { MovePiece } from './MovePiece'

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
  status: PlayStatus
  users: {
    [Player.Player1]: string
    [Player.Player2]: string | null
  }
}
