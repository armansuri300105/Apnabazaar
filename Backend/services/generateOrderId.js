import crypto from "crypto";

export const generateOrderId = () => {
  const prefix = "APNBZR";
  const now = new Date();

  const date = now.toISOString().slice(0,10).replace(/-/g, "");
  const time = now.toTimeString().slice(0,8).replace(/:/g, "");
  const random = crypto.randomBytes(2).toString("hex").toUpperCase();

  return `${prefix}-${date}-${time}-${random}`;
}
