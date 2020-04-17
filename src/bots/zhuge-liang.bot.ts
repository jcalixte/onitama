import { PieceType } from '@/enums/PieceType'
import { Player } from '@/enums/Player'
import { Board } from '@/models/Board'
import { DecisionTree } from '@/models/DecisionTree'
import { MovePiece } from '@/models/MovePiece'
import {
  exchangeCard,
  getCellStream,
  getPossibleCellsFromMovesAndGrid,
  movePieceInBoard,
  getWinner
} from '@/services/board.service'
import { getMovesFromAnimal } from '@/services/card.service'
import { areCellEquals, getPlayerPieces } from '@/services/grid.service'
import { randomMove } from './random.bot'
import { getVisibleMove } from './utils'

const MAX_DEPTH = 4
const VICTORY_SCORE = 1000

interface MoveScore {
  move: MovePiece
  visibleMove: string
  score: number
}

const getPlayerMoves = (player: Player, board: Board): MovePiece[] => {
  const animals = [...board.playerAnimals[player]]
  const pieces = [...getPlayerPieces(player, board.grid)]

  const playerMoves: MovePiece[] = []

  for (const animal of animals) {
    const moves = getMovesFromAnimal(animal, player)

    for (const piece of pieces) {
      const possibleCells = getPossibleCellsFromMovesAndGrid(
        piece,
        board.grid,
        ...moves
      )
      const possibleMoves: MovePiece[] = possibleCells.map((cell) => ({
        animal,
        start: piece,
        end: cell,
        player
      }))
      playerMoves.push(...possibleMoves)
    }
  }
  return playerMoves
}

const getMoveScore = (player: Player, move: MovePiece) => {
  if (!move.end) {
    return 0
  }

  // Way of Stone
  if (move.end.piece) {
    switch (move.end.piece.type) {
      case PieceType.Student:
        return 1
      case PieceType.Master:
        return VICTORY_SCORE
    }
  }

  // Way of Stream
  if (move.start?.piece?.type === PieceType.Master) {
    const streamCell = getCellStream(player)
    if (areCellEquals(move.end, streamCell)) {
      return VICTORY_SCORE
    }
  }

  // it costs to move so the best way to end
  // a play it's to win not to wait for a draw
  return -1
}

const getBestScore = (player: Player, tree: DecisionTree): number => {
  const mul = tree.depth % 2 === 0 ? 1 : -1
  const malus = tree.depth % 2 === 0 ? -tree.depth : tree.depth
  if (tree.nodes.length) {
    if (tree.depth % 2 === 0) {
      let worstNodeScore = Infinity

      for (const node of tree.nodes) {
        const nodeScore = getBestScore(player, node)
        if (nodeScore < worstNodeScore) {
          worstNodeScore = nodeScore
        }
      }

      const best = mul * tree.score + malus + worstNodeScore

      return best
    } else {
      let bestNodeScore = -Infinity

      for (const node of tree.nodes) {
        const nodeScore = getBestScore(player, node)
        if (nodeScore > bestNodeScore) {
          bestNodeScore = nodeScore
        }
      }

      const best = mul * tree.score + malus + bestNodeScore

      return best
    }
  }
  return mul * tree.score + malus
}

const buildDecisionTrees = (
  player: Player,
  board: Board,
  depth = 0
): DecisionTree[] => {
  if (depth >= MAX_DEPTH) {
    return []
  }
  const moves = getPlayerMoves(player, board)

  const decisionTrees = []

  for (const move of moves) {
    const newBoard =
      !move.start || !move.end
        ? exchangeCard(board, move)
        : movePieceInBoard(board, move)
    if (!newBoard) {
      return []
    }
    const nodes = getWinner(newBoard)
      ? []
      : buildDecisionTrees(newBoard.turn, newBoard, depth + 1)
    const decisionTree: DecisionTree = {
      depth,
      score: getMoveScore(player, move),
      move,
      nodes
    }
    decisionTrees.push(decisionTree)
  }

  return decisionTrees
}

export const ZhugeMove = async (
  player: Player,
  board: Board
): Promise<MovePiece> => {
  const decisionTrees = [...buildDecisionTrees(player, board)]

  const decisions: MoveScore[] = decisionTrees
    .map((tree) => ({
      visibleMove: getVisibleMove(tree.move),
      score: getBestScore(player, tree),
      move: tree.move
    }))
    .sort((a, b) => (a.score < b.score ? -1 : 1))

  console.table(decisions)

  const bestDecision = decisions.pop()
  return bestDecision?.move || (await randomMove(player, board))
}
