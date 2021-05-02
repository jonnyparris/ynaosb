import { PrismaClient } from '@prisma/client'
import request from 'supertest'
import { setupApp } from '.'

let app: any // where is the Express type?

const testDbClient = new PrismaClient({
  datasources: { db: { url: 'file:../api/test.db' } },
})

beforeAll(() => {
  app = setupApp(testDbClient)
})

describe('/accounts', () => {
  it('returns list of accounts', async (done) => {
    const response = await request(app).get('/accounts')
    expect(response.status).toBe(200)
    expect(response.body.length).toBe(13)
    done()
  })
})

describe('/accountBalances', () => {
  it('returns list of accounts and their balance', async (done) => {
    const response = await request(app).get('/accountBalances')
    expect(response.status).toBe(200)
    expect(response.body.Revolut).toBe(172494)
    done()
  })
})

describe('/categories', () => {
  it('returns list of categories', async (done) => {
    const response = await request(app).get('/categories')
    expect(response.status).toBe(200)
    expect(response.body.length).toBe(68)
    done()
  })
})
