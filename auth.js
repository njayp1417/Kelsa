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
            this.setupTabSwitching();
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

    // Set up tab switching functionality
    setupTabSwitching() {
        const authTabs = document.querySelectorAll('.auth-tab');
        const tabContents = document.querySelectorAll('.auth-tab-content');
        
        authTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const targetTab = tab.getAttribute('data-tab');
                
                // Remove active class from all tabs and contents
                authTabs.forEach(t => t.classList.remove('active'));
                tabContents.forEach(content => content.classList.remove('active'));
                
                // Add active class to clicked tab and corresponding content
                tab.classList.add('active');
                const targetContent = document.getElementById(targetTab + 'Tab');
                if (targetContent) {
                    targetContent.classList.add('active');
                }
            });
        });
    }

    // Set up event listeners for buttons and forms
    setupEventListeners() {
        // Google Sign In/Up buttons
        const googleSignInBtn = document.getElementById('googleSignIn');
        const googleSignUpBtn = document.getElementById('googleSignUp');
        
        if (googleSignInBtn) {
            googleSignInBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.signInWithGoogle();
            });
        }
        
        if (googleSignUpBtn) {
            googleSignUpBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.signInWithGoogle();
            });
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
            
            // Close modal and stay on current page
            setTimeout(() => {
                this.closeModal();
            }, 1500);
            
        } catch (error) {
            console.error('Google sign in error:', error);
            this.showError(this.getErrorMessage(error));
        }
    }

    // Email Link Sign In
    async handleEmailSignIn(e) {
        e.preventDefault();
        
        const email = document.getElementById('loginEmail').value.trim();
        const password = document.getElementById('loginPassword').value.trim();
        
        if (!email) {
            this.showError('Please enter your email address');
            return;
        }

        try {
            if (password) {
                // Sign in with email and password
                this.showLoading('Signing in...');
                await firebase.auth().signInWithEmailAndPassword(email, password);
                this.showSuccess('Successfully signed in!');
                setTimeout(() => this.closeModal(), 1500);
            } else {
                // Send email link
                this.showLoading('Sending sign in link...');
                
                const actionCodeSettings = {
                    url: window.location.origin + window.location.pathname,
                    handleCodeInApp: true,
                };

                await firebase.auth().sendSignInLinkToEmail(email, actionCodeSettings);
                
                // Save email for later use
                localStorage.setItem('emailForSignIn', email);
                
                this.showSuccess('Sign in link sent! Check your email and click the link to sign in.');
            }
            
        } catch (error) {
            console.error('Email sign in error:', error);
            this.showError(this.getErrorMessage(error));
        }
    }

    // Email Link Sign Up
    async handleEmailSignUp(e) {
        e.preventDefault();
        
        const email = document.getElementById('signupEmail').value.trim();
        
        if (!email) {
            this.showError('Please enter your email address');
            return;
        }

        try {
            this.showLoading('Sending sign up link...');
            
            const actionCodeSettings = {
                url: window.location.origin + window.location.pathname,
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
                        
                        // Close modal and stay on current page
                        setTimeout(() => {
                            this.closeModal();
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
            
            // Update UI to show signed out state
            setTimeout(() => {
                // UI will be updated by onAuthStateChanged
            }, 1000);
            
        } catch (error) {
            console.error('Sign out error:', error);
            this.showError('Error signing out');
        }
    }

    // Update UI based on authentication state
    updateUI(user) {
        const loginBtn = document.getElementById('loginBtn');
        const signupBtn = document.getElementById('signupBtn');
        
        if (user) {
            // User is signed in - update buttons to show user info and logout
            if (loginBtn) {
                loginBtn.innerHTML = `<i class="fas fa-user"></i> ${user.displayName || user.email || 'Account'}`;
                loginBtn.onclick = (e) => {
                    e.preventDefault();
                    this.showUserMenu();
                };
            }
            
            if (signupBtn) {
                signupBtn.innerHTML = '<i class="fas fa-sign-out-alt"></i> Sign Out';
                signupBtn.onclick = (e) => {
                    e.preventDefault();
                    this.signOut();
                };
            }
        } else {
            // User is signed out - restore original buttons
            if (loginBtn) {
                loginBtn.innerHTML = '<i class="fas fa-sign-in-alt"></i> Sign In';
                loginBtn.onclick = null;
            }
            
            if (signupBtn) {
                signupBtn.innerHTML = '<i class="fas fa-user-plus"></i> Sign Up';
                signupBtn.onclick = null;
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

    // Close modal helper
    closeModal() {
        const authModal = document.getElementById('authModal');
        if (authModal) {
            authModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    }

    // Show message helper
    showMessage(message, type) {
        const container = document.getElementById('authMessage');
        if (!container) return;

        const icon = type === 'success' ? '<i class="fas fa-check-circle"></i>' :
                    type === 'error' ? '<i class="fas fa-exclamation-circle"></i>' :
                    '<i class="fas fa-spinner fa-spin"></i>';

        container.innerHTML = `${icon} ${message}`;
        container.className = type;
        container.style.display = 'block';

        // Clear message after 5 seconds (except loading)
        if (type !== 'loading') {
            setTimeout(() => {
                if (container) {
                    container.style.display = 'none';
                    container.className = '';
                }
            }, 5000);
        }
    }

    // Get user-friendly error message
    getErrorMessage(error) {
        switch (error.code) {
            case 'auth/user-not-found':
                return 'No account found with this email address.';
            case 'auth/wrong-password':
                return 'Incorrect password. Please try again.';
            case 'auth/invalid-email':
                return 'Please enter a valid email address.';
            case 'auth/user-disabled':
                return 'This account has been disabled.';
            case 'auth/too-many-requests':
                return 'Too many attempts. Please try again later.';
            case 'auth/network-request-failed':
                return 'Network error. Please check your connection.';
            case 'auth/popup-closed-by-user':
                return 'Sign in was cancelled.';
            case 'auth/popup-blocked':
                return 'Popup was blocked. Please allow popups and try again.';
            case 'auth/email-already-in-use':
                return 'An account with this email already exists.';
            case 'auth/weak-password':
                return 'Password should be at least 6 characters.';
            default:
                return error.message || 'An error occurred. Please try again.';
        }
    }
}

// Initialize authentication when page loads
window.kelsaAuth = new KelsaAuth();