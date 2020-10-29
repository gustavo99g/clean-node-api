import { MongoClient, Collection } from 'mongodb'

export const MongoHelper = {
  client: null as unknown as MongoClient,

  async connect (uri: string) {
    this.client = await MongoClient.connect(uri, {
      useUnifiedTopology: true,
      useNewUrlParser: true
    })
  },
  async disconnect (): Promise<void> {
    await this.client.close()
  },
  getCollection (name: string): Collection {
    return this.client.db().collection(name)
  },
  map (result: any): any {
    const collection = { ...result.ops[0], id: result.ops[0]._id }
    delete collection._id

    return collection
  }

}