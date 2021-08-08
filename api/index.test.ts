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
  it('returns list of accounts', async () => {
    const response = await request(app).get('/accounts')
    expect(response.status).toBe(200)
    expect(response.body.length).toBe(13)
  })
})

describe('/accountBalances', () => {
  it('returns list of accounts and their balance', async () => {
    const response = await request(app).get('/accountBalances')
    expect(response.status).toBe(200)
    expect(response.body.Revolut).toBe(172494)
  })
})

describe('/categories', () => {
  it('returns list of categories', async () => {
    const response = await request(app).get('/categories')
    expect(response.status).toBe(200)
    expect(response.body.length).toBe(68)
  })
})

describe('/catGroups', () => {
  it('returns list of catGroups', async () => {
    const response = await request(app).get('/catGroups')
    expect(response.status).toBe(200)
    expect(response.body.length).toBe(10)
  })
})

describe('/catGroupBalances', () => {
  it('returns list of accounts and their balance', async () => {
    const response = await request(app).get('/catGroupBalances')
    expect(response.status).toBe(200)
    expect(response.body.Unavoidable).toBe(-2279575)
  })
})

describe('/catGroupBudgets', () => {
  it('returns list of accounts and their balance', async () => {
    const response = await request(app).get('/catGroupBudgets')
    expect(response.status).toBe(200)
    expect(response.body.Unavoidable).toBe(88467)
    expect(response.body.Work).toBe(424361)
    expect(response.body.Play).toBe(25910)
    expect(response.body.YAGNI).toBe(1551213)
  })
})
