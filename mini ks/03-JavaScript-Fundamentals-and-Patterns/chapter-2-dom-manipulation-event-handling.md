# Chapter 2: DOM Manipulation and Event Handling
## Modern Approaches to Document Object Model Interaction

---

## 2.1 Advanced DOM Selection and Manipulation

```javascript
// Modern DOM selection patterns
function initNavigation() {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.main-nav a');
  
  navLinks.forEach(link => {
    const linkHref = link.getAttribute('href');
    if (linkHref === currentPage || 
        (currentPage === '' && linkHref === 'index.html') ||
        (currentPage === '/' && linkHref === 'index.html')) {
      link.classList.add('active');
      link.setAttribute('aria-current', 'page');
    }
  });
}
```

**DETAILED EXPLANATION:**

Modern DOM manipulation focuses on performance, accessibility, and maintainability. The Kelsa Events project demonstrates efficient DOM interaction patterns that scale well in production environments.

### 2.1.1 Efficient DOM Selection Strategies

```javascript
// Performance-optimized selection
const header = document.querySelector('header');
const navLinks = document.querySelectorAll('.main-nav a');
const animateElements = document.querySelectorAll('.animate');

// Caching DOM references
class FormValidator {
  constructor(formId) {
    this.form = document.getElementById(formId);
    this.submitButton = this.form.querySelector('[type="submit"]');
    this.inputs = this.form.querySelectorAll('input, textarea, select');
  }
}
```

**DOM SELECTION PERFORMANCE:**

**Method Comparison:**
```javascript
// Fastest - Direct ID selection
const form = document.getElementById('contactForm');

// Fast - Single element by selector
const button = document.querySelector('.submit-btn');

// Moderate - Multiple elements
const inputs = document.querySelectorAll('input');

// Slow - Live NodeList (avoid)
const divs = document.getElementsByTagName('div'); // Updates automatically
```

**COMPUTER SCIENCE PRINCIPLES:**

**Time Complexity Analysis:**
- `getElementById()`: O(1) - Hash table lookup
- `querySelector()`: O(n) - Tree traversal with early termination
- `querySelectorAll()`: O(n) - Complete tree traversal
- `getElementsByClassName()`: O(n) - Live collection maintenance

**Memory Optimization:**
```javascript
// Cache DOM references to avoid repeated queries
class NavigationManager {
  constructor() {
    // Cache expensive queries once
    this.header = document.querySelector('header');
    this.navLinks = [...document.querySelectorAll('.main-nav a')];
    this.mobileNav = document.querySelector('.mobile-nav');
  }
  
  updateActiveLink(currentPage) {
    // Use cached references
    this.navLinks.forEach(link => {
      // Implementation using cached elements
    });
  }
}
```

### 2.1.2 Modern Element Creation and Insertion

```javascript
// Template-based element creation
function createNotification(message, type = 'success') {
  const notification = document.createElement('div');
  
  // CSS-in-JS approach for dynamic styling
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: ${type === 'success' ? '#4CAF50' : '#f44336'};
    color: white;
    padding: 20px 30px;
    border-radius: 10px;
    box-shadow: 0 4px 15px rgba(0,0,0,0.2);
    z-index: 10000;
    animation: slideIn 0.5s ease;
    max-width: 400px;
  `;
  
  // Template literal for complex HTML
  notification.innerHTML = `
    <div style="display: flex; align-items: center; gap: 15px;">
      <i class="fas fa-check-circle" style="font-size: 1.5rem;"></i>
      <span>${message}</span>
    </div>
  `;
  
  return notification;
}
```

**ELEMENT CREATION PATTERNS:**

**DocumentFragment for Performance:**
```javascript
// Efficient multiple element creation
function createMultipleElements(items) {
  const fragment = document.createDocumentFragment();
  
  items.forEach(item => {
    const element = document.createElement('div');
    element.textContent = item.text;
    element.className = item.className;
    fragment.appendChild(element);
  });
  
  // Single DOM insertion (triggers one reflow)
  document.body.appendChild(fragment);
}
```

**Template Element Pattern:**
```javascript
// HTML template approach
const template = document.createElement('template');
template.innerHTML = `
  <div class="notification">
    <i class="icon"></i>
    <span class="message"></span>
  </div>
`;

function createFromTemplate(message, iconClass) {
  const clone = template.content.cloneNode(true);
  clone.querySelector('.message').textContent = message;
  clone.querySelector('.icon').className = iconClass;
  return clone;
}
```

### 2.1.3 Class and Attribute Manipulation

```javascript
// Modern class manipulation
function initAccessibility() {
  // Add focus outline for keyboard navigation
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Tab') {
      document.body.classList.add('keyboard-user');
    }
  });
  
  document.addEventListener('mousedown', function() {
    document.body.classList.remove('keyboard-user');
  });
  
  // Batch class operations
  const touchTargets = document.querySelectorAll('a, button, .btn');
  touchTargets.forEach(target => {
    target.classList.add('touch-optimized');
  });
}
```

**CLASS MANIPULATION BEST PRACTICES:**

```javascript
// Efficient class operations
element.classList.add('active', 'visible', 'animated');
element.classList.remove('hidden', 'disabled');
element.classList.toggle('expanded');

// Conditional class assignment
element.classList.toggle('dark-mode', prefersDarkMode);

// Class replacement
element.classList.replace('loading', 'loaded');
```

**ATTRIBUTE MANAGEMENT:**
```javascript
// Modern attribute handling
function setupAccessibility(element) {
  // ARIA attributes
  element.setAttribute('aria-expanded', 'false');
  element.setAttribute('aria-controls', 'menu');
  element.setAttribute('role', 'button');
  
  // Data attributes
  element.dataset.userId = '123';        // data-user-id="123"
  element.dataset.trackingId = 'btn-1';  // data-tracking-id="btn-1"
  
  // Boolean attributes
  element.toggleAttribute('disabled', isDisabled);
}
```

## 2.2 Event Handling Patterns and Performance

```javascript
// Performance-optimized event handling
function initNavigation() {
  const header = document.querySelector('header');
  if (header) {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    };
    
    // Passive event listener for better performance
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Initial check
    handleScroll();
  }
}
```

### 2.2.1 Event Listener Optimization

**PASSIVE EVENT LISTENERS:**
```javascript
// Performance-critical events
window.addEventListener('scroll', handleScroll, { 
  passive: true,    // Won't call preventDefault()
  capture: false,   // Bubble phase
  once: false       // Can fire multiple times
});

// Touch events optimization
element.addEventListener('touchstart', handleTouch, { 
  passive: true     // Improves scroll performance
});

// One-time events
button.addEventListener('click', handleFirstClick, { 
  once: true        // Automatically removes after first trigger
});
```

**EVENT DELEGATION PATTERN:**
```javascript
// Efficient event handling for dynamic content
document.addEventListener('click', (event) => {
  // Button clicks
  if (event.target.matches('.btn')) {
    handleButtonClick(event);
  }
  
  // Link clicks
  if (event.target.matches('a[data-action]')) {
    handleActionLink(event);
  }
  
  // Card interactions
  if (event.target.closest('.card')) {
    handleCardClick(event);
  }
});
```

### 2.2.2 Custom Event Systems

```javascript
// Custom event creation and dispatch
class ImageOptimizer {
  loadImage(img) {
    this.prepareImage(img);
    img.classList.add('loaded');
    
    // Dispatch custom event when loaded
    img.addEventListener('load', () => {
      const event = new CustomEvent('imageLoaded', {
        detail: {
          src: img.src,
          width: img.naturalWidth,
          height: img.naturalHeight
        },
        bubbles: true,
        cancelable: false
      });
      
      img.dispatchEvent(event);
    });
  }
}

// Listen for custom events
document.addEventListener('imageLoaded', (event) => {
  console.log('Image loaded:', event.detail);
  // Update loading statistics, trigger animations, etc.
});
```

**EVENT OBJECT PATTERNS:**
```javascript
// Comprehensive event handling
function handleFormSubmit(event) {
  // Prevent default behavior
  event.preventDefault();
  
  // Stop event propagation if needed
  event.stopPropagation();
  
  // Access form data
  const formData = new FormData(event.target);
  const data = Object.fromEntries(formData.entries());
  
  // Access event properties
  console.log('Event type:', event.type);
  console.log('Target element:', event.target);
  console.log('Current target:', event.currentTarget);
  console.log('Timestamp:', event.timeStamp);
}
```

### 2.2.3 Intersection Observer for Performance

```javascript
// Modern visibility detection
function initAnimations() {
  const animateElements = document.querySelectorAll('.animate');
  
  if (animateElements.length > 0 && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Animate element into view
          entry.target.style.opacity = 1;
          entry.target.style.transform = 'translateY(0)';
          
          // Stop observing this element
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,                    // Trigger when 10% visible
      rootMargin: '0px 0px -50px 0px'    // Trigger 50px before viewport
    });
    
    // Observe all animation elements
    animateElements.forEach(element => {
      observer.observe(element);
    });
  }
}
```

**INTERSECTION OBSERVER CONFIGURATION:**

```javascript
// Advanced observer configuration
const observerConfig = {
  root: null,                    // Use viewport as root
  rootMargin: '50px 0px',        // Expand root area by 50px top/bottom
  threshold: [0, 0.25, 0.5, 0.75, 1.0]  // Multiple thresholds
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    const ratio = entry.intersectionRatio;
    
    if (ratio > 0.5) {
      entry.target.classList.add('half-visible');
    }
    
    if (ratio === 1.0) {
      entry.target.classList.add('fully-visible');
    }
  });
}, observerConfig);
```

## 2.3 Form Handling and Validation

```javascript
// Real-time form validation
class FormValidator {
  constructor(formId) {
    this.form = document.getElementById(formId);
    this.fields = {};
    this.initValidation();
  }
  
  initValidation() {
    const inputs = this.form.querySelectorAll('input, textarea, select');
    
    inputs.forEach(input => {
      // Store field metadata
      this.fields[input.id] = {
        element: input,
        valid: !input.required,
        touched: false,
        rules: this.getValidationRules(input)
      };
      
      // Real-time validation events
      input.addEventListener('blur', () => this.validateField(input.id));
      input.addEventListener('input', () => this.handleInput(input.id));
    });
  }
}
```

### 2.3.1 Advanced Form Data Handling

```javascript
// Modern form data extraction
function handleFormSubmission(event) {
  event.preventDefault();
  
  // FormData API for complex forms
  const formData = new FormData(event.target);
  
  // Convert to object
  const data = {};
  for (const [key, value] of formData.entries()) {
    // Handle multiple values (checkboxes, multi-select)
    if (data[key]) {
      data[key] = Array.isArray(data[key]) ? 
        [...data[key], value] : [data[key], value];
    } else {
      data[key] = value;
    }
  }
  
  // File handling
  const fileInputs = event.target.querySelectorAll('input[type="file"]');
  fileInputs.forEach(input => {
    if (input.files.length > 0) {
      data[input.name] = Array.from(input.files);
    }
  });
  
  return data;
}
```

**FORM VALIDATION PATTERNS:**
```javascript
// Comprehensive validation system
validateField(fieldId) {
  const field = this.fields[fieldId];
  const input = field.element;
  const value = input.value.trim();
  
  // Clear previous errors
  this.clearError(input);
  
  let isValid = true;
  let errorMessage = '';
  
  // Required validation
  if (field.rules.required && value === '') {
    isValid = false;
    errorMessage = input.dataset.errorRequired || 'This field is required';
  }
  
  // Email validation
  else if (field.rules.email && value && !this.isValidEmail(value)) {
    isValid = false;
    errorMessage = 'Please enter a valid email address';
  }
  
  // Custom validation
  else if (field.rules.custom && !field.rules.custom(value)) {
    isValid = false;
    errorMessage = field.rules.customMessage || 'Invalid value';
  }
  
  // Update field state
  field.valid = isValid;
  
  if (!isValid) {
    this.showError(input, errorMessage);
  } else {
    this.showSuccess(input);
  }
  
  return isValid;
}
```

### 2.3.2 Dynamic Form Enhancement

```javascript
// Progressive form enhancement
function enhanceFormExperience() {
  // Auto-resize textareas
  document.querySelectorAll('textarea').forEach(textarea => {
    textarea.addEventListener('input', function() {
      this.style.height = 'auto';
      this.style.height = this.scrollHeight + 'px';
    });
  });
  
  // Input formatting
  document.querySelectorAll('input[type="tel"]').forEach(input => {
    input.addEventListener('input', function() {
      // Format phone number as user types
      let value = this.value.replace(/\D/g, '');
      if (value.length >= 6) {
        value = value.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
      }
      this.value = value;
    });
  });
  
  // Real-time character count
  document.querySelectorAll('textarea[maxlength]').forEach(textarea => {
    const maxLength = textarea.getAttribute('maxlength');
    const counter = document.createElement('div');
    counter.className = 'character-counter';
    textarea.parentNode.appendChild(counter);
    
    function updateCounter() {
      const remaining = maxLength - textarea.value.length;
      counter.textContent = `${remaining} characters remaining`;
      counter.classList.toggle('warning', remaining < 50);
    }
    
    textarea.addEventListener('input', updateCounter);
    updateCounter();
  });
}
```

## 2.4 Performance Optimization Techniques

```javascript
// Debounced event handling
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Usage for expensive operations
const debouncedSearch = debounce((query) => {
  performSearch(query);
}, 300);

document.getElementById('search').addEventListener('input', (e) => {
  debouncedSearch(e.target.value);
});
```

### 2.4.1 Event Throttling and Debouncing

```javascript
// Throttle function for scroll events
function throttle(func, limit) {
  let inThrottle;
  return function() {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// Optimized scroll handler
const throttledScrollHandler = throttle(() => {
  const scrollY = window.scrollY;
  
  // Update header state
  document.querySelector('header').classList.toggle('scrolled', scrollY > 50);
  
  // Update scroll progress
  const progress = scrollY / (document.body.scrollHeight - window.innerHeight);
  document.documentElement.style.setProperty('--scroll-progress', progress);
}, 16); // ~60fps

window.addEventListener('scroll', throttledScrollHandler, { passive: true });
```

### 2.4.2 Memory Management and Cleanup

```javascript
// Proper event listener cleanup
class ComponentManager {
  constructor() {
    this.eventListeners = [];
    this.observers = [];
  }
  
  addEventListener(element, event, handler, options) {
    element.addEventListener(event, handler, options);
    
    // Store for cleanup
    this.eventListeners.push({
      element, event, handler, options
    });
  }
  
  addObserver(observer) {
    this.observers.push(observer);
  }
  
  destroy() {
    // Clean up event listeners
    this.eventListeners.forEach(({ element, event, handler, options }) => {
      element.removeEventListener(event, handler, options);
    });
    
    // Disconnect observers
    this.observers.forEach(observer => {
      observer.disconnect();
    });
    
    // Clear references
    this.eventListeners = [];
    this.observers = [];
  }
}
```

This chapter demonstrates modern DOM manipulation and event handling patterns that prioritize performance, accessibility, and maintainability. The next chapter will explore asynchronous programming patterns and API integration.