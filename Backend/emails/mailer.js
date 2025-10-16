import { google } from "googleapis";
import oAuth2Client from "./gmailAuth.js";
import nodemailer from "nodemailer";

export const sendMail = async ({ to, subject, html }) => {
  try {
    const accessTokenResponse = await oAuth2Client.getAccessToken();
    const accessToken = accessTokenResponse?.token;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: process.env.GMAIL_USER,
        clientId: process.env.GMAIL_CLIENT_ID,
        clientSecret: process.env.GMAIL_CLIENT_SECRET,
        refreshToken: process.env.GMAIL_REFRESH_TOKEN,
        accessToken,
      },
    });

    const mailOptions = {
      from: `"ApnaBazzar" <${process.env.GMAIL_USER}>`,
      to,
      subject,
      html,
    };

    const result = await transporter.sendMail(mailOptions);
    console.log("✅ Email sent:", result.messageId);
    return result;
  } catch (error) {
    console.error("❌ Error sending mail:", error);
    throw error;
  }
};