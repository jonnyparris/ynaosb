import { smoke } from './fixtures/smoke'
import { getAccounts, accountTotals, getROI, getIRR } from './accounts'

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

  it('gets the IRR for an investment account', () => {
    expect(getIRR('Degiro')).toEqual('33.6%')
    expect(getIRR('Binance')).toEqual('13.9%')
  })
})
