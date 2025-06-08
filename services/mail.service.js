const transporter = require("../config/mail.config");
const dotenv = require("dotenv");

dotenv.config();

const sendEmail = async ({ to, subject, text, html }) => {
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: to,
    subject,
    text,
    html,
  };

  return transporter.sendMail(mailOptions);
};

module.exports = { sendEmail };
