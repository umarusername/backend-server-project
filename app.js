const express = require("express");
const { getTopics } = require("./controllers/controllers.js");
const { getArticles } = require("./controllers/controllers.js");
const { patchArticle } = require("./controllers/controllers.js");
const { getUsers } = require("./controllers/controllers.js");
const { getArticleBody } = require("./controllers/controllers.js");

const app = express();
app.use(express.json());

app.get("/api/topics", getTopics);

app.get("/api/users", getUsers);

app.get("/api/articles/:article_id", getArticles);

app.get("/api/articles", getArticleBody);

//don't need to do app.get for patch requests

//PATCH ticket #7
app.patch("/api/articles/:article_id", patchArticle);

//Edit: This will automatically respond with an error 404 and send
//back a msg of "path not found" to any invalid url input.
app.all("/*", (req, res) => {
  res.status(404).send({ msg: "path not found" });
});

//first error handler then if conditions not met the err is passed to next handler below
app.use((err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ msg: "bad request" });
  }
  next(err);
});

//code below is dynamic and suitable for multiple errors like all 404s - also its an error handler
app.use((err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  }
});

module.exports = app;

//^allows us to do the app.get stuff
//in here we have endpoints
//errors for 404 and 500 could be in here first
