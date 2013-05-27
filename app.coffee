coffee = require("coffee-script")
express = require("express")
jade = require("jade")
lactate = require("lactate")
nconf = require("nconf")
https = require("https")
qs = require("querystring")

require "./configure"

app = module.exports = express()

app.set "views", "#{__dirname}/views"
app.set "view engine", "jade"
app.set "view options", layout: false

app.use lactate.static "#{__dirname}/dist", "max age": "one week"

# Convenience for allowing CORS on routes - GET only
app.all '*', (req, res, next) ->
  res.header 'Access-Control-Allow-Origin', '*'
  res.header 'Access-Control-Allow-Methods', 'GET, OPTIONS'
  res.header 'Access-Control-Allow-Headers', 'Content-Type'
  next()

authenticate = (code, cb) ->

  data = qs.stringify
    client_id: nconf.get("GITHUB_APPLICATION_CLIENT_ID"),
    client_secret: nconf.get("GITHUB_APPLICATION_CLIENT_SECRET"),
    code: code

  options =
    host: nconf.get("GITHUB_HOST")
    port: nconf.get("GITHUB_PORT")
    path: nconf.get("GITHUB_PATH")
    method: nconf.get("GITHUB_METHOD")
    headers: 'content-length': data.length

  body = ""
  req = https.request options, (res) ->
    res.setEncoding('utf8')
    res.on 'data', (chunk) -> body += chunk
    res.on 'end', -> cb(null, qs.parse(body).access_token)

  req.write(data)
  req.end()
  req.on 'error', (e) -> cb(e.message)

app.get '/authenticate/:code', (req, res) ->
  authenticate req.params.code, (err, token) ->
    if (err)
      res.json(err)
    else
    res.json(if token then "token": token else "error": "bad_code");

app.get "/*", (req, res) ->
  res.render "index"
