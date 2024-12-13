'use strict'

const logger = require('../logger')

function defaultGetResponseLogLevel(ctx = {}) {
    const status = ctx.status
    if (status >= 500) {
        return 'error'
    } else if (status >= 400) {
        return 'warn'
    }
    return 'info'
}

module.exports = (options = {}) => {
    const {
        getRequestLogLevel = () => 'info',
        getResponseLogLevel = defaultGetResponseLogLevel,
        getErrorLogLevel = () => 'error'
    } = options

    return async function (ctx, next) {
        ctx.log = logger.child({ ctx })
        const startTime = new Date()
        const reqLogLevel = getRequestLogLevel(ctx)
        ctx.log[reqLogLevel](`${ctx.method} ${ctx.url}`)

        if (ctx.request.is('json')) {
            ctx.log[reqLogLevel](`Request (JSON): ${JSON.stringify(ctx.request.body)}`)
        } else if (ctx.request.is('urlencoded')) {
            ctx.log[reqLogLevel](`Request (Form): ${JSON.stringify(ctx.request.body)}`)
        }

        // Handle response logging when response is sent
        ctx.res.on('finish', () => {
            ctx.duration = new Date() - startTime
            const resLogLevel = getResponseLogLevel(ctx)
            if (ctx.response.is('json')) {
                ctx.log[resLogLevel](`Response (JSON): ${JSON.stringify(ctx.response.body)}`)
            }
            ctx.log[resLogLevel](`Response (STATE): ${ctx.status} ${ctx.duration}ms`)
            // Remove log object to mitigate accidental leaks
            delete ctx.log
        })

        try {
            await next()
        } catch (err) {
            const errLogLevel = getErrorLogLevel(ctx)
            requestLogger[errLogLevel](`Unhandled exception occured`)
            throw err
        }
    }
}
