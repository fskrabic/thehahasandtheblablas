<?php

require 'PHPMailer/src/Exception.php';
require 'PHPMailer/src/PHPMailer.php';
require 'PHPMailer/src/SMTP.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Collect and sanitize the form inputs
    $name = htmlspecialchars(strip_tags(trim($_POST['name'])));
    $title = htmlspecialchars(strip_tags(trim($_POST['title'])));
    $inquiry = htmlspecialchars(strip_tags(trim($_POST['inquiry'])));
    $message = htmlspecialchars(strip_tags(trim($_POST['message'])));
    $email = !empty($_POST['email']) ? htmlspecialchars(strip_tags(trim($_POST['email']))) : 'Not provided';

    // Simple validation
    if (empty($name) || empty($title) || empty($message) || empty($inquiry)) {
        echo "All fields except email are required.";
        exit;
    }

    // Create a new PHPMailer instance
    $mail = new PHPMailer(true);

    try {
        // Server settings for Gmail SMTP
        $mail->isSMTP();                                      // Use SMTP
        $mail->Host       = 'smtp.gmail.com';                 // Set the SMTP server to send through
        $mail->SMTPAuth   = true;                             // Enable SMTP authentication
        $mail->Username   = 'skrabicf@gmail.com';           // Your Gmail address
        $mail->Password   = 'lhoh jbcm zezf yagg';              // Your Gmail password or App-specific password
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;   // Enable TLS encryption
        $mail->Port       = 587;                              // TCP port to connect to

        // Recipients
        $mail->setFrom('skrabicf@gmail.com', 'THE HAHAS AND THE BLABLAS');      // Sender's email and name
        $mail->addAddress('skrabicf@gmail.com', 'Admin');         // Recipient's email (your email)

        // Content
        $mail->isHTML(false);                                       // Set email format to plain text
        $mail->Subject = "$inquiry - $title";
        $mail->Body    = "Name: $name\nUser's Email: $email\nType of Inquiry: $inquiry\n\nMessage:\n$message";

        // Send the email
        $mail->send();
        echo 'Message has been sent successfully!';
    } catch (Exception $e) {
        echo "Message could not be sent. Mailer Error: {$mail->ErrorInfo}";
    }
}
?>
