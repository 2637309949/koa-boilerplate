'use strict'

const { env, name } = require('.')
const enabled = process.env.LOG_ENABLED || ['production', 'development'].includes(env)
const level = process.env.LOG_LEVEL || (env === 'production' ? 'info' : 'debug')

const config = {
  name,
  enabled,
  level,
  redact: []
}

module.exports = config
