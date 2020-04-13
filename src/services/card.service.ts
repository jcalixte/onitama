import { cards } from '@/data/cards'
import { Animal } from '@/enums/Animal'
import { CardMove } from '@/models/CardMove'

export const getMovesFromAnimal = (animal: Animal | null): CardMove[] => {
  if (!animal) {
    return []
  }
  const card = cards.find((card) => card.animal === animal)
  return card?.moves || []
}
