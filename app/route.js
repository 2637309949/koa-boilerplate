'use strict'

const Router = require('koa-router')
const miscController = require('./controller/misc')
const userController = require('./controller/user')

const router = new Router()
router.get('/', miscController.getApiInfo)
router.get('/spec', miscController.getSwaggerSpec)
router.get('/status', miscController.healthcheck)

router.get('/v1/user/handler/QueryUser', userController.QueryUser)
router.get('/v1/user/handler/QueryUserDetail', userController.QueryUserDetail)
router.get('/v1/user/handler/UpdateUser', userController.UpdateUser)
router.get('/v1/user/handler/DeleteUser', userController.DeleteUser)
router.get('/v1/user/handler/InsertUser', userController.InsertUser)

module.exports = router
