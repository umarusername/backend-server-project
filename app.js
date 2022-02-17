const express = require("express");
const { getTopics } = require("./controllers/controllers.js");
const { getArticles } = require("./controllers/controllers.js");

//THIS IS AFTER I MADE A BRANCH NOT THE ORIGINAL MAIN --> I FORGOT TO DO ALL THIS WORK IN A SEPERATE BRANCH SO I'M WRITING THIS MESSAGE TO DIFFERENTIATE BETWEEN MAIN AND NCNEWS-#14 BRANCH.

const app = express();

app.get("/api/topics", getTopics);

app.get("/api/articles/:article_id", getArticles);

//THIS ERROR "HANDLER" ISN'T DOING ANYTHING - MAKE A REAL ONE!!
//Edit: This will automatically respond with an error 404 and send
//back a msg of "path not found" to any invalid url input.
app.all("/*", (req, res) => {
  console.log("<-----------COMING FROM APP.JS------------>");
  res.status(404).send({ msg: "path not found" });
});

//first error handler then if conditions not met the err is passed to next handler below (line 30)
app.use((err, req, res, next) => {
  //console.log(err.code);
  if (err.code === "22P02") {
    res.status(400).send({ msg: "bad request" });
  }
  next(err);
});

//code below is dynamic and suitable for multiple errors like all 404s - also its an error handler
app.use((err, req, res, next) => {
  //console.log(err.code);
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  }
});

module.exports = app;

//^allows us to do the app.get stuff
//in here we have endpoints
//errors for 404 and 500 could be in here first
