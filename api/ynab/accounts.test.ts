import { smoke } from './fixtures/smoke'
import { getAccounts, accountTotals, getROI, getIRR } from './accounts'

describe('Accounts', () => {
  it('returns list of on budget accounts', () => {
    expect(getAccounts().length).toBe(1)
  })

  it('returns accurate totals', () => {
    const totals = accountTotals()
    for (const key in totals) {
      if (smoke.accounts[key]) {
        expect(totals[key]).toEqual(smoke.accounts[key])
      } else {
        // console.info('Untested total:', key, totals[key])
      }
    }
  })

  it('gets the ROI for an investment account', () => {
    expect(getROI('Cheese')).toEqual('2.2%')
  })

  it('gets the IRR for an investment account', () => {
    expect(getIRR('Cheese')).toEqual('3.4%')
  })
})
