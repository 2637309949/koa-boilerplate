'use strict'

const debug = require('debug')('koa:request-id')
const { nanoid } = require('../util/strings')
const generate18CharId = () => nanoid(18, 'abcdefghijklmnopqrstuvwxyz0123456789')

module.exports = (options = {}) => {
  const {
    query = null,
    header = 'X-Request-Id',
    exposeHeader = 'X-Request-Id',
    generator = generate18CharId
  } = options

  debug('Create a middleware')

  return async function (ctx, next) {
    const reqId = (query && ctx.query[query])
      || (header && ctx.get(header))
      || generator()
    debug(`reqId=${reqId}`)

    ctx.id = reqId
    ctx.state.reqId = reqId

    if (exposeHeader) {
      debug(`Expose the request id via headers['${exposeHeader}']`)
      ctx.set(exposeHeader, reqId)
    }

    await next()
  }
}
