const Archives = require("../../models/archivesSchema");
const Posts = require("../../models/post");

exports.addArchivePostByAdmin = async (req, res) => {
  try {
    let user = req.user._id;
    if (!req.params.id) {
      return res.json({ success: false, message: "invalid id " });
    }

    //find post
    let archive = await Posts.findById(req.params.id);

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
