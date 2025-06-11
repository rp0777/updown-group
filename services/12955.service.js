const { formatList } = require("../utils/formatList.util");
const puppeteer = require('puppeteer-core');
const chromium = require('@sparticuz/chromium');

const fetchData = async () => {
  let browser;
  try {
    browser = await puppeteer.launch({
      args: [
        ...chromium.args,
        '--disable-dev-shm-usage',
        '--single-process',
        '--no-zygote',
        '--no-sandbox'
      ],
      executablePath: process.env.CHROME_EXECUTABLE_PATH || await chromium.executablePath(),
      headless: true,
      timeout: 30000
    });

    const page = await browser.newPage();
    await page.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    );

    await page.goto('https://www.irctc.co.in/online-charts/traincomposition', {
      waitUntil: 'networkidle2',
      timeout: 60000
    });

    const journeyDate = new Date();

    const istDate = new Intl.DateTimeFormat("en-CA", {
      // timeZone: "America/Los_Angeles",
      timeZone: "Asia/Kolkata",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(journeyDate);

    const payload = {
      trainNo: "12955",
      boardingStation: "MMCT",
      remoteStation: "MMCT",
      trainSourceStation: "MMCT",
      // jDate: istDate,
      jDate: "2025-06-09",
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
    } else if (response && response.vbd && response.vbd.length === 0) {
      console.log("No Vacant Berth Data Found!");
      return "No vacant berths found!";
    }
  } catch (err) {
    console.error("API Error for fetching Vacant Berth Data:", err.message);
    throw err;
  }
};

module.exports = { fetchData };
