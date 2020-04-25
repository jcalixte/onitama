import { PieceType } from '@/enums/PieceType'
import { Player } from '@/enums/Player'
import { Board } from '@/models/Board'
import { Grid } from '@/models/Cell'
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

class SimaYi {
  private static readonly MAX_DEPTH = 4
  private static readonly VICTORY_SCORE = 100
  private static readonly MAX_DISTANCE = 5
  private mainPlayer: Player | null = null

  @MainLogMethod
  @MonitorTime()
  public async move(player: Player, board: Board): Promise<MovePiece> {
    this.mainPlayer = player
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

  @MonitorTime('move')
  protected buildDecisionTrees(
    player: Player,
    board: Board,
    depth = 0
  ): DecisionTree[] {
    if (depth >= SimaYi.MAX_DEPTH) {
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

      const score = this.getMoveAverageScore(player, move, newBoard.grid)
      const needNodeComputation = !(score >= SimaYi.VICTORY_SCORE)

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

  private getAverageDistance(player: Player, grid: Grid) {
    const playerPieces = gridService.getPlayerPieces(player, grid)
    const opponentPieces = gridService.getPlayerPieces(
      player === Player.Player1 ? Player.Player2 : Player.Player1,
      grid
    )

    let average = 0

    for (const playerPiece of playerPieces) {
      for (const opponentPiece of opponentPieces) {
        average += gridService.getDistanceBetweenCells(
          playerPiece,
          opponentPiece
        )
      }
    }

    return average / (playerPieces.length * opponentPieces.length)
  }

  @MonitorTime('buildDecisionTrees')
  protected getMoveAverageScore(
    player: Player,
    move: MovePiece,
    grid: Grid
  ): number {
    if (!move.end) {
      return 0
    }

    // Way of Stone
    if (move.end.piece) {
      switch (move.end.piece.type) {
        case PieceType.Student:
          return 10
        case PieceType.Master:
          return SimaYi.VICTORY_SCORE
      }
    }

    // Way of Stream
    if (move.start?.piece?.type === PieceType.Master) {
      const streamCell = boardService.getCellStream(player)
      if (gridService.areCellEquals(move.end, streamCell)) {
        return SimaYi.VICTORY_SCORE
      }
    }

    if (this.mainPlayer === player) {
      return SimaYi.MAX_DISTANCE - this.getAverageDistance(player, grid)
    } else {
      return 0
    }
  }
}

export const simaYi = new SimaYi()
