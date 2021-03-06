const _ = require('lodash')
const analyticsScript = require('./site/blocks/analytics')
const compression = require('compression')
const config = require('config3')
const cssRoutes = require('./site/css-routes')
const express = require('express')
const httpErrors = require('httperrors')
const log = require('bole')(__filename)

function locals (req, res, next) {
  _.extend(
    res.locals,
    _.pick(
      config,
      'appURI',
      'appVersion',
      'analytics',
      'titleSuffix'))
  res.locals.analytics.script = analyticsScript
  next()
}

function head (app) {
  app.set('view engine', 'jade')
  app.set('views', __dirname)
  app.set('trust proxy', true)
  if (config.enableLogger) {
    app.use(function logger (req, res, next) {
      log.debug(req)
      next()
    })
  }
  app.use(compression())
  app.use(locals)
  app.use(cssRoutes)
}

function tail (app) {
  app.use(express.static(config.staticDir))
  app.use(express.static(config.wwwDir))
  app.use(function (req, res, next) {
    next(new httpErrors.NotFound(req.path))
  })
  app.use(require('./errors/error-handler'))
}

module.exports = {
  head: head,
  tail: tail
}
