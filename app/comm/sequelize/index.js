'use strict'

const debug = require('debug')('sequelize')
const Sequelize = require('sequelize')
const define = require('./define.js')
let sequelize = null

function globalSequelize() {
    return sequelize
}

async function init(defines, opt = {}) {
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

function QueryOpts(where) {
    return { where, attributes: { exclude: ['deletedAt','password'] } }
}

module.exports.init = init
module.exports.QueryOpts = QueryOpts
module.exports.globalSequelize = globalSequelize
module.exports.define = define
