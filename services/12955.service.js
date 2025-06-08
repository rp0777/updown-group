const axios = require("axios");
const { formatList } = require("../utils/formatList.util");

const fetchData = async () => {
  try {
    const journeyDate = new Date();

    const istDate = new Intl.DateTimeFormat("en-CA", {
      timeZone: "America/Los_Angeles",
      // timeZone: "Asia/Kolkata",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(journeyDate);

    const payload = {
      trainNo: "22990",
      boardingStation: "MHV",
      remoteStation: "MHV",
      trainSourceStation: "MHV",
      jDate: istDate,
      cls: "SL",
      chartType: 2,
    };

    const response = await axios.post(
      "https://www.irctc.co.in/online-charts/api/vacantBerth",
      payload,
      {
        headers: {
          accept: "application/json",
          "content-type": "application/json",
          origin: "https://www.irctc.co.in",
          referer: "https://www.irctc.co.in/online-charts/traincomposition",
          "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
        },
      }
    );

    if (response.data && response.data.vbd && response.data.vbd.length > 0) {
      const formattedBerths = formatList(response.data.vbd);

      return formattedBerths;
    } else if (
      response.data &&
      response.data.vbd &&
      response.data.vbd.length === 0
    ) {
      return "No vacant berths found!";
    }
  } catch (err) {
    console.error("API Error:", err.response?.data || err.message);
    throw err;
  }
};

module.exports = { fetchData };
