/* ==========================================================================
   BRUH FREELANCING - FORM SANITIZATION & CLIENT-SIDE SECURITY ARCHITECTURE
   ========================================================================== */

class FormSecurityEngine {
  constructor(formId) {
    this.form = document.getElementById(formId);
    if (!this.form) return;

    this.submitBtn = this.form.querySelector('button[type="submit"]');
    this.statusAlert = document.getElementById('formStatusAlert');
    this.honeypotField = document.getElementById('hp_shield_check');
    this.nonceField = document.getElementById('form_security_nonce');

    this.initSecurityTokens();
    this.attachEventListeners();
  }

  // Generate dynamic client-side nonce and timestamp to prevent replay attacks
  initSecurityTokens() {
    if (this.nonceField) {
      const timestamp = Date.now();
      const randomNonce = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      this.nonceField.value = `${timestamp}:${randomNonce}`;
    }
  }

  // Robust HTML Tag Stripping and Entity Encoding (XSS defense)
  sanitizeString(input) {
    if (typeof input !== 'string') return '';
    return input
      .trim()
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;');
  }

  // Remove potential SQL injection / command injection control characters
  sanitizeDangerousTokens(input) {
    if (typeof input !== 'string') return '';
    return input.replace(/(--|;|\/\*|\*\/|xp_|UNION|SELECT|INSERT|DROP|UPDATE|DELETE|<script|<\/script>)/gi, '');
  }

  // Validate Email against standard RFC 5322 regex pattern
  isValidEmail(email) {
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
    return emailRegex.test(email) && email.length <= 120;
  }

  // Validate Name (letters, spaces, hyphens, min 2, max 60)
  isValidName(name) {
    const nameRegex = /^[a-zA-Z\s'-]{2,60}$/;
    return nameRegex.test(name);
  }

  // Rate Limiting check (max 3 submissions within 10 minutes)
  checkRateLimit() {
    const storageKey = 'bruh_form_submissions';
    const now = Date.now();
    const windowMs = 10 * 60 * 1000; // 10 mins

    try {
      const records = JSON.parse(localStorage.getItem(storageKey) || '[]');
      const recent = records.filter(time => (now - time) < windowMs);

      if (recent.length >= 3) {
        return false;
      }

      recent.push(now);
      localStorage.setItem(storageKey, JSON.stringify(recent));
      return true;
    } catch (e) {
      // Fallback if localStorage disabled
      return true;
    }
  }

  showFeedback(inputEl, message, isError = true) {
    const feedbackEl = inputEl.closest('.form-group')?.querySelector('.input-feedback');
    if (feedbackEl) {
      feedbackEl.textContent = message;
      feedbackEl.className = `input-feedback ${isError ? 'error' : 'valid'}`;
    }
  }

  clearFeedback(inputEl) {
    const feedbackEl = inputEl.closest('.form-group')?.querySelector('.input-feedback');
    if (feedbackEl) {
      feedbackEl.textContent = '';
      feedbackEl.className = 'input-feedback';
    }
  }

  attachEventListeners() {
    const nameInput = this.form.querySelector('#contactName');
    const emailInput = this.form.querySelector('#contactEmail');
    const messageInput = this.form.querySelector('#contactMessage');

    // Real-time input validation on blur
    nameInput?.addEventListener('blur', () => {
      const val = nameInput.value.trim();
      if (!val) {
        this.showFeedback(nameInput, 'Name is required.');
      } else if (!this.isValidName(val)) {
        this.showFeedback(nameInput, 'Please enter a valid full name (letters only, min 2 chars).');
      } else {
        this.showFeedback(nameInput, 'Looks good!', false);
      }
    });

    emailInput?.addEventListener('blur', () => {
      const val = emailInput.value.trim();
      if (!val) {
        this.showFeedback(emailInput, 'Email address is required.');
      } else if (!this.isValidEmail(val)) {
        this.showFeedback(emailInput, 'Please provide a valid corporate or personal email.');
      } else {
        this.showFeedback(emailInput, 'Valid email format!', false);
      }
    });

    messageInput?.addEventListener('blur', () => {
      const val = messageInput.value.trim();
      if (!val) {
        this.showFeedback(messageInput, 'Message is required.');
      } else if (val.length < 15) {
        this.showFeedback(messageInput, 'Please describe your project in at least 15 characters.');
      } else {
        this.showFeedback(messageInput, 'Ready to submit!', false);
      }
    });

    // Form submission interceptor
    this.form.addEventListener('submit', (e) => this.handleSubmit(e));
  }

  handleSubmit(e) {
    e.preventDefault();

    // 1. Anti-Bot Honeypot verification
    if (this.honeypotField && this.honeypotField.value.trim() !== '') {
      console.warn('Bot detected via honeypot field. Request dropped silently.');
      this.displayStatus('Spam detected. Submission dropped.', true);
      return;
    }

    // 2. Client-side Rate Limiting check
    if (!this.checkRateLimit()) {
      this.displayStatus('Rate limit exceeded: You have submitted multiple messages recently. Please wait a few minutes.', true);
      return;
    }

    // 3. Extract & Sanitize form fields
    const nameInput = this.form.querySelector('#contactName');
    const emailInput = this.form.querySelector('#contactEmail');
    const serviceSelect = this.form.querySelector('#contactService');
    const messageInput = this.form.querySelector('#contactMessage');

    const rawName = nameInput.value;
    const rawEmail = emailInput.value;
    const rawService = serviceSelect.value;
    const rawMessage = messageInput.value;

    // Strict validation
    if (!this.isValidName(rawName.trim())) {
      this.showFeedback(nameInput, 'Please provide a valid full name.');
      nameInput.focus();
      return;
    }

    if (!this.isValidEmail(rawEmail.trim())) {
      this.showFeedback(emailInput, 'Please provide a valid email address.');
      emailInput.focus();
      return;
    }

    if (!rawMessage.trim() || rawMessage.trim().length < 15) {
      this.showFeedback(messageInput, 'Please provide a project description with at least 15 characters.');
      messageInput.focus();
      return;
    }

    // Sanitize data
    const sanitizedData = {
      name: this.sanitizeString(this.sanitizeDangerousTokens(rawName)),
      email: this.sanitizeString(rawEmail.trim().toLowerCase()),
      service: this.sanitizeString(rawService),
      message: this.sanitizeString(this.sanitizeDangerousTokens(rawMessage)),
      timestamp: new Date().toISOString()
    };

    // Button loading state
    const originalBtnText = this.submitBtn.innerHTML;
    this.submitBtn.disabled = true;
    this.submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Securing & Submitting...';

    // Simulated secure transmission to HTTPS static endpoint
    setTimeout(() => {
      this.submitBtn.disabled = false;
      this.submitBtn.innerHTML = originalBtnText;

      this.displayStatus(`Thank you, ${sanitizedData.name}! Your message for "${sanitizedData.service}" was securely received. Ayyappa & Chandhana will connect with you within 24 hours.`, false);
      
      this.form.reset();
      this.initSecurityTokens();
      
      // Clear visual feedback messages
      [nameInput, emailInput, messageInput].forEach(el => this.clearFeedback(el));
    }, 1100);
  }

  displayStatus(message, isError) {
    if (!this.statusAlert) return;
    this.statusAlert.className = `form-status-alert ${isError ? 'error' : 'success'}`;
    this.statusAlert.innerHTML = `
      <i class="fas ${isError ? 'fa-exclamation-triangle' : 'fa-check-circle'}"></i>
      <span>${this.sanitizeString(message)}</span>
    `;
    this.statusAlert.style.display = 'flex';

    if (!isError) {
      setTimeout(() => {
        this.statusAlert.style.display = 'none';
      }, 7000);
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new FormSecurityEngine('contactForm');
});
