import request from 'supertest'
import { app } from '../src/server.js'

async function createUser(email, role='MODERATOR'){
  const reg = await request(app).post('/api/auth/register').send({ name: 'Mod', email, password: 'secret123', role })
  return reg.body.data.token
}

describe('Moderation', () => {
  let token
  let reportId

  beforeAll(async () => {
    token = await createUser(`mod${Date.now()}@test.com`)
    const reporter = await createUser(`rep${Date.now()}@test.com`, 'CITIZEN')
    const created = await request(app)
      .post('/api/reports')
      .set('Authorization', `Bearer ${reporter}`)
      .send({ description: 'Testing incident', category: 'medical', location: { type: 'Point', coordinates: [77.6, 12.97] } })
    reportId = created.body.data._id
  })

  it('verifies a report', async () => {
    const r = await request(app)
      .post(`/api/moderation/${reportId}/verify`)
      .set('Authorization', `Bearer ${token}`)
      .send({ verified: true })
    expect(r.status).toBe(200)
    expect(r.body.data.status).toBe('verified')
  })
})
