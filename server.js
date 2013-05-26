require("coffee-script");

var nconf = require("nconf");
var http = require("http");
var app = require("./app");

var port = nconf.get("port")
console.log("port: " + port);
app.listen(nconf.get("port"), null, function(err) {
  console.log("Geometry Zen Server is running on port " + port + ".");
});
//http.createServer(app).listen(nconf.get("PORT"), function(err) {
//  console.log("Server is running on port " + port + ".");
//});