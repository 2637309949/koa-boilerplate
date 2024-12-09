'use strict'

const misc = require('./misc')
const user = require('./user')
const auth = require('./auth')

const hdl = {}
hdl.misc = misc
hdl.user = user
hdl.auth = auth

module.exports  = hdl

