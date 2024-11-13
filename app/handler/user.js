'use strict'

const Response = require('../comm/util/response')
const logger = require('../comm/logger')
const {
    InvalidRequestQueryFormat
} = require('../comm//error')
const userDB = require('./user.db')
const sz = require('../comm/sequelize')

exports.QueryUser = async ctx => {
    const { name, pageNo = 1, pageSize = 10 } = ctx.query
    const where = { name }
    const rsp = {}
    if (name === undefined) {
        throw new InvalidRequestQueryFormat('解析参数失败, name未设置')
    }

    const options = sz.QueryOpts(where)
    const [users, total] = await userDB.QueryUserDB(options, null)
    rsp.data = users
    rsp.totalCount = total
    rsp.curPage = pageNo
    rsp.totalPage = (total / pageSize) | 0
    rsp.totalPage += (rsp.totalCount % pageSize !== 0 ? 1 : 0)
    Response.success(ctx, rsp)
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
