// import nodemailer from "nodemailer";
// import { google } from "googleapis";

// const oAuth2Client = new google.auth.OAuth2(
//   process.env.GMAIL_CLIENT_ID,
//   process.env.GMAIL_CLIENT_SECRET,
//   "https://developers.google.com/oauthplayground"
// );
// oAuth2Client.setCredentials({ refresh_token: process.env.GMAIL_REFRESH_TOKEN });

// export const sendMail = async ({ to, subject, html }) => {
//   try {
//     const accessToken = await oAuth2Client.getAccessToken();

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


import sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export const sendMail = async ({ to, subject, html }) => {
  try {
    const msg = {
      to,
      from: process.env.SENDGRID_FROM,
      subject,
      html,
    };
    const result = await sgMail.send(msg);
    console.log("Email sent:", result);
    return result;
  } catch (error) {
    console.error("Error sending mail:", error);
    throw error;
  }
};