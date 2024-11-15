'use strict'

const hdl = {}
hdl.getReqId = function (ctx) {
    const reqId = ctx?.state?.reqId
        || ctx?.reqId
        || ctx?.req.id
        || ctx?.get('X-Request-Id')
        || ''
    return reqId
}

module.exports = hdl