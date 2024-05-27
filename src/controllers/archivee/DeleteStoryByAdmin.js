const Archives = require("../../models/archivesSchema");
const Storys = require("../../models/story");

exports.ArchiveStoryByAdmin = async (req, res) => {
  try {
    let user = req.user._id;
    if (!req.params.id) {
      return res.json({ success: false, message: "invalid id " });
    }

    //find post
    let archive = await Storys.findById(req.params.id);

    let archivePost = await Archives.create({
      user,
      type: "post",
      data: archive,
    });
    await Storys.findByIdAndDelete(archive._id);

    return res.json({ success: true, message: "archived successfully" });
  } catch (error) {
    return res.json({ success: false, message: "internal server error " });
  }
};
