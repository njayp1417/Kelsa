// Shared Authentication Module for Kelsa Events
// This module provides consistent authentication across all pages

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCCng5B1NsrAugglmy5au8b8tB2NAEp2lA",
    authDomain: "kelsa-events.firebaseapp.com",
    projectId: "kelsa-events",
    storageBucket: "kelsa-events.firebasestorage.app",
    messagingSenderId: "137881039928",
    appId: "1:137881039928:web:701eb84377311f84c9e2cd"
};

// Initialize Firebase and Auth (will be set when module loads)
let app, auth;

// Initialize Firebase Authentication
async function initializeAuth() {
    try {
        const { initializeApp } = await import("https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js");
        const { getAuth, onAuthStateChanged, signOut, GoogleAuthProvider, signInWithPopup, sendSignInLinkToEmail } = await import("https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js");
        
        app = initializeApp(firebaseConfig);
        auth = getAuth(app);
        
        // Set up auth state listener
        onAuthStateChanged(auth, updateAuthUI);
        
        // Make auth functions globally available
        window.handleGoogleSignIn = handleGoogleSignIn;
        window.handleEmailSignIn = handleEmailSignIn;
        window.handleEmailSignUp = handleEmailSignUp;
        window.showAuthMessage = showAuthMessage;
        window.switchAuthTab = switchAuthTab;
        
        // Initialize UI handlers
        initializeAuthUI();
        
    } catch (error) {
        console.error('Failed to initialize Firebase:', error);
    }
}

// Update authentication UI based on user state
function updateAuthUI(user) {
    const authDropdown = document.getElementById('authDropdown');
    if (!authDropdown) return;

    if (user) {
        // User is logged in
        authDropdown.innerHTML = `
            <div style="padding: 15px; border-bottom: 1px solid #eee; background: #f8f9fc;">
                <strong style="color: #1a237e;">${user.displayName || "User"}</strong><br>
                <small style="color: #757575;">${user.email}</small>
            </div>
            <a href="#" id="logoutBtn"
               style="display: flex; align-items: center; gap: 8px; padding: 12px 16px; color: #d32f2f; text-decoration: none;" 
               onmouseover="this.style.background='#f5f5f5'" onmouseout="this.style.background='white'">
                <i class="fas fa-sign-out-alt"></i> Sign Out
            </a>
        `;

        // Add logout handler
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.onclick = () => signOut(auth);
        }
    } else {
        // User is logged out
        authDropdown.innerHTML = `
            <a href="#" id="loginBtn"
               style="display: flex; align-items: center; gap: 8px; padding: 12px 16px; color: #333; text-decoration: none; border-bottom: 1px solid rgba(0,0,0,0.05);" 
               onmouseover="this.style.background='#f8f9fc'" onmouseout="this.style.background='white'">
                <i class="fas fa-sign-in-alt"></i> Sign In
            </a>
            <a href="#" id="signupBtn"
               style="display: flex; align-items: center; gap: 8px; padding: 12px 16px; color: #333; text-decoration: none;" 
               onmouseover="this.style.background='#f8f9fc'" onmouseout="this.style.background='white'">
                <i class="fas fa-user-plus"></i> Sign Up
            </a>
        `;

        // Add modal handlers
        const loginBtn = document.getElementById('loginBtn');
        const signupBtn = document.getElementById('signupBtn');
        
        if (loginBtn) {
            loginBtn.onclick = (e) => {
                e.preventDefault();
                openAuthModal('login');
            };
        }
        
        if (signupBtn) {
            signupBtn.onclick = (e) => {
                e.preventDefault();
                openAuthModal('signup');
            };
        }
    }
}

// Initialize authentication UI handlers
function initializeAuthUI() {
    // Hamburger dropdown toggle
    const authHamburger = document.getElementById('authHamburger');
    const authDropdown = document.getElementById('authDropdown');
    
    if (authHamburger && authDropdown) {
        authHamburger.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const isVisible = authDropdown.style.opacity === '1';
            if (isVisible) {
                authDropdown.style.opacity = '0';
                authDropdown.style.visibility = 'hidden';
                authDropdown.style.transform = 'translateY(-10px)';
            } else {
                authDropdown.style.opacity = '1';
                authDropdown.style.visibility = 'visible';
                authDropdown.style.transform = 'translateY(0)';
            }
        });
        
        // Close dropdown when clicking outside
        document.addEventListener('click', function(e) {
            if (!authHamburger.contains(e.target) && !authDropdown.contains(e.target)) {
                authDropdown.style.opacity = '0';
                authDropdown.style.visibility = 'hidden';
                authDropdown.style.transform = 'translateY(-10px)';
            }
        });
    }
    
    // Modal close handlers
    const authModal = document.getElementById('authModal');
    const authClose = document.querySelector('.auth-close');
    
    if (authClose && authModal) {
        authClose.addEventListener('click', function() {
            authModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        });
    }
    
    if (authModal) {
        authModal.addEventListener('click', function(e) {
            if (e.target === authModal) {
                authModal.style.display = 'none';
                document.body.style.overflow = 'auto';
            }
        });
    }
}

// Open authentication modal
function openAuthModal(tab = 'login') {
    const authModal = document.getElementById('authModal');
    const authDropdown = document.getElementById('authDropdown');
    
    if (authModal) {
        authModal.style.display = 'block';
        document.body.style.overflow = 'hidden';
        switchAuthTab(tab);
    }
    
    if (authDropdown) {
        authDropdown.style.opacity = '0';
        authDropdown.style.visibility = 'hidden';
        authDropdown.style.transform = 'translateY(-10px)';
    }
}

// Switch authentication tabs
function switchAuthTab(tabName) {
    const authTabs = document.querySelectorAll('.auth-tab');
    const loginTab = document.getElementById('loginTab');
    const signupTab = document.getElementById('signupTab');
    
    authTabs.forEach(tab => {
        if (tab.getAttribute('data-tab') === tabName) {
            tab.style.background = 'white';
            tab.style.color = '#1a237e';
            tab.style.borderBottom = '3px solid #1a237e';
        } else {
            tab.style.background = 'none';
            tab.style.color = '#757575';
            tab.style.borderBottom = 'none';
        }
    });
    
    if (loginTab && signupTab) {
        if (tabName === 'login') {
            loginTab.style.display = 'block';
            signupTab.style.display = 'none';
        } else {
            loginTab.style.display = 'none';
            signupTab.style.display = 'block';
        }
    }
}

// Google Sign In handler
async function handleGoogleSignIn() {
    try {
        showAuthMessage('Signing in with Google...', 'loading');
        
        const { GoogleAuthProvider, signInWithPopup } = await import("https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js");
        const provider = new GoogleAuthProvider();
        provider.addScope('email');
        provider.addScope('profile');
        
        await signInWithPopup(auth, provider);
        
        showAuthMessage('Successfully signed in with Google!', 'success');
        
        setTimeout(() => {
            const authModal = document.getElementById('authModal');
            if (authModal) {
                authModal.style.display = 'none';
                document.body.style.overflow = 'auto';
            }
        }, 1500);
        
    } catch (error) {
        console.error('Google sign in error:', error);
        showAuthMessage(error.message || 'Sign in failed', 'error');
    }
}

// Email Sign In handler
async function handleEmailSignIn(e) {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value.trim();
    if (!email) {
        showAuthMessage('Please enter your email address', 'error');
        return;
    }
    
    try {
        showAuthMessage('Sending sign in link...', 'loading');
        
        const { sendSignInLinkToEmail } = await import("https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js");
        const actionCodeSettings = {
            url: window.location.origin + window.location.pathname,
            handleCodeInApp: true,
        };
        
        await sendSignInLinkToEmail(auth, email, actionCodeSettings);
        localStorage.setItem('emailForSignIn', email);
        showAuthMessage('Sign in link sent! Check your email.', 'success');
        
    } catch (error) {
        console.error('Email sign in error:', error);
        showAuthMessage(error.message || 'Sign in failed', 'error');
    }
}

// Email Sign Up handler
async function handleEmailSignUp(e) {
    e.preventDefault();
    const email = document.getElementById('signupEmail').value.trim();
    if (!email) {
        showAuthMessage('Please enter your email address', 'error');
        return;
    }
    
    try {
        showAuthMessage('Sending sign up link...', 'loading');
        
        const { sendSignInLinkToEmail } = await import("https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js");
        const actionCodeSettings = {
            url: window.location.origin + window.location.pathname,
            handleCodeInApp: true,
        };
        
        await sendSignInLinkToEmail(auth, email, actionCodeSettings);
        localStorage.setItem('emailForSignIn', email);
        showAuthMessage('Sign up link sent! Check your email.', 'success');
        
    } catch (error) {
        console.error('Email sign up error:', error);
        showAuthMessage(error.message || 'Sign up failed', 'error');
    }
}

// Show authentication messages
function showAuthMessage(message, type) {
    const container = document.getElementById('authMessage');
    if (!container) return;
    
    const icon = type === 'success' ? '<i class="fas fa-check-circle"></i>' :
                type === 'error' ? '<i class="fas fa-exclamation-circle"></i>' :
                '<i class="fas fa-spinner fa-spin"></i>';
    
    container.innerHTML = `${icon} ${message}`;
    container.style.display = 'block';
    container.style.background = type === 'success' ? '#d4edda' : type === 'error' ? '#f8d7da' : '#d1ecf1';
    container.style.color = type === 'success' ? '#155724' : type === 'error' ? '#721c24' : '#0c5460';
    container.style.border = `1px solid ${type === 'success' ? '#c3e6cb' : type === 'error' ? '#f5c6cb' : '#bee5eb'}`;
    
    if (type !== 'loading') {
        setTimeout(() => {
            if (container) container.style.display = 'none';
        }, 5000);
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeAuth);
} else {
    initializeAuth();
}