import request from 'supertest'
import { app } from '../src/server.js'

let token

beforeAll(async () => {
  const email = `r${Date.now()}@test.com`
  const reg = await request(app).post('/api/auth/register').send({ name: 'Reporter', email, password: 'secret123' })
  token = reg.body.data.token
})

describe('Reports', () => {
  it('creates and lists reports', async () => {
    const create = await request(app)
      .post('/api/reports')
      .set('Authorization', 'Bearer ' + token)
      .send({ description: 'Injured person', category: 'medical', location: { type: 'Point', coordinates: [77.6, 12.97] } })
    expect(create.status).toBe(201)

    const list = await request(app).get('/api/reports')
    expect(list.status).toBe(200)
    expect(Array.isArray(list.body.data)).toBe(true)
  })
})
