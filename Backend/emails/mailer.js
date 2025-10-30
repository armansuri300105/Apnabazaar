// This file handles sending emails to users (verification, order confirmations, etc.)

// Previously used Gmail for sending emails (kept for reference)
// import nodemailer from "nodemailer";
// import { google } from "googleapis";

// Gmail OAuth2 setup for secure email sending
// const oAuth2Client = new google.auth.OAuth2(
//   process.env.GMAIL_CLIENT_ID,
//   process.env.GMAIL_CLIENT_SECRET,
//   "https://developers.google.com/oauthplayground"
// );
// oAuth2Client.setCredentials({ refresh_token: process.env.GMAIL_REFRESH_TOKEN });

// Gmail email sending function
// export const sendMail = async ({ to, subject, html }) => {
//   try {
//     const accessToken = await oAuth2Client.getAccessToken();

//     // Set up Gmail connection
//     const transporter = nodemailer.createTransport({
//       service: "gmail",
//       auth: {
//         type: "OAuth2",
//         user: process.env.GMAIL_USER,
//         clientId: process.env.GMAIL_CLIENT_ID,
//         clientSecret: process.env.GMAIL_CLIENT_SECRET,
//         refreshToken: process.env.GMAIL_REFRESH_TOKEN,
//         accessToken: accessToken.token,
//       },
//     });

//     const mailOptions = { from: process.env.GMAIL_USER, to, subject, html };
//     return await transporter.sendMail(mailOptions);
//   } catch (error) {
//     console.error("Error sending mail:", error);
//     throw error;
//   }
// };

// Now using SendGrid for more reliable email delivery
import sgMail from "@sendgrid/mail";

// Set up SendGrid with API key from environment variables
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Function to send emails using SendGrid
// Parameters:
// - to: Recipient's email address
// - subject: Email subject line
// - html: Email content in HTML format
export const sendMail = async ({ to, subject, html }) => {
  try {
    // Prepare email message
    const msg = {
      to,                              // Recipient
      from: process.env.SENDGRID_FROM, // Verified sender address
      subject,                         // Email subject
      html,                           // Email content (HTML)
    };
    const result = await sgMail.send(msg);
    return result;
  } catch (error) {
    console.error("Error sending mail:", error);
    throw error;
  }
};