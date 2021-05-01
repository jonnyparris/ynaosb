import { PrismaClient } from '@prisma/client'
import request from 'supertest'
import { setupApp } from '.'

const testDbClient = new PrismaClient({
  datasources: { db: { url: 'file:../api/test.db' } },
})

describe('Accounts', () => {
  it('returns list of accounts', async () => {
    const app = setupApp(testDbClient)
    const response = await request(app).get('/accounts')
    expect(response.status).toBe(200)
    expect(response.body.length).toBe(26)
  })
})
