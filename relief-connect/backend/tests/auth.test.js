import request from 'supertest'
import { app } from '../src/server.js'

describe('Auth', () => {
  it('registers and logs in a user', async () => {
    const email = `user${Date.now()}@test.com`
    const reg = await request(app).post('/api/auth/register').send({ name: 'Test', email, password: 'secret123' })
    expect(reg.status).toBe(200)
    expect(reg.body.data.token).toBeDefined()

    const login = await request(app).post('/api/auth/login').send({ email, password: 'secret123' })
    expect(login.status).toBe(200)
    expect(login.body.data.token).toBeDefined()
  })
})
