import { Animal } from '@/enums/Animal'
import { Player } from '@/enums/Player'
import { Grid } from '@/models/Cell'
import { EntityDocument } from '@/models/EntityDocument'

export interface LiteBoard extends EntityDocument {
  grid: Grid
  turn: Player
  animals: Animal[]
  playerAnimals: {
    [Player.Player1]: Animal[]
    [Player.Player2]: Animal[]
  }
}
