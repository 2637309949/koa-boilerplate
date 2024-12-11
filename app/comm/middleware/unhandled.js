'use strict'

const cx = require('../util/context')
const Response = require('../util/response')
const {
  InvalidRequestBodyFormat,
  InvalidRequestQueryFormat,
  ApplicationError
} = require('../error')

module.exports = () => {
  return async function (ctx, next) {
    let logger = cx.getLogger(ctx)
    try {
      await next()
      if (!ctx.body && (!ctx.status || ctx.status === 404)) {
        logger.error(`Unhandled by router`)
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
      logger.error(`Unhandled exception occured ${err}`)
      Response.internalServerError(ctx, Response.UNKNOWN_ERROR)
    }
  }
}
