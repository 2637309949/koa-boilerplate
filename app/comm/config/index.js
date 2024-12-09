'use strict'

const dotenv = require('dotenv')

const { 
  NODE_ENV = 'development',
  APP_NAME = 'koa-boilerplate', 
  APP_HOST = '0.0.0.0', 
  APP_PORT = 7070, 
  JWT_SECRET_KEY = '87hsd079qhw07gq7h'
} = process.env

dotenv.config()

const configs = {
  base: {
    env: NODE_ENV,
    name: APP_NAME,
    host: APP_HOST,
    port: APP_PORT,
    jwtSecretKey: JWT_SECRET_KEY,
  },
  production: {
    port: APP_PORT
  },
  development: {
    db: {
      uri: 'mysql://myppdb:myppdb@172.30.12.123:3309/test',
      pool: {
        max: 10,                          // 最大连接数
        min: 2,                           // 最小连接数
        idle: 10000,                      // 连接池中连接的最大空闲时间（10秒）
        acquire: 30000,                   // 获取连接的最长等待时间（30秒）
        evict: 10000,                     // 空闲连接清理间隔（10秒）
        handleDisconnects: true,          // 自动处理连接断开（MySQL 等数据库推荐使用）
        validate: async (connection) => { // 用来验证连接是否有效，常用 ping 操作来检查
          try {
            await connection.ping()
            return true
          } catch (error) {
            return false
          }
        }
      },
    }
  },
  test: {
    port: 7072,
  }
}

module.exports = {
  ...configs.base,
  ...configs[NODE_ENV]
}
