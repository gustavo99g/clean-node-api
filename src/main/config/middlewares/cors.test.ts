import app from '../app'
import request from 'supertest'

describe('CORS', () => {
  test('should enable cors', async () => {
    app.get('/test-cors', (req, res) => {
      return res.send()
    })
    await request(app)
      .get('/test-cors')
      .expect('access-control-allow-origin', '*')
  })
})
