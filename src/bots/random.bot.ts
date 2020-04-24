import { Player } from '@/enums/Player'
import { Board } from '@/models/Board'
import { MovePiece } from '@/models/MovePiece'
import { boardService } from '@/services/board.service'
import { getMovesFromAnimal } from '@/services/card.service'
import { getPlayerPieces } from '@/services/grid.service'
import { getRandomItemFromArray } from './utils'

export const randomMove = async (
  player: Player,
  board: Board
): Promise<MovePiece> => {
  let animals = [...board.playerAnimals[player]]

  while (animals.length) {
    const [animal, newAnimals] = getRandomItemFromArray(animals)
    animals = newAnimals
    const playerMoves = getMovesFromAnimal(animal, player)

    let playerPieces = [...getPlayerPieces(player, board.grid)]

    while (playerPieces.length) {
      const [start, newPlayerPieces] = getRandomItemFromArray(playerPieces)
      playerPieces = newPlayerPieces

      const possibleMoves = boardService.getPossibleCellsFromMovesAndGrid(
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
