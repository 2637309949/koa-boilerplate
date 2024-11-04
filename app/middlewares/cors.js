'use strict'

const cors = require('@koa/cors')

module.exports = (options = {}) => {
  const { origins = ['*'] } = options
  const validateOrigin = ctx => {
    if (origins.includes('*')) return '*'
    const origin = ctx.get('Origin')
    return origins.includes(origin) ? origin : null
  }
  return cors({
    ...options,
    origin: validateOrigin
  })
}
