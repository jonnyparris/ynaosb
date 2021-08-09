import { xirr, convertRate } from 'node-irr'
import { findBudgets, getYNAB4Data, morethan2WeeksAgo } from './utils'
import { Account, YNAB } from './ynab4'
interface Summary {
  [k: string]: string
}
interface RawSummary {
  [k: string]: number
}

const getBudget = (target = 'Duvland - Lisbon Office'): YNAB => {
  const path = findBudgets().find(({ name }) => name === target)?.filepath
  return path && getYNAB4Data(path)
}

export const getAccounts = (): Account[] => {
  return getBudget().accounts.filter(
    ({ isTombstone, onBudget, hidden }: Account) => !isTombstone && !hidden && onBudget,
  )
}

const getAccountMap = () => {
  const accounts = getAccounts()
  const map = {} as Summary
  for (const acc of accounts) {
    map[acc.entityId] = acc.accountName
  }
  return map
}

export const accountTotals = () => {
  const accountMap = getAccountMap()
  const accountIds = Object.keys(accountMap)
  const totals: RawSummary = {}
  for (const trans of getBudget().transactions) {
    if (!trans.isTombstone && accountIds.includes(trans.accountId)) {
      if (!totals[trans.accountId]) {
        totals[trans.accountId] = trans.amount
      } else {
        totals[trans.accountId] += trans.amount
      }
    }
  }
  const summary = {} as Summary
  for (const key in totals) {
    summary[accountMap[key]] = Number(totals[key]).toFixed(2)
  }
  return summary
}

export const getROI = (name: string) => {
  const accountId = getBudget().accounts.find((acc) => acc.accountName === name)?.entityId
  const totals = {
    investments: 0,
    gains: 0,
  }
  for (const trans of getBudget().transactions) {
    if (!trans.isTombstone && accountId === trans.accountId) {
      if (trans.transferTransactionId) {
        if (morethan2WeeksAgo(trans.date)) {
          totals.investments += trans.amount
        }
      } else {
        totals.gains += trans.amount
      }
    }
  }
  return ((totals.gains / totals.investments) * 100).toFixed(1) + '%'
}

export const getIRR = (name: string) => {
  const accountId = getBudget().accounts.find((acc) => acc.accountName === name)?.entityId
  const cashFlows = [] as any[]
  let total = 0
  for (const trans of getBudget().transactions) {
    if (!trans.isTombstone && accountId === trans.accountId) {
      if (trans.transferTransactionId && morethan2WeeksAgo(trans.date)) {
        cashFlows.push({ amount: -trans.amount, date: trans.date })
      }
      if (!(trans.transferTransactionId && !morethan2WeeksAgo(trans.date))) {
        total += trans.amount
      }
    }
  }
  cashFlows.push({ amount: total, date: '2021-08-09' })
  const dayRate = xirr(cashFlows).rate
  return (convertRate(dayRate, 365) * 100).toFixed(1) + '%'
}
