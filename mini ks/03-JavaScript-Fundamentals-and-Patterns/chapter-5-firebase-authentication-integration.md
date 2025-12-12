# Chapter 5: Firebase Authentication Integration
## Simple Authentication for Static Websites

---

## 5.1 Firebase Setup for Kelsa Events

```javascript
// Firebase initialization and configuration
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { 
  getAuth, 
  onAuthStateChanged, 
  signOut, 
  GoogleAuthProvider, 
  signInWithPopup, 
  sendSignInLinkToEmail 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyCCng5B1NsrAugglmy5au8b8tB2NAEp2lA",
  authDomain: "kelsa-events.firebaseapp.com",
  projectId: "kelsa-events",
  storageBucket: "kelsa-events.firebasestorage.app",
  messagingSenderId: "137881039928",
  appId: "1:137881039928:web:701eb84377311f84c9e2cd"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
```

**IMPLEMENTATION OVERVIEW:**

The Kelsa Events website uses Firebase Authentication for simple user sign-in functionality. This implementation focuses on Google OAuth and email link authentication for customer inquiries and event bookings.

### 5.1.1 Google Sign-In Implementation

```javascript
// Simple Google OAuth implementation
window.handleGoogleSignIn = async function() {
    try {
        showAuthMessage('Signing in with Google...', 'loading');
        const provider = new GoogleAuthProvider();
        provider.addScope('email');
        provider.addScope('profile');
        await signInWithPopup(auth, provider);
        showAuthMessage('Successfully signed in!', 'success');
        setTimeout(() => closeAuthModal(), 1500);
    } catch (error) {
        console.error('Google sign in error:', error);
        showAuthMessage(error.message || 'Sign in failed', 'error');
    }
};
```

**GOOGLE OAUTH FLOW:**
1. User clicks "Sign in with Google" button
2. Firebase opens Google OAuth popup
3. User grants permissions
4. Firebase receives authentication token
5. User is signed in and modal closes

### 5.1.2 Email Link Authentication

```javascript
// Passwordless email sign-in
window.handleEmailSignIn = async function(e) {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value.trim();
    if (!email) {
        showAuthMessage('Please enter your email address', 'error');
        return;
    }
    try {
        showAuthMessage('Sending sign in link...', 'loading');
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
};
```

## 5.2 Authentication State Management

```javascript
// Simple auth state listener
onAuthStateChanged(auth, user => {
    const authDropdown = document.getElementById('authDropdown');
    if (!authDropdown) return;
    
    if (user) {
        // User is signed in - show user info and sign out option
        authDropdown.innerHTML = `
            <div style="padding: 15px; border-bottom: 1px solid #eee; background: #f8f9fc;">
                <strong style="color: #1a237e;">${user.displayName || "User"}</strong><br>
                <small style="color: #757575;">${user.email}</small>
            </div>
            <a href="#" onclick="handleSignOut(event)"
               style="display: flex; align-items: center; gap: 8px; padding: 12px 16px; color: #d32f2f; text-decoration: none;" 
               onmouseover="this.style.background='#f5f5f5'" onmouseout="this.style.background='white'">
                <i class="fas fa-sign-out-alt"></i> Sign Out
            </a>
        `;
    } else {
        // User is signed out - show sign in options
        authDropdown.innerHTML = `
            <a href="#" onclick="openAuthModal('login'); return false;"
               style="display: flex; align-items: center; gap: 8px; padding: 12px 16px; color: #333; text-decoration: none; border-bottom: 1px solid rgba(0,0,0,0.05);" 
               onmouseover="this.style.background='#f8f9fc'" onmouseout="this.style.background='white'">
                <i class="fas fa-sign-in-alt"></i> Sign In
            </a>
            <a href="#" onclick="openAuthModal('signup'); return false;"
               style="display: flex; align-items: center; gap: 8px; padding: 12px 16px; color: #333; text-decoration: none;" 
               onmouseover="this.style.background='#f8f9fc'" onmouseout="this.style.background='white'">
                <i class="fas fa-user-plus"></i> Sign Up
            </a>
        `;
    }
});
```

## 5.3 Sign Out Functionality

```javascript
// Simple sign out
window.handleSignOut = async function(event) {
    if (event) event.preventDefault();
    try {
        const authDropdown = document.getElementById('authDropdown');
        if (authDropdown) {
            authDropdown.style.opacity = '0';
            authDropdown.style.visibility = 'hidden';
            authDropdown.style.transform = 'translateY(-10px)';
        }
        await signOut(auth);
    } catch (error) {
        console.error('Sign out error:', error);
    }
};
```

## 5.4 Modal Management

```javascript
// Authentication modal functions
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
```

This simplified Firebase authentication implementation provides the essential functionality needed for the Kelsa Events website without unnecessary complexity.