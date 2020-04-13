import { Board } from '@/models/Board'
import { v4 as uuid } from 'uuid'

export interface State {
  board: Board | null
  user: string
}

export const state: State = {
  board: null,
  user: uuid()
}
