'use strict'

const { env, name } = require('./')

const config = {
  name,
  enabled: process.env.LOG_ENABLED || ['production', 'development'].includes(env),
  level: process.env.LOG_LEVEL || (env === 'production' ? 'info' : 'debug'),
  redact: []
}

module.exports = config
