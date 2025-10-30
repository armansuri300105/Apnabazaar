// This file creates unique order IDs for tracking purchases

// Import cryptographic tools for generating random values
import crypto from "crypto";

// Function to generate a unique order ID
// Format: APNBZR-YYYYMMDD-HHMMSS-RANDOM
// Example: APNBZR-20231030-143022-A1B2
export const generateOrderId = () => {
  // Start with website prefix
  const prefix = "APNBZR";
  const now = new Date();

  // Get current date (YYYYMMDD format)
  const date = now.toISOString().slice(0,10).replace(/-/g, "");
  
  // Get current time (HHMMSS format)
  const time = now.toTimeString().slice(0,8).replace(/:/g, "");
  
  // Add random characters to ensure uniqueness
  const random = crypto.randomBytes(2).toString("hex").toUpperCase();

  // Combine all parts with dashes
  return `${prefix}-${date}-${time}-${random}`;
}
