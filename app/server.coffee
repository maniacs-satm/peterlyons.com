#!/usr/bin/env coffee
config = require "app/config"
NotFound = require "./NotFound"
express = require "express"
path = require "path"
child_process = require "child_process"

app = express()
app.set "view engine", "jade"
app.set "views", __dirname
app.locals
  config: config
  appURI: config.appURI
app.use express.logger {immediate: true, format: ":date :method :url"}
app.use express.logger {format: ":method :url :date"}

#Load in the controllers
(require("app/#{routes}")(app) for routes in [
	"blogs/blogRoutes"
	"pages/pagesRoutes"
  "photos/photosRoutes"
	"photos/galleriesRoutes"
  "site/cssRoutes"
	"site/errorRoutes"
])
app.use express.static config.staticDir

#Last in the chain means 404 for you
app.use (req, res, next) ->
  next new NotFound req.path

app.use (error, req, res, next) ->
  console.log "Error handler middleware:", error
  if error instanceof NotFound
    res.render "site/error404"
  else
    res.render "site/error500"

ip = if config.loopback then "127.0.0.1" else "0.0.0.0"
console.log "Express serving on http://#{ip}:#{config.port} baseURL: #{config.baseURL}, env: #{process.env.NODE_ENV}"
app.listen config.port, ip

if config.inspector.enabled
  inspector = child_process.fork(
    require.resolve("node-inspector/bin/inspector"),
    ["--web-port=#{config.inspector.webPort}", "--web-host=127.0.0.1"]
  )
  inspector.on "message", (message) ->
    switch message.event
      when "SERVER.LISTENING"
        console.log "Visit %s to start debugging.", message.address.url
      when "SERVER.ERROR"
        console.log "Cannot start the server: %s.", message.error.code
