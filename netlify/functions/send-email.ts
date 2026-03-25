import { Handler } from "@netlify/functions";
import nodemailer from "nodemailer";

export const handler: Handler = async (event, context) => {
  // Only allow POST
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method Not Allowed" }),
    };
  }

  try {
    const { to, subject, text } = JSON.parse(event.body || "{}");

    if (!to || !subject || !text) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Missing required fields" }),
      };
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
      },
    });

    if (!process.env.GMAIL_USER || !process.env.GMAIL_PASS) {
      console.warn("GMAIL_USER or GMAIL_PASS not set. Skipping email send.");
      return {
        statusCode: 200,
        body: JSON.stringify({ status: "skipped", message: "Email credentials not configured" }),
      };
    }

    await transporter.sendMail({
      from: `"Haybah Store" <${process.env.GMAIL_USER}>`,
      to,
      subject,
      text,
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ status: "ok", message: "Email sent successfully" }),
    };
  } catch (error) {
    console.error("Error sending email:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ status: "error", message: "Failed to send email" }),
    };
  }
};
