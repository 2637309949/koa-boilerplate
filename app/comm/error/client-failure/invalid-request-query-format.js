'use strict'

const ClientFailure = require('.')


/**
 * Thrown when the request body has an invalid format.
 */
class InvalidRequestQueryFormat extends ClientFailure {
  constructor(message) {
    super(message)
    this.name = 'InvalidRequestQueryFormat'
  }
}

module.exports = InvalidRequestQueryFormat
