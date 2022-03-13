import express from 'express'
import accounts from './ynab/accounts'

export const setupApp = () => {
  const app = express()
  app.use(express.json())
  app.use(accounts())
  return app
}

export default {
  path: '/api',
  handler: setupApp(),
}
