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

afterAll(() => {
  testDbClient.$disconnect()
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

describe('/catGroups', () => {
  it('returns list of catGroups', async (done) => {
    const response = await request(app).get('/catGroups')
    expect(response.status).toBe(200)
    expect(response.body.length).toBe(10)
    done()
  })
})

describe('/catGroupBalances', () => {
  it('returns list of accounts and their balance', async (done) => {
    const response = await request(app).get('/catGroupBalances')
    expect(response.status).toBe(200)
    expect(response.body.Unavoidable).toBe(-2279575)
    done()
  })
})

describe('/catGroupBudgets', () => {
  it('returns list of accounts and their balance', async (done) => {
    const response = await request(app).get('/catGroupBudgets')
    expect(response.status).toBe(200)
    expect(response.body.Unavoidable).toBe(88467)
    done()
  })
})
