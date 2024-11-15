'use strict'

const logger = require('../logger')
const cx = require('../util/context')
const debug = require('debug')('sequelize')
const Sequelize = require('sequelize')
const define = require('./define.js')
let sequelize = null

function globalSequelize() {
    return sequelize
}

async function init(defines, opt = {}) {
    // const logging = (...msg) => console.log(msg)
    try {
        sequelize = new Sequelize(opt.uri, { pool: opt.pool })
        await sequelize.authenticate()
        debug('Connection has been established successfully.')
    } catch (error) {
        debug('Unable to connect to the database:', error)
    }
    defines.forEach(define => {
        const { associate, sync,modelName,attributes,options } = define
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
    return { where, attributes: { exclude: ['deletedAt','password'] } }
}

function logging(ctx) {
    return msg => logger.info({ event: 'sequelize' }, `${msg} (${cx.getReqId(ctx)})`)
}

module.exports.init = init
module.exports.logging = logging
module.exports.withWhere = withWhere
module.exports.globalSequelize = globalSequelize
module.exports.define = define
