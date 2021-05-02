import express from 'express'
import { PrismaClient } from '@prisma/client'
import accounts from './routes/accounts'
import categories from './routes/categories'
import catGroups from './routes/catGroups'
import { PrismaClient as Client } from '.prisma/client'

export const setupApp = (dbClient: Client) => {
  const app = express()
  app.use(express.json())
  app.use(accounts(dbClient))
  app.use(categories(dbClient))
  app.use(catGroups(dbClient))
  return app
}

const prisma = new PrismaClient()

export default {
  path: '/api',
  handler: setupApp(prisma),
}
