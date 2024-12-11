'use strict'

const {
    InvalidRequestBodyFormat,
    InvalidRequestQueryFormat,
    ApplicationError
} = require('../comm/error')
const jwt = require('jsonwebtoken')
const sz = require('../comm/sequelize')
const userDB = require('./user.db')
const config = require('../comm/config')
const api = require('../models/api')
const response = require('../comm/util/response')
const hdl = {}

hdl.register = async ctx => {
    const {
        username,
        email,
        password,
        confirmPassword } = ctx.request.body
    const sequelize = sz.globalSequelize(ctx)
    if (username === undefined) {
        throw new InvalidRequestBodyFormat('解析参数失败, username未设置')
    }
    if (email === undefined) {
        throw new InvalidRequestBodyFormat('解析参数失败, email未设置')
    }
    if (password === undefined) {
        throw new InvalidRequestBodyFormat('解析参数失败, password未设置')
    }
    if (confirmPassword === undefined) {
        throw new InvalidRequestBodyFormat('解析参数失败, confirmPassword未设置')
    }

    // Check if email is already registered
    const rsp = {}
    const where = { email }
    const options = sz.withWhere(where)
    const user = await userDB.queryUserDetailDB(ctx, sequelize, options)
    if (user) {
        throw new ApplicationError(`用户Email ${email} 已存在`)
    }

    // Check if password meets criteria
    const isValid = api.user.checkPasswordCriteria(password)
    if (!isValid) {
        throw new ApplicationError(`密码无效! 密码必须包含：1个大写字母、1个数字、1个特殊字符且必须至少8个字符! `)
    }

    // Check if the passwords match
    if (password !== confirmPassword) {
        throw new ApplicationError(`密码不匹配, 请重新确认密码!`)
    }

    const hashpwd = await api.user.hashPassword(password)
    const insertFields = { username, email, password: hashpwd }
    const iUser = await userDB.insertUserDB(ctx, sequelize, insertFields)
    if (!iUser) {
        throw new ApplicationError('新增用户失败')
    }
    rsp.data = {
        username: iUser.username,
        email: iUser.email,
    }
    response.success(ctx, rsp)
}

hdl.login = async ctx => {
    const {
        email,
        password } = ctx.request.body
    const sequelize = sz.globalSequelize(ctx)
    if (email === undefined) {
        throw new InvalidRequestBodyFormat('解析参数失败, email未设置')
    }
    if (password === undefined) {
        throw new InvalidRequestBodyFormat('解析参数失败, password未设置')
    }

    const rsp = {}
    const where = { email }
    const options = { where, attributes: { exclude: ['deletedAt'] } }
    const user = await userDB.queryUserDetailDB(ctx, sequelize, options)
    if (!user) {
        throw new ApplicationError(`用户Email ${email} 不存在`)
    }

    const isMatch = await api.user.comparePassword(password, user.password)
    if (!isMatch) {
        throw new ApplicationError(`用户密码不匹配`)
    }
    const currentTime = new Date()
    const twoAM = new Date(currentTime.toDateString() + ' 02:00:00')
    // 如果当前时间已经超过了今天凌晨2点，设置过期时间为明天凌晨2点
    if (currentTime > twoAM) {
        twoAM.setDate(currentTime.getDate() + 1);
    }
    const expirationTime = Math.floor(twoAM.getTime() / 1000)
    const token = jwt.sign(
        { id: user.id },
        config.jwtSecretKey,
        { expiresIn: expirationTime },
    )
    rsp.token = token
    rsp.expiresIn = expirationTime
    rsp.user = {
        username: user.username,
        email: user.email
    }
    response.success(ctx, rsp)
}

hdl.profile = async ctx => {
    const sequelize = sz.globalSequelize(ctx)
    const rsp = {}
    const where = { id }
    const options = sz.withWhere(where)
    const user = await userDB.queryUserDetailDB(ctx, sequelize, options)
    if (!user) {
        throw new ApplicationError(`用户ID ${id} 不存在`)
    }
    rsp.data = {
        id: user.id,
        username: user.username,
        nickname: user.nickname,
        avatar: user.avatar,
        gender: user.gender,
        gendebirthdayr: user.birthday,
        email: user.email
    }
    response.success(ctx, rsp)
}

hdl.resetpwd = async ctx => {
}

module.exports = hdl
