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
