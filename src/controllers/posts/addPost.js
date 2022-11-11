const Posts = require("../../models/post");
const user = require("../../models/Register");
const addpost = async (req, res) => {
  try {
    //parsing the postedby object
    let parsed = JSON.parse(req.body.postedby);
    const { description, reactions, comments, shares } = req.body;

    const savedpost = await Posts.create({
      postedby: parsed,
      description,
      reactions,
      comments,
      shares,
      media: req.file.filename,
    });
    res.send(savedpost);
  } catch (err) {
    console.log("error is ", err);
    res.status(400).send(err);
  }
};

module.exports = addpost;
