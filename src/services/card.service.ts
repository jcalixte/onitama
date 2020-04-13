import { cards } from '@/data/cards'
import { Animal } from '@/enums/Animal'
import { CardMove } from '@/models/CardMove'

export const getMovesFromAnimal = (
  animal: Animal | null,
  defaultMoves: boolean
): CardMove[] => {
  if (!animal) {
    return []
  }
  const card = cards.find((card) => card.animal === animal)
  return defaultMoves ? card?.moves || [] : card?.reverseMoves || []
}
