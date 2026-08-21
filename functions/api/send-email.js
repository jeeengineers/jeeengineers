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
    const adminEmail = env.ADMIN_EMAIL || 'jeeengineers@gmail.com';
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
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Outfit:wght@600;700;800&display=swap" rel="stylesheet">
          <style>
            body { font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 25px 15px; color: #334155; -webkit-font-smoothing: antialiased; }
            .container { max-width: 600px; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 30px -5px rgba(15, 23, 42, 0.06); margin: 0 auto; border: 1px solid #e2e8f0; }
            .top-bar { height: 5px; background: linear-gradient(90deg, #0284c7 0%, #2563eb 50%, #7c3aed 100%); }
            .header { background: #ffffff; padding: 32px 25px 20px 25px; text-align: center; border-bottom: 1px solid #f1f5f9; }
            .logo-img { max-height: 48px; width: auto; display: block; margin: 0 auto 12px auto; }
            .badge { display: inline-block; background: #eff6ff; color: #0284c7; border: 1px solid #bfdbfe; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.8px; padding: 4px 12px; border-radius: 20px; margin-bottom: 10px; }
            .header h2 { font-family: 'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; font-size: 22px; font-weight: 700; letter-spacing: -0.02em; color: #0f172a; }
            .header p { margin: 6px 0 0 0; font-size: 13px; color: #64748b; }
            .content { padding: 28px 25px; }
            .intro-text { font-size: 15px; line-height: 1.6; color: #334155; margin-top: 0; margin-bottom: 20px; }
            .field-table { width: 100%; border-collapse: separate; border-spacing: 0; margin-top: 10px; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; }
            .field-table td { padding: 12px 16px; font-size: 14px; border-bottom: 1px solid #f1f5f9; }
            .field-table tr:last-child td { border-bottom: none; }
            .field-label { font-weight: 600; color: #64748b; width: 38%; background: #f8fafc; text-transform: uppercase; font-size: 11px; letter-spacing: 0.5px; }
            .field-value { color: #0f172a; font-weight: 500; }
            .field-value strong { color: #0f172a; font-weight: 700; }
            .field-value a { color: #0284c7; text-decoration: none; font-weight: 600; }
            .message-box { background: #f5f3ff; border-left: 4px solid #7c3aed; border-top: 1px solid #ddd6fe; border-right: 1px solid #ddd6fe; border-bottom: 1px solid #ddd6fe; padding: 16px; margin-top: 10px; border-radius: 0 10px 10px 0; color: #0f172a; font-size: 14px; line-height: 1.6; }
            .btn-wrapper { text-align: center; margin-top: 28px; }
            .btn-primary { display: inline-block; background: linear-gradient(135deg, #0284c7 0%, #2563eb 50%, #7c3aed 100%); color: #ffffff !important; text-decoration: none; padding: 13px 30px; border-radius: 8px; font-weight: 700; font-size: 14px; box-shadow: 0 4px 14px rgba(2, 132, 199, 0.25); }
            .footer { background: #f8fafc; padding: 22px 20px; text-align: center; font-size: 12px; color: #64748b; border-top: 1px solid #e2e8f0; line-height: 1.6; }
            .footer strong { color: #0f172a; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="top-bar"></div>
            <div class="header">
              <img src="https://jeeengineers.com/img/Jee-Engineers_logo.png" alt="Jee Engineers Logo" class="logo-img" />
              <div><span class="badge">🚨 NEW SALES LEAD</span></div>
              <h2>New Sales Inquiry Received</h2>
              <p>Source Page: <strong>${escapeHtml(sourcePage)}</strong></p>
            </div>
            <div class="content">
              <p class="intro-text">A new customer inquiry has been submitted via the website form on <strong>${escapeHtml(sourcePage)}</strong>:</p>
              
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
                  <td class="field-value">${hasUserEmail ? `<a href="mailto:${escapeHtml(cleanedUserEmail)}">${escapeHtml(cleanedUserEmail)}</a>` : '<span style="color:#94a3b8; font-style:italic;">Not provided</span>'}</td>
                </tr>
                <tr>
                  <td class="field-label">State / Region</td>
                  <td class="field-value">${escapeHtml(state) || 'Not specified'}</td>
                </tr>
                <tr>
                  <td class="field-label">Budget Range</td>
                  <td class="field-value">${budget ? `₹ ${escapeHtml(budget)}` : 'Not specified'}</td>
                </tr>
                <tr>
                  <td class="field-label">Machine Interest</td>
                  <td class="field-value">${escapeHtml(machineType) || 'Not specified'}</td>
                </tr>
                <tr>
                  <td class="field-label">Required Capacity</td>
                  <td class="field-value">${bricksCapacity ? `${escapeHtml(bricksCapacity)} bricks/hour` : 'Not specified'}</td>
                </tr>
              </table>

              ${message ? `
                <div style="margin-top: 20px;">
                  <span style="font-size: 11px; font-weight: 700; text-transform: uppercase; color: #64748b; letter-spacing: 0.5px;">Additional Message / Requirements:</span>
                  <div class="message-box">${escapeHtml(message).replace(/\n/g, '<br/>')}</div>
                </div>
              ` : ''}

              <div class="btn-wrapper">
                <a href="tel:${escapeHtml(contactNumber)}" class="btn-primary">Call Lead Now (${escapeHtml(contactNumber)})</a>
              </div>
            </div>
            <div class="footer">
              Automated Lead Notification System • <strong>JEE ENGINEERS</strong><br/>
              Powered by Cloudflare Pages & Resend
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
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Outfit:wght@600;700;800&display=swap" rel="stylesheet">
            <style>
              body { font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 25px 15px; color: #334155; -webkit-font-smoothing: antialiased; }
              .container { max-width: 600px; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 30px -5px rgba(15, 23, 42, 0.06); margin: 0 auto; border: 1px solid #e2e8f0; }
              .top-bar { height: 5px; background: linear-gradient(90deg, #0284c7 0%, #2563eb 50%, #7c3aed 100%); }
              .header { background: #ffffff; padding: 32px 25px 24px 25px; text-align: center; border-bottom: 1px solid #f1f5f9; }
              .logo-img { max-height: 52px; width: auto; display: block; margin: 0 auto 12px auto; }
              .brand-title { font-family: 'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 24px; font-weight: 800; letter-spacing: -0.01em; color: #0f172a; margin: 0 0 4px 0; }
              .brand-subtitle { font-size: 13px; color: #0284c7; font-weight: 600; margin: 0; letter-spacing: 0.3px; }
              .content { padding: 30px 25px; line-height: 1.6; }
              .greeting { font-size: 16px; color: #0f172a; margin-top: 0; margin-bottom: 12px; }
              .intro-p { font-size: 14.5px; color: #334155; margin-bottom: 20px; }
              .highlight-box { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 18px 20px; margin: 24px 0; }
              .highlight-title { font-family: 'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 15px; font-weight: 700; color: #0f172a; margin: 0 0 10px 0; }
              .details-list { margin: 0; padding: 0; list-style: none; }
              .details-list li { font-size: 14px; color: #334155; padding: 7px 0; border-bottom: 1px dashed #cbd5e1; }
              .details-list li:last-child { border-bottom: none; }
              .details-list strong { color: #0f172a; }
              .sla-notice { background: #f0f9ff; border: 1px solid #bae6fd; border-radius: 10px; padding: 14px 18px; margin: 20px 0; font-size: 13.5px; color: #0369a1; font-weight: 500; }
              .sla-notice strong { color: #0284c7; }
              .cta-section { text-align: center; margin: 28px 0 10px 0; padding-top: 5px; }
              .btn-whatsapp { display: inline-block; background: linear-gradient(135deg, #0284c7 0%, #2563eb 50%, #7c3aed 100%); color: #ffffff !important; text-decoration: none; padding: 13px 30px; border-radius: 8px; font-weight: 700; font-size: 14px; box-shadow: 0 4px 14px rgba(2, 132, 199, 0.3); }
              .signoff { margin-top: 30px; font-size: 14px; color: #475569; border-top: 1px solid #f1f5f9; padding-top: 20px; }
              .signoff strong { color: #0f172a; }
              .footer { background: #f8fafc; padding: 25px 20px; text-align: center; font-size: 12.5px; color: #64748b; border-top: 1px solid #e2e8f0; line-height: 1.7; }
              .footer a { color: #0284c7; text-decoration: none; font-weight: 600; }
              .footer-address { margin-bottom: 8px; color: #334155; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="top-bar"></div>
              <div class="header">
                <img src="https://jeeengineers.com/img/Jee-Engineers_logo.png" alt="Jee Engineers Logo" class="logo-img" />
                <h1 class="brand-title">JEE ENGINEERS</h1>
                <p class="brand-subtitle">Leading Fly Ash Brick Machine Manufacturer</p>
              </div>
              <div class="content">
                <p class="greeting">Dear <strong>${escapeHtml(fullName)}</strong>,</p>
                <p class="intro-p">Thank you for reaching out to <strong>Jee Engineers</strong>. We have received your request regarding our high-efficiency fly ash brick making machinery.</p>
                
                <div class="sla-notice">
                  ⚡ Our sales engineers are evaluating your specifications and will respond within <strong>2 to 4 business hours</strong> with customized pricing and technical specifications.
                </div>

                <div class="highlight-box">
                  <div class="highlight-title">📋 Submission Details:</div>
                  <ul class="details-list">
                    ${machineType ? `<li><strong>Machine Interest:</strong> ${escapeHtml(machineType)}</li>` : ''}
                    ${bricksCapacity ? `<li><strong>Capacity Needed:</strong> ${escapeHtml(bricksCapacity)} bricks/hour</li>` : ''}
                    ${contactNumber ? `<li><strong>Contact Number:</strong> ${escapeHtml(contactNumber)}</li>` : ''}
                  </ul>
                </div>

                <p class="intro-p">If you need immediate assistance or wish to speak to an expert immediately, please feel free to call or WhatsApp us:</p>

                <div class="cta-section">
                  <a href="https://wa.me/919327491268" class="btn-whatsapp">Call / WhatsApp (+91 9327491268)</a>
                </div>

                <div class="signoff">
                  Best regards,<br/>
                  <strong>Sales & Technical Support Team</strong><br/>
                  <span style="color: #64748b;">Jee Engineers, Ahmedabad, Gujarat</span>
                </div>
              </div>
              <div class="footer">
                <div class="footer-address">
                  <strong>Jee Engineers</strong> • Kathwada GIDC, Ahmedabad, Gujarat, India
                </div>
                <div>
                  Phone: <a href="tel:+919327491268">+91 9327491268</a> | Email: <a href="mailto:jeeengineers@gmail.com">jeeengineers@gmail.com</a>
                </div>
                <div style="margin-top: 6px;">
                  Website: <a href="https://jeeengineers.com">www.jeeengineers.com</a>
                </div>
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
