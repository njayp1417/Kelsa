/**
 * Kelsa Events Website - Main JavaScript
 * Optimized for performance and user experience
 */

// Create preloader element
const preloader = document.createElement('div');
preloader.className = 'preloader';
preloader.innerHTML = `
  <div class="preloader-content">
    <div class="preloader-spinner"></div>
    <div class="preloader-text">Loading Kelsa Events...</div>
  </div>
`;

// Add preloader to body
document.body.appendChild(preloader);

// Hide preloader when page is loaded
window.addEventListener('load', () => {
  setTimeout(() => {
    preloader.classList.add('preloader-hidden');
    setTimeout(() => {
      preloader.remove();
    }, 500);
  }, 500);
});

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initNavigation();
    initAnimations();
    initCurrentYear();
    initScrollToTop();
    initAccessibility();
});

/**
 * Navigation functionality
 */
function initNavigation() {
    // Add active class to current page in navigation
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
    
    // Handle header scroll effect
    const header = document.querySelector('header');
    if (header) {
        const handleScroll = () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        };
        
        // Use passive event listener for better performance
        window.addEventListener('scroll', handleScroll, { passive: true });
        
        // Initial check
        handleScroll();
    }
    

}

/**
 * Animation functionality with performance optimizations
 */
function initAnimations() {
    // Use Intersection Observer for animations
    const animateElements = document.querySelectorAll('.animate');
    
    if (animateElements.length > 0 && 'IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = 1;
                    entry.target.style.transform = 'translateY(0)';
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });
        
        animateElements.forEach(element => {
            observer.observe(element);
        });
    } else {
        // Fallback for browsers without Intersection Observer
        animateElements.forEach(element => {
            element.style.opacity = 1;
            element.style.transform = 'translateY(0)';
        });
    }
}

/**
 * Update copyright year
 */
function initCurrentYear() {
    const yearElements = document.querySelectorAll('#currentYear');
    const currentYear = new Date().getFullYear();
    
    yearElements.forEach(element => {
        element.textContent = currentYear;
    });
}

/**
 * Scroll to top button
 */
function initScrollToTop() {
    // Create scroll to top button if it doesn't exist
    if (!document.querySelector('.scroll-top')) {
        const scrollBtn = document.createElement('button');
        scrollBtn.classList.add('scroll-top');
        scrollBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
        scrollBtn.setAttribute('aria-label', 'Scroll to top');
        scrollBtn.style.position = 'fixed';
        scrollBtn.style.bottom = '20px';
        scrollBtn.style.right = '20px';
        scrollBtn.style.display = 'none';
        scrollBtn.style.padding = '12px';
        scrollBtn.style.backgroundColor = 'var(--primary)';
        scrollBtn.style.color = '#fff';
        scrollBtn.style.border = 'none';
        scrollBtn.style.borderRadius = '50%';
        scrollBtn.style.cursor = 'pointer';
        scrollBtn.style.zIndex = '999';
        scrollBtn.style.boxShadow = '0 2px 10px rgba(0,0,0,0.2)';
        scrollBtn.style.transition = 'opacity 0.3s, transform 0.3s';
        
        document.body.appendChild(scrollBtn);
        
        // Show/hide button based on scroll position
        let scrollTimeout;
        window.addEventListener('scroll', () => {
            // Clear the timeout if it has already been set
            clearTimeout(scrollTimeout);
            
            // Set a timeout to run after scrolling ends
            scrollTimeout = setTimeout(() => {
                if (window.scrollY > 300) {
                    scrollBtn.style.display = 'block';
                    setTimeout(() => {
                        scrollBtn.style.opacity = 1;
                        scrollBtn.style.transform = 'translateY(0)';
                    }, 10);
                } else {
                    scrollBtn.style.opacity = 0;
                    scrollBtn.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        scrollBtn.style.display = 'none';
                    }, 300);
                }
            }, 100);
        }, { passive: true });
        
        // Scroll to top when clicked
        scrollBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

/**
 * Accessibility improvements
 */
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
    
    // Improve touch targets for mobile
    const touchTargets = document.querySelectorAll('a, button, .btn, input[type="submit"]');
    touchTargets.forEach(target => {
        // Ensure minimum touch target size
        const rect = target.getBoundingClientRect();
        if (rect.width < 44 || rect.height < 44) {
            target.style.minHeight = '44px';
            target.style.minWidth = '44px';
        }
    });
    
    // Add role attributes where needed
    document.querySelectorAll('.hero').forEach(hero => {
        if (!hero.hasAttribute('role')) {
            hero.setAttribute('role', 'banner');
        }
    });
    
    document.querySelectorAll('footer').forEach(footer => {
        if (!footer.hasAttribute('role')) {
            footer.setAttribute('role', 'contentinfo');
        }
    });
    
    // Add aria-labels to social links
    document.querySelectorAll('.social-links a').forEach(link => {
        const icon = link.querySelector('i');
        if (icon && !link.hasAttribute('aria-label')) {
            const className = Array.from(icon.classList).find(cls => cls.startsWith('fa-'));
            if (className) {
                const socialName = className.replace('fa-', '');
                link.setAttribute('aria-label', `Follow us on ${socialName}`);
            }
        }
    });
}

/**
 * Smooth scroll to element
 * @param {string} targetId - The ID of the target element
 */
function smoothScrollTo(targetId) {
    const targetElement = document.getElementById(targetId);
    
    if (targetElement) {
        window.scrollTo({
            top: targetElement.offsetTop - 100,
            behavior: 'smooth'
        });
    }
}

// Initialize smooth scrolling for anchor links
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('a[href^="#"]:not([href="#"])').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href').substring(1);
            if (targetId) {
                e.preventDefault();
                smoothScrollTo(targetId);
            }
        });
    });
});
