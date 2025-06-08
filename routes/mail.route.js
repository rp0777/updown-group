const express = require("express");
const { sendEmail } = require("../services/mail.service");
const { fetchData } = require("../services/12955.service");
const dotenv = require("dotenv");

dotenv.config();

const router = express.Router();

router.get("/vacant-berth", async (req, res) => {

  console.log("Fetching vacant berth data...");
  try {
    const data = await fetchData();
    const journeyDate = new Date();

    const istDate = new Intl.DateTimeFormat("en-CA", {
      timeZone: "America/Los_Angeles",
      // timeZone: "Asia/Kolkata",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(journeyDate);

    if (data === "No vacant berths found!") {
      res.status(200).json({ message: "No vacant berths found!" });
    } else {
      console.log("Sending email...");
      try {
        await sendEmail({
          to: process.env.EMAIL_TO,
          subject: `Jaipur SuperFast Vacant Seats for Date ${istDate}`,
          text: data,
          html: `<b>${data}</b>`,
        });
        res.status(200).json({ message: "Email sent successfully" });
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    }
  } catch (error) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
