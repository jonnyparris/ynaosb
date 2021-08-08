import { smoke } from './fixtures/smoke'
import { getAccounts, accountTotals } from './accounts'

describe('Accounts', () => {
  it('returns list of on budget accounts', () => {
    expect(getAccounts().length).toBe(13)
  })

  it('returns accurate totals', () => {
    const totals = accountTotals()
    for (const key in totals) {
      if (smoke.accounts[key]) {
        expect(totals[key]).toEqual(smoke.accounts[key])
      } else {
        console.info('Untested total:', key, totals[key])
      }
    }
  })
})
