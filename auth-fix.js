// Enhanced Authentication Modal Fix
(function() {
    'use strict';
    
    function switchTab(tabName) {
        // Update tab buttons
        document.querySelectorAll('.auth-tab').forEach(t => {
            t.classList.remove('active');
            t.style.color = '#666';
            t.style.borderBottomColor = 'transparent';
        });
        
        const activeTab = document.querySelector(`[data-tab="${tabName}"]`);
        if (activeTab) {
            activeTab.classList.add('active');
            activeTab.style.color = '#1a237e';
            activeTab.style.borderBottomColor = '#ffb300';
        }
        
        // Update tab content
        document.querySelectorAll('.auth-tab-content').forEach(content => {
            content.classList.remove('active');
            content.style.display = 'none';
        });
        
        const targetContent = document.getElementById(tabName + 'Tab');
        if (targetContent) {
            targetContent.classList.add('active');
            targetContent.style.display = 'block';
        }
    }
    
    function initAuth() {
        const authHamburger = document.getElementById('authHamburger');
        const authDropdown = document.getElementById('authDropdown');
        const authModal = document.getElementById('authModal');
        const authClose = document.querySelector('.auth-close');
        const loginBtn = document.getElementById('loginBtn');
        const signupBtn = document.getElementById('signupBtn');
        
        // Tab switching
        document.querySelectorAll('.auth-tab').forEach(tab => {
            tab.addEventListener('click', function() {
                switchTab(this.dataset.tab);
            });
        });
        
        // Hamburger menu
        if (authHamburger && authDropdown) {
            authHamburger.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                authDropdown.classList.toggle('show');
            });
            
            document.addEventListener('click', function(e) {
                if (!authHamburger.contains(e.target)) {
                    authDropdown.classList.remove('show');
                }
            });
        }
        
        // Login button
        if (loginBtn && authModal) {
            loginBtn.addEventListener('click', function(e) {
                e.preventDefault();
                authModal.style.display = 'block';
                document.body.style.overflow = 'hidden';
                authDropdown.classList.remove('show');
                switchTab('login');
            });
        }
        
        // Signup button
        if (signupBtn && authModal) {
            signupBtn.addEventListener('click', function(e) {
                e.preventDefault();
                authModal.style.display = 'block';
                document.body.style.overflow = 'hidden';
                authDropdown.classList.remove('show');
                switchTab('signup');
            });
        }
        
        // Close modal
        if (authClose && authModal) {
            authClose.addEventListener('click', function() {
                authModal.style.display = 'none';
                document.body.style.overflow = 'auto';
            });
        }
        
        // Close on outside click
        if (authModal) {
            authModal.addEventListener('click', function(e) {
                if (e.target === authModal) {
                    authModal.style.display = 'none';
                    document.body.style.overflow = 'auto';
                }
            });
        }
    }
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initAuth);
    } else {
        initAuth();
    }
})();