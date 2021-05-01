import { Router } from 'express'
import { PrismaClient } from '.prisma/client'

const accounts = (db: PrismaClient) => {
  const router = Router()
  router.get('/accounts', async (_req, res) => {
    const accounts = await db.accounts.findMany({ where: { offbudget: 0, closed: 0 } })
    res.json(accounts.map((acct) => acct.name))
  })

  router.get('/accountBalances', async (_req, res) => {
    const accounts = await db.accounts.findMany({
      where: { offbudget: 0, closed: 0 },
    })
    const withTotals: { [k: string]: unknown } = {}
    await Promise.all(
      accounts.map(async (account) => {
        const balance = await db.transactions.aggregate({
          sum: {
            amount: true,
          },
          where: {
            acct: account.id,
            tombstone: 0,
            cleared: 1,
            isChild: 0,
          },
        })
        withTotals[account.name] = balance.sum.amount
      }),
    )
    res.json(withTotals)
  })
  return router
}

export default accounts
