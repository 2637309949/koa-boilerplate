'use strict'

const Response = require('../comm/util/response')
const logger = require('../comm/logger')
const {
    InvalidRequestBodyFormat,
    InvalidRequestQueryFormat,
    ApplicationError
} = require('../comm/error')
const userDB = require('./user.db')
const sz = require('../comm/sequelize')
const hdl = {}

hdl.QueryUser = async ctx => {
    const { name, pageNo = 1, pageSize = 10 } = ctx.query
    const rsp = {}
    if (name === undefined) {
        throw new InvalidRequestQueryFormat('解析参数失败, name未设置')
    }

    const where = { name }
    const options = sz.QueryOpts(where)
    const [users, total] = await userDB.QueryUserDB(options, null)
    rsp.data = users
    rsp.totalCount = total
    rsp.curPage = pageNo
    rsp.totalPage = (total / pageSize) | 0
    rsp.totalPage += (rsp.totalCount % pageSize !== 0 ? 1 : 0)
    Response.success(ctx, rsp)
}

hdl.QueryUserDetail = async ctx => {
    const { id } = ctx.query
    const rsp = {}
    if (!id) {
        throw new InvalidRequestQueryFormat('解析参数失败, id未设置')
    }

    const where = { id }
    const options = sz.QueryOpts(where)
    const user = await userDB.QueryUserDetailDB(options)
    if (!user) {
        throw new ApplicationError(`用户ID ${id} 不存在`)
    }

    rsp.data = user
    Response.success(ctx, rsp)
}

hdl.UpdateUser = async ctx => {
    const { id, name, email } = ctx.request.body
    const rsp = {}
    if (!id) {
        throw new InvalidRequestBodyFormat('解析参数失败, id未设置')
    }
    if (!name && !email) {
        throw new InvalidRequestBodyFormat('至少提供一个更新字段，如name或email')
    }

    const updateFields = { id }
    if (name) updateFields.name = name
    if (email) updateFields.email = email

    const where = { id }
    const options = sz.QueryOpts(where)
    const user = await userDB.QueryUserDetailDB(options)
    if (!user) {
        throw new ApplicationError(`用户ID ${id} 不存在`)
    }

    const updatedUser = await userDB.UpdateUserDB(updateFields)
    if (!updatedUser) {
        throw new ApplicationError('更新用户信息失败')
    }

    rsp.data = updateFields
    Response.success(ctx, rsp)
}

hdl.DeleteUser = async ctx => {
    const { id } = ctx.request.body
    const rsp = {}
    if (!id) {
        throw new InvalidRequestBodyFormat('解析参数失败, id未设置')
    }

    const where = { id }
    await userDB.DeleteUserDB(where)
    rsp.data = where
    Response.success(ctx, rsp)
}

hdl.InsertUser = async ctx => {
    const { name, email } = ctx.request.body
    const rsp = {}
    if (!name) {
        throw new InvalidRequestBodyFormat('解析参数失败, name未设置')
    }
    if (!email) {
        throw new InvalidRequestBodyFormat('解析参数失败, email未设置')
    }

    const insertFields = {}
    if (name) insertFields.name = name
    if (email) insertFields.email = email

    const where = { email }
    const options = sz.QueryOpts(where)
    const user = await userDB.QueryUserDetailDB(options)
    if (user) {
        throw new ApplicationError(`用户Email ${email} 已存在`)
    }

    const insertedUser = await userDB.InsertUserDB(insertFields)
    if (!insertedUser) {
        throw new ApplicationError('新增用户失败')
    }

    rsp.data = insertedUser
    Response.success(ctx, rsp)
}

hdl.SaveUser = async ctx => {
    const { id, name, email } = ctx.request.body
    const rsp = {}
    if (!name) {
        throw new InvalidRequestBodyFormat('解析参数失败, name未设置')
    }
    if (!email) {
        throw new InvalidRequestBodyFormat('解析参数失败, email未设置')
    }

    const updateFields = {}
    if (name) updateFields.name = name
    if (email) updateFields.email = email

    const where = {}
    if (id) {
        where.id = id
    } else {
        where.email = email
    }
    const options = sz.QueryOpts(where)
    const user = await userDB.QueryUserDetailDB(options)
    if (!user) {
        const insertedUser = await userDB.InsertUserDB(updateFields)
        if (!insertedUser) {
            throw new ApplicationError('新增用户失败')
        }
        rsp.data = insertedUser
    } else {
        updateFields.id = user.id
        const updatedUser = await userDB.UpdateUserDB(updateFields)
        if (!updatedUser) {
            throw new ApplicationError('更新用户信息失败')
        }
        rsp.data = updateFields
    }
    Response.success(ctx, rsp)
}

module.exports = hdl
