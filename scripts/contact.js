(function(){
  document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('contact-form');
    if (!form) return;

    const loadEmailJSSDK = () => new Promise((resolve, reject) => {
      if (window.emailjs) return resolve();
      const s = document.createElement('script');
      s.src = 'https://cdn.jsdelivr.net/npm/emailjs-com@2.6.4/dist/email.min.js';
      s.onload = () => resolve();
      s.onerror = () => reject(new Error('Failed to load EmailJS SDK'));
      document.head.appendChild(s);
    });

    // Replace these placeholders with your EmailJS user/service/template IDs
    const EMAILJS_USER_ID = 'Jab5E43Gsn_umHjvO';
    const EMAILJS_SERVICE_ID = 'service_fnf7axk';
    const EMAILJS_TEMPLATE_ID = 'template_wz5kntk';

    loadEmailJSSDK().then(() => {
      try {
        if (emailjs && typeof emailjs.init === 'function') {
          emailjs.init(EMAILJS_USER_ID);
        }
      } catch (err) {
        console.warn('EmailJS init error', err);
      }
    }).catch(err => console.warn(err));

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

      const templateParams = {
        first_name: (form.querySelector('[name="first-name"]') || { value: '' }).value,
        last_name: (form.querySelector('[name="last-name"]') || { value: '' }).value,
        email: (form.querySelector('[name="email"]') || { value: '' }).value,
        phone: (form.querySelector('[name="phone"]') || { value: '' }).value,
        business: (form.querySelector('[name="business"]') || { value: '' }).value,
        position: (form.querySelector('[name="position"]') || { value: '' }).value,
        website: (form.querySelector('[name="website"]') || { value: '' }).value,
        description: (form.querySelector('[name="description"]') || { value: '' }).value,
      };

      if (!window.emailjs || !emailjs.send) {
        alert('Email service is not available. Please try again later.');
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = _origBtnText || 'Submit';
        }
        return;
      }

      emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams)
        .then(() => {
          alert('Message sent — thank you!');
          form.reset();
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = _origBtnText || 'Submit';
          }
        }, (err) => {
          console.error('EmailJS error', err);
          alert('Failed to send message. Please try again later.');
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = _origBtnText || 'Submit';
          }
        });
    });
  });
})();
