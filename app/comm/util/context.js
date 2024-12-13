'use strict'
const logger = require('../logger')

const hdl = {}
hdl.getReqId = function (ctx) {
    const reqId = ctx?.id 
        || ctx?.state?.reqId
        || ctx?.reqId
        || ctx?.req?.id
        || ctx?.get('X-Request-Id')
        || 'unknow'
    return reqId
}

hdl.getLogger = function (ctx) {
    if (ctx?.log) {
        return ctx.log
    }
    return logger
}

module.exports = hdl