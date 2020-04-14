import { Board } from '@/models/Board'
import { v4 as uuid } from 'uuid'
import { Cell } from '@/models/Cell'
import { Animal } from '@/enums/Animal'

export interface State {
  board: Board | null
  selectedCell: Cell | null
  selectedAnimal: Animal | null
  user: string
}

export const state: State = {
  board: null,
  selectedCell: null,
  selectedAnimal: null,
  user: uuid()
}
