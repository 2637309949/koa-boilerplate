'use strict'

const debug = require('debug')('koa:logging')

const defaultSerializers = {
    req: (ctx = {}) => {
        return {
            method: ctx.method,
            path: ctx.path,
            url: ctx.url,
            headers: ctx.headers,
            protocol: ctx.protocol,
            ip: ctx.ip,
            query: ctx.query
        }
    },
    res: (ctx = {}) => {
        return {
            statusCode: ctx.status,
            duration: ctx.duration,
            type: ctx.type,
            headers: (ctx.response || {}).headers
        }
    },
    err: (err) => {
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
}

// eslint-disable-next-line
function defaultGetRequestLogLevel(ctx = {}) {
    return 'info'
}

function defaultGetResponseLogLevel(ctx = {}) {
    const status = ctx.status
    if (status >= 500) {
        return 'error'
    } else if (status >= 400) {
        return 'warn'
    }
    return 'info'
}

// eslint-disable-next-line
function defaultGetErrorLogLevel(err) {
    return 'error'
}


module.exports = (options = {}) => {
    const {
        logger = null,
        getReqId = () => null,
        getRequestLogLevel = defaultGetRequestLogLevel,
        getResponseLogLevel = defaultGetResponseLogLevel,
        getErrorLogLevel = defaultGetErrorLogLevel
    } = options
    const serializers = {
        ...defaultSerializers,
        ...options.serializers
    }

    if (typeof logger !== 'object' || logger === null) {
        throw new TypeError('Logger required')
    }

    debug('Create a middleware')

    return async function logging(ctx, next) {
        // Try to get the request id
        const reqId = getReqId(ctx)
            || ctx.state.reqId
            || ctx.reqId
            || ctx.req.id
            || ctx.get('X-Request-Id')
        const startTime = new Date()
        ctx.log = logger.child({
            serializers: (!!serializers ? serializers : {})
        })

        debug(`Created a child logger from parent logger (reqId=${reqId})`)

        const reqLogLevel = getRequestLogLevel(ctx)
        ctx.log[reqLogLevel](
            { req: ctx, event: 'request' },
            `${ctx.method} ${ctx.path} (${reqId})`
        )

        debug('Logged a request event')

        // Handle response logging when response is sent
        ctx.res.on('finish', () => {
            ctx.duration = new Date() - startTime

            const resLogLevel = getResponseLogLevel(ctx)
            ctx.log[resLogLevel](
                { req: ctx, res: ctx, event: 'response' },
                `${ctx.status} ${ctx.message} - ${ctx.duration}ms (${reqId})`
            )

            debug('Logged a response event')

            // Remove log object to mitigate accidental leaks
            delete ctx.log
        })

        try {
            await next()
        } catch (err) {
            const errLogLevel = getErrorLogLevel(ctx)
            ctx.log[errLogLevel](
                { err, event: 'error' },
                `Unhandled exception occured (${reqId})`
            )

            debug('Logged an error event')

            throw err
        }
    }
}
