const db = require("../db/connection.js");
const { sort } = require("../db/data/test-data/articles.js");

//GET ticket #3 connecting to topics
exports.selectTopics = () => {
  return db.query("SELECT * FROM topics;").then((result) => {
    if (result.rows.length === 0) {
      return Promise.reject({ status: 404, msg: "path not found" });
    }
    return result.rows;
  });
};

//TICKET #5 IS TO REFACTOR TICKET #14 BELOW
//GET ticket #14 connecting to article:id
exports.selectArticles = (id) => {
  return db
    .query(
      `SELECT articles.*,
      COUNT(comments.comment_id) AS comment_count 
      FROM articles 
      LEFT JOIN comments ON comments.article_id = articles.article_id 
      WHERE articles.article_id = $1
      GROUP BY articles.article_id;`,
      [id] //$1 would be first element (can add more(also this stops sql injection))
    )
    .then((result) => {
      if (result.rows.length === 0) {
        return Promise.reject({ status: 404, msg: "article not found" });
      }
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

//TICKET #16 IS TO REFACTIR TICKET #9
//TICKET #10 IS TO REFACTOR TICKET #9 BELOW
//GET ticket #9 - connecting to articles
//Created_At is default, sortby overrides it if we are given a sortby(same for order).
exports.selectArticleBody = (sort_by = "created_at", order = "desc", topic) => {
  //Greenlist below
  const greenListSortBy = [
    "created_at",
    "topic",
    "article_id",
    "title",
    "votes",
    "sort_by",
  ];

  if (!greenListSortBy.includes(sort_by)) {
    return Promise.reject({ status: 400, msg: "Invalid sort query" });
  }
  if (!["asc", "desc"].includes(order)) {
    return Promise.reject({ status: 400, msg: "Invalid order query" });
  }
  //query-string run this string if we don't have the sortby or order.
  let queryString = `SELECT articles.*,
  COUNT(comments.article_id) AS comment_count
  FROM articles
  LEFT JOIN comments ON articles.article_id = comments.article_id`;
  const queryValues = [];
  if (topic) {
    queryString += ` WHERE topic = $1`;
    queryValues.push(topic);
  }
  queryString += `
  GROUP BY articles.article_id
  ORDER BY articles.${sort_by} ${order};`;
  // console.log("============>", queryString, queryValues);

  return db.query(queryString, queryValues).then((result) => {
    //This is the first step, if the topic does not exist we cannot do anything else
    //If the topic does not exist you will call the returnError() function
    //If the topic does exist we want to check how many articles there are in the topic

    const doesTopicExist = async (topic) => {
      console.log("doesTopicExist function has run.");
      const dbOutput = await db.query(
        "SELECT * FROM articles WHERE topic = $1;",
        [topic]
      );

      //Invoking the returnError function here with given values.
      if (dbOutput.rows.length < 1) {
        console.log("dbOutput is LESS THAN 1", dbOutput);
        returnError(404, "Topic not found");
      } else {
        console.log("Does not exist");
        checkArticleCount();
      }
      doesTopicExist(topic);

      //Rejecting Promise
      const returnError = (errorNum, message) => {
        console.log("PROMISE HAS BEEN REJECTED");
        return Promise.reject({ status: errorNum, msg: `${message}` });
      };
      //Calling returnError function here BUT might break the empty array
      const checkArticleCount = () => {
        if (result.rows.length == 0) {
          console.log("returning an empty array");
          return returnError(404, "Topic not found");
        }
        if (result.rows.length >= 1) {
          console.log("returning articles");
          return result.rows;
        }
        //check the count of the articles in the topic.
        //if the articles are 0 then we want to return an empty array
        //if the articles are greater than 0 we want to return the articles.
      };
    };
    console.log("last return");
    // return result.rows;
  });
};

//Start of checkTopic
// const checkTopicExists = async (topic) => {
//   console.log("THE CHECKTOPIC FUNCTION HAS BEEN CALLED HERE");
//   //checking if topic exists
//   const dbOutput = await db.query(
//     "SELECT * FROM articles WHERE topic = $1;",
//     [topic]
//   );
//   console.log("THIS IS DB OUTPUT====>", dbOutput.rows);
//   console.log("TOPIC 2 ELECTRIC BOOGALOO------------>", topic);
//   //rejecting promise
//   if (dbOutput.rows.length >= 1) {
//     console.log(
//       "THIS IS dbOutput INSIDE PROMISE REJECT====>",
//       dbOutput.rows
//     );
//     //Topic does NOT exist
//     return Promise.reject({ status: 404, msg: "Topic not found" });
//   }
// }; //End of checkTopic

// if (result.rows.length === 0) {
//   checkTopicExists(topic);
//   console.log("THIS IS HAPPENING SECOND + TOPIC:", topic);
//   return result.rows;
// }

//GET ticket #15 - get comments of an article
exports.selectCommentsByArticle = (id) => {
  //"SELECT * FROM comments WHERE comment_id = article_id"
  return db
    .query(`SELECT * FROM comments WHERE article_id = $1`, [id])
    .then((result) => {
      if (result.rows.length === 0) {
        return Promise.reject({ status: 404, msg: "comments not found" });
      }
      // console.log("RESULT FROM CONTROLLER===>", result.rows);
      return result.rows;
    });
};

//POST ticket #11 - post comment on article
exports.insertCommentByArticleID = (id, author, body) => {
  if (body.length === 0 || author.length === 0) {
    return Promise.reject({ status: 400, msg: "bad request" });
  }
  return db
    .query(
      `INSERT into comments(article_id, author, body)
  VALUES($1, $2, $3) RETURNING *`,
      [id, author, body]
    )
    .then((result) => {
      // console.log("RESULT.ROWS[0] FROM MODEL===>", result.rows[0]);
      return result.rows[0];
    });
};

//DELETE ticket #16 - delete comment by ID
// exports.deleteCommentByID = (id) => {
//   return db
//     .query(`DELETE FROM comments WHERE id = $1`, [id])
//     .then((err, result) => {
//       if (err) {
//         return console.log(err);
//       }
//       return result;
//     });
// };
