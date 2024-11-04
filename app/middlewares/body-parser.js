'use strict'

const bodyParser = require('koa-bodyparser')
const { InvalidRequestBodyFormat } = require('../errors')

module.exports = (options = {}) => {
  return bodyParser({
    ...options,
    onerror: () => {
      throw new InvalidRequestBodyFormat('Invalid format is detected in the request body')
    }
  })
}
