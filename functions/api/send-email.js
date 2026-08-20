/**
 * Cloudflare Pages Function: /api/send-email
 * Endpoint to process contact form submissions via Resend API
 */

export async function onRequestPost(context) {
  const { request, env } = context;

  // Set CORS headers for security and flexibility
  const corsHeaders = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  try {
    const data = await request.json();
    const {
      fullName = '',
      contactNumber = '',
      email = '',
      state = '',
      budget = '',
      machineType = '',
      bricksCapacity = '',
      message = '',
      sourcePage = 'Contact Us Page'
    } = data;

    // Validate required fields
    if (!fullName.trim() || !contactNumber.trim()) {
      return new Response(
        JSON.stringify({ success: false, error: 'Full Name and Contact Number are required.' }),
        { status: 400, headers: corsHeaders }
      );
    }

    const resendApiKey = env.RESEND_API_KEY;
    const adminEmail = env.ADMIN_EMAIL || 'info.jeeengineers@gmail.com';
    // Use custom domain sender or fallback to Resend's default onboarding sender for initial testing
    const fromEmail = env.FROM_EMAIL || 'Jee Engineers <onboarding@resend.dev>';

    if (!resendApiKey) {
      console.error('RESEND_API_KEY environment variable is not configured.');
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Server configuration error: RESEND_API_KEY is not configured in Cloudflare environment variables.'
        }),
        { status: 500, headers: corsHeaders }
      );
    }

    const cleanedUserEmail = (email && typeof email === 'string') ? email.trim() : '';
    const hasUserEmail = cleanedUserEmail.length > 0 && cleanedUserEmail.includes('@');

    // 1. Admin Email Payload
    const adminEmailPayload = {
      from: fromEmail,
      to: [adminEmail],
      subject: `🚨 New Lead: Inquiry from ${fullName} (${sourcePage})`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; background-color: #f4f6f9; margin: 0; padding: 20px; color: #333; }
            .container { max-width: 600px; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.05); margin: 0 auto; border: 1px solid #e2e8f0; }
            .header { background: #0d47a1; color: #ffffff; padding: 20px; text-align: center; }
            .header h2 { margin: 0; font-size: 22px; font-weight: 700; }
            .content { padding: 25px; }
            .field-table { width: 100%; border-collapse: collapse; margin-top: 15px; }
            .field-table td { padding: 10px 12px; border-bottom: 1px solid #edf2f7; font-size: 14px; }
            .field-label { font-weight: bold; color: #4a5568; width: 35%; background: #f7fafc; }
            .field-value { color: #1a202c; }
            .message-box { background: #edf2f7; border-left: 4px solid #0d47a1; padding: 12px 15px; margin-top: 15px; border-radius: 4px; font-style: italic; }
            .footer { background: #f7fafc; padding: 15px; text-align: center; font-size: 12px; color: #718096; border-top: 1px solid #edf2f7; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <img src="https://jeeengineers.com/img/Jee-Engineers_logo.png" alt="Jee Engineers Logo" style="max-height: 50px; width: auto; display: block; margin: 0 auto 10px auto;" />
              <h2>New Sales Inquiry Received</h2>
            </div>
            <div class="content">
              <p>You have received a new inquiry from the website contact form (<strong>${sourcePage}</strong>):</p>
              
              <table class="field-table">
                <tr>
                  <td class="field-label">Full Name</td>
                  <td class="field-value"><strong>${escapeHtml(fullName)}</strong></td>
                </tr>
                <tr>
                  <td class="field-label">Contact Number</td>
                  <td class="field-value"><a href="tel:${escapeHtml(contactNumber)}">${escapeHtml(contactNumber)}</a></td>
                </tr>
                <tr>
                  <td class="field-label">Email Address</td>
                  <td class="field-value">${hasUserEmail ? `<a href="mailto:${escapeHtml(cleanedUserEmail)}">${escapeHtml(cleanedUserEmail)}</a>` : '<span style="color:#a0aec0;">Not provided</span>'}</td>
                </tr>
                <tr>
                  <td class="field-label">State / Region</td>
                  <td class="field-value">${escapeHtml(state) || 'Not specified'}</td>
                </tr>
                <tr>
                  <td class="field-label">Budget (INR)</td>
                  <td class="field-value">${budget ? `₹ ${escapeHtml(budget)}` : 'Not specified'}</td>
                </tr>
                <tr>
                  <td class="field-label">Machine Type</td>
                  <td class="field-value">${escapeHtml(machineType) || 'Not specified'}</td>
                </tr>
                <tr>
                  <td class="field-label">Production Capacity</td>
                  <td class="field-value">${escapeHtml(bricksCapacity) || 'Not specified'}</td>
                </tr>
              </table>

              ${message ? `
                <p style="margin-top: 20px; font-weight: bold; color: #4a5568;">Additional Message / Requirements:</p>
                <div class="message-box">${escapeHtml(message).replace(/\n/g, '<br/>')}</div>
              ` : ''}
            </div>
            <div class="footer">
              Sent automatically by Jee Engineers Website via Resend & Cloudflare Pages
            </div>
          </div>
        </body>
        </html>
      `
    };

    // Send Admin Email via Resend API
    const adminRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(adminEmailPayload)
    });

    const adminResult = await adminRes.json();

    if (!adminRes.ok) {
      console.error('Resend API Error (Admin Email):', adminResult);
      return new Response(
        JSON.stringify({ success: false, error: adminResult.message || 'Failed to send inquiry email.' }),
        { status: adminRes.status, headers: corsHeaders }
      );
    }

    // 2. User Confirmation Email (ONLY sent if user provided their email address)
    let userEmailSent = false;

    if (hasUserEmail) {
      const userEmailPayload = {
        from: fromEmail,
        to: [cleanedUserEmail],
        subject: `Thank you for contacting Jee Engineers!`,
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; background-color: #f4f6f9; margin: 0; padding: 20px; color: #333; }
              .container { max-width: 600px; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.05); margin: 0 auto; border: 1px solid #e2e8f0; }
              .header { background: #0d47a1; color: #ffffff; padding: 25px; text-align: center; }
              .header h2 { margin: 0 0 8px 0; font-size: 24px; }
              .header p { margin: 0; font-size: 14px; opacity: 0.9; }
              .content { padding: 25px; line-height: 1.6; }
              .summary-box { background: #f7fafc; border: 1px solid #edf2f7; padding: 15px; border-radius: 6px; margin: 20px 0; }
              .cta-button { display: inline-block; background-color: #0d47a1; color: #ffffff !important; text-decoration: none; padding: 12px 24px; border-radius: 5px; font-weight: bold; margin-top: 15px; }
              .footer { background: #f7fafc; padding: 20px; text-align: center; font-size: 13px; color: #718096; border-top: 1px solid #edf2f7; }
              .footer a { color: #0d47a1; text-decoration: none; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <img src="https://jeeengineers.com/img/Jee-Engineers_logo.png" alt="Jee Engineers Logo" style="max-height: 50px; width: auto; display: block; margin: 0 auto 10px auto;" />
                <h2>JEE ENGINEERS</h2>
                <p>Leading Fly Ash Brick Machine Manufacturer</p>
              </div>
              <div class="content">
                <p>Dear <strong>${escapeHtml(fullName)}</strong>,</p>
                <p>Thank you for reaching out to <strong>Jee Engineers</strong>. We have received your request regarding our high-efficiency fly ash brick making machines.</p>
                
                <p>Our sales engineers are evaluating your requirements and will contact you within <strong>2 to 4 business hours</strong> with customized pricing and technical specifications.</p>

                <div class="summary-box">
                  <h4 style="margin-top:0; color:#0d47a1;">Submission Details:</h4>
                  <ul style="margin: 0; padding-left: 20px;">
                    ${machineType ? `<li><strong>Machine Interest:</strong> ${escapeHtml(machineType)}</li>` : ''}
                    ${bricksCapacity ? `<li><strong>Capacity Needed:</strong> ${escapeHtml(bricksCapacity)} bricks/hour</li>` : ''}
                    ${contactNumber ? `<li><strong>Contact Number:</strong> ${escapeHtml(contactNumber)}</li>` : ''}
                  </ul>
                </div>

                <p>If you need urgent assistance or wish to speak to an expert immediately, please feel free to call or WhatsApp us at <a href="tel:+919327491268"><strong>+91 9327491268</strong></a>.</p>

                <p style="margin-top:25px;">Best regards,<br/>
                <strong>Sales & Technical Support Team</strong><br/>
                Jee Engineers, Ahmedabad, Gujarat</p>
              </div>
              <div class="footer">
                <p>Jee Engineers | Ahmedabad, Gujarat, India<br/>
                Phone: +91 9327491268 | Email: info.jeeengineers@gmail.com<br/>
                Website: <a href="https://jeeengineers.com">jeeengineers.com</a></p>
              </div>
            </div>
          </body>
          </html>
        `
      };

      try {
        const userRes = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${resendApiKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(userEmailPayload)
        });

        if (userRes.ok) {
          userEmailSent = true;
        } else {
          const userErr = await userRes.json();
          console.warn('Resend API Warning (User Confirmation Email):', userErr);
        }
      } catch (err) {
        console.warn('Failed to dispatch user confirmation email:', err);
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Inquiry submitted successfully',
        adminEmailId: adminResult.id,
        userConfirmationSent: userEmailSent
      }),
      { status: 200, headers: corsHeaders }
    );

  } catch (error) {
    console.error('Error handling contact form submission:', error);
    return new Response(
      JSON.stringify({ success: false, error: 'Internal server error processing inquiry.' }),
      { status: 500, headers: corsHeaders }
    );
  }
}

// OPTIONS preflight for CORS support
export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    }
  });
}

/**
 * Utility function to sanitize HTML output
 */
function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
