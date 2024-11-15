'use strict'

const {
    InvalidRequestBodyFormat,
    InvalidRequestQueryFormat,
    ApplicationError
} = require('../comm/error')
const Response = require('../comm/util/response')
const sz = require('../comm/sequelize')
const userDB = require('./user.db')
const hdl = {}

hdl.QueryUser = async ctx => {
    const { username, pageNo = 1, pageSize = 10 } = ctx.query
    if (username === undefined) {
        throw new InvalidRequestQueryFormat('解析参数失败, username未设置')
    }

    const rsp = {}
    const sequelize = sz.globalSequelize(ctx)
    const where = { username }
    const options = sz.withWhere(where)
    const [users, total] = await userDB.QueryUserDB(ctx, sequelize, options, null)
    rsp.data = users
    rsp.totalCount = total
    rsp.curPage = pageNo
    rsp.totalPage = (total / pageSize) | 0
    rsp.totalPage += (rsp.totalCount % pageSize !== 0 ? 1 : 0)
    Response.success(ctx, rsp)
}

hdl.QueryUserDetail = async ctx => {
    const { id } = ctx.query
    if (!id) {
        throw new InvalidRequestQueryFormat('解析参数失败, id未设置')
    }

    const rsp = {}
    const where = { id }
    const options = sz.withWhere(where)
    const sequelize = sz.globalSequelize(ctx)
    const user = await userDB.QueryUserDetailDB(ctx, sequelize, options)
    if (!user) {
        throw new ApplicationError(`用户ID ${id} 不存在`)
    }

    rsp.data = user
    Response.success(ctx, rsp)
}

hdl.UpdateUser = async ctx => {
    const { id, username, email } = ctx.request.body
    if (!id) {
        throw new InvalidRequestBodyFormat('解析参数失败, id未设置')
    }
    if (!username && !email) {
        throw new InvalidRequestBodyFormat('至少提供一个更新字段，如name或email')
    }

    const rsp = {}
    const where = { id }
    const sequelize = sz.globalSequelize(ctx)
    const updateFields = { id }
    if (username) updateFields.username = username
    if (email) updateFields.email = email
    const options = sz.withWhere(where)
    const user = await userDB.QueryUserDetailDB(ctx, sequelize, options)
    if (!user) {
        throw new ApplicationError(`用户ID ${id} 不存在`)
    }

    const updatedUser = await userDB.UpdateUserDB(ctx, updateFields)
    if (!updatedUser) {
        throw new ApplicationError('更新用户信息失败')
    }

    rsp.data = updateFields
    Response.success(ctx, rsp)
}

hdl.DeleteUser = async ctx => {
    const { id } = ctx.request.body
    if (!id) {
        throw new InvalidRequestBodyFormat('解析参数失败, id未设置')
    }

    const rsp = {}
    const where = { id }
    const sequelize = sz.globalSequelize(ctx)
    await userDB.DeleteUserDB(ctx, sequelize, where)
    rsp.data = where
    Response.success(ctx, rsp)
}

hdl.InsertUser = async ctx => {
    const { username, email } = ctx.request.body
    if (!username) {
        throw new InvalidRequestBodyFormat('解析参数失败, username未设置')
    }
    if (!email) {
        throw new InvalidRequestBodyFormat('解析参数失败, email未设置')
    }

    const insertFields = {}
    if (username) insertFields.username = username
    if (email) insertFields.email = email

    const rsp = {}
    const where = { email }
    const sequelize = sz.globalSequelize(ctx)
    const options = sz.withWhere(where)
    const user = await userDB.QueryUserDetailDB(ctx, sequelize, options)
    if (user) {
        throw new ApplicationError(`用户Email ${email} 已存在`)
    }
    const insertedUser = await userDB.InsertUserDB(ctx, sequelize, insertFields)
    if (!insertedUser) {
        throw new ApplicationError('新增用户失败')
    }

    rsp.data = insertedUser
    Response.success(ctx, rsp)
}

hdl.SaveUser = async ctx => {
    const { id, name, email } = ctx.request.body
    if (!name) {
        throw new InvalidRequestBodyFormat('解析参数失败, name未设置')
    }
    if (!email) {
        throw new InvalidRequestBodyFormat('解析参数失败, email未设置')
    }

    const updateFields = {}
    if (name) updateFields.name = name
    if (email) updateFields.email = email

    const rsp = {}
    const where = {}
    if (id) {
        where.id = id
    } else {
        where.email = email
    }

    const sequelize = sz.globalSequelize(ctx)
    const options = sz.withWhere(where)
    const user = await userDB.QueryUserDetailDB(ctx, sequelize, options)
    if (!user) {
        const insertedUser = await userDB.InsertUserDB(ctx, sequelize, updateFields)
        if (!insertedUser) {
            throw new ApplicationError('新增用户失败')
        }
        rsp.data = insertedUser
    } else {
        updateFields.id = user.id
        const updatedUser = await userDB.UpdateUserDB(ctx, sequelize, updateFields)
        if (!updatedUser) {
            throw new ApplicationError('更新用户信息失败')
        }
        rsp.data = updateFields
    }
    Response.success(ctx, rsp)
}

module.exports = hdl
