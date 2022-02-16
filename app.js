const express = require("express");
const { getTopics } = require("./controllers/controllers.js");

const app = express();

app.get("/api/topics", getTopics);

module.exports = app;

//^allows us to do the app.get stuff
//in here we have endpoints
//errors for 404 and 500 could be in here first
