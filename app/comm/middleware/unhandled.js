'use strict'

const logger = require('../logger')
const Response = require('../util/response')
const {
  InvalidRequestBodyFormat,
  InvalidRequestQueryFormat,
  ApplicationError
} = require('../error')

module.exports = () => {
  return async function (ctx, next) {
    // Try to get the request id
    const reqId = ctx.state.reqId
    || ctx.reqId
    || ctx.req.id
    || ctx.get('X-Request-Id')
    try {
      await next()
      if (!ctx.body && (!ctx.status || ctx.status === 404)) {
        logger.error({ event: 'error' }, 'Unhandled by router')
        Response.notFound(ctx, Response.UNKNOWN_ENDPOINT)
        return
      }
    } catch (err) {
      if (err instanceof InvalidRequestBodyFormat) {
        Response.unprocessableEntity(ctx, { ...Response.INVALID_REQUEST_BODY_FORMAT, message: err.message })
        return
      } else if (err instanceof InvalidRequestQueryFormat) {
        Response.unprocessableEntity(ctx, { ...Response.INVALID_REQUEST, message: err.message })
        return
      } else if (err instanceof ApplicationError) {
        Response.error(ctx, { ...Response.INTERNAL_ERROR, message: err.message })
        return
      }
      logger.error({ err, event: 'error' }, `Unhandled exception occured (${reqId})`)
      Response.internalServerError(ctx, Response.UNKNOWN_ERROR)
    }
  }
}
