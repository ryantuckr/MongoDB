// This route handles the HTML page that the user is sent to.

var path = require("path");

module.exports = function(app) {

// Simple index route to the test file.
app.get("/", function(req, res) {
  console.log("/ html route");
  res.sendFile(path.join(__dirname, "../public/index-test.html"));
});

// GET route to get to the index.handlebars page.
// app.get("/", function(req, res) {
//   console.log("/ route");
//   res.render("index");
// });

}