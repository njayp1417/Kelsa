// Centralized Authentication Modal System
(function() {
    'use strict';
    
    // Create and inject authentication modal HTML
    function createAuthModal() {
        const modalHTML = `
            <!-- Authentication Modal -->
            <div id="authModal" class="auth-modal">
                <div class="auth-modal-content">
                    <span class="auth-close">&times;</span>
                    <div class="auth-tabs">
                        <button class="auth-tab active" data-tab="login">Sign In</button>
                        <button class="auth-tab" data-tab="signup">Sign Up</button>
                    </div>
                    
                    <div id="authMessage"></div>
                    
                    <!-- Login Tab -->
                    <div id="loginTab" class="auth-tab-content active">
                        <h2>Welcome Back</h2>
                        <button id="googleSignIn" class="btn-google">
                            <i class="fab fa-google"></i>
                            Continue with Google
                        </button>
                        <div class="auth-divider">
                            <span>or</span>
                        </div>
                        <form id="emailSignInForm">
                            <div class="form-group">
                                <label for="loginEmail">Email Address</label>
                                <input type="email" id="loginEmail" autocomplete="username" required>
                            </div>
                            <div class="form-group">
                                <label for="loginPassword">Password (optional)</label>
                                <input type="password" id="loginPassword" autocomplete="current-password" placeholder="Leave blank for email link">
                            </div>
                            <button type="submit" class="btn" style="width: 100%;">Sign In</button>
                        </form>
                    </div>
                    
                    <!-- Signup Tab -->
                    <div id="signupTab" class="auth-tab-content">
                        <h2>Create Account</h2>
                        <button id="googleSignUp" class="btn-google">
                            <i class="fab fa-google"></i>
                            Continue with Google
                        </button>
                        <div class="auth-divider">
                            <span>or</span>
                        </div>
                        <form id="emailSignUpForm">
                            <div class="form-group">
                                <label for="signupEmail">Email Address</label>
                                <input type="email" id="signupEmail" required>
                            </div>
                            <button type="submit" class="btn" style="width: 100%;">Send Sign Up Link</button>
                        </form>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', modalHTML);
    }
    
    // Initialize authentication functionality
    function initAuthSystem() {
        const authHamburger = document.getElementById('authHamburger');
        const authDropdown = document.getElementById('authDropdown');
        const authModal = document.getElementById('authModal');
        const authClose = document.querySelector('.auth-close');
        const loginBtn = document.getElementById('loginBtn');
        const signupBtn = document.getElementById('signupBtn');
        
        // Hamburger dropdown functionality
        if (authHamburger && authDropdown) {
            authHamburger.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                authDropdown.classList.toggle('show');
                authHamburger.setAttribute('aria-expanded', authDropdown.classList.contains('show'));
            });

            authHamburger.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    e.stopPropagation();
                    authDropdown.classList.toggle('show');
                    authHamburger.setAttribute('aria-expanded', authDropdown.classList.contains('show'));
                }
            });

            document.addEventListener('click', function(e) {
                if (!authHamburger.contains(e.target)) {
                    authDropdown.classList.remove('show');
                    authHamburger.setAttribute('aria-expanded', 'false');
                }
            });
        }
        
        // Login button functionality
        if (loginBtn && authModal) {
            loginBtn.addEventListener('click', function(e) {
                e.preventDefault();
                authModal.style.display = 'block';
                document.body.style.overflow = 'hidden';
                if (authDropdown) authDropdown.classList.remove('show');
                
                // Switch to login tab
                switchToTab('login');
            });
        }
        
        // Signup button functionality
        if (signupBtn && authModal) {
            signupBtn.addEventListener('click', function(e) {
                e.preventDefault();
                authModal.style.display = 'block';
                document.body.style.overflow = 'hidden';
                if (authDropdown) authDropdown.classList.remove('show');
                
                // Switch to signup tab
                switchToTab('signup');
            });
        }
        
        // Modal close functionality
        if (authClose && authModal) {
            authClose.addEventListener('click', function() {
                authModal.style.display = 'none';
                document.body.style.overflow = 'auto';
            });
        }
        
        // Close modal when clicking outside
        if (authModal) {
            authModal.addEventListener('click', function(e) {
                if (e.target === authModal) {
                    authModal.style.display = 'none';
                    document.body.style.overflow = 'auto';
                }
            });
        }
        
        // Tab switching functionality
        const authTabs = document.querySelectorAll('.auth-tab');
        authTabs.forEach(tab => {
            tab.addEventListener('click', function() {
                const targetTab = tab.getAttribute('data-tab');
                switchToTab(targetTab);
            });
        });
    }
    
    // Switch between tabs with animation
    function switchToTab(tabName) {
        const authTabs = document.querySelectorAll('.auth-tab');
        const tabContents = document.querySelectorAll('.auth-tab-content');
        
        // Remove active class from all tabs and contents
        authTabs.forEach(t => t.classList.remove('active'));
        tabContents.forEach(content => content.classList.remove('active'));
        
        // Add active class to target tab and content
        const targetTab = document.querySelector(`.auth-tab[data-tab="${tabName}"]`);
        const targetContent = document.getElementById(tabName + 'Tab');
        
        if (targetTab) targetTab.classList.add('active');
        if (targetContent) targetContent.classList.add('active');
    }
    
    // Initialize when DOM is ready
    function init() {
        createAuthModal();
        initAuthSystem();
    }
    
    // Auto-initialize
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    
    // Export for manual initialization if needed
    window.AuthModal = {
        init: init,
        switchToTab: switchToTab
    };
})();