import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Route for sending emails
  app.post("/api/send-email", async (req, res) => {
    const { to, subject, text } = req.body;

    // Use environment variables for Gmail configuration
    // For Gmail, you usually need an "App Password" if 2FA is enabled.
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
      },
    });

    try {
      if (!process.env.GMAIL_USER || !process.env.GMAIL_PASS) {
        console.warn("GMAIL_USER or GMAIL_PASS not set. Skipping email send.");
        return res.status(200).json({ status: "skipped", message: "Email credentials not configured" });
      }

      await transporter.sendMail({
        from: `"Haybah Store" <${process.env.GMAIL_USER}>`,
        to,
        subject,
        text,
      });

      res.json({ status: "ok", message: "Email sent successfully" });
    } catch (error) {
      console.error("Error sending email:", error);
      res.status(500).json({ status: "error", message: "Failed to send email" });
    }
  });

  // API Route for sending SMS (Placeholder for Twilio/Vonage)
  app.post("/api/send-sms", async (req, res) => {
    const { to, text } = req.body;
    
    // This is a placeholder. To make this work, you would need a Twilio account.
    // Example:
    // const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);
    // await client.messages.create({ body: text, from: '+123456789', to: to });

    console.log(`[SMS Placeholder] To: ${to}, Message: ${text}`);
    
    // For now, we just log it and return success to show the intent
    res.json({ status: "ok", message: "SMS logic is ready for integration with a provider like Twilio" });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
