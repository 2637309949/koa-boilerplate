'use strict'


function reqSerializer(ctx = {}) {
    return {
        url: ctx.url,
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
        body,
    }
}

const serializers = {
    req: reqSerializer,
    res: resSerializer,
    err: errSerializer
}

module.exports.serializers = serializers
