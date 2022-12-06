const Posts = require("../../models/post");
const addpost = async (req, res) => {
  console.log(req.body);
  try {
    //parsing the postedby object
    let parsed = JSON.parse(req.body.postedby);
    const { description, reactions, comments, shares } = req.body;
    const savedpost = await Posts.create({
      postedby: parsed,
      description,
      reactions: JSON.parse(reactions),
      comments: JSON.parse(comments),
      shares: JSON.parse(shares),
      media: req.file.filename,
    });
    console.log(savedpost);
    res.send(savedpost);
  } catch (err) {
    console.log("error is ", err);
    res.status(400).send(err);
  }
};

module.exports = addpost;
