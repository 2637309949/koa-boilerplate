'use strict'
const sz = require('../comm/sequelize')

const hdl = {}
hdl.queryUserDB = async (ctx, sequelize, options, ...count) => {
    options.logging = sz.logging(ctx)
    const User = sequelize.models.User
    let total = 0
    if (count.length > 0) {
        total = await User.count(options)
    }
    return [await User.findAll(options), total]
}

hdl.queryUserDetailDB = (ctx, sequelize, options) => {
    options.logging = sz.logging(ctx)
    const User = sequelize.models.User
    return User.findOne(options)
}

hdl.updateUserDB = (ctx, sequelize, user) => {
    const options = { where: { id: user.id } }
    options.logging = sz.logging(ctx)
    const User = sequelize.models.User
    return User.update(user, options)
}

hdl.deleteUserDB = (ctx, sequelize, user) => {
    const options = { where: { id: user.id } }
    options.logging = sz.logging(ctx)
    const User = sequelize.models.User
    return User.update({ deletedAt: Date.now() / 1000 | 0 }, options)
}

hdl.insertUserDB = async (ctx, sequelize, user) => {
    const options = {}
    options.logging = sz.logging(ctx)
    const User = sequelize.models.User
    const ret = await User.create(user, options)
    return ret
}

module.exports = hdl
