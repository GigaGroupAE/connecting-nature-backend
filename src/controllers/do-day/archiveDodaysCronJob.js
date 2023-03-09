const CronJob = require("cron").CronJob;
const DodayModel = require("../../models/To-Day");


//this job will run every one minute
const archiveDodaysCronJob = new CronJob("* * * * *", async () => {
  const currentTime = new Date();

  try {
    const docs = await DodayModel.find({
      endTime: { $lt: currentTime },
      status: "active",
    });
    for (const doc of docs) {
      doc.status = "archived";
      await doc.save();
    }
  } catch (err) {
    console.error("Error finding or updating documents:", err);
  }
});

archiveDodaysCronJob.start();
