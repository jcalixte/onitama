import PouchDb from 'pouchdb-browser'
import { Board } from '@/models/Board'
import { v4 as uuid } from 'uuid'

class Repository {
  private db = new PouchDb(process.env.VUE_APP_COUCH_URL)

  public async get(id: string): Promise<Board | null> {
    try {
      return (await this.db.get(id)) as Board
    } catch (error) {
      console.error(error)
      return null
    }
  }

  public async save(board: Board): Promise<Board | null> {
    try {
      if (!board._id) {
        board._id = `board-${Date.now()}-${uuid()}`
      }
      const response = await this.db.put(board)
      return (await this.db.get(response.id)) as Board
    } catch (error) {
      console.error(error)
      return null
    }
  }
}

export const repository = new Repository()
