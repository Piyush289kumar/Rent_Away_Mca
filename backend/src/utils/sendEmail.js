import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail", // 🔥 IMPORTANT
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, // App Password
  },
});

export const sendEmail = async ({ to, subject, html }) => {
  await transporter.sendMail({
    from: `"Rent Away" <${process.env.MAIL_FROM_ADDRESS}>`,
    to,
    subject,
    html,
  });
};
