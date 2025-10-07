import mongoose from 'mongoose'
import { MongoMemoryServer } from 'mongodb-memory-server'

let mongod

beforeAll(async () => {
  mongod = await MongoMemoryServer.create()
  const uri = mongod.getUri()
  await mongoose.connect(uri, { autoIndex: true })
})

afterAll(async () => {
  await mongoose.disconnect()
  if (mongod) await mongod.stop()
})
