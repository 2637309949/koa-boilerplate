'use strict'

const Response = require('../comm/util/response')
const logger = require('../comm/logger')
const { InvalidRequestBodyFormat, InvalidRequestQueryFormat } = require('../comm//error')
const userDB = require('./user.db')

exports.QueryUser = async ctx => {
    try {
        const { name, pageNo = 1, pageSize = 10 } = ctx.query
        const where = { name }
        const rsp = {}
        if (name === undefined) {
            throw new InvalidRequestQueryFormat()
        }

        const options = {where,attributes: { exclude: ['deletedAt'] }}
        const [users, total] = await userDB.QueryUserDB(options, 0)
        rsp.data = users
        rsp.totalCount = total
        rsp.curPage = pageNo
        rsp.totalPage = (total / pageSize) | 0
        if (rsp.totalCount % pageSize !== 0) {
            rsp.totalPage += 1
        }
        Response.success(ctx, rsp)
    } catch (err) {
        logger.error({ err, event: 'error' }, 'Unhandled exception occured')
        if (err instanceof InvalidRequestBodyFormat) {
            return Response.unprocessableEntity(ctx, Response.INVALID_REQUEST_BODY_FORMAT)
        } else if (err instanceof InvalidRequestQueryFormat) {
            return Response.unprocessableEntity(ctx, Response.INVALID_REQUEST)
        }
        Response.internalServerError(ctx, Response.UNKNOWN_ERROR)
    }
}

exports.QueryUserDetail = ctx => {
    ctx.body = ''
}

exports.UpdateUser = ctx => {
    ctx.body = ''
}

exports.DeleteUser = ctx => {
    ctx.body = ''
}

exports.InsertUser = ctx => {
    ctx.body = ''
}

exports.SaveUser = ctx => {
    ctx.body = ''
}
