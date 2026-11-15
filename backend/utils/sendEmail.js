import nodemailer from "nodemailer";

const sendEmail = async (receiverEmail, subject, senderName) => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.log("Email credentials are not configured.");
    return;
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  await transporter.sendMail({
    from: `"Mini Connect" <${process.env.EMAIL_USER}>`,
    to: receiverEmail,
    subject: `New Mini Connect message: ${subject}`,
    text: `You have received a new message from ${senderName}. Please log in to Mini Connect to read it.`
  });

  console.log("Email notification sent.");
};

export default sendEmail;