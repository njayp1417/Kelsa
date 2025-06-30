/**
 * Enhanced Form Validation for Kelsa Events
 * Provides real-time validation with detailed feedback
 */

class FormValidator {
  constructor(formId) {
    this.form = document.getElementById(formId);
    if (!this.form) return;
    
    this.fields = {};
    this.isSubmitting = false;
    this.submitButton = this.form.querySelector('[type="submit"]');
    
    this.initValidation();
  }
  
  // Initialize validation on the form
  initValidation() {
    // Get all form fields
    const inputs = this.form.querySelectorAll('input, textarea, select');
    
    // Set up validation rules for each field
    inputs.forEach(input => {
      // Store field information
      this.fields[input.id] = {
        element: input,
        value: input.value,
        valid: !input.required, // Initially valid if not required
        touched: false,
        rules: this.getValidationRules(input)
      };
      
      // Add event listeners
      input.addEventListener('blur', () => this.validateField(input.id));
      input.addEventListener('input', () => this.handleInput(input.id));
    });
    
    // Form submission handler
    this.form.addEventListener('submit', (e) => this.handleSubmit(e));
  }
  
  // Get validation rules based on input attributes
  getValidationRules(input) {
    const rules = {};
    
    // Required validation
    if (input.hasAttribute('required')) {
      rules.required = true;
    }
    
    // Email validation
    if (input.type === 'email') {
      rules.email = true;
    }
    
    // Phone validation
    if (input.type === 'tel') {
      rules.phone = true;
    }
    
    // Minimum length
    if (input.hasAttribute('minlength')) {
      rules.minLength = parseInt(input.getAttribute('minlength'));
    }
    
    // Maximum length
    if (input.hasAttribute('maxlength')) {
      rules.maxLength = parseInt(input.getAttribute('maxlength'));
    }
    
    // Pattern validation
    if (input.hasAttribute('pattern')) {
      rules.pattern = new RegExp(input.getAttribute('pattern'));
    }
    
    return rules;
  }
  
  // Validate a specific field
  validateField(fieldId) {
    const field = this.fields[fieldId];
    if (!field) return false;
    
    const input = field.element;
    const value = input.value.trim();
    field.value = value;
    field.touched = true;
    
    // Clear previous errors
    this.clearError(input);
    
    // Check validation rules
    const rules = field.rules;
    let isValid = true;
    let errorMessage = '';
    
    // Required validation
    if (rules.required && value === '') {
      isValid = false;
      errorMessage = input.dataset.errorRequired || 'This field is required';
    }
    
    // Email validation
    else if (rules.email && value !== '' && !this.isValidEmail(value)) {
      isValid = false;
      errorMessage = input.dataset.errorEmail || 'Please enter a valid email address';
    }
    
    // Phone validation
    else if (rules.phone && value !== '' && !this.isValidPhone(value)) {
      isValid = false;
      errorMessage = input.dataset.errorPhone || 'Please enter a valid phone number';
    }
    
    // Minimum length
    else if (rules.minLength && value.length < rules.minLength) {
      isValid = false;
      errorMessage = input.dataset.errorMinLength || 
        `Please enter at least ${rules.minLength} characters`;
    }
    
    // Pattern validation
    else if (rules.pattern && value !== '' && !rules.pattern.test(value)) {
      isValid = false;
      errorMessage = input.dataset.errorPattern || 'Please enter a valid value';
    }
    
    // Update field status
    field.valid = isValid;
    
    // Show error if invalid
    if (!isValid) {
      this.showError(input, errorMessage);
    } else {
      this.showSuccess(input);
    }
    
    // Update submit button state
    this.updateSubmitButton();
    
    return isValid;
  }
  
  // Handle input changes
  handleInput(fieldId) {
    const field = this.fields[fieldId];
    if (!field) return;
    
    // Update value
    field.value = field.element.value;
    
    // Validate only if already touched or form was submitted
    if (field.touched || this.isSubmitting) {
      this.validateField(fieldId);
    }
  }
  
  // Handle form submission
  handleSubmit(e) {
    e.preventDefault();
    this.isSubmitting = true;
    
    // Validate all fields
    let isFormValid = true;
    for (const fieldId in this.fields) {
      const isFieldValid = this.validateField(fieldId);
      isFormValid = isFormValid && isFieldValid;
    }
    
    // If form is valid, submit it
    if (isFormValid) {
      // Show loading state
      this.showLoading();
      
      // Get form data
      const formData = new FormData(this.form);
      const formValues = Object.fromEntries(formData.entries());
      
      // Simulate form submission (replace with actual submission)
      setTimeout(() => {
        this.showSuccess();
        
        // For demo purposes, show success message
        this.form.innerHTML = `
          <div style="text-align: center; padding: 2rem 1rem;">
            <i class="fas fa-check-circle" style="font-size: 3rem; color: var(--success); margin-bottom: 1rem;"></i>
            <h3>Thank You!</h3>
            <p>Your message has been sent successfully. We'll get back to you shortly.</p>
          </div>
        `;
      }, 1500);
    } else {
      // Scroll to first error
      const firstErrorField = this.form.querySelector('.invalid');
      if (firstErrorField) {
        firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' });
        firstErrorField.focus();
      }
    }
  }
  
  // Show error message for a field
  showError(input, message) {
    input.classList.add('invalid');
    input.classList.remove('valid');
    
    // Create or update error message
    let errorElement = input.parentNode.querySelector('.error-message');
    if (!errorElement) {
      errorElement = document.createElement('div');
      errorElement.className = 'error-message';
      input.parentNode.appendChild(errorElement);
    }
    
    errorElement.textContent = message;
    
    // Add shake animation
    input.classList.add('shake');
    setTimeout(() => {
      input.classList.remove('shake');
    }, 500);
  }
  
  // Clear error message for a field
  clearError(input) {
    input.classList.remove('invalid');
    const errorElement = input.parentNode.querySelector('.error-message');
    if (errorElement) {
      errorElement.remove();
    }
  }
  
  // Show success state for a field
  showSuccess(input) {
    if (input) {
      input.classList.add('valid');
      input.classList.remove('invalid');
    }
  }
  
  // Update submit button state
  updateSubmitButton() {
    if (!this.submitButton) return;
    
    // Check if all fields are valid
    let isFormValid = true;
    for (const fieldId in this.fields) {
      if (!this.fields[fieldId].valid) {
        isFormValid = false;
        break;
      }
    }
    
    // Update button state
    if (isFormValid) {
      this.submitButton.removeAttribute('disabled');
      this.submitButton.classList.remove('disabled');
    } else {
      this.submitButton.setAttribute('disabled', 'disabled');
      this.submitButton.classList.add('disabled');
    }
  }
  
  // Show loading state during submission
  showLoading() {
    if (this.submitButton) {
      this.submitButton.disabled = true;
      this.submitButton.dataset.originalText = this.submitButton.textContent;
      this.submitButton.classList.add('loading');
    }
  }
  
  // Validate email format
  isValidEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }
  
  // Validate phone format (international format)
  isValidPhone(phone) {
    // Basic international phone validation
    // Allows formats like +1234567890, +123 456 7890, +123-456-7890
    const re = /^\+?[0-9\s\-()]{7,20}$/;
    return re.test(String(phone));
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  window.formValidator = new FormValidator('contactForm');
});