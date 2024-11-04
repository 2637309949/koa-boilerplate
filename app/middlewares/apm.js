'use strict'

const apm = require('elastic-apm-node')
const debug = require('debug')('koa:apm')
const R = require('ramda')

function serializeUser(user = {}) {
  return R.pipe(
    R.pick(['id', 'name', 'email', 'phoneNumber', 'gender']),
    x => R.assoc('username', R.prop('name', x)),
    R.dissoc('name')
  )(user)
}

function redactAuthHeaders(payload) {
  if (payload?.context?.request?.headers) {
    const headers = payload.context.request.headers
    if (headers['x-authenticated-userid']) {
      headers['x-authenticated-userid'] = '[REDACTED]'
    }
  }
  return payload
}

apm.addFilter(redactAuthHeaders)

module.exports = () => {
  return async function apmMiddleware(ctx, next) {
    // Skip if apm is disabled
    if (!apm.isStarted()) {
      debug('Skipped because APM is disabled')
      return await next()
    }

    try {
      await next()
    } catch (err) {
      ctx.res.on('finish', () => {
        apm.captureError(err)
        debug('Sent error to APM server')
      })
      throw err
    } finally {
      const user = ctx.state.user || {}
      const reqId = ctx.state.reqId || ctx.reqId || ctx.req.id || ctx.get('X-Request-Id')
      apm.setCustomContext({ reqId })
      apm.setUserContext(serializeUser(user))
    }
  }
}
