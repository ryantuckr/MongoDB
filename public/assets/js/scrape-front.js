// GET to grab the headlines as a json
function getResults() {
    // Empty the headlines before re-scraping.
    $("#headlines").empty();
  
    $.getJSON("/api/all", function (data) {
      // For each one
      // var i = i.slice(0, 4);
      for (var i = 0; i < data.length; i++) {
        // Display the information on the page
        $("#headlines").append("<p data-id='" + data[i]._id + "'>" + data[i].title + '<br><a href="' + data[i].link + ' " target="iframe_a">' + data[i].link + '</a>');
      }
    });
  }
  
  // Runs the getResults function as soon as the script is executed.
  getResults();
  
  // Whenever someone clicks a p tag the Comments form will display.
  $(document).on("click", "p", function () {
    // Empty the notes from the note section.
    $("#notes").empty();
  
    // Save the id from the p tag.
    var thisId = $(this).attr("data-id");
  
    // Now make an ajax call for the Headline
    $.ajax({
        method: "GET",
        url: "/api/headlines/" + thisId
      })
      // Now add the note information to the page.
      .then(function (data) {
        console.log(data);
  
        // The headline of the article.
        $("#comment-input").append("<h3>Comment on this article: <br>" + data.title + "</h3><br>");
        // An input to enter a name.
        $("#comment-input").append("Your Name: <br><br><input id='nameinput' name='name' ><br><br>");
        // A textarea to add a new comment.
        $("#comment-input").append("Add a Comment: <br><br><textarea id='bodyinput' name='body'></textarea><br><br>");
        // A button to submit a new comment, with the id of the article saved to it (data-id).
        $("#comment-input").append("<br><button class='btn btn-default' data-id='" + data._id + "' id='savenote'>Submit</button><br><hr>");
  
        // If there's a comment about the article, show it in the saved notes area below the comment-input.
        if (data.note) {
          // Place the the comments in the #savednotes area.
          // for (var i = 0; i < data.note.length; i++) {
          //   // Display the saved comment history on the page.
          //   $("#savednotes").append("<br>" + data.note[i].name + "<br>" + data.note[i].body + "<br><hr><br>");
          // }
          $("#savednotes").append("<br>" + data.note.name + "<br>");
          $("#savednotes").append(data.note.body + "<br>");
         // $("#savednotes").append("<hr><br>");
  
        }
      });
  });
  
  // When you click the Submit button.
  $(document).on("click", "#savenote", function () {
    // Grab the id associated with the article from the submit button
    var thisId = $(this).attr("data-id");
  
    // Run a POST request to change the note, using what's entered in the inputs.
    $.ajax({
        method: "POST",
        url: "/api/headlines/" + thisId,
        data: {
          // Value taken from name input.
          name: $("#nameinput").val(),
          // Value taken from note textarea.
          body: $("#bodyinput").val()
        }
  
      })
      // Once the values are captured, append the comment into savednotes section and clear the comment input section.
      .then(function (data) {
        // Log the response
        console.log(data);
  
        // Empty the notes section
        $("#comment-input").empty();
        $("#savednotes").empty();
  
  
  
      });
  
    // Remove the values entered in the input and textarea for note entry.
    $("#nameinput").val("");
    $("#bodyinput").val("");
  
  });