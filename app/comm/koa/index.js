'use strict'

const Koa = require('koa')
const logging = require('../middleware/logger')
const cors = require('../middleware/cors')
const apmMiddleware = require('../middleware/apm')
const requestId = require('../middleware/traceid')
const bodyParser = require('../middleware/parser')
const unhandled = require('../middleware/unhandled')
const timemark = require('../middleware/timemark')
const corsConfig = require('../config/cors')
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
    this.use(requestId({ exposeHeader: 'X-Request-Id' }))
    this.use(logging())
    this.use(timemark())
    this.use(unhandled())
    this.use(apmMiddleware())
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
