require("coffee-script");

var nconf = require("nconf");
var http = require("http");
var app = require("./app");

var port = nconf.get("PORT")
app.listen(port, null, function(err) {
  console.log("listening on port " + port);
});
//http.createServer(app).listen(nconf.get("PORT"), function(err) {
//  console.log("Server is running on port " + port + ".");
//});