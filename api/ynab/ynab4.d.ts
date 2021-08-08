export interface Account {
  isTombstone?: boolean
  hidden: boolean
  lastEnteredCheckNumber: number
  lastReconciledBalance: number
  lastReconciledDate: string
  sortableIndex: number
  accountName: string
  entityType: string
  entityVersion: string
  entityId: string
  accountType: string
  onBudget: boolean
}

export interface Transaction {
  isTombstone?: boolean
  accountId: string
  importedPayee: string
  entityType: string
  entityId: string
  YNABID: string
  cleared: string
  amount: number
  date: string
  accepted: boolean
  categoryId: string
  entityVersion: string
  source: string
  payeeId: string
}

export interface YNAB {
  accounts: Account[]
  transactions: Transaction[]
  [k: string]: unknown
}
