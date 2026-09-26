// Aidan Claffey Travel — site behaviour

document.addEventListener('DOMContentLoaded', function () {
  // Mobile nav toggle
  var navToggle = document.getElementById('nav-toggle');
  var mainNav = document.getElementById('main-nav');
  if (navToggle && mainNav) {
    navToggle.addEventListener('click', function () {
      mainNav.classList.toggle('open');
    });
    mainNav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        mainNav.classList.remove('open');
      });
    });
  }

  // Enquiry form validation + submission
  var form = document.getElementById('enquiry-form');
  if (!form) return;

  var statusBox = document.getElementById('form-status');

  var validators = {
    name: function (v) { return v.trim().length >= 2 ? '' : 'Please enter your full name.'; },
    email: function (v) {
      var re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return re.test(v.trim()) ? '' : 'Please enter a valid email address.';
    },
    phone: function (v) {
      var re = /^[0-9+()\s-]{7,20}$/;
      return re.test(v.trim()) ? '' : 'Please enter a valid phone number.';
    },
    service: function (v) { return v ? '' : 'Please select a service.'; },
    message: function (v) { return v.trim().length >= 10 ? '' : 'Please add a few details about your enquiry (min. 10 characters).'; }
  };

  function setFieldError(fieldName, message) {
    var wrapper = document.getElementById('field-' + fieldName.replace('travel-date', 'date'));
    if (!wrapper) return;
    var errorEl = wrapper.querySelector('.error-msg');
    if (message) {
      wrapper.classList.add('has-error');
      if (errorEl) errorEl.textContent = message;
    } else {
      wrapper.classList.remove('has-error');
      if (errorEl) errorEl.textContent = '';
    }
  }

  function validateForm() {
    var isValid = true;
    Object.keys(validators).forEach(function (fieldName) {
      var input = form.elements[fieldName];
      if (!input) return;
      var error = validators[fieldName](input.value || '');
      setFieldError(fieldName, error);
      if (error) isValid = false;
    });
    return isValid;
  }

  // Live validation as the user types/selects
  Object.keys(validators).forEach(function (fieldName) {
    var input = form.elements[fieldName];
    if (!input) return;
    input.addEventListener('blur', function () {
      setFieldError(fieldName, validators[fieldName](input.value || ''));
    });
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    statusBox.className = 'form-status';
    statusBox.textContent = '';

    if (!validateForm()) {
      statusBox.classList.add('error');
      statusBox.textContent = 'Please correct the highlighted fields and try again.';
      var firstError = form.querySelector('.has-error input, .has-error select, .has-error textarea');
      if (firstError) firstError.focus();
      return;
    }

    // NOTE: This form currently has no backend connected.
    // To go live, connect this form to an email/form service (e.g. Formspree,
    // Netlify Forms, or a custom backend) so enquiries actually reach your inbox.
    var submitBtn = form.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending...';

    setTimeout(function () {
      statusBox.classList.add('success');
      statusBox.textContent = "Thanks! Your enquiry has been prepared. (Note: this demo form isn't yet connected to an email service — see setup notes.)";
      submitBtn.disabled = false;
      submitBtn.textContent = 'Submit Enquiry';
      form.reset();
    }, 700);
  });
});
