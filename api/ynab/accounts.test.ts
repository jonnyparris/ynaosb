import { smoke } from './fixtures/smoke'
import { getAccounts, accountTotals, getROI } from './accounts'

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
        // console.info('Untested total:', key, totals[key])
      }
    }
  })

  it('gets the ROI for an investment account', () => {
    expect(getROI('Degiro')).toEqual('5.3%')
    expect(getROI('Binance')).toEqual('2.6%')
  })
})
