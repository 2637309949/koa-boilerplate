'use strict'

const sz = require('../comm/sequelize')

exports.QueryUserDB = (where) => {
    ctx.body = ''
}

exports.QueryUserDetailDB = (where) => {
    ctx.body = ''
}

exports.UpdateUserDB = (user) => {
    ctx.body = ''
}

exports.DeleteUserDB = (user) => {
    ctx.body = ''
}

exports.InsertUserDB = async (user) => {
    const sequelize = sz.globalSequelize()
    const User = sequelize.User
    const ret = await User.create(user)
    return ret
}
