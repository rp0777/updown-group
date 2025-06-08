const { sendEmail } = require("../services/mail.service");
const { fetchData } = require("../services/12955.service");

const runVacantBerthJob = async () => {
  console.log("Running vacant berth job...");

  try {
    console.log("Fetching Vacant Berth Data...");
    const data = await fetchData();
    const journeyDate = new Date();

    const istDate = new Intl.DateTimeFormat("en-CA", {
      timeZone: "America/Los_Angeles",
      // timeZone: "Asia/Kolkata",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(journeyDate);

    console.log("Sending Email of Vacant Berth Data...");
    try {
      await sendEmail({
        to: process.env.EMAIL_TO,
        subject: `Jaipur SuperFast Vacant Seats for Date ${istDate}`,
        text: data,
        html: `<p>Below Seats are vacant in train MMCT JAIPUR SF (12922) </p><pre>${data}</pre>`,
      });
      console.log("📧 Email sent successfully!");
    } catch (error) {
      console.error("❌ Error in vacant berth job:", error.message);
    }
  } catch (err) {
    console.error("❌ Error in vacant berth job:", err.message);
  }
};

module.exports = runVacantBerthJob;
