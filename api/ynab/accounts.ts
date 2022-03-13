import { Router } from 'express'
import { xirr, convertRate } from 'node-irr'
import { findBudgets, getYNAB4Data, morethan2WeeksAgo } from './utils'
import { Account, YNAB } from './ynab4'
interface Summary {
  [k: string]: string
}
interface RawSummary {
  [k: string]: number
}

const addCommas = (n: number) => {
  const rx = /(\d+)(\d{3})/
  return String(n).replace(/^\d+/, function (w) {
    while (rx.test(w)) {
      w = w.replace(rx, '$1,$2')
    }
    return w
  })
}

const getBudget = (target = 'Duvland - Lisbon Office'): YNAB => {
  const path = findBudgets().find(({ name }) => name === target)?.filepath
  return path && getYNAB4Data(path)
}

export const getAccounts = (offBudgetOnly = false): Account[] => {
  return getBudget().accounts.filter(
    ({ isTombstone, onBudget, hidden }: Account) =>
      !isTombstone && !hidden && onBudget === !offBudgetOnly,
  )
}

const getAccountMap = (offBudgetOnly = false) => {
  const accounts = getAccounts(offBudgetOnly)
  const map = {} as Summary
  for (const acc of accounts) {
    map[acc.entityId] = acc.accountName
  }
  return map
}

export const accountTotals = (offBudgetOnly = false) => {
  const accountMap = getAccountMap(offBudgetOnly)
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
    if (totals[key]) {
      summary[accountMap[key]] = addCommas(Math.ceil(totals[key]))
    }
  }
  return summary
}

export const getInvestmentTotals = (name: string, allTotals = false) => {
  const accountId = getBudget().accounts.find((acc) => acc.accountName === name)?.entityId
  const totals = {
    investments: 0,
    gains: 0,
  }
  for (const trans of getBudget().transactions) {
    if (!trans.isTombstone && accountId === trans.accountId) {
      if (trans.transferTransactionId) {
        if (morethan2WeeksAgo(trans.date) || allTotals) {
          totals.investments += trans.amount
        }
      } else {
        totals.gains += trans.amount
      }
    }
  }
  return totals
}

export const getROI = (name: string) => {
  const { investments, gains } = getInvestmentTotals(name)
  return ((gains / investments) * 100).toFixed(1) + '%'
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
      // If NOT a recent deposit (i.e. a market gain)
      if (!(trans.transferTransactionId && !morethan2WeeksAgo(trans.date))) {
        total += trans.amount
      }
    }
  }
  cashFlows.push({ amount: total, date: '2021-08-09' })
  const dayRate = xirr(cashFlows).rate
  return (convertRate(dayRate, 365) * 100).toFixed(1) + '%'
}

interface InvestmentSummary {
  name: string
  balance: string
  IRR: string
  ROI: string
  totalInput: string
  fees?: number
}

export const getInvestmentsSummary = (): InvestmentSummary[] => {
  const investments = getAccounts(true)
  const summary: InvestmentSummary[] = []
  for (const investment of investments) {
    getInvestmentTotals(investment.accountName, true).investments &&
      summary.push({
        name: investment.accountName,
        balance: accountTotals(true)[investment.accountName],
        ROI: getROI(investment.accountName),
        IRR: getIRR(investment.accountName),
        totalInput: addCommas(getInvestmentTotals(investment.accountName, true).investments),
      })
  }
  return summary
}

const accounts = () => {
  const router = Router()
  router.get('/accounts', (_req, res) => {
    res.json(getAccounts().map((acct) => acct.accountName))
  })

  router.get('/accountBalances', (req, res) => {
    res.json(accountTotals(req.query.offBudget === 'true'))
  })

  router.get('/investment-accounts', (req, res) => {
    res.json(getInvestmentsSummary())
  })
  return router
}

export default accounts
