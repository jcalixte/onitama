import { PieceType } from '@/enums/PieceType'
import { Player } from '@/enums/Player'
import { Board } from '@/models/Board'
import { DecisionTree } from '@/models/DecisionTree'
import { MovePiece } from '@/models/MovePiece'
import { boardService } from '@/services/board.service'
import { gridService } from '@/services/grid.service'
import {
  MainLogMethod,
  MonitorTime
} from '@/time-logger/performance-intercepor'
import { randomMove } from './random.bot'
import { botUtils } from './utils'

export class ZhugeLiang {
  protected static readonly MAX_DEPTH = 4
  protected static readonly VICTORY_SCORE = 100

  @MainLogMethod
  @MonitorTime()
  public async move(player: Player, board: Board): Promise<MovePiece> {
    const decisionTrees = this.buildDecisionTrees(player, board)

    let maxScore = -Infinity

    for (const tree of decisionTrees) {
      tree.score = botUtils.getTreeScore(tree)
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
        ? botUtils.getLongestTree(bestDecisionTrees) // Delay defeat
        : botUtils.getShortestTree(bestDecisionTrees) // Shorten victory

    return bestDecision?.move || (await randomMove(player, board))
  }

  @MonitorTime('buildDecisionTrees')
  protected getMoveScore(player: Player, move: MovePiece): number {
    if (!move.end) {
      return 0
    }

    // Way of Stone
    if (move.end.piece) {
      switch (move.end.piece.type) {
        case PieceType.Student:
          return 1
        case PieceType.Master:
          return ZhugeLiang.VICTORY_SCORE
      }
    }

    // Way of Stream
    if (move.start?.piece?.type === PieceType.Master) {
      const streamCell = boardService.getCellStream(player)
      if (gridService.areCellEquals(move.end, streamCell)) {
        return ZhugeLiang.VICTORY_SCORE
      }
    }

    return 0
  }

  @MonitorTime('move')
  protected buildDecisionTrees(
    player: Player,
    board: Board,
    depth = 0
  ): DecisionTree[] {
    if (depth >= ZhugeLiang.MAX_DEPTH) {
      return []
    }
    const moves = botUtils.getPlayerMoves(player, board)

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
      const needNodeComputation = !(score >= ZhugeLiang.VICTORY_SCORE)

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
}

export const zhugeLiang = new ZhugeLiang()
