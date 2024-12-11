'use strict'

const logger = require('../logger')
const cx = require('../util/context')
const Sequelize = require('sequelize')
const define = require('./define.js')
let sequelize = null

function globalSequelize() {
    if (!sequelize) {
        throw new TypeError('`sequelize` is required.')
    }
    return sequelize
}

async function init(defines, opt = {}) {
    try {
        sequelize = new Sequelize(opt.uri, { pool: opt.pool, logging: logging() })
        await sequelize.authenticate()
        logger.info('Connection has been established successfully')
    } catch (error) {
        logger.error('Unable to connect to the database:', error)
    }
    defines.forEach(define => {
        const { associate, sync, modelName, attributes, options } = define
        const model = sequelize.define(
            modelName,
            attributes,
            options,
        )
        if (sync) {
            model.sync()
        }
        associate.forEach(funk => {
            funk(model, sequelize.models)
        })
    })
}

function withWhere(where) {
    return { where, attributes: { exclude: ['deletedAt', 'password'] } }
}

function logging(ctx) {
    let logger = cx.getLogger(ctx)
    return msg => {
        const sqlMatch = msg.match(/^Executing \(default\): (.*);/);
        if (sqlMatch) {
            msg = sqlMatch[1]
        }
        logger.info(msg)
    }
}

module.exports.init = init
module.exports.logging = logging
module.exports.withWhere = withWhere
module.exports.globalSequelize = globalSequelize
module.exports.define = define
