(function(){
  document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('contact-form');
    if (!form) return;

    // helper: load the supported EmailJS browser SDK with timeout
    const loadEmailJSSDK = (timeoutMs = 8000) => new Promise((resolve, reject) => {
      if (window.emailjs) return resolve();
      const s = document.createElement('script');
      s.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js';
      let timedOut = false;
      const t = setTimeout(() => {
        timedOut = true;
        s.onerror = null;
        s.onload = null;
        reject(new Error('EmailJS SDK load timeout'));
      }, timeoutMs);
      s.onload = () => { if (!timedOut) { clearTimeout(t); resolve(); } };
      s.onerror = () => { if (!timedOut) { clearTimeout(t); reject(new Error('Failed to load EmailJS SDK')); } };
      document.head.appendChild(s);
    });

    // Replace these placeholders with your EmailJS service/template IDs.
    // The public key should be provided on the form via `data-emailjs-key` in production.
    const DEFAULT_EMAILJS_PUBLIC_KEY = '';
    const EMAILJS_SERVICE_ID = 'service_fnf7axk';
    const EMAILJS_TEMPLATE_ID = 'template_wz5kntk';

    // create a message area to show success / error messages instead of using alert()
    let _msgTimeout = null;
    const msgEl = document.createElement('div');
    msgEl.className = 'contact-form-message hidden';
    msgEl.setAttribute('role', 'status');
    msgEl.setAttribute('aria-live', 'polite');
    msgEl.setAttribute('tabindex', '-1');

    // debug details output (shown only when debug flag true)
    const debugEl = document.createElement('pre');
    debugEl.className = 'contact-form-debug hidden';
    debugEl.setAttribute('aria-hidden', 'true');

    // place message and debug box just below the submit button when possible
    const _placeMessageBelowButton = () => {
      const initialSubmitBtn = form.querySelector('button[type="submit"]');
      if (initialSubmitBtn && initialSubmitBtn.parentNode) {
        initialSubmitBtn.insertAdjacentElement('afterend', msgEl);
        msgEl.insertAdjacentElement('afterend', debugEl);
        return true;
      }
      // fallback: append to form
      form.appendChild(msgEl);
      form.appendChild(debugEl);
      return false;
    };
    _placeMessageBelowButton();

    // dismiss button for messages (improves UX)
    const dismissBtn = document.createElement('button');
    dismissBtn.type = 'button';
    dismissBtn.className = 'contact-form-message-dismiss';
    dismissBtn.textContent = '×';
    dismissBtn.setAttribute('aria-label', 'Dismiss message');
    dismissBtn.addEventListener('click', () => {
      msgEl.classList.add('hidden');
      debugEl.classList.add('hidden');
    });
    msgEl.appendChild(dismissBtn);

    const EMAILJS_PUBLIC_KEY = (form.getAttribute('data-emailjs-key') || DEFAULT_EMAILJS_PUBLIC_KEY).trim();
    const EMAILJS_DEBUG = (form.getAttribute('data-emailjs-debug') || 'false').toLowerCase() === 'true';

    const showMessage = (type, text, details = null, autoHide = true) => {
      clearTimeout(_msgTimeout);
      // update visible message
      const textNode = document.createElement('span');
      textNode.textContent = text;
      // replace existing content except dismiss button
      while (msgEl.firstChild && msgEl.firstChild !== dismissBtn) msgEl.removeChild(msgEl.firstChild);
      msgEl.insertBefore(textNode, dismissBtn);
      msgEl.classList.remove('hidden', 'success', 'error');
      msgEl.classList.add(type === 'success' ? 'success' : 'error');
      // handle debug details
      if (details && EMAILJS_DEBUG) {
        try {
          debugEl.textContent = typeof details === 'string' ? details : JSON.stringify(details, null, 2);
          debugEl.classList.remove('hidden');
          debugEl.setAttribute('aria-hidden', 'false');
        } catch (e) {
          debugEl.textContent = String(details);
          debugEl.classList.remove('hidden');
          debugEl.setAttribute('aria-hidden', 'false');
        }
      } else {
        debugEl.classList.add('hidden');
        debugEl.setAttribute('aria-hidden', 'true');
      }
      // focus message for screen readers
      msgEl.focus({ preventScroll: true });
      if (autoHide) _msgTimeout = setTimeout(() => msgEl.classList.add('hidden'), 6000);
    };

    // initialize EmailJS SDK (async) and fail gracefully if missing key
    (async () => {
      if (!EMAILJS_PUBLIC_KEY) {
        console.warn('EmailJS public key is not provided on the form via data-emailjs-key. Email sending will be disabled.');
        showMessage('error', 'Email service not configured. Contact administrator.');
        return;
      }
      try {
        await loadEmailJSSDK(8000);
        if (window.emailjs && typeof window.emailjs.init === 'function') {
          window.emailjs.init(EMAILJS_PUBLIC_KEY);
        } else {
          console.warn('EmailJS SDK loaded but `emailjs.init` not found');
          showMessage('error', 'Email service unavailable.');
        }
      } catch (err) {
        console.error('EmailJS SDK load/init error', err);
        showMessage('error', 'Failed to load email service. Please try again later.', err);
      }
    })();

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = form.querySelector('button[type="submit"]');
      // change button text to indicate submitting state
      let _origBtnText = null;
      if (submitBtn) {
        _origBtnText = submitBtn.textContent;
        submitBtn.textContent = 'Submitting...';
        submitBtn.disabled = true;
      }

      const firstName = (form.querySelector('[name="first-name"]') || { value: '' }).value;
      const lastName = (form.querySelector('[name="last-name"]') || { value: '' }).value;
      const emailVal = (form.querySelector('[name="email"]') || { value: '' }).value;
      const phone = (form.querySelector('[name="phone"]') || { value: '' }).value;
      const business = (form.querySelector('[name="business"]') || { value: '' }).value;
      const position = (form.querySelector('[name="position"]') || { value: '' }).value;
      const website = (form.querySelector('[name="website"]') || { value: '' }).value;
      const description = (form.querySelector('[name="description"]') || { value: '' }).value;
      const titleField = (form.querySelector('[name="title"]') || { value: '' }).value;

      const templateParams = {
        first_name: firstName,
        last_name: lastName,
        // map `name` and `title` because your EmailJS template uses {{name}} and {{title}}
        name: `${firstName}${lastName ? ' ' + lastName : ''}`,
        title: titleField || description.substring(0, 60),
        email: emailVal,
        phone,
        business,
        position,
        website,
        description,
      };

      if (!window.emailjs || !emailjs.send) {
        showMessage('error', 'Email service is not available. Please try again later.');
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = _origBtnText || 'Submit';
        }
        return;
      }

      emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams)
        .then((response) => {
          // Only show debug details if debug is enabled and the response contains useful info.
          const isTrivialOk = response && response.status === 200 && typeof response.text === 'string' && response.text.trim().toUpperCase() === 'OK';
          const detailsToShow = (EMAILJS_DEBUG && !isTrivialOk) ? response : null;
          showMessage('success', 'Message sent — thank you!', detailsToShow);
          form.reset();
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = _origBtnText || 'Submit';
          }
        }, (err) => {
          console.error('EmailJS error', err);
          showMessage('error', 'Failed to send message. Please try again later.', err);
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = _origBtnText || 'Submit';
          }
        });
    });
  });
})();
