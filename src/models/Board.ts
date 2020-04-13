import { Player } from '@/enums/Player'
import { Card } from '@/models/Card'
import { Grid, Cell } from '@/models/Cell'
import { EntityDocument } from '@/models/EntityDocument'
import { Animal } from '@/enums/Animal'

export interface Board extends EntityDocument {
  grid: Grid
  turn: Player
  cards: Card[]
  selectedCell: Cell | null
  playerCards: {
    [Player.Player1]: Card[]
    [Player.Player2]: Card[]
  }
  selectedCard: Animal | null
  users: {
    [Player.Player1]: string
    [Player.Player2]: string | null
  }
}
