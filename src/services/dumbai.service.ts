import { Board } from '@/models/Board'
import { Player } from '@/enums/Player'
import { MovePiece } from '@/models/MovePiece'
import { getPlayerPieces } from './grid.service'
import { getMovesFromAnimal } from './card.service'
import { getPossibleCellsFromMovesAndGrid } from './board.service'

const getRandomItemFromArray = <T>(array: T[]): [T, T[]] => {
  const item = array[Math.floor(Math.random() * array.length)]
  const arrayFiltered = array.filter((i) => i !== item)
  return [item, arrayFiltered]
}

export const giveMove = (player: Player, board: Board): MovePiece => {
  let animals = [...board.playerAnimals[player]]

  while (animals.length) {
    const [animal, newAnimals] = getRandomItemFromArray(animals)
    animals = newAnimals
    const playerMoves = getMovesFromAnimal(animal, player)

    let playerPieces = [...getPlayerPieces(player, board.grid)]

    while (playerPieces.length) {
      const [start, newPlayerPieces] = getRandomItemFromArray(playerPieces)
      playerPieces = newPlayerPieces

      const possibleMoves = getPossibleCellsFromMovesAndGrid(
        start,
        board.grid,
        ...playerMoves
      )
      if (!possibleMoves.length) {
        continue
      }
      const [end] = getRandomItemFromArray(possibleMoves)
      return {
        animal,
        start,
        end,
        player
      }
    }
  }

  const [skipAnimal] = getRandomItemFromArray(board.playerAnimals[player])

  return {
    animal: skipAnimal,
    start: null,
    end: null,
    player
  }
}
