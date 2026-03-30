import nodemailer from "nodemailer";

const createTransporter = () => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    throw new Error("Email credentials are missing in environment variables");
  }

  return nodemailer.createTransport({
    host: "smtp.zoho.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    },
    tls: {
      rejectUnauthorized: false
    }
  });
};

const sendEmail = async (to, subject, html, attachmentPath = null) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: `"Bestolap Tuition" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
      attachments: attachmentPath
        ? [
            {
              filename: "invoice.pdf",
              path: attachmentPath
            }
          ]
        : []
    };

    const info = await transporter.sendMail(mailOptions);

    console.log("📨 Email sent:", info.messageId);

    return info;

  } catch (error) {
    console.error("❌ Email sending failed:", error.message);
    throw error;
  }
};

export default sendEmail;
