const express = require('express')
const next = require('next')
const compression = require('compression')

const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

app.prepare()
.then(() => {
  const server = express()
  server.use(compression())

  server.get('/report/listing', (req, res) => {
    const actualPage = '/updates'
    app.render(req, res, actualPage)
  })
  server.get('/report/:id', (req, res) => {
    const actualPage = '/report'
    const queryParams = { id: req.params.id }
    app.render(req, res, actualPage, queryParams)
  })
  server.get('/country/:id', (req, res) => {
    const actualPage = '/country'
    const queryParams = { id: req.params.id, name: req.params.name }
    app.render(req, res, actualPage, queryParams)
  })
  server.get('/disaster/:id', (req, res) => {
    const actualPage = '/disaster'
    const queryParams = { id: req.params.id, name: req.params.name }
    app.render(req, res, actualPage, queryParams)
  })

  server.get('*', (req, res) => {
    return handle(req, res)
  })

  server.listen(3000, (err) => {
    if (err) throw err
    console.log('> Ready on http://localhost:3000')
  })
})
.catch((ex) => {
  console.error(ex.stack)
  process.exit(1)
})
