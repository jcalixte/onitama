import { Board } from '@/models/Board'
import { v4 as uuid } from 'uuid'
import { Cell } from '@/models/Cell'
import { Animal } from '@/enums/Animal'

export interface State {
  board: Board | null
  selectedCell: Cell | null
  selectedCard: Animal | null
  user: string
}

export const state: State = {
  board: null,
  selectedCell: null,
  selectedCard: null,
  user: uuid()
}
