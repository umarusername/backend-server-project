const { request } = require("../app.js");
const { selectTopics } = require("../models/models.js");
const { selectArticles } = require("../models/models.js");
const { updateArticle } = require("../models/models.js");
const { selectUsers } = require("../models/models.js");
const { selectArticleBody } = require("../models/models.js");

//GET ticket #3 connecting to topics
exports.getTopics = (req, res, next) => {
  selectTopics()
    .then((topics) => {
      // console.log("<======IN CONTROLLER THEN======>");
      res.status(200).send(topics);
    })
    .catch((err) => {
      // console.log("<=======IN CONTROLLER CATCH========>");
      next(err);
    });
};

//GET ticket #14 connecting to article:id
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

//PATCH ticket #7
exports.patchArticle = (req, res, next) => {
  const id = req.params.article_id; //getting id which would be 5 in this case
  const potato = req.body; //getting object body which will be: { inc_votes: 1 }
  updateArticle(id, potato) //calling in function from models.js
    .then((result) => {
      // console.log("HELLO FROM CONTROLLER", result);
      res.status(200).send(result); //getting the updated article object then sending it back to client
    })
    .catch((err) => {
      next(err);
    });
};

//ticket #21 - connecting to users
exports.getUsers = (req, res, next) => {
  selectUsers()
    .then((users) => {
      // console.log("look here --->", users);
      res.status(200).send(users);
    })
    .catch((err) => {
      next(err);
    });
};

//GET ticket #9 - connecting to articles
exports.getArticleBody = (req, res, next) => {
  selectArticleBody()
    .then((articles) => {
      res.status(200).send(articles);
    })
    .catch((err) => {
      next(err);
    });
};
