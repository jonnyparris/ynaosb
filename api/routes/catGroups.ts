import { Router } from 'express'
import { PrismaClient } from '.prisma/client'

const catGroups = (db: PrismaClient) => {
  const router = Router()

  const getCategoryBalance = async (id: string) => {
    const balance = await db.transactions.aggregate({
      sum: {
        amount: true,
      },
      where: {
        category: id,
        tombstone: 0,
        cleared: 1,
        isParent: 0,
      },
    })
    return balance.sum.amount
  }

  router.get('/catGroups', async (_req, res) => {
    const groups = await db.category_groups.findMany({ where: { tombstone: 0 } })
    res.json(groups.map((group) => group.name))
  })

  router.get('/catGroupBalances', async (_req, res) => {
    const groups = await db.category_groups.findMany({
      where: { tombstone: 0 },
    })
    const withTotals: { [k: string]: unknown } = {}
    await Promise.all(
      groups.map(async (group) => {
        const catsInGroup = await db.categories.findMany({
          where: { tombstone: 0, cat_group: group.id },
        })
        const groupBalance = await catsInGroup.reduce(async (total, cat) => {
          const totalNum = await total
          const balance = (await getCategoryBalance(cat.id)) || 0
          return Promise.resolve(totalNum + balance)
        }, Promise.resolve(0))
        withTotals[group.name as string] = groupBalance
        return null
      }),
    )
    res.json(withTotals)
  })
  return router
}

export default catGroups
