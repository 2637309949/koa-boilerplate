'use strict'

const sz = require('../comm/sequelize')
const hdl = {}

hdl.QueryUserDB = async (options, ...count) => {
    const sequelize = sz.globalSequelize()
    const User = sequelize.models.User
    let total = 0
    if (count.length > 0) {
        total = await User.count(options)
    }
    return [await User.findAll(options), total]
}

hdl.QueryUserDetailDB = (options) => {
    const sequelize = sz.globalSequelize()
    const User = sequelize.models.User
    return User.findOne(options)
}

hdl.UpdateUserDB = (user) => {
    const sequelize = sz.globalSequelize()
    const User = sequelize.models.User
    return User.update(user, {
        where: {
            id: user.id
        }
    })
}

hdl.DeleteUserDB = (user) => {
    const sequelize = sz.globalSequelize()
    const User = sequelize.models.User
    return User.update({ deletedAt: Date.now() / 1000 | 0 }, {
        where: {
            id: user.id
        }
    })
}

hdl.InsertUserDB = async (user) => {
    const sequelize = sz.globalSequelize()
    const User = sequelize.models.User
    const ret = await User.create(user)
    return ret
}

module.exports = hdl
