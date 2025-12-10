// Authentication JavaScript for Kelsa Events
class KelsaAuth {
    constructor() {
        this.currentUser = null;
        this.init();
    }

    init() {
        // Wait for Firebase to load
        document.addEventListener('DOMContentLoaded', () => {
            this.setupAuthStateListener();
            this.setupEventListeners();
            this.handleEmailLinkSignIn();
        });
    }

    // Listen for authentication state changes
    setupAuthStateListener() {
        firebase.auth().onAuthStateChanged((user) => {
            this.currentUser = user;
            this.updateUI(user);
        });
    }

    // Set up event listeners for buttons and forms
    setupEventListeners() {
        // Google Sign In/Up buttons
        const googleSignInBtn = document.getElementById('googleSignIn');
        const googleSignUpBtn = document.getElementById('googleSignUp');
        
        if (googleSignInBtn) {
            googleSignInBtn.addEventListener('click', () => this.signInWithGoogle());
        }
        
        if (googleSignUpBtn) {
            googleSignUpBtn.addEventListener('click', () => this.signInWithGoogle());
        }

        // Email forms
        const emailSignInForm = document.getElementById('emailSignInForm');
        const emailSignUpForm = document.getElementById('emailSignUpForm');
        
        if (emailSignInForm) {
            emailSignInForm.addEventListener('submit', (e) => this.handleEmailSignIn(e));
        }
        
        if (emailSignUpForm) {
            emailSignUpForm.addEventListener('submit', (e) => this.handleEmailSignUp(e));
        }

        // Logout button (if exists)
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => this.signOut());
        }
    }

    // Google Sign In
    async signInWithGoogle() {
        try {
            this.showLoading('Signing in with Google...');
            
            const provider = new firebase.auth.GoogleAuthProvider();
            provider.addScope('email');
            provider.addScope('profile');
            
            const result = await firebase.auth().signInWithPopup(provider);
            
            this.showSuccess('Successfully signed in with Google!');
            
            // Redirect to dashboard or home page
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1500);
            
        } catch (error) {
            console.error('Google sign in error:', error);
            this.showError(this.getErrorMessage(error));
        }
    }

    // Email Link Sign In
    async handleEmailSignIn(e) {
        e.preventDefault();
        
        const email = document.getElementById('email').value.trim();
        
        if (!email) {
            this.showError('Please enter your email address');
            return;
        }

        try {
            this.showLoading('Sending sign in link...');
            
            const actionCodeSettings = {
                url: window.location.origin + '/login.html',
                handleCodeInApp: true,
            };

            await firebase.auth().sendSignInLinkToEmail(email, actionCodeSettings);
            
            // Save email for later use
            localStorage.setItem('emailForSignIn', email);
            
            this.showSuccess('Sign in link sent! Check your email and click the link to sign in.');
            
        } catch (error) {
            console.error('Email sign in error:', error);
            this.showError(this.getErrorMessage(error));
        }
    }

    // Email Link Sign Up
    async handleEmailSignUp(e) {
        e.preventDefault();
        
        const email = document.getElementById('email').value.trim();
        
        if (!email) {
            this.showError('Please enter your email address');
            return;
        }

        try {
            this.showLoading('Sending sign up link...');
            
            const actionCodeSettings = {
                url: window.location.origin + '/signup.html',
                handleCodeInApp: true,
            };

            await firebase.auth().sendSignInLinkToEmail(email, actionCodeSettings);
            
            // Save email for later use
            localStorage.setItem('emailForSignIn', email);
            
            this.showSuccess('Sign up link sent! Check your email and click the link to create your account.');
            
        } catch (error) {
            console.error('Email sign up error:', error);
            this.showError(this.getErrorMessage(error));
        }
    }

    // Handle email link sign in when user clicks the link
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
                        this.showSuccess('Successfully signed in!');
                        
                        // Redirect to home page
                        setTimeout(() => {
                            window.location.href = 'index.html';
                        }, 1500);
                    })
                    .catch((error) => {
                        console.error('Email link sign in error:', error);
                        this.showError(this.getErrorMessage(error));
                    });
            }
        }
    }

    // Sign out
    async signOut() {
        try {
            await firebase.auth().signOut();
            this.showSuccess('Successfully signed out');
            
            // Redirect to home page
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1000);
            
        } catch (error) {
            console.error('Sign out error:', error);
            this.showError('Error signing out');
        }
    }

    // Update UI based on authentication state
    updateUI(user) {
        // Update navigation
        const loginLink = document.querySelector('a[href="login.html"]');
        const signupLink = document.querySelector('a[href="signup.html"]');
        
        if (user) {
            // User is signed in
            if (loginLink) {
                loginLink.textContent = user.displayName || user.email || 'Account';
                loginLink.href = '#';
                loginLink.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.showUserMenu();
                });
            }
            
            if (signupLink) {
                signupLink.textContent = 'Sign Out';
                signupLink.href = '#';
                signupLink.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.signOut();
                });
            }
        } else {
            // User is signed out
            if (loginLink) {
                loginLink.textContent = 'Login';
                loginLink.href = 'login.html';
            }
            
            if (signupLink) {
                signupLink.textContent = 'Sign Up';
                signupLink.href = 'signup.html';
            }
        }
    }

    // Show user menu (simple implementation)
    showUserMenu() {
        const user = this.currentUser;
        if (!user) return;
        
        const menu = `
            <div style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); z-index: 10000; display: flex; align-items: center; justify-content: center;" onclick="this.remove()">
                <div style="background: white; padding: 2rem; border-radius: 8px; max-width: 300px; width: 90%;" onclick="event.stopPropagation()">
                    <h3 style="margin: 0 0 1rem 0; color: var(--primary);">Account</h3>
                    <p><strong>Name:</strong> ${user.displayName || 'Not provided'}</p>
                    <p><strong>Email:</strong> ${user.email}</p>
                    <button onclick="window.kelsaAuth.signOut(); this.closest('div').remove();" style="background: var(--primary); color: white; border: none; padding: 0.5rem 1rem; border-radius: 4px; cursor: pointer; width: 100%; margin-top: 1rem;">Sign Out</button>
                    <button onclick="this.closest('div').remove();" style="background: #ccc; color: black; border: none; padding: 0.5rem 1rem; border-radius: 4px; cursor: pointer; width: 100%; margin-top: 0.5rem;">Close</button>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', menu);
    }

    // Show loading message
    showLoading(message) {
        this.showMessage(message, 'loading');
    }

    // Show success message
    showSuccess(message) {
        this.showMessage(message, 'success');
    }

    // Show error message
    showError(message) {
        this.showMessage(message, 'error');
    }

    // Show message helper
    showMessage(message, type) {
        const container = document.getElementById('message-container');
        if (!container) return;

        const messageClass = type === 'success' ? 'success-message' : 
                           type === 'error' ? 'error-message' : 'loading-message';
        
        const icon = type === 'success' ? '<i class="fas fa-check-circle"></i>' :
                    type === 'error' ? '<i class="fas fa-exclamation-circle"></i>' :
                    '<i class="fas fa-spinner fa-spin"></i>';

        container.innerHTML = `
            <div class="${messageClass}">
                ${icon} ${message}
            </div>
        `;

        // Clear message after 5 seconds (except loading)
        if (type !== 'loading') {
            setTimeout(() => {
                if (container) container.innerHTML = '';
            }, 5000);
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
            default:
                return error.message || 'An error occurred. Please try again.';
        }
    }
}

// Initialize authentication when page loads
window.kelsaAuth = new KelsaAuth();