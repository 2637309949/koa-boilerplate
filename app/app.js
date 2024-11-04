'use strict'

const Koa = require('koa')
const logging = require('@kasa/koa-logging')
const cors = require('./middlewares/cors')
const apmMiddleware = require('./middlewares/apm')
const requestId = require('./middlewares/traceid')
const bodyParser = require('./middlewares/body-parser')
const errorHandler = require('./middlewares/error-handler')
const corsConfig = require('./config/cors')
const logger = require('./logger')
const router = require('./routes')

class App extends Koa {
  constructor(...params) {
    super(...params)
    this.proxy = true
    // Disable `console.errors` except development env
    this.silent = this.env !== 'development' 
    this.servers = []
    this._configureMiddlewares()
    this._configureRoutes()
  }

  _configureMiddlewares() {
    this.use(errorHandler())
    this.use(apmMiddleware())
    this.use(requestId())
    this.use(logging({ logger, overrideSerializers: false }))
    this.use(bodyParser({ enableTypes: ['json'], jsonLimit: '10mb' }))
    this.use(
      cors({
        origins: corsConfig.origins,
        allowMethods: ['GET', 'HEAD', 'PUT', 'POST', 'DELETE', 'PATCH'],
        allowHeaders: ['Content-Type', 'Authorization'],
        exposeHeaders: ['Content-Length', 'Date', 'X-Request-Id']
      })
    )
  }

  _configureRoutes() {
    this.use(router.routes())
    this.use(router.allowedMethods())
  }

  listen(...args) {
    const server = super.listen(...args)
    this.servers.push(server)
    return server
  }

  async terminate() {
    for (const server of this.servers) {
      server.close()
    }
  }
}

module.exports = App
