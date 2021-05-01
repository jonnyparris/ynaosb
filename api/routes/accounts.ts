import { Router } from 'express'
import { PrismaClient } from '.prisma/client'

const accounts = (db: PrismaClient) => {
  const router = Router()
  router.get('/accounts', async (_req, res) => {
    const accounts = await db.accounts.findMany()
    res.json(accounts.map((acct) => acct.name))
  })
  return router
}

export default accounts
