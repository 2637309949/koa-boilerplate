'use strict'

const sz = require('../comm/sequelize')

exports.QueryUserDB = ctx => {
    ctx.body = ''
}

exports.QueryUserDetailDB = ctx => {
    ctx.body = ''
}

exports.UpdateUserDB = ctx => {
    ctx.body = ''
}

exports.DeleteUserDB = ctx => {
    ctx.body = ''
}

exports.InsertUserDB = async (user) => {
    const sequelize = sz.globalSequelize()
    const User = sequelize.User
    const ret = await User.create(user)
    return ret
}
