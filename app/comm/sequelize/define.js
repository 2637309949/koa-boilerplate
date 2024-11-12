'use strict'

const { DataTypes } = require('sequelize')

const defaultOpts = {
    attributes: {
        total: { type: DataTypes.VIRTUAL }
    },
    options: {},
    associate: [],
    addHook: []
}

module.exports.define = (...options) => {
    return options.reduce((acc, curr) => {
        curr(acc)
        return acc
    }, defaultOpts)
}

module.exports.modelName = (modelName) => {
    return (opt) => {
        opt.modelName = modelName
    }
}

module.exports.attributes = (attributes) => {
    return (opt) => {
        opt.attributes = { ...opt.attributes, ...attributes }
    }
}

module.exports.options = (options) => {
    return (opt) => {
        opt.options = { ...opt.options, ...options }
    }
}

module.exports.associate = (associate) => {
    return (opt) => {
        opt.associate.push(associate)
    }
}

module.exports.addHook = (addHook) => {
    return (opt) => {
        opt.addHook.push(addHook)
    }
}
