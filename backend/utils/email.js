const nodemailer = require("nodemailer");

let transporter = null;

function getTransporter() {
  if (transporter) return transporter;

  if (!process.env.SMTP_HOST) {
    // No SMTP configured — fall back to logging emails to the console.
    // This keeps the whole app runnable/testable without real email creds.
    transporter = {
      sendMail: async (opts) => {
        console.log("---- [DEV EMAIL] ----");
        console.log("To:", opts.to);
        console.log("Subject:", opts.subject);
        console.log("Body:", opts.text || opts.html);
        console.log("----------------------");
        return true;
      },
    };
    return transporter;
  }

  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
  return transporter;
}

async function sendEmail({ to, subject, text, html }) {
  const t = getTransporter();
  await t.sendMail({
    from: process.env.EMAIL_FROM || "no-reply@scient.org",
    to,
    subject,
    text,
    html,
  });
}

module.exports = { sendEmail };
