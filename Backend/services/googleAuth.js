// This file sets up Google Sign-In functionality for the website

// Import Google's authentication tools
import { google } from "googleapis";
import "dotenv/config";  // Load environment variables for secure credentials

// Create Google authentication client
// This allows users to sign in with their Google account
export const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,      // Your app's Google client ID
    process.env.GOOGLE_CLIENT_SECRET,  // Your app's Google client secret
    "postmessage"                     // Special redirect for web apps
);