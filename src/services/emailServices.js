import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();


const transport = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const sendEmail = async (to, verification) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject: "Activate Your Account - Ecobazar",
      html: `<!DOCTYPE html>
          <html lang="en">
          <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>Activate Your Account - Ecobazar</title>
              <style>
                  body { font-family: Arial, sans-serif; background-color: #f8f9fa; margin: 0; padding: 0; text-align: left; }
                  .container { width: 80%; max-width: 600px; margin: 20px auto; background-color: #ffffff; padding: 20px; border-radius: 10px; box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1); }
                  .header { text-align: center; background-color: #28a745; color: #ffffff; padding: 15px; border-radius: 10px 10px 0 0; font-size: 20px; }
                  .content { padding: 20px; font-size: 16px; color: #333; }
                  .code { display: block; width: fit-content; margin: 15px auto; padding: 10px 20px; background-color: #ffc107; color: #000; font-size: 18px; font-weight: bold; border-radius: 5px; letter-spacing: 2px; }
                  .footer { text-align: center; padding: 15px; font-size: 14px; color: #777; }
                  .footer a { color: #28a745; text-decoration: none; }
              </style>
          </head>
          <body>
              <div class="container">
                  <div class="header">
                      Welcome to Ecobazar!
                  </div>
                  <div class="content">
                      <p>Thank you for joining <strong>Ecobazar</strong>! Before you start shopping, please activate your account using the verification code below:</p>
                      <span class="code">${verification}</span>
                      <p>If you did not create this account, please ignore this email.</p>
                  </div>
                  <div class="footer">
                      <p>For assistance, please contact us at <a href="mailto:ecommercecompanyteam@gmail.com">ecommercecompanyteam@gmail.com</a></p>
                      <p>&copy; 2025 Ecobazar. All rights reserved.</p>
                  </div>
              </div>
          </body>
          </html>`
    };

    const info = await transport.sendMail(mailOptions);
    console.log("Email sent: ", info.response);
  } catch (error) {
    console.log("Error sending email: ", error);
  }
};

export default sendEmail;