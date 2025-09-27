import { sendMail } from "./mailer.js";

// ✅ Verification Mail
export const sendVerificationMail = (to, token) => {
  const verificationUrl = `${process.env.server_url}/api/user/verifyEmail?Token=${token}`;

  const html = `
    <div style="
      font-family: Arial, sans-serif;
      background-color: #f4f4f7;
      padding: 40px;
      text-align: center;
    ">
      <div style="
        max-width: 600px;
        margin: auto;
        background-color: #ffffff;
        padding: 30px;
        border-radius: 10px;
        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
      ">
        <h2 style="color: #4a90e2;">Verify Your Email</h2>
        <p style="color: #333; font-size: 16px;">
          Thank you for signing up! Please click the button below to verify your account.
        </p>
        <a href="${verificationUrl}" style="
          display: inline-block;
          margin: 20px 0;
          padding: 12px 25px;
          background-color: #4a90e2;
          color: #fff;
          text-decoration: none;
          border-radius: 5px;
          font-weight: bold;
        ">Verify Email</a>
        <p style="color: #999; font-size: 14px;">
          If the button doesn’t work, copy and paste this URL into your browser:
        </p>
        <p style="color: #4a90e2; font-size: 14px;">${verificationUrl}</p>
        <p style="color: #999; font-size: 12px; margin-top: 30px;">
          This verification link is valid for 15 minutes.
        </p>
      </div>
    </div>
  `;

  return sendMail({ to, subject: "Verify Your Email", html });
};


// ✅ Order Confirmation
export const sendOrderConfirmation = (to, name, orderId, items, total) => {
  const html = `
    <div style="font-family: Arial, sans-serif; background-color: #f4f4f7; padding: 40px; text-align: center;">
      <div style="max-width: 600px; margin: auto; background-color: #ffffff; padding: 30px; border-radius: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
        <h2 style="color: #4a90e2;">Order Confirmed!</h2>
        <p style="color: #333; font-size: 16px;">Hi <b>${name}</b>, your order <b>${orderId}</b> has been confirmed.</p>

        ${items.map(item => `
          <div style="display: flex; align-items: center; border: 1px solid #eee; border-radius: 8px; padding: 10px; margin: 15px 0; text-align: left;">
            <img src="${item?.images[0]}" alt="${item.name}" style="width: 80px; height: 80px; object-fit: cover; border-radius: 5px; margin-right: 15px;" />
            <div style="flex: 1;">
              <p style="margin: 0; font-weight: bold; font-size: 14px; color: #333;">${item.name}</p>
              <p style="margin: 5px 0 0 0; color: #555; font-size: 13px;">Quantity: ${item.quantity}</p>
            </div>
            <p style="margin: 0; font-weight: bold; color: #4a90e2;">₹${item.price}</p>
          </div>
        `).join("")}

        <p style="font-size: 16px; margin-top: 20px;"><b>Total:</b> ₹${total}</p>
        <p style="color: #999; font-size: 12px; margin-top: 20px;">Thank you for shopping with us!</p>
      </div>
    </div>
  `;

  return sendMail({ to, subject: "Order Confirmation", html });
};

// ✅ Order Status Update
export const sendOrderStatusMail = (to, name, orderId, status) => {
  const html = `
    <div style="font-family: Arial, sans-serif; background-color: #f4f4f7; padding: 40px; text-align: center;">
      <div style="max-width: 600px; margin: auto; background-color: #ffffff; padding: 30px; border-radius: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
        <h2 style="color: #4a90e2;">Order Update</h2>
        <p style="color: #333; font-size: 16px;">Hi <b>${name}</b>, your order <b>${orderId}</b> is now <b style="color:#27ae60;">${status}</b>.</p>
        <p style="color: #999; font-size: 12px; margin-top: 20px;">Thank you for shopping with us!</p>
      </div>
    </div>
  `;
  return sendMail({ to, subject: `Order ${status}`, html });
};

// ✅ Order Canceled
export const sendCancelMail = (to, name, orderId) => {
  const html = `
    <div style="font-family: Arial, sans-serif; background-color: #f4f4f7; padding: 40px; text-align: center;">
      <div style="max-width: 600px; margin: auto; background-color: #ffffff; padding: 30px; border-radius: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
        <h2 style="color: #e74c3c;">Order Canceled</h2>
        <p style="color: #333; font-size: 16px;">Hi <b>${name}</b>, we regret to inform you that your order <b>${orderId}</b> has been canceled.</p>
        <p style="color: #999; font-size: 12px; margin-top: 20px;">If you have any questions, please contact our support.</p>
      </div>
    </div>
  `;
  return sendMail({ to, subject: "Order Canceled", html });
};

// ✅ vendor Application
export const sendVendorApplicationMail = (to, userName, email) => {
  const html = `
    <div style="font-family: Arial, sans-serif; background-color: #f4f4f7; padding: 40px; text-align: center;">
      <div style="max-width: 600px; margin: auto; background-color: #ffffff; padding: 30px; border-radius: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
        <h2 style="color: #4a90e2;">New Vendor Application</h2>
        <p style="color: #333; font-size: 16px;">Hi Admin,</p>
        <p style="color: #333; font-size: 16px;">
          <b>${userName}</b> has applied to become a vendor on your platform.
        </p>
        <p style="color: #333; font-size: 14px;">
          Email: <b>${email}</b>
        </p>
        <p style="color: #999; font-size: 12px; margin-top: 20px;">
          Please review the application in the admin panel.
        </p>
      </div>
    </div>
  `;
  return sendMail({ to, subject: "New Vendor Application", html });
};

// ✅ vendor Application Approve Mail
export const sendVendorApprovalMail = (to, userName) => {
  const html = `
    <div style="font-family: Arial, sans-serif; background-color: #f4f4f7; padding: 40px; text-align: center;">
      <div style="max-width: 600px; margin: auto; background-color: #ffffff; padding: 30px; border-radius: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
        <h2 style="color: #27ae60;">Vendor Application Approved!</h2>
        <p style="color: #333; font-size: 16px;">Hi <b>${userName}</b>,</p>
        <p style="color: #333; font-size: 16px;">
          Congratulations! Your application to become a vendor has been approved.
        </p>
        <p style="color: #333; font-size: 14px;">
          You can now log in to your vendor dashboard and start listing your products.
        </p>
        <a href=${process.env.client_url}/signin" style="
          display: inline-block;
          margin: 20px 0;
          padding: 12px 25px;
          background-color: #27ae60;
          color: #fff;
          text-decoration: none;
          border-radius: 5px;
          font-weight: bold;
        ">Go to Vendor Dashboard</a>
        <p style="color: #999; font-size: 12px; margin-top: 20px;">
          Welcome to our vendor community!
        </p>
      </div>
    </div>
  `;
  return sendMail({ to, subject: "Vendor Application Approved", html });
};