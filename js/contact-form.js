/**
 * Contact Form Handler for Jee Engineers
 * Handles client-side validation, AJAX submit to Cloudflare Pages API (/api/send-email),
 * loading UI states, and redirection to thank-you page.
 */

document.addEventListener('DOMContentLoaded', function () {
  const forms = document.querySelectorAll('#contactForm, #pricingForm, form[data-resend-form]');
  if (!forms.length) return;

  forms.forEach(function(form) {
    // Create alert container for status feedback if not present
    let alertBox = form.querySelector('.formAlertBox');
    if (!alertBox) {
      alertBox = document.createElement('div');
      alertBox.className = 'col-12 mt-3 alertBox formAlertBox';
      alertBox.style.display = 'none';
      const formRow = form.querySelector('.row') || form;
      formRow.insertBefore(alertBox, formRow.firstChild);
    }

    form.addEventListener('submit', async function (e) {
      e.preventDefault();
      hideAlert(alertBox);

      // 1. Inputs Extraction (supports both contact form & quick quote form field names)
      const fullNameInput = form.querySelector('#fullName, #name, [name="fullName"], [name="name"]');
      const contactNumberInput = form.querySelector('#contactNumber, #phone, [name="contactNumber"], [name="phone"]');
      const emailInput = form.querySelector('#email, [name="email"]');
      const stateInput = form.querySelector('#state, [name="state"]');
      const budgetInput = form.querySelector('#budget, [name="budget"]');
      const machineTypeSelect = form.querySelector('#machineType, [name="machineType"]');
      const bricksCapacitySelect = form.querySelector('#bricksCapacity, [name="bricksCapacity"]');
      const messageInput = form.querySelector('#message, [name="message"]');
      const submitBtn = form.querySelector('button[type="submit"]');

      const fullName = fullNameInput ? fullNameInput.value.trim() : '';
      const contactNumber = contactNumberInput ? contactNumberInput.value.trim() : '';
      const email = emailInput ? emailInput.value.trim() : '';
      const budget = budgetInput ? parseFloat(budgetInput.value) : NaN;

      if (!fullName) {
        showAlert(alertBox, 'Full Name is required.', 'danger');
        if (fullNameInput) fullNameInput.focus();
        return;
      }

      if (!contactNumber || contactNumber.length < 10 || isNaN(contactNumber.replace(/[\s\-\+\(\)]/g, ''))) {
        showAlert(alertBox, 'Please enter a valid Contact / Phone Number with at least 10 digits.', 'danger');
        if (contactNumberInput) contactNumberInput.focus();
        return;
      }

      if (budgetInput && (isNaN(budget) || budget < 100000)) {
        showAlert(alertBox, 'Budget must be at least 100,000 INR.', 'danger');
        if (budgetInput) budgetInput.focus();
        return;
      }

      // Email validation if email is entered
      if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        showAlert(alertBox, 'Please enter a valid email address or leave it blank.', 'danger');
        if (emailInput) emailInput.focus();
        return;
      }

      // 2. Prepare Payload
      const payload = {
        fullName: fullName,
        contactNumber: contactNumber,
        email: email,
        state: stateInput ? stateInput.value.trim() : '',
        budget: budgetInput ? budgetInput.value.trim() : '',
        machineType: machineTypeSelect ? machineTypeSelect.value : '',
        bricksCapacity: bricksCapacitySelect ? bricksCapacitySelect.value : '',
        message: messageInput ? messageInput.value.trim() : '',
        sourcePage: document.title || window.location.pathname
      };

      // 3. UI Loading State
      const originalBtnContent = submitBtn ? submitBtn.innerHTML : 'Submit Request';
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2" aria-hidden="true"></i>Sending Request...';
      }

      try {
        // 4. Send Request to Cloudflare Pages API Endpoint
        const response = await fetch('/api/send-email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        });

        const result = await response.json();

        if (response.ok && result.success) {
          // Success: Redirect to thank you page
          window.location.href = 'thank-you';
        } else {
          // API Error response
          const errorMessage = result.error || 'There was a problem submitting your request. Please try again or call us directly.';
          showAlert(alertBox, errorMessage, 'danger');
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnContent;
          }
        }
      } catch (err) {
        console.error('Submission error:', err);
        showAlert(alertBox, 'Network error: Unable to reach server. Please call +91 9327491268 directly.', 'warning');
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalBtnContent;
        }
      }
    });
  });

  function showAlert(alertBox, msg, type) {
    if (!alertBox) return;
    alertBox.className = `col-12 mt-3 alert alert-${type} alert-dismissible fade show formAlertBox`;
    alertBox.innerHTML = `
      <i class="fa ${type === 'danger' ? 'fa-exclamation-triangle' : 'fa-info-circle'} me-2" aria-hidden="true"></i>
      ${msg}
      <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;
    alertBox.style.display = 'block';
    alertBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  function hideAlert(alertBox) {
    if (!alertBox) return;
    alertBox.style.display = 'none';
    alertBox.innerHTML = '';
  }
});
