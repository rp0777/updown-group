const axios = require("axios");
const puppeteer = require("puppeteer");
const { formatList } = require("../utils/formatList.util");

const fetchData = async () => {
  try {
    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"], // Needed on some cloud platforms
    });

    const page = await browser.newPage();

    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36"
    );

    // Go to the chart page to simulate a real session
    await page.goto("https://www.irctc.co.in/online-charts/traincomposition", {
      waitUntil: "networkidle2",
    });

    const journeyDate = new Date();

    const istDate = new Intl.DateTimeFormat("en-CA", {
      timeZone: "America/Los_Angeles",
      // timeZone: "Asia/Kolkata",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(journeyDate);

    const payload = {
      trainNo: "12955",
      boardingStation: "MMCT",
      remoteStation: "MMCT",
      trainSourceStation: "MMCT",
      jDate: istDate,
      cls: "SL",
      chartType: 2,
    };

    const response = await page.evaluate(async (payload) => {
      const res = await fetch(
        "https://www.irctc.co.in/online-charts/api/vacantBerth",
        {
          method: "POST",
          headers: {
            accept: "application/json",
            "content-type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (!res.ok) {
        return { error: `Failed with status ${res.status}` };
      }

      return await res.json();
    }, payload);

    await browser.close();

    if (response && response.vbd && response.vbd.length > 0) {
      const formattedBerths = formatList(response.vbd);

      return formattedBerths;
    } else if (
      response &&
      response.vbd &&
      response.vbd.length === 0
    ) {
      console.log("No Vacant Berth Data Found!");
      return "No vacant berths found!";
    }
  } catch (err) {
    console.error("API Error for fetching Vacant Berth Data:", err.message);
    throw err;
  }
};

module.exports = { fetchData };
