// These are the routes to handle the posting of comments on the website.

var db = require("../models");

module.exports = function (app) {

  // Routes for the Comment (Note) section.
  // ======================================

  // GET route for grabbing a specific Headline by id, populate it with it's note.
  app.get("/api/headlines/:id", function (req, res) {
    // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
    db.Headline.findOne({
        _id: req.params.id
      })
      // ..and populate all of the notes associated with it
      .populate("note")
      .then(function (dbHeadline) {
        // If we were able to successfully find an Headline with the given id, send it back to the client
        res.json(dbHeadline);
      })
      .catch(function (err) {
        // If an error occurred, send it to the client
        res.json(err);
      });
  });

  // ==============================================================

  // POST route for saving/updating a Headline's associated Note.
  app.post("/api/headlines/:id", function (req, res) {
    // Create a new note and pass the req.body to the entry
    db.Note.create(req.body)
      .then(function (dbNote) {
        // If a Note was created successfully, find one Headline with an `_id` equal to `req.params.id`. Update the Headline to be associated with the new Note
        // { new: true } tells the query that we want it to return the updated User -- it returns the original by default
        // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
        return db.Headline.findOneAndUpdate({
          _id: req.params.id
        }, {
          note: dbNote._id
        }, {
          new: true
        });
      })
      .then(function (dbHeadline) {
        // If we were able to successfully update a Headline, send it back to the client.
        console.log("updated headline: ", dbHeadline);
        res.json(dbHeadline);
      })
      .catch(function (err) {
        // If an error occurred, send it to the client.
        res.json(err);
      });
  });

}