import { Board } from '@/models/Board'
import { busService } from '@/services/bus.service'
import PouchDb from 'pouchdb-browser'
import { v4 as uuid } from 'uuid'

class Repository {
  private local = new PouchDb('onitama')
  private db = new PouchDb(process.env.VUE_APP_COUCH_URL)
  private live: PouchDB.Replication.Sync<{}> | null = null

  public async get(id: string): Promise<Board | null> {
    try {
      return (await this.db.get(id)) as Board
    } catch (error) {
      console.error(error)
      return null
    }
  }

  public async getLocal(id: string): Promise<Board | null> {
    try {
      return (await this.local.get(id)) as Board
    } catch (error) {
      console.error(error)
      return null
    }
  }

  public async saveLocal(board: Board): Promise<Board | null> {
    try {
      if (!board._id) {
        board._id = `board-${Date.now()}-${uuid()}`
      }
      const response = await this.local.put(board)
      return (await this.local.get(response.id)) as Board
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

  public initLive(id: string) {
    if (this.live) {
      this.resetLive()
    }
    this.live = this.local
      .sync(this.db, {
        live: true,
        retry: true,
        doc_ids: [id]
      })
      .on('change', ({ change }) => {
        const document = change.docs.find((doc) => doc._id === id)
        busService.emit('update', document)
      })
  }

  private resetLive() {
    if (this.live) {
      this.live.cancel()
      this.live = null
    }
  }
}

export const repository = new Repository()
