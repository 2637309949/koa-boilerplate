'use strict'

const Router = require('koa-router')
const miscCtrl = require('./handler/misc')
const userCtrl = require('./handler/user')
const authCtrl = require('./handler/auth')

const router = new Router()
router.get('/', miscCtrl.getApiInfo)
router.get('/spec', miscCtrl.getSwaggerSpec)
router.get('/status', miscCtrl.healthcheck)

// routes for user
router.get('/v1/user/queryUser', userCtrl.queryUser)
router.get('/v1/user/queryUserDetail', userCtrl.queryUserDetail)
router.post('/v1/user/updateUser', userCtrl.updateUser)
router.post('/v1/user/deleteUser', userCtrl.deleteUser)
router.post('/v1/user/insertUser', userCtrl.insertUser)
router.post('/v1/user/saveUser', userCtrl.saveUser)

// routes for auth
router.post('/v1/auth/register', authCtrl.register)
router.post('/v1/auth/login', authCtrl.login)
router.get('/v1/auth/profile', authCtrl.profile)
router.post('/v1/auth/changepwd', authCtrl.changepwd)
router.post('/v1/auth/resetpwd', authCtrl.resetpwd)

module.exports = router
