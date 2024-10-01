const nodemailer = require("nodemailer");

export default async function (req, res) {
  if (req.method === "POST") {
    const { name, title, email, inquiry, message } = req.body;

    if (!name || !title || !inquiry || !message) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    try {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.GMAIL_USER,
          pass: process.env.GMAIL_APP_PASSWORD,
        },
      });

      const type = inquiry === "booking" ? "[BOOKING REQUEST]" : "[GENERAL]";
      const mailOptions = {
        from: process.env.GMAIL_USER,
        to: process.env.GMAIL_USER,
        subject: `${type} ${title}`,
        text: `Sender: ${name}\nEmail: ${email}\n\n\n${message}`,
      };

      await transporter.sendMail(mailOptions);
      res.status(200).json({ message: "Email sent successfully!" });
    } catch (error) {
      console.error("Error sending email:", error);
      res.status(500).json({ error: "Failed to send email" });
    }
  } else {
    res.status(405).json({ error: "Only POST requests allowed" });
  }
}
