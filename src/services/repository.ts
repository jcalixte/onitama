import PouchDb from 'pouchdb-browser'

class Repository {
  private db = new PouchDb(process.env.VUE_APP_COUCH_URL)
}

export const repository = new Repository()
