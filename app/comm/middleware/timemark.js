'use strict'
const cx = require('../util/context')

module.exports = (options = {}) => {
    const {
    } = options
    return async function (ctx, next) {
        ctx.timeMark = {
            init(format) {
                this.start = new Date()
                this.last = new Date()
                this.format = format
                this.desc = ''
            },
            mark(format) {
                let duration = new Date() - this.last
                this.last = new Date()
                this.desc += ` ${format}[${duration}ms]`
            }
        }
        let logger = cx.getLogger(ctx)
        ctx.res.on('finish', () => {
            let t = ctx.timeMark
            if (t.start) {
                let desc = t.format
                let duration = new Date() - t.start
                if (t.desc?.length) {
                    logger.debug(`${desc} total duration:[${duration}ms] step${t.desc}`)
                } else {
                    logger.debug(`${desc} total duration:[${duration}ms]`)
                }
            }
            // Remove log object to mitigate accidental leaks
            delete ctx.timeMark
        })
        await next()
    }
}
