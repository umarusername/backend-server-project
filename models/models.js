const db = require("../db/connection.js");

//GET ticket #3 connecting to topics
exports.selectTopics = () => {
  return db.query("SELECT * FROM topics;").then((result) => {
    if (result.rows.length === 0) {
      return Promise.reject({ status: 404, msg: "path not found" });
    }
    return result.rows;
  });
};

//GET ticket #14 connecting to article:id
exports.selectArticles = (id) => {
  return db
    .query("SELECT * FROM articles WHERE article_id = $1;", [id]) //$1 would be first element (can add more(also this stops sql injection))
    .then((result) => {
      if (result.rows.length === 0) {
        return Promise.reject({ status: 404, msg: "article not found" });
      }
      //console.log("=====++====>", result.rows);
      return result.rows[0];
    });
};

//PATCH ticket #7 - patching article:id
exports.updateArticle = (id, votes) => {
  const votesDeconstructed = votes.inc_votes; //votesDeconstructed will be 1
  return db
    .query(
      "UPDATE articles SET votes=votes+$2 WHERE article_id = $1 RETURNING*; ",
      [id, votesDeconstructed] //UPDATING the specific votes of article 5
    )
    .then((result) => {
      if (result.rows.length === 0) {
        return Promise.reject({ status: 404, msg: "article not found" });
      }
      return result.rows[0]; //returning the updated article 5 object
    });
};

//ticket #21 - connecting to users
exports.selectUsers = () => {
  return db.query("SELECT * FROM users;").then((result) => {
    if (result.rows.length === 0) {
      return Promise.reject({ status: 404, msg: "path not found" });
    }
    return result.rows;
  });
};

//GET ticket #9 - connecting to articles
exports.selectArticleBody = () => {
  return db
    .query("SELECT * FROM articles ORDER BY created_at DESC;")
    .then((result) => {
      if (result.rows.length === 0) {
        return Promise.reject({ status: 404, msg: "path not found" });
      }
      return result.rows;
    });
};
