// Dependencies.
var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");
var path = require("path");
// Request axios and cheerio make the scraping possible.
var axios = require("axios");
var cheerio = require("cheerio");

// Set up the Express server.
var app = express();
// Set up the PORT.
var PORT = process.env.PORT || 8080;

// Require all models.
var db = require("./models");


// Configure the middleware.
// Morgan logger for logging requests.
app.use(logger("dev"));

// Use body parsing for comment submission.
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// Require and enable Handlebars.
var exphbs = require("express-handlebars");

app.engine("handlebars", exphbs({
    defaultLayout: "main"
}));
app.set("view engine", "handlebars");

// Static directory.
app.use(express.static("public"));

// ----- DATABASE CONFIG ------
var databaseUri = 'mongodb://localhost/mongoHeadlines';
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";
if (process.env.MONGODB_URI) {
  mongoose.connect(process.env.MONGODB_URI);
} else {
  mongoose.connect(databaseUri);
}



// ----- END DATABASE CONFIG -------

// By default mongoose uses callbacks for async queries, we're setting it to use promises (.then syntax) instead
// Connect to MONGOOSE
var db = mongoose.connection;

// show errors.
db.on('error', function(err) {
  console.log('Mongoose error: ', err);
});

// log a success message.
db.once('open', function() {
  console.log('Mongoose connection successful.');
});

// Routes.
require("./routes/html-routes.js")(app);
require("./routes/api-scrape-routes.js")(app);
require("./routes/api-note-routes.js")(app);


// Listen on port 8080.
app.listen(8080, function() {
  console.log("App running on port 8080!");
});