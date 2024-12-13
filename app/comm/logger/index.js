'use strict'

const winston = require('winston')
const config = require('../config/logger')

let logger = winston.createLogger({
  ...config,
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.timestamp(),
    winston.format.printf(({ timestamp, level, message, ctx = { id: 'unknow' } }) => {
      let reqId = ctx?.id
      const localDate = new Date(timestamp)
      // 设置时区为中国时区
      const localTimestamp = localDate.toLocaleString('zh-CN', {
        timeZone: 'Asia/Shanghai',
        hour12: false
      }).replace(/\//g, '-').replace(/, /g, ' ')
      return `[${localTimestamp}] ${level}: ${message} ${reqId}`
    })
  ),
  transports: [
    new winston.transports.Console()
  ]
})

module.exports = logger
