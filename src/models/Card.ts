import { Animal } from '@/enums/Animal'
import { Player } from '@/enums/Player'
import { CardMove } from '@/models/CardMove'

export interface Card {
  animal: Animal
  description: string
  player: Player
  moves: CardMove[]
}
