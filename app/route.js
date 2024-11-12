'use strict'

const Router = require('koa-router')
const miscCtrl = require('./handler/misc')
const userCtrl = require('./handler/user')

const router = new Router()
router.get('/', miscCtrl.getApiInfo)
router.get('/spec', miscCtrl.getSwaggerSpec)
router.get('/status', miscCtrl.healthcheck)

router.get('/v1/user/QueryUser', userCtrl.QueryUser)
router.get('/v1/user/QueryUserDetail', userCtrl.QueryUserDetail)
router.get('/v1/user/UpdateUser', userCtrl.UpdateUser)
router.get('/v1/user/DeleteUser', userCtrl.DeleteUser)
router.get('/v1/user/InsertUser', userCtrl.InsertUser)
router.get('/v1/user/SaveUser', userCtrl.SaveUser)

module.exports = router
