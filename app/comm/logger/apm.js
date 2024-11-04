'use strict'

const apm = require('elastic-apm-node')
const active = !!process.env.ELASTIC_APM_SERVER_URL

apm.start({
  ignoreUrls: [ '/', '/spec' ],
  usePathAsTransactionName: true,
  active
})

module.exports = apm
