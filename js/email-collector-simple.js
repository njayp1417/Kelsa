// Simple Email Collection - Actually Works on GitHub Pages
class SimpleEmailCollector {
    constructor() {
        this.emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        this.init();
    }

    init() {
        const newsletterForm = document.querySelector('form[onsubmit*="newsletter"]');
        if (newsletterForm) {
            newsletterForm.addEventListener('submit', (e) => this.handleNewsletterSubmit(e));
        }

        const contactForm = document.getElementById('contactForm');
        if (contactForm) {
            contactForm.addEventListener('submit', (e) => this.handleContactSubmit(e));
        }
    }

    validateEmail(email) {
        if (!email || email.trim() === '') {
            return { valid: false, message: 'Email is required' };
        }
        
        const trimmedEmail = email.trim().toLowerCase();
        
        if (!this.emailRegex.test(trimmedEmail)) {
            return { valid: false, message: 'Please enter a valid email address' };
        }
        
        return { valid: true, email: trimmedEmail };
    }

    async handleNewsletterSubmit(e) {
        e.preventDefault();
        
        const emailInput = e.target.querySelector('input[type="email"]');
        const submitBtn = e.target.querySelector('button[type="submit"]');
        
        if (!emailInput) return;
        
        const validation = this.validateEmail(emailInput.value);
        
        if (!validation.valid) {
            this.showMessage(validation.message, 'error', emailInput);
            return;
        }
        
        const originalText = submitBtn.textContent;
        submitBtn.disabled = true;
        submitBtn.textContent = 'Subscribing...';
        
        try {
            this.sendEmailToYou(validation.email, 'newsletter');
            this.showMessage('Thank you for subscribing!', 'success', emailInput);
            emailInput.value = '';
        } catch (error) {
            this.showMessage('Please try again', 'error', emailInput);
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
        }
    }

    async handleContactSubmit(e) {
        const emailInput = document.getElementById('email');
        if (!emailInput) return;
        
        const validation = this.validateEmail(emailInput.value);
        
        if (!validation.valid) {
            this.showMessage(validation.message, 'error', emailInput);
            e.preventDefault();
            return;
        }
        
        this.sendEmailToYou(validation.email, 'contact');
    }

    sendEmailToYou(email, source) {
        // Method that actually works: mailto
        const subject = `New ${source} from Kelsa Events`;
        const body = `
New email collected:
Email: ${email}
Source: ${source}
Time: ${new Date().toLocaleString()}
Page: ${window.location.href}

Add this email to your newsletter list.
        `;

        const mailtoLink = `mailto:kelsarentalsevent@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        
        // Open email client
        window.open(mailtoLink, '_blank');
        
        console.log(`📧 Email collected: ${email} (${source})`);
    }

    showMessage(message, type, inputElement) {
        const existingMessage = inputElement.parentNode.querySelector('.email-message');
        if (existingMessage) {
            existingMessage.remove();
        }
        
        const messageDiv = document.createElement('div');
        messageDiv.className = 'email-message';
        messageDiv.textContent = message;
        messageDiv.style.cssText = `
            margin-top: 8px;
            padding: 8px 12px;
            border-radius: 4px;
            font-size: 14px;
            font-weight: 500;
            ${type === 'success' ? 
                'background: #d4edda; color: #155724; border: 1px solid #c3e6cb;' : 
                'background: #f8d7da; color: #721c24; border: 1px solid #f5c6cb;'
            }
        `;
        
        inputElement.parentNode.insertBefore(messageDiv, inputElement.nextSibling);
        
        setTimeout(() => {
            if (messageDiv.parentNode) {
                messageDiv.remove();
            }
        }, 5000);
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    new SimpleEmailCollector();
    console.log('✅ Simple email collector ready');
});