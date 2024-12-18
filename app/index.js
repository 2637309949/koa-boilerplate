'use strict'

const App = require('./comm/koa')
const apm = require('./comm/logger/apm')
const config = require('./comm/config')
const logger = require('./comm/logger')
const sequelize = require('./comm/sequelize')
const defines = require('./models/model')
const route = require('./route')

const app = new App()
app.configureRoutes(route)

function handleError(err, ctx) {
  if (apm.active) {
    apm.captureError(err)
  }

  if (!ctx) {
    logger.error('Unhandled exception occured')
  }
}

async function terminate(signal) {
  try {
    await app.terminate()
  } finally {
    logger.info('App is terminated')
    process.kill(process.pid, signal)
  }
}

// Handle uncaught errors
app.on('error', handleError)

// Start server
if (!module.parent) {
  sequelize.init(defines, config.db)
  
  app.listen(config.port, config.host, () => {
    logger.info(`Listening on ${config.host}:${config.port}, in ${config.env}`)
  }).on('error', handleError)

  const errors = ['unhandledRejection', 'uncaughtException']
  errors.map(error => {
    process.on(error, handleError)
  })

  const signals = ['SIGTERM', 'SIGINT', 'SIGUSR2']
  signals.map(signal => {
    process.once(signal, () => terminate(signal))
  })
}

// Expose app
module.exports = app
