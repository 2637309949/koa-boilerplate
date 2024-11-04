'use strict'

const pino = require('pino')
const config = require('./config/logger')

function reqSerializer(ctx = {}) {
  return {
    method: ctx.method, 
    path: ctx.path,
    url: ctx.url,
    headers: ctx.headers,
    protocol: ctx.protocol,
    ip: ctx.ip,
    query: ctx.query
  }
}

function errSerializer(err) {
  if (!(err instanceof Error)) {
    return err
  }
  return {
    name: err.name,
    message: err.message,
    code: err.code,
    status: err.status,
    stack: err.stack
  }
}


function resSerializer(ctx = {}) {
  ctx.body = ctx.body || {}
  ctx.response = ctx.response || {}
  const { status, code, message } = ctx.body
  const body = { status, message }
  if (code) {
    body.code = code
  }
  return {
    statusCode: ctx.status,
    duration: ctx.duration,
    type: ctx.type,
    headers: ctx.response.headers,
    body,
  }
}

const logger = pino({
  ...config,
  serializers: {
    req: reqSerializer,
    res: resSerializer,
    err: errSerializer
  }
})

module.exports = logger
