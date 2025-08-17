import { Router } from 'express'
import swaggerUi from 'swagger-ui-express'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const root = path.resolve(__dirname, '..', '..')
const specPath = path.join(root, 'docs', 'swagger.json')
const htmlPath = path.join(root, 'docs', 'index.html')

const router = Router()

router.get('/', (req, res) => res.sendFile(htmlPath))
router.get('/swagger.json', (req, res) => {
  const json = fs.readFileSync(specPath, 'utf8')
  res.type('application/json').send(json)
})
router.use('/swagger-ui', swaggerUi.serve, swaggerUi.setup(null, { swaggerUrl: '/api-docs/swagger.json' }))

export default router
