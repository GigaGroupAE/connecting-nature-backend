const cron = require("node-cron");
const cleanupOldArchives = require("../controllers/archivee/cleanupArchives");

cron.schedule("0 23 * * *", () => {
  console.log("Running archive clean up job at 11 PM");
  cleanupOldArchives();
});
