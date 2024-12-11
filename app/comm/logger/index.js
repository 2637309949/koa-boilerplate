'use strict'

const winston = require('winston')
const config = require('../config/logger')

const logger = winston.createLogger({
  ...config,
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.timestamp(),
    winston.format.printf(({ timestamp, level, message, ctx }) => {
      let reqId = ctx?.id
      const localDate = new Date(timestamp)
      const localTimestamp = localDate.toLocaleString('zh-CN', {
        timeZone: 'Asia/Shanghai', // 设置时区为中国时区
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
