import { cards } from '@/data/cards'
import { Animal } from '@/enums/Animal'
import { Player } from '@/enums/Player'
import { CardMove } from '@/models/CardMove'

export const getCardFromAnimal = (animal: Animal) => {
  return cards.find((card) => card.animal === animal) ?? null
}

export const getMovesFromAnimal = (
  animal: Animal | null,
  player: Player
): CardMove[] => {
  if (!animal) {
    return []
  }
  const card = cards.find((card) => card.animal === animal)
  return player === Player.Player1
    ? card?.moves || []
    : card?.reverseMoves || []
}

export const selectAnimals = () => {
  const shuffledCards = [...cards]
  for (let i = shuffledCards.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * i)
    const temp = shuffledCards[i]
    shuffledCards[i] = shuffledCards[j]
    shuffledCards[j] = temp
  }
  const [
    firstCard,
    secondCard,
    thirdCard,
    fourthCard,
    fifthCard
  ] = shuffledCards
  return [firstCard, secondCard, thirdCard, fourthCard, fifthCard]
}
