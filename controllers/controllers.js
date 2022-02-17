const { request } = require("../app.js");
const { selectTopics } = require("../models/models.js");
const { selectArticles } = require("../models/models.js");

exports.getTopics = (req, res, next) => {
  selectTopics().then((topics) => {
    res.status(200).send(topics);
  });
};

exports.getArticles = (req, res, next) => {
  const id = req.params.article_id;
  selectArticles(id)
    .then((articles) => {
      res.status(200).send({ articles: articles }); //sending articles object (line 16) back with key of articles (line 18) //THIS IS NOT DESTRUCTURED
    })
    .catch((err) => {
      next(err);
    });
};
