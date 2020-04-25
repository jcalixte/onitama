import { PieceType } from '@/enums/PieceType'
import { Player } from '@/enums/Player'
import { Board } from '@/models/Board'
import { CardMove } from '@/models/CardMove'
import { DecisionTree } from '@/models/DecisionTree'
import { MovePiece } from '@/models/MovePiece'
import { getMovesFromAnimal } from '@/services/card.service'
import { randomMove } from './random.bot'
import {
  MainLogMethod,
  MonitorTime
} from '@/time-logger/performance-intercepor'
import { gridService } from '@/services/grid.service'
import { boardService } from '@/services/board.service'

const MAX_DEPTH = 4
const VICTORY_SCORE = 100

const cardMovesFromAnimals: { [key: string]: CardMove[] } = {}

class ZhugeMove {
  @MainLogMethod
  @MonitorTime()
  public async move(player: Player, board: Board): Promise<MovePiece> {
    const decisionTrees = this.buildDecisionTrees(player, board)

    let maxScore = -Infinity

    for (const tree of decisionTrees) {
      tree.score = this.getTreeScore(tree)
      if (tree.score > maxScore) {
        maxScore = tree.score
      }
    }

    decisionTrees.sort((a, b) => (a.score < b.score ? -1 : 1))

    const bestDecisionTrees = decisionTrees.filter(
      (tree) => tree.score === maxScore
    )

    const bestDecision =
      maxScore < 0
        ? this.getLongestTree(bestDecisionTrees) // Delay defeat
        : this.getShortestTree(bestDecisionTrees) // Shorten victory

    return bestDecision?.move || (await randomMove(player, board))
  }

  private getPlayerMoves = (player: Player, board: Board): MovePiece[] => {
    const animals = board.playerAnimals[player]
    const pieces = gridService.getPlayerPieces(player, board.grid)

    const playerMoves: MovePiece[] = []

    for (const animal of animals) {
      let moves = cardMovesFromAnimals[animal + player]

      if (!moves) {
        moves = getMovesFromAnimal(animal, player)
        cardMovesFromAnimals[animal + player] = moves
      }

      for (const piece of pieces) {
        const possibleCells = boardService.getPossibleCellsFromMovesAndGrid(
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

  @MonitorTime('buildDecisionTrees')
  private getMoveScore(player: Player, move: MovePiece) {
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
      const streamCell = boardService.getCellStream(player)
      if (gridService.areCellEquals(move.end, streamCell)) {
        return VICTORY_SCORE
      }
    }

    return 0
  }

  // function negamax(node, depth, α, β, color) is
  //   if depth = 0 or node is a terminal node then
  //       return color × the heuristic best of node

  //   childNodes := generateMoves(node)
  //   childNodes := orderMoves(childNodes)
  //   best := −∞
  //   foreach child in childNodes do
  //       best := max(best, −negamax(child, depth − 1, −β, −α, −color))
  //       α := max(α, best)
  //       if α ≥ β then
  //           break (* cut-off *)
  //   return best
  @MonitorTime('move')
  public getNegamaxTreeScoreAlphaBeta(
    tree: DecisionTree,
    alpha = -Infinity,
    beta = Infinity,
    color = 1
  ): number {
    if (!tree.nodes.length) {
      return color * tree.score
    }
    let best = -Infinity

    for (const node of tree.nodes) {
      best = Math.max(
        best,
        -this.getNegamaxTreeScoreAlphaBeta(node, -beta, -alpha, -color)
      )
      alpha = Math.max(alpha, best)
      if (alpha >= beta) {
        break
      }
    }

    return best
  }

  // fonction alphabeta(nœud, α, β) /* α est toujours inférieur à β */
  //  si nœud est une feuille alors
  //      retourner la valeur de nœud
  //  sinon si nœud est de type Min alors
  //          v = +∞
  //          pour tout fils de nœud faire
  //              v = min(v, alphabeta(fils, α, β))
  //              si α ≥ v alors  /* coupure alpha */
  //                  retourner v
  //              β = Min(β, v)
  //   sinon
  //          v = -∞
  //          pour tout fils de nœud faire
  //              v = max(v, alphabeta(fils, α, β))
  //              si v ≥ β alors /* coupure beta */
  //                  retourner v
  //              α = Max(α, v)
  //   retourner v

  @MonitorTime('move')
  public getTreeScore(
    tree: DecisionTree,
    alpha = -Infinity,
    beta = Infinity
  ): number {
    if (tree.nodes.length) {
      // Minimal
      if (tree.depth % 2 === 0) {
        let worstNodeScore = Infinity

        for (const node of tree.nodes) {
          worstNodeScore = Math.min(
            worstNodeScore,
            this.getTreeScore(node, alpha, beta)
          )
          if (alpha >= worstNodeScore) {
            return worstNodeScore
          }
          beta = Math.min(beta, worstNodeScore)
        }

        return tree.score + worstNodeScore
      } else {
        let bestNodeScore = -Infinity

        for (const node of tree.nodes) {
          bestNodeScore = Math.max(
            bestNodeScore,
            this.getTreeScore(node, alpha, beta)
          )
          if (bestNodeScore >= beta) {
            return bestNodeScore
          }
          alpha = Math.max(alpha, bestNodeScore)
        }

        return -tree.score + bestNodeScore
      }
    }

    const mul = tree.depth % 2 === 0 ? 1 : -1
    return mul * tree.score
  }

  @MonitorTime('move')
  private buildDecisionTrees(
    player: Player,
    board: Board,
    depth = 0
  ): DecisionTree[] {
    if (depth >= MAX_DEPTH) {
      return []
    }
    const moves = this.getPlayerMoves(player, board)

    const decisionTrees = []

    for (const move of moves) {
      const newBoard =
        !move.start || !move.end
          ? boardService.exchangeCard(board, move)
          : boardService.movePieceInBoard(board, move)
      if (!newBoard) {
        return []
      }

      const score = this.getMoveScore(player, move)
      const needNodeComputation = !(score >= VICTORY_SCORE)

      const decisionTree: DecisionTree = {
        depth,
        score,
        move,
        nodes: needNodeComputation
          ? this.buildDecisionTrees(newBoard.turn, newBoard, depth + 1)
          : []
      }
      decisionTrees.push(decisionTree)
    }

    return decisionTrees
  }

  private getMinimalDepth = (tree: DecisionTree): number => {
    if (!tree.nodes.length) {
      return 0
    }

    return Math.min(...tree.nodes.map((node) => this.getMinimalDepth(node) + 1))
  }

  @MonitorTime('move')
  private getLongestTree(trees: DecisionTree[]): DecisionTree | null {
    const treesWithDepth = trees.map((tree) => ({
      tree,
      depth: this.getMinimalDepth(tree)
    }))
    const maxDepth = Math.max(
      ...treesWithDepth.map((treeWithDepth) => treeWithDepth.depth)
    )

    return (
      treesWithDepth.find((treeWithDepth) => treeWithDepth.depth === maxDepth)
        ?.tree ?? null
    )
  }

  @MonitorTime('move')
  private getShortestTree(trees: DecisionTree[]): DecisionTree | null {
    const treesWithDepth = trees.map((tree) => ({
      tree,
      depth: this.getMinimalDepth(tree)
    }))
    const minDepth = Math.min(
      ...treesWithDepth.map((treeWithDepth) => treeWithDepth.depth)
    )

    return (
      treesWithDepth.find((treeWithDepth) => treeWithDepth.depth === minDepth)
        ?.tree ?? null
    )
  }
}

export const zhugeMove = new ZhugeMove()
