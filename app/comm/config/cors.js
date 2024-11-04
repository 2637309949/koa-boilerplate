'use strict'

const origins = (process.env.CORS_ORIGINS || '*').split(',')
module.exports = {
  origins,
}
