import { MovePiece } from '@/models/MovePiece'
import { Column } from '@/enums/Column'

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
