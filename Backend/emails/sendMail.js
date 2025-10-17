import { sendMail } from "./mailer.js";

// ✅ Verification Mail
export const sendVerificationMail = (to, token) => {
  const verificationUrl = `${process.env.client_url}/user/verify/${token}`;

  const html = `
    <div style="
      font-family: 'Segoe UI', Roboto, Arial, sans-serif;
      background-color: #f5f7fa;
      padding: 40px 20px;
      text-align: center;
    ">
      <div style="
        max-width: 600px;
        margin: auto;
        background-color: #ffffff;
        padding: 40px 30px;
        border-radius: 12px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.08);
        border: 1px solid #eaeaea;
      ">
        <img 
          src="https://res.cloudinary.com/do9m8kc0b/image/upload/v1760161496/esftuk6irpikvltmbevx.png" 
          alt="ApnaBazaar" 
          style="width: 140px; margin-bottom: 25px;"
        />
        <h2 style="
          color: #2d3748;
          font-size: 22px;
          margin-bottom: 10px;
        ">Verify Your Email</h2>

        <p style="
          color: #4a5568;
          font-size: 15px;
          line-height: 1.6;
          margin: 0 0 25px;
        ">
          Thanks for joining <strong>ApnaBazaar</strong>!  
          Click the button below to verify your account and get started.
        </p>

        <a href="${verificationUrl}" style="
          display: inline-block;
          padding: 12px 28px;
          background-color: #2563eb;
          color: #ffffff;
          text-decoration: none;
          border-radius: 6px;
          font-weight: 600;
          font-size: 15px;
          transition: background-color 0.3s ease;
        ">Verify Email</a>

        <p style="
          color: #718096;
          font-size: 13px;
          margin-top: 25px;
          line-height: 1.4;
        ">
          If the button doesn’t work, copy and paste this link into your browser:
        </p>

        <a href="${verificationUrl}" style="
          color: #2563eb;
          font-size: 13px;
          word-break: break-all;
          text-decoration: none;
        ">"${verificationUrl}"</a>

        <hr style="
          border: none;
          border-top: 1px solid #e2e8f0;
          margin: 30px 0;
        " />

        <p style="
          color: #a0aec0;
          font-size: 12px;
          margin: 0;
        ">
          This verification link is valid for <strong>15 minutes</strong>.
        </p>
      </div>

      <p style="
        color: #a0aec0;
        font-size: 12px;
        margin-top: 20px;
      ">
        © 2025 ApnaBazaar. All rights reserved.
      </p>
    </div>
  `;

  return sendMail({ to, subject: "Verify Your Email", html });
};


// ✅ Order Confirmation
export const sendOrderConfirmation = (to, name, orderId, items, total) => {
  const html = `
    <div style="font-family: Arial, sans-serif; background-color: #f4f4f7; padding: 40px; text-align: center;">
      <div style="max-width: 600px; margin: auto; background-color: #ffffff; padding: 30px; border-radius: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
        <img 
          src="https://res.cloudinary.com/do9m8kc0b/image/upload/v1760161496/esftuk6irpikvltmbevx.png" 
          alt="ApnaBazaar" 
          style="width: 140px; margin-bottom: 25px;"
        />
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

export const sendOrderToVendor = (to, vendorName, orderId, items, shippingAddress, buyerName) => {
  const html = `
    <div style="font-family: Arial, sans-serif; background-color: #f4f4f7; padding: 40px; text-align: center;">
      <div style="max-width: 600px; margin: auto; background-color: #ffffff; padding: 30px; border-radius: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
        <img 
          src="https://res.cloudinary.com/do9m8kc0b/image/upload/v1760161496/esftuk6irpikvltmbevx.png" 
          alt="ApnaBazaar" 
          style="width: 140px; margin-bottom: 25px;"
        />

        <h2 style="color: #4a90e2;">🛒 New Order Received!</h2>
        <p style="color: #333; font-size: 16px;">Hi <b>${vendorName}</b>, you’ve received a new order <b>#${orderId}</b>.</p>
        <p style="color: #666; font-size: 14px;">Please prepare the following items for shipment:</p>

        ${items.map(item => `
          <div style="display: flex; align-items: center; border: 1px solid #eee; border-radius: 8px; padding: 10px; margin: 15px 0; text-align: left;">
            <img src="${item?.images?.[0] || ''}" alt="${item.name}" style="width: 80px; height: 80px; object-fit: cover; border-radius: 5px; margin-right: 15px;" />
            <div style="flex: 1;">
              <p style="margin: 0; font-weight: bold; font-size: 14px; color: #333;">${item.name}</p>
              <p style="margin: 5px 0 0 0; color: #555; font-size: 13px;">Quantity: ${item.quantity}</p>
              <p style="margin: 2px 0 0 0; color: #4a90e2; font-size: 13px;">Price: ₹${item.price}</p>
            </div>
          </div>
        `).join("")}

        <h3 style="color: #4a90e2; margin-top: 30px;">📦 Shipping Details</h3>
        <div style="text-align: left; font-size: 14px; color: #444; margin: 10px 0 20px 0;">
          <p><b>Customer:</b> ${buyerName}</p>
          <p><b>Name:</b> ${shippingAddress?.name}</p>
          <p><b>Email:</b> ${shippingAddress?.email}</p>
          <p><b>Phone:</b> ${shippingAddress?.phone}</p>
          <p><b>Address:</b> ${shippingAddress?.street}, ${shippingAddress?.city}, ${shippingAddress?.state} - ${shippingAddress?.zipcode}</p>
        </div>

        <p style="color: #999; font-size: 12px; margin-top: 20px;">
          Please process and dispatch the order at your earliest convenience.<br/>
          Thank you for partnering with <b>ApnaBazaar</b> 💛
        </p>
      </div>
    </div>
  `;

  return sendMail({
    to,
    subject: `New Order #${orderId} - Please Process`,
    html
  });
};

// ✅ Order Status Update
export const sendOrderStatusMail = (to, name, orderId, status) => {
  const html = `
    <div style="font-family: Arial, sans-serif; background-color: #f4f4f7; padding: 40px; text-align: center;">
      <div style="max-width: 600px; margin: auto; background-color: #ffffff; padding: 30px; border-radius: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
        <img 
          src="https://res.cloudinary.com/do9m8kc0b/image/upload/v1760161496/esftuk6irpikvltmbevx.png" 
          alt="ApnaBazaar" 
          style="width: 140px; margin-bottom: 25px;"
        />
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
        <img 
          src="https://res.cloudinary.com/do9m8kc0b/image/upload/v1760161496/esftuk6irpikvltmbevx.png" 
          alt="ApnaBazaar" 
          style="width: 140px; margin-bottom: 25px;"
        />
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
        <img 
          src="https://res.cloudinary.com/do9m8kc0b/image/upload/v1760161496/esftuk6irpikvltmbevx.png" 
          alt="ApnaBazaar" 
          style="width: 140px; margin-bottom: 25px;"
        />
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
        <img 
          src="https://res.cloudinary.com/do9m8kc0b/image/upload/v1760161496/esftuk6irpikvltmbevx.png" 
          alt="ApnaBazaar" 
          style="width: 140px; margin-bottom: 25px;"
        />
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