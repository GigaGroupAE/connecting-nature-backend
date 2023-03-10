const CronJob = require("cron").CronJob;
const DodayModel = require("../../models/To-Day");

//this job will run every one minute
const archiveDodaysCronJob = new CronJob("* * * * *", async () => {
  //updating campaigns whose end time has reached
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

    //unlock do-days whose start-time has reached

    const startedCampaigns = await DodayModel.find({
      date: { $lt: currentTime },
      locked: true,
    });

    for (const doc of startedCampaigns) {
      doc.locked = false;
      await doc.save();
    }



  } catch (err) {
    console.error("Error finding or updating documents:", err);
  }
});

archiveDodaysCronJob.start();
