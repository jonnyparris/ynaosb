import { findBudgets, getYNAB4Data } from './utils'
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
