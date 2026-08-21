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
    $mail->Username   = 'jeeengineers@gmail.com'; // Your Gmail address
    $mail->Password   = 'Nikunj@123'; // Use App Password from Google
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
    $mail->Port       = 587;

    // Email content
    $mail->setFrom('jeeengineers@gmail.com', 'Info Jee Engineers');
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

    $mail->isHTML(true);

    $safeFullName = htmlspecialchars($fullName, ENT_QUOTES, 'UTF-8');
    $safeContactNumber = htmlspecialchars($contactNumber, ENT_QUOTES, 'UTF-8');
    $safeEmail = htmlspecialchars($email, ENT_QUOTES, 'UTF-8');
    $safeState = htmlspecialchars($state, ENT_QUOTES, 'UTF-8');
    $safeBudget = htmlspecialchars($budget, ENT_QUOTES, 'UTF-8');
    $safeMachineType = htmlspecialchars($machineType, ENT_QUOTES, 'UTF-8');
    $safeBricksCapacity = htmlspecialchars($bricksCapacity, ENT_QUOTES, 'UTF-8');
    $safeMessage = htmlspecialchars($message, ENT_QUOTES, 'UTF-8');

    // Prepare HTML email body matching clean white theme
    $mail->Body = "
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset='utf-8'>
        <style>
          body { font-family: 'Inter', Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 25px 15px; color: #334155; }
          .container { max-width: 600px; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 30px -5px rgba(15, 23, 42, 0.06); margin: 0 auto; border: 1px solid #e2e8f0; }
          .top-bar { height: 5px; background: linear-gradient(90deg, #0284c7 0%, #2563eb 50%, #7c3aed 100%); }
          .header { background: #ffffff; padding: 32px 25px 20px 25px; text-align: center; border-bottom: 1px solid #f1f5f9; }
          .logo-img { max-height: 48px; width: auto; display: block; margin: 0 auto 12px auto; }
          .badge { display: inline-block; background: #eff6ff; color: #0284c7; border: 1px solid #bfdbfe; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.8px; padding: 4px 12px; border-radius: 20px; margin-bottom: 10px; }
          .header h2 { margin: 0; font-size: 22px; font-weight: 700; color: #0f172a; }
          .content { padding: 28px 25px; }
          .field-table { width: 100%; border-collapse: separate; border-spacing: 0; margin-top: 10px; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; }
          .field-table td { padding: 12px 16px; font-size: 14px; border-bottom: 1px solid #f1f5f9; }
          .field-table tr:last-child td { border-bottom: none; }
          .field-label { font-weight: 600; color: #64748b; width: 38%; background: #f8fafc; text-transform: uppercase; font-size: 11px; letter-spacing: 0.5px; }
          .field-value { color: #0f172a; font-weight: 500; }
          .message-box { background: #f5f3ff; border-left: 4px solid #7c3aed; border: 1px solid #ddd6fe; padding: 16px; margin-top: 10px; border-radius: 0 10px 10px 0; color: #0f172a; font-size: 14px; }
          .btn-wrapper { text-align: center; margin-top: 28px; }
          .btn-primary { display: inline-block; background: linear-gradient(135deg, #0284c7 0%, #2563eb 50%, #7c3aed 100%); color: #ffffff !important; text-decoration: none; padding: 13px 30px; border-radius: 8px; font-weight: 700; font-size: 14px; box-shadow: 0 4px 14px rgba(2, 132, 199, 0.25); }
          .footer { background: #f8fafc; padding: 22px 20px; text-align: center; font-size: 12px; color: #64748b; border-top: 1px solid #e2e8f0; }
        </style>
      </head>
      <body>
        <div class='container'>
          <div class='top-bar'></div>
          <div class='header'>
            <img src='https://jeeengineers.com/img/Jee-Engineers_logo.png' alt='Jee Engineers Logo' class='logo-img' />
            <div><span class='badge'>🚨 NEW SALES LEAD</span></div>
            <h2>New Sales Inquiry Received</h2>
          </div>
          <div class='content'>
            <p style='font-size: 15px;'>A new customer inquiry has been received from the website contact form:</p>
            <table class='field-table'>
              <tr><td class='field-label'>Full Name</td><td class='field-value'><strong>{$safeFullName}</strong></td></tr>
              <tr><td class='field-label'>Contact Number</td><td class='field-value'><a href='tel:{$safeContactNumber}'>{$safeContactNumber}</a></td></tr>
              <tr><td class='field-label'>Email Address</td><td class='field-value'><a href='mailto:{$safeEmail}'>{$safeEmail}</a></td></tr>
              <tr><td class='field-label'>State / Region</td><td class='field-value'>{$safeState}</td></tr>
              <tr><td class='field-label'>Budget Range</td><td class='field-value'>₹ {$safeBudget}</td></tr>
              <tr><td class='field-label'>Machine Interest</td><td class='field-value'>{$safeMachineType}</td></tr>
              <tr><td class='field-label'>Required Capacity</td><td class='field-value'>{$safeBricksCapacity} bricks/hour</td></tr>
            </table>
            " . ($safeMessage ? "<div style='margin-top: 20px;'><span style='font-size: 11px; font-weight: 700; text-transform: uppercase; color: #64748b;'>Message:</span><div class='message-box'>" . nl2br($safeMessage) . "</div></div>" : "") . "
            <div class='btn-wrapper'>
              <a href='tel:{$safeContactNumber}' class='btn-primary'>Call Lead Now ({$safeContactNumber})</a>
            </div>
          </div>
          <div class='footer'>
            Automated Notification System • <strong>JEE ENGINEERS</strong>
          </div>
        </div>
      </body>
      </html>
    ";

    // Send email
    $mail->send();
    header('Location: thank-you.html');
    exit(); // Stop further script execution
} catch (Exception $e) {
    echo "Email could not be sent. Mailer Error: {$mail->ErrorInfo}";
}
?>