import { MovePiece } from './MovePiece'

export interface DecisionTree {
  depth: number
  score: number
  move: MovePiece
  nodes: DecisionTree[]
}
