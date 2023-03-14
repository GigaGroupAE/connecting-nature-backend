const stories = require("../../models/story");
const UserModel = require("../../models/Register")
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
    //increasing points of the user
    await UserModel.findByIdAndUpdate(req.user._id, {
      $inc: { points: 5 },
    });
    res.send(savedstory);
  } catch (err) {
    console.log("error is ", err);
    res.status(400).send(err);
  }
};

module.exports = addstory;
