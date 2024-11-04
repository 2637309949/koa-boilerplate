'use strict'

const requestId = require('@kasa/koa-request-id')
const { nanoid } = require('../utils/strings')
const generate18CharId = () => nanoid(18, 'abcdefghijklmnopqrstuvwxyz0123456789')

module.exports = (options = {}) => {
  return requestId({
    ...options,
    generator: generate18CharId
  })
}
