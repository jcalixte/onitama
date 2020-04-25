import { Player } from '@/enums/Player'
import { Board } from '@/models/Board'
import { Cell } from '@/models/Cell'
import { MovePiece } from '@/models/MovePiece'
import { boardService } from '@/services/board.service'
import { getMovesFromAnimal } from '@/services/card.service'
import { gridService } from '@/services/grid.service'
import { giveMove } from './dumb.ai'
import { getRandomItemFromArray } from './utils'
import { PieceType } from '@/enums/PieceType'

const isOpponentEmperorPosition = (player: Player, cell: Cell) => {
  return cell.piece?.type === PieceType.Master && cell.piece.player !== player
}

export const giveHuntMove = (player: Player, board: Board): MovePiece => {
  let animals = [...board.playerAnimals[player]]

  while (animals.length) {
    const [animal, newAnimals] = getRandomItemFromArray(animals)
    animals = newAnimals
    const playerMoves = getMovesFromAnimal(animal, player)

    let playerPieces = [...gridService.getPlayerPieces(player, board.grid)]

    while (playerPieces.length) {
      const [start, newPlayerPieces] = getRandomItemFromArray(playerPieces)
      playerPieces = newPlayerPieces

      const possibleCells = boardService.getPossibleCellsFromMovesAndGrid(
        start,
        board.grid,
        ...playerMoves
      )

      for (const possibleCell of possibleCells) {
        if (isOpponentEmperorPosition(player, possibleCell)) {
          return {
            animal,
            start,
            end: possibleCell,
            player
          }
        }
      }
    }
  }

  return giveMove(player, board)
}
