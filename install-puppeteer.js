const puppeteer = require("puppeteer");

(async () => {
  try {
    await puppeteer.launch({ headless: true });
    console.log("Chrome installed successfully");
    process.exit(0);
  } catch (err) {
    console.error("Failed to install Chrome:", err);
    process.exit(1);
  }
})();
