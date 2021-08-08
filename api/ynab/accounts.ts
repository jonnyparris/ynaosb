import { findBudgets, getYNAB4Data } from './utils'
import { Account } from './ynab4'

const getBudget = (target = 'Duvland - Lisbon Office') => {
  const path = findBudgets().find(({ name }) => name === target)?.filepath
  return path && getYNAB4Data(path)
}

export const accounts = () => {
  return getBudget().accounts.filter(
    ({ isTombstone, onBudget, hidden }: Account) => !isTombstone && !hidden && onBudget,
  )
}
