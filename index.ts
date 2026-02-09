import { Hono } from 'hono'
import { v1 } from './routes'
import {cors} from 'hono/cors'
import { Scalar } from '@scalar/hono-api-reference'
import openApi from './apiSchema.json' // أي swagger.json عندك

const app = new Hono()


app.use(
  '*',
  cors({
    origin: 'http://localhost:5173',
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowHeaders: ['Content-Type', 'Authorization']
  })
)




app.route('/api/v1', v1)

// 🔹 swagger json
app.get('/doc', c => c.json(openApi))

// 🔹 scalar ui
app.get(
  '/scalar',
  Scalar({
    url: '/doc'
  })
)

export default {
  port: 8000,
  fetch: app.fetch
}
