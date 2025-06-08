const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Routes
const mailRoutes = require("./routes/mail.route");
app.use("/v1", mailRoutes);

// Scheduler
require("./schedulers/berth.scheduler"); // <== Adds CRON job

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
