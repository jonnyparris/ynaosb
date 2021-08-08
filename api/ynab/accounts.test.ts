import { accounts } from './accounts'

describe('Accounts', () => {
  it('returns list of on budget accounts', () => {
    expect(accounts().length).toBe(13)
  })
})
