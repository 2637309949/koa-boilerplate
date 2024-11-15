'use strict'

const logger = require('../logger')
const got = require('got')
const debug = require('debug')('api:http')
class HttpApi {
  constructor(options = {}) {
    this.options = {
      json: true,
      http: got,
      ...options
    }

    logger.debug('Create an instance')

    const baseUrl = this.options.baseUrl
    if (!(baseUrl && typeof baseUrl === 'string')) {
      throw new TypeError('`baseUrl` is required.')
    }

    logger.debug(`baseUrl: ${baseUrl}`)

    const { http, ...httpOptions } = this.options
    this.http = http.extend(httpOptions)

    logger.debug('Configured HTTP client')
  }

  async _request(spec) {
    const { path, ...options } = spec
    logger.debug(`request: ${spec.method} ${path} (${this.options.baseUrl})`)

    const { statusCode, body } = await this.http(path, options)
    logger.debug(`response: ${statusCode}`)
    return body
  }

  _checkParams(params, required = []) {
    const isSufficient = required.every(
      param => params[param] !== undefined
    )
    if (!isSufficient) {
      throw new Error(`Required Parameters: ${required}`)
    }
  }
}

module.exports = HttpApi
