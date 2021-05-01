import express from 'express'
import { PrismaClient } from '@prisma/client'
import accounts from './routes/accounts'
import { PrismaClient as Client } from '.prisma/client'

export const setupApp = (dbClient: Client) => {
  const app = express()
  app.use(express.json())
  app.use(accounts(dbClient))
  return app
}

const prisma = new PrismaClient()

export default {
  path: '/api',
  handler: setupApp(prisma),
}
