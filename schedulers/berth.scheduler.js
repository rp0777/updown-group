const { CronJob } = require("cron");
const runVacantBerthJob = require("../jobs/vacantBerth.job");
const dotenv = require("dotenv");

dotenv.config();

const job = new CronJob(
  process.env.CRON_SCHEDULE || "0 17 * * 1-5",
  async () => {
    console.log(
      "🔔 CRON triggered at",
      new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })
    );
    await runVacantBerthJob();
  },
  null,
  true,
  "Asia/Kolkata" // 💡 this tells it to run in IST
);

job.start();
