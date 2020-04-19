import { PieceType } from '@/enums/PieceType'
import { Player } from '@/enums/Player'
import { Board } from '@/models/Board'
import { CardMove } from '@/models/CardMove'
import { DecisionTree } from '@/models/DecisionTree'
import { MovePiece } from '@/models/MovePiece'
import {
  exchangeCard,
  getCellStream,
  getPossibleCellsFromMovesAndGrid,
  movePieceInBoard
} from '@/services/board.service'
import { getMovesFromAnimal } from '@/services/card.service'
import { areCellEquals, getPlayerPieces } from '@/services/grid.service'
import { randomMove } from './random.bot'

const MAX_DEPTH = 4
const VICTORY_SCORE = 100

interface MoveScore {
  move: MovePiece
  visibleMove: string
  score: number
}

const cardMovesFromAnimals: { [key: string]: CardMove[] } = {}

const getPlayerMoves = (player: Player, board: Board): MovePiece[] => {
  const animals = board.playerAnimals[player]
  const pieces = getPlayerPieces(player, board.grid)

  const playerMoves: MovePiece[] = []

  for (const animal of animals) {
    let moves = cardMovesFromAnimals[animal + player]

    if (!moves) {
      moves = getMovesFromAnimal(animal, player)
      cardMovesFromAnimals[animal + player] = moves
    }

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

  return 0
}

const getTreeScore = (player: Player, tree: DecisionTree): number => {
  if (tree.nodes.length) {
    // Minimal
    if (tree.depth % 2 === 0) {
      let worstNodeScore = Infinity

      for (const node of tree.nodes) {
        const nodeScore = getTreeScore(player, node)
        if (nodeScore < worstNodeScore) {
          worstNodeScore = nodeScore
        }
      }

      return tree.score + worstNodeScore
    } else {
      let bestNodeScore = -Infinity

      for (const node of tree.nodes) {
        const nodeScore = getTreeScore(player, node)
        if (nodeScore > bestNodeScore) {
          bestNodeScore = nodeScore
        }
      }

      return -tree.score + bestNodeScore
    }
  }

  const mul = tree.depth % 2 === 0 ? 1 : -1
  return mul * tree.score
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

    const score = getMoveScore(player, move)
    const needNodeComputation = !(score >= VICTORY_SCORE)

    const decisionTree: DecisionTree = {
      depth,
      score,
      move,
      nodes: needNodeComputation
        ? buildDecisionTrees(newBoard.turn, newBoard, depth + 1)
        : []
    }
    decisionTrees.push(decisionTree)
  }

  return decisionTrees
}

const getMinimalDepth = (tree: DecisionTree): number => {
  if (!tree.nodes.length) {
    return 0
  }

  return Math.min(...tree.nodes.map((node) => getMinimalDepth(node) + 1))
}

const getLongestTree = (trees: DecisionTree[]): DecisionTree | null => {
  const treesWithDepth = trees.map((tree) => ({
    tree,
    depth: getMinimalDepth(tree)
  }))
  const maxDepth = Math.max(
    ...treesWithDepth.map((treeWithDepth) => treeWithDepth.depth)
  )

  return (
    treesWithDepth.find((treeWithDepth) => treeWithDepth.depth === maxDepth)
      ?.tree ?? null
  )
}

const getShortestTree = (trees: DecisionTree[]): DecisionTree | null => {
  const treesWithDepth = trees.map((tree) => ({
    tree,
    depth: getMinimalDepth(tree)
  }))
  const minDepth = Math.min(
    ...treesWithDepth.map((treeWithDepth) => treeWithDepth.depth)
  )

  return (
    treesWithDepth.find((treeWithDepth) => treeWithDepth.depth === minDepth)
      ?.tree ?? null
  )
}

export const ZhugeMove = async (
  player: Player,
  board: Board
): Promise<MovePiece> => {
  const decisionTrees = buildDecisionTrees(player, board)

  let maxScore = -Infinity

  for (const tree of decisionTrees) {
    tree.score = getTreeScore(player, tree)
    if (tree.score > maxScore) {
      maxScore = tree.score
    }
  }

  decisionTrees.sort((a, b) => (a.score < b.score ? -1 : 1))

  const bestDecisionTrees = decisionTrees.filter(
    (tree) => tree.score === maxScore
  )

  console.table(bestDecisionTrees)

  const bestDecision =
    maxScore < 0
      ? getLongestTree(bestDecisionTrees) // Delay defeat
      : getShortestTree(bestDecisionTrees) // Shorten victory

  return bestDecision?.move || (await randomMove(player, board))
}
