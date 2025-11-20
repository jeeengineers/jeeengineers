<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require 'vendor/autoload.php'; // Include PHPMailer via Composer

$mail = new PHPMailer(true); // Enable exceptions

try {
    // SMTP configuration
    $mail->isSMTP();
    $mail->Host       = 'smtp.gmail.com';
    $mail->SMTPAuth   = true;
    $mail->Username   = 'info.jeeengineers@gmail.com'; // Your Gmail address
    $mail->Password   = 'Nikunj@123'; // Use App Password from Google
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
    $mail->Port       = 587;

    // Email content
    $mail->setFrom('info.jeeengineers@gmail.com', 'Info Jee Engineers');
    $mail->addAddress('jeeengineers@gmail.com', 'Jee Engineers');
    $mail->Subject = 'New Inquiry from Contact Form';

    // Retrieve form data
    $fullName = $_POST['fullName'];
    $contactNumber = $_POST['contactNumber'];
    $email = $_POST['email'];
    $state = $_POST['state'];
    $budget = $_POST['budget'];
    $machineType = $_POST['machineType'];
    $bricksCapacity = $_POST['bricksCapacity'];
    $message = $_POST['message'];

    // Prepare email body
    $mail->Body = "You have received a new inquiry:\n\n" .
                  "Full Name: $fullName\n" .
                  "Contact Number: $contactNumber\n" .
                  "Email: $email\n" .
                  "State: $state\n" .
                  "Budget: $budget\n" .
                  "Machine Type: $machineType\n" .
                  "Bricks Capacity: $bricksCapacity\n" .
                  "Message: $message\n";

    // Send email
    $mail->send();
    header('Location: thank-you.html');
    exit(); // Stop further script execution
} catch (Exception $e) {
    echo "Email could not be sent. Mailer Error: {$mail->ErrorInfo}";
}
?>