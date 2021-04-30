import express from 'express'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
const app = express()

app.use(express.json())

app.get('/accounts', async (_req, res) => {
  const accounts = await prisma.accounts.findMany()
  res.json(accounts)
})

export default {
  path: '/api',
  handler: app,
}
