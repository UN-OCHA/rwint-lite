require('newrelic')
const express = require('express')
const next = require('next')
const compression = require('compression')
const winston = require('winston')
const expressWinston = require('express-winston')
const fs = require('fs')
const mkdirp = require('mkdirp')

const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()
const logDir = '/var/log/node'

if (!fs.existsSync(logDir)) {
  mkdirp(logDir)
}

app.prepare()
.then(() => {
  const server = express()
  server.use(compression())

  if (!dev) {
    server.use(expressWinston.logger({
      transports: [
        new winston.transports.Console(),
        new (winston.transports.File)({filename: `${logDir}/access.log`})
      ]
    }))
  }

  server.get('/sw.js', (req, res) => {
    res.setHeader('content-type', 'text/javascript')
    fs.createReadStream('./offline/serviceWorker.js').pipe(res)
  })

  server.get('/report/listing', (req, res) => {
    const actualPage = '/updates'
    const queryParams = { page: req.query.page, search: req.query.search }
    app.render(req, res, actualPage, queryParams)
  })
  server.get('/report/:id/:country/:title', (req, res) => {
    const actualPage = '/report'
    const queryParams = { id: req.params.id }
    app.render(req, res, actualPage, queryParams)
  })
  server.get('/country/listing', (req, res) => {
    const actualPage = '/countries'
    const queryParams = { search: req.query.search }
    app.render(req, res, actualPage, queryParams)
  })
  server.get('/country/:id/:name', (req, res) => {
    const actualPage = '/country'
    const queryParams = { id: req.params.id, name: req.params.name }
    app.render(req, res, actualPage, queryParams)
  })
  server.get('/disaster/listing', (req, res) => {
    const actualPage = '/disasters'
    const queryParams = { page: req.query.page, search: req.query.search }
    app.render(req, res, actualPage, queryParams)
  })
  server.get('/disaster/:id/:name', (req, res) => {
    const actualPage = '/disaster'
    const queryParams = { id: req.params.id, name: req.params.name }
    app.render(req, res, actualPage, queryParams)
  })
  server.get('/job/listing', (req, res) => {
    const actualPage = '/jobs'
    const queryParams = { page: req.query.page, search: req.query.search }
    app.render(req, res, actualPage, queryParams)
  })
  server.get('/job/:id/:name', (req, res) => {
    const actualPage = '/job'
    const queryParams = { id: req.params.id, name: req.params.name }
    app.render(req, res, actualPage, queryParams)
  })
  server.get('/job/:id/:country/:title', (req, res) => {
    const actualPage = '/job'
    const queryParams = { id: req.params.id }
    app.render(req, res, actualPage, queryParams)
  })
  server.get('/training/listing', (req, res) => {
    const actualPage = '/trainings'
    const queryParams = { page: req.query.page, search: req.query.search }
    app.render(req, res, actualPage, queryParams)
  })
  server.get('/training/:id/:name', (req, res) => {
    const actualPage = '/training'
    const queryParams = { id: req.params.id, name: req.params.name }
    app.render(req, res, actualPage, queryParams)
  })
  server.get('/training/:id/:country/:title', (req, res) => {
    const actualPage = '/training'
    const queryParams = { id: req.params.id }
    app.render(req, res, actualPage, queryParams)
  })

  server.get('*', (req, res) => {
    return handle(req, res)
  })

  if (!dev) {
    server.use(expressWinston.errorLogger({
      transports: [
        new winston.transports.Console({
          json: true,
          colorize: true
        }),
        new (winston.transports.File)({filename: `${logDir}/error.log`})
      ]
    }))
  }

  server.listen(3000, '0.0.0.0', (err) => {
    if (err) throw err
    console.log('> Ready on http://0.0.0.0:3000')
  })
})
.catch((ex) => {
  console.error(ex.stack)
  process.exit(1)
})
