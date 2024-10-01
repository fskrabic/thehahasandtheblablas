const nodemailer = require("nodemailer");

// Export an async function that handles the request
export default async function (req, res) {
  if (req.method === "POST") {
    const { name, title, email, inquiry, message } = req.body;

    // Validate inputs
    if (!name || !title || !inquiry || !message) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    try {
      // Create a transporter using Gmail SMTP
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: "skrabicf@gmail.com", // Replace with your Gmail email
          pass: "lhoh jbcm zezf yagg", // Replace with your App Password
        },
      });

      // Create the email options
      const mailOptions = {
        from: "skrabicf@gmail.com", // Sender email
        to: "skrabicf@gmail.com", // Your email (recipient)
        subject: `${inquiry} - ${title}`, // Email subject
        text: `Name: ${name}\nEmail: ${email}\nType of Inquiry: ${inquiry}\n\nMessage:\n${message}`,
      };

      // Send the email
      await transporter.sendMail(mailOptions);

      // Send a success response
      res.status(200).json({ message: "Email sent successfully!" });
    } catch (error) {
      console.error("Error sending email:", error);
      res.status(500).json({ error: "Failed to send email" });
    }
  } else {
    res.status(405).json({ error: "Only POST requests allowed" });
  }
}
