'use strict'

const {
    misc,
    user,
    auth
} = require('./handler')
const Router = require('koa-router')

const router = new Router()
router.get('/', misc.getApiInfo)
router.get('/spec', misc.getSwaggerSpec)
router.get('/status', misc.healthcheck)

// routes for user
router.get('/v1/user/queryUser', user.queryUser)
router.get('/v1/user/queryUserDetail', user.queryUserDetail)
router.post('/v1/user/updateUser', user.updateUser)
router.post('/v1/user/deleteUser', user.deleteUser)
router.post('/v1/user/insertUser', user.insertUser)
router.post('/v1/user/saveUser', user.saveUser)

// routes for auth
router.post('/v1/auth/register', auth.register)
router.post('/v1/auth/login', auth.login)
router.get('/v1/auth/profile', auth.profile)
router.post('/v1/auth/resetpwd', auth.resetpwd)

module.exports = router
