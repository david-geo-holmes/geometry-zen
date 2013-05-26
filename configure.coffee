nconf = require("nconf")

env = process.env.NODE_ENV or "development"

console.log "env: #{env}"

nconf.use("memory")
  .argv()
  .env()
  .file({file: "config.#{env}.json"})
  .defaults({
    port: 8080
  })

unless host = nconf.get("host")
  console.error "The 'host' option is required."
  process.exit(1)