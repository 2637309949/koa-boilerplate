'use strict'

const sz = require('../comm/sequelize')

exports.QueryUserDB = async (options, ...count) => {
    const sequelize = sz.globalSequelize()
    const User = sequelize.models.User
    let total = 0
    if (count.length > 0) {
        total = await User.count(options)
    }
    return [await User.findAll(options), total]
}

exports.QueryUserDetailDB = (count) => {
    const sequelize = sz.globalSequelize()
    const User = sequelize.models.User
    return User.findOne(count)
}

exports.UpdateUserDB = (user) => {
    const sequelize = sz.globalSequelize()
    const User = sequelize.models.User
    return User.update(user, {
        where: {
            id: user.id
        }
    })
}

exports.DeleteUserDB = (user) => {
    const sequelize = sz.globalSequelize()
    const User = sequelize.models.User
    return User.destroy({
        where: {
            id: user.id
        }
    })
}

exports.InsertUserDB = async (user) => {
    const sequelize = sz.globalSequelize()
    const User = sequelize.models.User
    const ret = await User.create(user)
    return ret
}
