const stories = require("../../models/story");
const addstory = async (req, res) => {
  console.log(req.body);
  try {
    let media = {};
    if (req.file) {
      media = {
        name: req.file.filename,
        type: req.file.mimetype,
      };
    }

    //parsing the postedby object
    let parsed = JSON.parse(req.body.postedby);
    const { description } = req.body;

    const savedstory = await stories.create({
      postedby: parsed,
      reactions: [],
      description: description,
      media: media,
    });
    res.send(savedstory);
  } catch (err) {
    console.log("error is ", err);
    res.status(400).send(err);
  }
};

module.exports = addstory;
