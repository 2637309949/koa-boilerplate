'use strict'

const path = require('path')
const swaggerJSDoc = require('swagger-jsdoc')
const pkginfo = require('../../../package.json')

const info = {
  title: pkginfo.name,
  description: pkginfo.description,
  version: pkginfo.version,
  contact: pkginfo.author,
  termsOfService: ''
}
const servers = []

const definition = {
  openapi: '3.0.0',
  info,
  servers
}

const options = {
  definition,
  apis: [
    path.join(__dirname, './tags.yaml'),
    path.join(__dirname, '../controllers/**/*.js'),
    path.join(__dirname, './components/schemas.yaml'),
    path.join(__dirname, './components/headers.yaml'),
    path.join(__dirname, './components/parameters.yaml'),
    path.join(__dirname, './components/responses.yaml')
  ]
}

const spec = swaggerJSDoc(options)

module.exports = spec
