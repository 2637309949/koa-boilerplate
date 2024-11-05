'use strict'

const Koa = require('koa')
const logging = require('../middleware/logger')
const serializers = require('../logger/http').serializers
const cors = require('../middleware/cors')
const apmMiddleware = require('../middleware/apm')
const requestId = require('../middleware/traceid')
const bodyParser = require('../middleware/parser')
const errorHandler = require('../middleware/unhandled')
const corsConfig = require('../config/cors')
const logger = require('../logger')

class App extends Koa {
  constructor(...params) {
    super(...params)
    this.proxy = true
    // Disable `console.errors` except development env
    this.silent = this.env !== 'development' 
    this.servers = []
    this._configureMiddlewares()
  }

  _configureMiddlewares() {
    this.use(errorHandler())
    this.use(apmMiddleware())
    this.use(requestId())
    this.use(logging({ logger, serializers }))
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

  configureRoutes(route) {
    this.use(route.routes())
    this.use(route.allowedMethods())
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
