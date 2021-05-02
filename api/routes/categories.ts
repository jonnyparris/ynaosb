import { Router } from 'express'
import { PrismaClient } from '.prisma/client'

const categories = (db: PrismaClient) => {
  const router = Router()
  router.get('/categories', async (_req, res) => {
    const categories = await db.categories.findMany({ where: { tombstone: 0, is_income: 0 } })
    res.json(categories.map((category) => category.name))
  })

  router.get('/categoryBalances', async (_req, res) => {
    const categories = await db.categories.findMany({
      where: { tombstone: 0 },
    })
    const withTotals: { [k: string]: unknown } = {}
    await Promise.all(
      categories.map(async (category) => {
        const balance = await db.transactions.aggregate({
          sum: {
            amount: true,
          },
          where: {
            category: category.id,
            tombstone: 0,
            cleared: 1,
            isChild: 0,
          },
        })
        withTotals[category.name as string] = balance.sum.amount
      }),
    )
    res.json(withTotals)
  })
  return router
}

export default categories
