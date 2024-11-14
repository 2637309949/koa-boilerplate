'use strict'

const { DataTypes } = require('sequelize')

const defaultOpts = {
    attributes: {
        total: {
            type: DataTypes.VIRTUAL
        },
        deletedAt: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
            defaultValue: 0
        }
    },
    options: {
        timestamps: false,
        paranoid: false,
        charset: 'utf8mb4',
        collate: 'utf8mb4_general_ci',
        defaultScope: {
            where: {
                deletedAt: 0,
            },
        },
    },
    associate: [],
    addHook: [],
    sync: false
}

module.exports.define = (...options) => {
    return options.reduce((acc, curr) => {
       curr(acc)
        return acc 
    }, {...defaultOpts})
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

module.exports.sync = (flag) => {
    return (opt) => {
        opt.sync = flag
    }
}
