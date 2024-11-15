'use strict'

const {
    InvalidRequestBodyFormat,
    InvalidRequestQueryFormat,
    ApplicationError
} = require('../comm/error')
const response = require('../comm/util/response')
const sz = require('../comm/sequelize')
const userDB = require('./user.db')
const hdl = {}

hdl.queryUser = async ctx => {
    const { username, pageNo = 1, pageSize = 10 } = ctx.query
    if (username === undefined) {
        throw new InvalidRequestQueryFormat('解析参数失败, username未设置')
    }

    const rsp = {}
    const sequelize = sz.globalSequelize(ctx)
    const where = { username }
    const options = sz.withWhere(where)
    const [users, total] = await userDB.queryUserDB(ctx, sequelize, options, null)
    rsp.data = users
    rsp.totalCount = total
    rsp.curPage = pageNo
    rsp.totalPage = (total / pageSize) | 0
    rsp.totalPage += (rsp.totalCount % pageSize !== 0 ? 1 : 0)
    response.success(ctx, rsp)
}

hdl.queryUserDetail = async ctx => {
    const { id } = ctx.query
    if (!id) {
        throw new InvalidRequestQueryFormat('解析参数失败, id未设置')
    }

    const rsp = {}
    const where = { id }
    const options = sz.withWhere(where)
    const sequelize = sz.globalSequelize(ctx)
    const user = await userDB.queryUserDetailDB(ctx, sequelize, options)
    if (!user) {
        throw new ApplicationError(`用户ID ${id} 不存在`)
    }

    rsp.data = user
    response.success(ctx, rsp)
}

hdl.updateUser = async ctx => {
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
    const user = await userDB.queryUserDetailDB(ctx, sequelize, options)
    if (!user) {
        throw new ApplicationError(`用户ID ${id} 不存在`)
    }

    const updatedUser = await userDB.updateUserDB(ctx, updateFields)
    if (!updatedUser) {
        throw new ApplicationError('更新用户信息失败')
    }

    rsp.data = updateFields
    response.success(ctx, rsp)
}

hdl.deleteUser = async ctx => {
    const { id } = ctx.request.body
    if (!id) {
        throw new InvalidRequestBodyFormat('解析参数失败, id未设置')
    }

    const rsp = {}
    const where = { id }
    const sequelize = sz.globalSequelize(ctx)
    await userDB.deleteUserDB(ctx, sequelize, where)
    rsp.data = where
    response.success(ctx, rsp)
}

hdl.insertUser = async ctx => {
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
    const user = await userDB.queryUserDetailDB(ctx, sequelize, options)
    if (user) {
        throw new ApplicationError(`用户Email ${email} 已存在`)
    }
    const insertedUser = await userDB.insertUserDB(ctx, sequelize, insertFields)
    if (!insertedUser) {
        throw new ApplicationError('新增用户失败')
    }

    rsp.data = insertedUser
    response.success(ctx, rsp)
}

hdl.saveUser = async ctx => {
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
    const user = await userDB.queryUserDetailDB(ctx, sequelize, options)
    if (!user) {
        const insertedUser = await userDB.insertUserDB(ctx, sequelize, updateFields)
        if (!insertedUser) {
            throw new ApplicationError('新增用户失败')
        }
        rsp.data = insertedUser
    } else {
        updateFields.id = user.id
        const updatedUser = await userDB.updateUserDB(ctx, sequelize, updateFields)
        if (!updatedUser) {
            throw new ApplicationError('更新用户信息失败')
        }
        rsp.data = updateFields
    }
    response.success(ctx, rsp)
}

module.exports = hdl
