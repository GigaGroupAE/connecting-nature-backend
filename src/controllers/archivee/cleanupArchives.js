const fs = require("fs");
const path = require("path");
const Archives = require("../../models/archivesSchema");

const FIFTEEN_DAYS = 15 * 24 * 60 * 60 * 1000;

async function cleanupOldArchives() {
  try {
    const projectRoot = path.resolve(__dirname, "../../../");
    const fifteenDaysAgo = new Date(Date.now() - FIFTEEN_DAYS);

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const archives = await Archives.find({
      type: "post",
      createdAt: { $gte: today, $lt: fifteenDaysAgo },
    });

    for (const archive of archives) {
      if (
        archive.data &&
        archive.data.media &&
        archive.data.media.compressedPath
      ) {
        const mediaFileName = path.basename(archive.data.media.compressedPath);

        const mediaFilePath = path.join(projectRoot, "uploads", mediaFileName);

        console.log("Deleting media file at:", mediaFilePath);

        try {
          fs.unlinkSync(mediaFilePath);
          console.log("Deleted media file:", mediaFilePath);
        } catch (err) {
          console.error("Error deleting media file:", mediaFilePath, err);
        }
      }

      // Delete the archive document
      await Archives.findByIdAndDelete(archive._id);
      console.log("Deleted archived post:", archive._id);
    }
  } catch (err) {
    console.error("Error during cleanupArchivedPosts:", err);
  }
}

module.exports = cleanupOldArchives;
