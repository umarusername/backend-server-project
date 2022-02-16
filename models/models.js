const db = require("../db/connection.js");

exports.selectTopics = () => {
  //   console.log("YOU'RE IN MODEL");
  return db.query("SELECT * FROM topics;").then((result) => {
    return result.rows;
  });
};
