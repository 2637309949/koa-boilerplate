'use strict'

const debug = require('debug')('koa:error-handler')
const Response = require('../util/response')
const { InvalidRequestBodyFormat } = require('../error')

module.exports = () => {
  return async function(ctx, next) {
    try {
      await next()
      // Respond 404 Not Found for unhandled request
      if (!ctx.body && (!ctx.status || ctx.status === 404)) {
        debug('Unhandled by router')
        return Response.notFound(ctx, Response.UNKNOWN_ENDPOINT)
      }
    } catch (err) {
      debug('An error occured: %s', err.name)
      if (err instanceof InvalidRequestBodyFormat) {
        return Response.unprocessableEntity(ctx, Response.INVALID_REQUEST_BODY_FORMAT)
      }
      return Response.internalServerError(ctx, Response.UNKNOWN_ERROR)
    }
  }
}
