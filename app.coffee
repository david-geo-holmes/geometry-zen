coffee = require("coffee-script")
express = require("express")
jade = require("jade")
lactate = require("lactate")
nconf = require("nconf")
https = require("https")
qs = require("querystring")

marketing = require("./marketing.json")

require "./configure"

isProductionMode = () ->
  switch process.env.NODE_ENV or "local"
    when "local"
      false
    else
      true

app = module.exports = express()

app.set "views", "#{__dirname}/views"
app.set "view engine", "jade"
app.set "view options", layout: false

app.use express.logger()

# Serve out of dist or generated, depending upon the environment.
folder = "#{if isProductionMode() then 'dist' else 'generated'}"
app.use "/font", lactate.static("#{__dirname}/#{folder}/img", "max age": "one week")
app.use lactate.static "#{__dirname}/#{folder}", "max age": "one week"

app.use express.cookieParser()
app.use express.bodyParser()

app.use app.router

app.use express.errorHandler()

# Convenience for allowing CORS on routes - GET only
app.all '*', (req, res, next) ->
  res.header 'Access-Control-Allow-Origin', '*'
  res.header 'Access-Control-Allow-Methods', 'GET, OPTIONS'
  res.header 'Access-Control-Allow-Headers', 'Content-Type'
  next()

authenticate = (code, cb) ->

  # POST https://github.com/login/oauth/access_token
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

# Forward geometryzen.herokuapp.com to www.geometryzen.org
# Notice that we use HTTP status 301 Moved Permanently (best for SEO purposes).
app.get "/*", (req, res, next) ->
    if req.headers.host.match(/^geometryzen.herokuapp.com/)
      res.redirect("http://www.geometryzen.org#{req.url}", 301)
    else
      next()

# Exchange the session code fot an access token.
app.get '/authenticate/:code', (req, res) ->
  authenticate req.params.code, (err, token) ->
    if (err)
      res.json(err)
    else
    res.json(if token then "token": token else "error": "bad_code");

app.get "/*", (req, res, next) ->
  # Set a cookie to communicate the GitHub Client ID back to the client.
  res.cookie('github-application-client-id', nconf.get("GITHUB_APPLICATION_CLIENT_ID"))
  res.render "index",
    css: "#{if isProductionMode() then 'css/app.min.css' else 'css/app.css'}"
    js: "#{if isProductionMode() then 'js/app.min.js' else 'js/app.js'}"
    marketing: marketing
