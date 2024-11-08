'use strict'

const dotenv = require('dotenv')
dotenv.config()

const env = process.env.NODE_ENV || 'development'
const configs = {
  base: {
    env,
    name: process.env.APP_NAME || 'koa-boilerplate',
    host: process.env.APP_HOST || '0.0.0.0',
    port: 7070
  },
  production: {
    port: process.env.APP_PORT || 7071
  },
  development: {
    db: {
      uri: 'mysql://myppdb:myppdb@172.30.12.123:3309/test'
    }
  },
  test: {
    port: 7072,
  }
}

module.exports = {
  ...configs.base,
  ...configs[env]
}
