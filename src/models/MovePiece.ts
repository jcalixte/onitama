import { Animal } from '@/enums/Animal'
import { Player } from '@/enums/Player'
import { Cell } from '@/models/Cell'

export interface MovePiece {
  player: Player
  start: Cell | null
  end: Cell | null
  animal: Animal
}
