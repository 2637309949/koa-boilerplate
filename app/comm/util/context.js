'use strict'
const logger = require('../logger')

const hdl = {}
hdl.getReqId = function (ctx) {
    const reqId = ctx?.state?.reqId
        || ctx?.reqId
        || ctx?.req.id
        || ctx?.get('X-Request-Id')
        || 'unknow'
    return reqId
}

hdl.getLogger = function (ctx) {
    if (ctx?.log) {
        return ctx.log
    }
    ctx = {id: hdl.getReqId(ctx)}
    return logger.child({ ctx })
}

module.exports = hdl