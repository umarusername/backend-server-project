const db = require("../db/connection.js");

exports.selectTopics = () => {
  return db.query("SELECT * FROM topics;").then((result) => {
    if (result.rows.length === 0) {
      return Promise.reject({ status: 404, msg: "path not found" });
    }
    return result.rows;
  });
};

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
