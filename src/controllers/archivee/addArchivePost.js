const Archives = require("../../models/archivesSchema");
const Posts = require("../../models/post");

exports.addArchivePost = async (req, res) => {
  try {
    let user = req.user._id;
    if (!req.params.id) {
      return res.json({ success: false, message: "invalid id " });
    }

    //find post
    let archive = await Posts.findById(req.params.id);

    //check if user is actually archiving his own posts
    if (user.toString() !== archive.postedby.toString()) {
      return res.status(401).json({ success: false, message: "not allowed" });
    }

    let archivePost = await Archives.create({
      user,
      type: "post",
      data: archive,
    });
    await Posts.findByIdAndDelete(archive._id);

    return res.json({ success: true, message: "archived successfully" });
  } catch (error) {
    return res.json({ success: false, message: "internal server error " });
  }
};
