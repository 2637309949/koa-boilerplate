'use strict'

const { env } = require('.')
const enabled = process.env.LOG_ENABLED || ['production', 'development'].includes(env)
const level = process.env.LOG_LEVEL || (env === 'production' ? 'info' : 'debug')

const config = {
  silent: !enabled,
  level
}

module.exports = config
