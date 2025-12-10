// Authentication Modal for Kelsa Events
class AuthModal {
    constructor() {
        this.modal = document.getElementById('authModal');
        this.currentUser = null;
        this.init();
    }

    init() {
        document.addEventListener('DOMContentLoaded', () => {
            this.setupEventListeners();
            this.setupAuthStateListener();
            this.handleEmailLinkSignIn();
            this.addModalStyles();
            this.setupCredentialManager();
        });
    }
    
    // Setup credential management for instant login
    async setupCredentialManager() {
        if ('credentials' in navigator) {
            try {
                const credential = await navigator.credentials.get({
                    password: true,
                    mediation: 'silent'
                });
                
                if (credential && credential.type === 'password') {
                    // Auto-fill saved credentials
                    const emailInput = document.getElementById('loginEmail');
                    const passwordInput = document.getElementById('loginPassword');
                    
                    if (emailInput && passwordInput) {
                        emailInput.value = credential.id;
                        passwordInput.value = credential.password;
                    }
                }
            } catch (error) {
                console.log('Credential manager not available or no saved credentials');
            }
        }
    }

    // Add modal styles
    addModalStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .auth-hamburger {
                position: relative;
                display: inline-block;
            }
            
            .auth-hamburger > i {
                font-size: 1.5rem;
                color: white;
                cursor: pointer;
                padding: 8px;
                border-radius: 50%;
                transition: all 0.3s ease;
                background: rgba(255,255,255,0.1);
            }
            
            .auth-hamburger > i:hover {
                background: rgba(255,255,255,0.2);
                transform: scale(1.1);
            }
            
            .auth-dropdown {
                position: absolute;
                top: 100%;
                right: 0;
                background: white;
                border-radius: 12px;
                box-shadow: 0 8px 25px rgba(0,0,0,0.15);
                min-width: 220px;
                padding: 16px;
                z-index: 1000;
                opacity: 0;
                visibility: hidden;
                transform: translateY(-10px);
                transition: all 0.3s ease;
                margin-top: 8px;
            }
            
            .auth-dropdown.show {
                opacity: 1;
                visibility: visible;
                transform: translateY(0);
            }
            
            .auth-btn {
                display: flex;
                align-items: center;
                gap: 12px;
                padding: 12px 16px;
                color: var(--text);
                text-decoration: none;
                border-radius: 8px;
                transition: background-color 0.2s ease;
                margin-bottom: 8px;
                border: 1px solid #e9ecef;
            }
            
            .auth-btn:hover {
                background-color: #f8f9fa;
            }
            
            .user-info {
                display: flex;
                align-items: center;
                gap: 12px;
                padding: 12px 0;
                border-bottom: 1px solid #e9ecef;
                margin-bottom: 12px;
            }
            
            .avatar-circle {
                width: 40px;
                height: 40px;
                border-radius: 50%;
                background: linear-gradient(135deg, var(--primary), var(--accent));
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                font-weight: 600;
                font-size: 16px;
            }
            
            .user-name {
                font-weight: 500;
                color: var(--text);
            }
            
            .dropdown-item {
                display: flex;
                align-items: center;
                gap: 12px;
                padding: 12px 16px;
                color: var(--text);
                text-decoration: none;
                border-radius: 8px;
                transition: background-color 0.2s ease;
                margin-bottom: 4px;
            }
            
            .dropdown-item:hover {
                background-color: #f8f9fa;
            }
            
            .dropdown-divider {
                height: 1px;
                background-color: #e9ecef;
                margin: 8px 0;
            }
            
            .auth-modal {
                display: none;
                position: fixed;
                z-index: 10000;
                left: 0;
                top: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(0,0,0,0.5);
                backdrop-filter: blur(5px);
            }
            
            .auth-modal-content {
                background-color: white;
                margin: 5% auto;
                padding: 2rem;
                border-radius: 15px;
                width: 90%;
                max-width: 400px;
                position: relative;
                box-shadow: 0 10px 30px rgba(0,0,0,0.3);
                animation: modalSlideIn 0.3s ease;
            }
            
            @keyframes modalSlideIn {
                from { opacity: 0; transform: translateY(-50px); }
                to { opacity: 1; transform: translateY(0); }
            }
            
            .auth-close {
                color: #aaa;
                float: right;
                font-size: 28px;
                font-weight: bold;
                cursor: pointer;
                position: absolute;
                right: 15px;
                top: 10px;
            }
            
            .auth-close:hover {
                color: var(--primary);
            }
            
            .auth-tabs {
                display: flex;
                margin-bottom: 2rem;
                border-bottom: 2px solid #f0f0f0;
            }
            
            .auth-tab {
                flex: 1;
                padding: 1rem;
                border: none;
                background: none;
                cursor: pointer;
                font-size: 1rem;
                font-weight: 500;
                color: #666;
                transition: all 0.3s ease;
            }
            
            .auth-tab.active {
                color: var(--primary);
                border-bottom: 2px solid var(--primary);
            }
            
            .auth-tab-content {
                display: none;
            }
            
            .auth-tab-content.active {
                display: block;
            }
            
            .auth-tab-content h2 {
                text-align: center;
                margin-bottom: 1.5rem;
                color: var(--primary);
            }
            
            .btn-google {
                width: 100%;
                padding: 0.75rem;
                background: #4285f4;
                color: white;
                border: none;
                border-radius: 8px;
                font-size: 1rem;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 0.5rem;
                margin-bottom: 1rem;
                transition: background-color 0.3s ease;
            }
            
            .btn-google:hover {
                background: #3367d6;
            }
            
            .auth-divider {
                text-align: center;
                margin: 1.5rem 0;
                position: relative;
                color: #666;
            }
            
            .auth-divider::before {
                content: '';
                position: absolute;
                top: 50%;
                left: 0;
                right: 0;
                height: 1px;
                background: #e0e0e0;
            }
            
            .auth-divider span {
                background: white;
                padding: 0 1rem;
            }
            
            .form-group {
                margin-bottom: 1rem;
            }
            
            .form-group label {
                display: block;
                margin-bottom: 0.5rem;
                font-weight: 500;
                color: var(--text);
            }
            
            .form-group input {
                width: 100%;
                padding: 0.75rem;
                border: 2px solid #e0e0e0;
                border-radius: 8px;
                font-size: 1rem;
                transition: border-color 0.3s ease;
            }
            
            .form-group input:focus {
                outline: none;
                border-color: var(--primary);
            }
            
            .auth-message {
                padding: 0.75rem;
                border-radius: 8px;
                margin-bottom: 1rem;
                font-size: 0.9rem;
            }
            
            .auth-message.success {
                background: #d4edda;
                color: #155724;
                border: 1px solid #c3e6cb;
            }
            
            .auth-message.error {
                background: #f8d7da;
                color: #721c24;
                border: 1px solid #f5c6cb;
            }
            
            .auth-message.loading {
                background: #d1ecf1;
                color: #0c5460;
                border: 1px solid #bee5eb;
            }
            
            @media (max-width: 768px) {
                .auth-modal-content {
                    margin: 10% auto;
                    padding: 1.5rem;
                }
            }
        `;
        document.head.appendChild(style);
    }

    // Setup event listeners
    setupEventListeners() {
        // Modal open/close
        document.getElementById('loginBtn').addEventListener('click', (e) => {
            e.preventDefault();
            this.openModal('login');
            document.getElementById('authDropdown').classList.remove('show');
        });

        document.getElementById('signupBtn').addEventListener('click', (e) => {
            e.preventDefault();
            this.openModal('signup');
            document.getElementById('authDropdown').classList.remove('show');
        });

        document.querySelector('.auth-close').addEventListener('click', () => {
            this.closeModal();
        });

        // Close modal when clicking outside
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.closeModal();
            }
        });

        // Auth hamburger dropdown
        const authHamburger = document.getElementById('authHamburger');
        const authDropdown = document.getElementById('authDropdown');
        
        if (authHamburger && authDropdown) {
            authHamburger.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                authDropdown.classList.toggle('show');
            });
            
            document.addEventListener('click', (e) => {
                if (!authHamburger.contains(e.target)) {
                    authDropdown.classList.remove('show');
                }
            });
        }

        // Sign out button
        document.addEventListener('click', (e) => {
            if (e.target.id === 'signOutBtn') {
                e.preventDefault();
                this.signOut();
            }
        });

        // Tab switching
        document.querySelectorAll('.auth-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                const tabName = tab.dataset.tab;
                this.switchTab(tabName);
            });
        });

        // Authentication buttons
        document.getElementById('googleSignIn').addEventListener('click', () => this.signInWithGoogle());
        document.getElementById('googleSignUp').addEventListener('click', () => this.signInWithGoogle());

        // Forms
        document.getElementById('emailSignInForm').addEventListener('submit', (e) => this.handleEmailSignIn(e));
        document.getElementById('emailSignUpForm').addEventListener('submit', (e) => this.handleEmailSignUp(e));
    }

    // Setup Firebase auth state listener
    setupAuthStateListener() {
        firebase.auth().onAuthStateChanged((user) => {
            this.currentUser = user;
            this.updateNavigation(user);
        });
    }

    // Open modal
    openModal(tab = 'login') {
        this.modal.style.display = 'block';
        this.switchTab(tab);
        document.body.style.overflow = 'hidden';
    }

    // Close modal
    closeModal() {
        this.modal.style.display = 'none';
        document.body.style.overflow = 'auto';
        this.clearMessage();
    }

    // Switch tabs
    switchTab(tabName) {
        // Update tab buttons
        document.querySelectorAll('.auth-tab').forEach(tab => {
            tab.classList.remove('active');
            tab.style.color = '#666';
            tab.style.borderBottomColor = 'transparent';
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
        
        const targetContent = document.getElementById(`${tabName}Tab`);
        if (targetContent) {
            targetContent.classList.add('active');
            targetContent.style.display = 'block';
        }

        this.clearMessage();
    }

    // Google Sign In
    async signInWithGoogle() {
        try {
            this.showMessage('Signing in with Google...', 'loading');
            
            const provider = new firebase.auth.GoogleAuthProvider();
            provider.addScope('email');
            provider.addScope('profile');
            
            const result = await firebase.auth().signInWithPopup(provider);
            
            this.showMessage('Successfully signed in!', 'success');
            
            setTimeout(() => {
                this.closeModal();
            }, 1500);
            
        } catch (error) {
            console.error('Google sign in error:', error);
            this.showMessage(this.getErrorMessage(error), 'error');
        }
    }

    // Email Sign In with instant login
    async handleEmailSignIn(e) {
        e.preventDefault();
        
        const email = document.getElementById('loginEmail').value.trim();
        const password = document.getElementById('loginPassword')?.value;
        
        if (!email) {
            this.showMessage('Please enter your email address', 'error');
            return;
        }

        try {
            // Try instant login with password if provided
            if (password) {
                this.showMessage('Signing in...', 'loading');
                await firebase.auth().signInWithEmailAndPassword(email, password);
                this.showMessage('Successfully signed in!', 'success');
                setTimeout(() => this.closeModal(), 1500);
                return;
            }
            
            // Fallback to email link
            this.showMessage('Sending sign in link...', 'loading');
            
            const actionCodeSettings = {
                url: window.location.origin + '/index.html',
                handleCodeInApp: true,
            };

            await firebase.auth().sendSignInLinkToEmail(email, actionCodeSettings);
            
            localStorage.setItem('emailForSignIn', email);
            
            this.showMessage('Sign in link sent! Check your email and click the link to sign in.', 'success');
            
        } catch (error) {
            console.error('Email sign in error:', error);
            this.showMessage(this.getErrorMessage(error), 'error');
        }
    }

    // Email Sign Up
    async handleEmailSignUp(e) {
        e.preventDefault();
        
        const email = document.getElementById('signupEmail').value.trim();
        
        if (!email) {
            this.showMessage('Please enter your email address', 'error');
            return;
        }

        try {
            this.showMessage('Sending sign up link...', 'loading');
            
            const actionCodeSettings = {
                url: window.location.origin + '/index.html',
                handleCodeInApp: true,
            };

            await firebase.auth().sendSignInLinkToEmail(email, actionCodeSettings);
            
            localStorage.setItem('emailForSignIn', email);
            
            this.showMessage('Sign up link sent! Check your email and click the link to create your account.', 'success');
            
        } catch (error) {
            console.error('Email sign up error:', error);
            this.showMessage(this.getErrorMessage(error), 'error');
        }
    }

    // Handle email link sign in
    handleEmailLinkSignIn() {
        if (firebase.auth().isSignInWithEmailLink(window.location.href)) {
            let email = localStorage.getItem('emailForSignIn');
            
            if (!email) {
                email = window.prompt('Please provide your email for confirmation');
            }

            if (email) {
                firebase.auth().signInWithEmailLink(email, window.location.href)
                    .then((result) => {
                        localStorage.removeItem('emailForSignIn');
                        this.showMessage('Successfully signed in!', 'success');
                        
                        // Clean URL
                        window.history.replaceState({}, document.title, window.location.pathname);
                    })
                    .catch((error) => {
                        console.error('Email link sign in error:', error);
                        this.showMessage(this.getErrorMessage(error), 'error');
                    });
            }
        }
    }

    // Update navigation based on auth state
    updateNavigation(user) {
        const authSection = document.getElementById('authSection');
        const userSection = document.getElementById('userSection');
        
        if (user) {
            // User is signed in - show user section, hide auth section
            authSection.style.display = 'none';
            userSection.style.display = 'block';
            
            // Update user info
            const avatarCircle = userSection.querySelector('.avatar-circle');
            const userName = userSection.querySelector('.user-name');
            
            const name = user.displayName || user.email || 'User';
            const initials = this.getInitials(name);
            
            avatarCircle.textContent = initials;
            userName.textContent = name.split(' ')[0] || name.split('@')[0];
            
        } else {
            // User is signed out - show auth section, hide user section
            authSection.style.display = 'block';
            userSection.style.display = 'none';
        }
    }
    
    // Get user initials for avatar
    getInitials(name) {
        if (!name) return 'U';
        
        const words = name.split(' ');
        if (words.length >= 2) {
            return (words[0][0] + words[1][0]).toUpperCase();
        }
        return name.charAt(0).toUpperCase();
    }



    // Sign out
    async signOut() {
        try {
            // Close dropdown
            const authDropdown = document.getElementById('authDropdown');
            if (authDropdown) {
                authDropdown.classList.remove('show');
            }
            
            await firebase.auth().signOut();
            this.showMessage('Successfully signed out', 'success');
        } catch (error) {
            console.error('Sign out error:', error);
            this.showMessage('Error signing out', 'error');
        }
    }

    // Show message
    showMessage(message, type) {
        const messageContainer = document.getElementById('authMessage');
        const icon = type === 'success' ? '<i class="fas fa-check-circle"></i>' :
                    type === 'error' ? '<i class="fas fa-exclamation-circle"></i>' :
                    '<i class="fas fa-spinner fa-spin"></i>';

        messageContainer.innerHTML = `
            <div class="auth-message ${type}">
                ${icon} ${message}
            </div>
        `;

        if (type !== 'loading') {
            setTimeout(() => {
                this.clearMessage();
            }, 5000);
        }
    }

    // Clear message
    clearMessage() {
        const messageContainer = document.getElementById('authMessage');
        if (messageContainer) {
            messageContainer.innerHTML = '';
        }
    }

    // Get user-friendly error message
    getErrorMessage(error) {
        switch (error.code) {
            case 'auth/user-not-found':
                return 'No account found with this email address.';
            case 'auth/invalid-email':
                return 'Please enter a valid email address.';
            case 'auth/too-many-requests':
                return 'Too many attempts. Please try again later.';
            case 'auth/network-request-failed':
                return 'Network error. Please check your connection.';
            case 'auth/popup-closed-by-user':
                return 'Sign in was cancelled.';
            case 'auth/popup-blocked':
                return 'Popup was blocked. Please allow popups and try again.';
            case 'auth/unauthorized-domain':
                return 'This domain is not authorized. Please contact support.';
            default:
                return error.message || 'An error occurred. Please try again.';
        }
    }
}

// Initialize authentication modal
window.authModal = new AuthModal();