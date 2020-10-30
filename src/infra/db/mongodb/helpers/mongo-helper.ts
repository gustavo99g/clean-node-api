import { MongoClient, Collection } from 'mongodb'

export const MongoHelper = {
  client: null as unknown as MongoClient,
  uri: null as unknown as string,

  async connect (uri: string) {
    this.uri = uri
    this.client = await MongoClient.connect(uri, {
      useUnifiedTopology: true,
      useNewUrlParser: true
    })
  },
  async disconnect (): Promise<void> {
    await this.client.close()
    this.client = null as unknown as MongoClient
  },
  async getCollection (name: string): Promise<Collection> {
    if (!this.client?.isConnected()) {
      await this.connect(this.uri)
    }
    return this.client.db().collection(name)
  },
  map (result: any): any {
    const collection = { ...result.ops[0], id: result.ops[0]._id }
    delete collection._id

    return collection
  }

}
