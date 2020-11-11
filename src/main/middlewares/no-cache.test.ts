import app from '../config/app'
import request from 'supertest'
import { noCache } from './no-cache'

describe('NO CACHE middleware', () => {
  test('should enable no cache', async () => {
    app.post('/no-cache', noCache, (req, res) => {
      return res.send()
    })
    await request(app)
      .post('/no-cache')
      .expect('cache-control', 'no-store, no-cache, must-revalidate, proxy-revalidate')
      .expect('pragma', 'no-cache')
      .expect('expires', '0')
      .expect('surrogate-control', 'no-store')
  })
})
