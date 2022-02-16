const { selectTopics } = require("../models/models.js");

exports.getTopics = (req, res, next) => {
  // console.log("YOU'RE IN CONTROLLER");
  selectTopics().then((topics) => {
    console.log(topics, "<------------------ CONTROLLER");
    res.status(200).send(topics);
  });
};
