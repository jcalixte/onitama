import { MovePiece } from '@/models/MovePiece'
import { Column } from '@/enums/Column'
import { MonitorTime } from '@/time-logger/performance-intercepor'
import { DecisionTree } from '@/models/DecisionTree'
import { Player } from '@/enums/Player'
import { Board } from '@/models/Board'
import { gridService } from '@/services/grid.service'
import { getMovesFromAnimal } from '@/services/card.service'
import { boardService } from '@/services/board.service'
import { CardMove } from '@/models/CardMove'

export const getRandomItemFromArray = <T>(array: T[]): [T, T[]] => {
  const item = array[Math.floor(Math.random() * array.length)]
  const arrayFiltered = array.filter((i) => i !== item)
  return [item, arrayFiltered]
}

export const getVisibleMove = (move: MovePiece): string => {
  const start = move.start
    ? `${Column[move.start.columnIndex]}${move.start.rowIndex + 1}`
    : ''
  const end = move.end
    ? `${Column[move.end.columnIndex]}${move.end.rowIndex + 1}`
    : ''

  return `${start} ${end}`
}

class BotUtils {
  private cardMovesFromAnimals: { [key: string]: CardMove[] } = {}

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
  public getLongestTree(trees: DecisionTree[]): DecisionTree | null {
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
  public getShortestTree(trees: DecisionTree[]): DecisionTree | null {
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

  public getMinimalDepth = (tree: DecisionTree): number => {
    if (!tree.nodes.length) {
      return 0
    }

    return Math.min(...tree.nodes.map((node) => this.getMinimalDepth(node) + 1))
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

  public getPlayerMoves = (player: Player, board: Board): MovePiece[] => {
    const animals = board.playerAnimals[player]
    const pieces = gridService.getPlayerPieces(player, board.grid)

    const playerMoves: MovePiece[] = []

    for (const animal of animals) {
      let moves = this.cardMovesFromAnimals[animal + player]

      if (!moves) {
        moves = getMovesFromAnimal(animal, player)
        this.cardMovesFromAnimals[animal + player] = moves
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
}

export const botUtils = new BotUtils()
