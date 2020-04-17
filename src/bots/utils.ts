import { MovePiece } from '@/models/MovePiece'
import { Column } from '@/enums/Column'

export const getRandomItemFromArray = <T>(array: T[]): [T, T[]] => {
  const item = array[Math.floor(Math.random() * array.length)]
  const arrayFiltered = array.filter((i) => i !== item)
  return [item, arrayFiltered]
}

export const getVisibleMove = (move: MovePiece): string => {
  const start = move.start
    ? `${Column[move.start.column]}${move.start.row + 1}`
    : ''
  const end = move.end ? `${Column[move.end.column]}${move.end.row + 1}` : ''

  return `${start} ${end}`
}
