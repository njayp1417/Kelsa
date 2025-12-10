// Firebase Configuration for Kelsa Events
const firebaseConfig = {
  apiKey: "AIzaSyCCng5B1NsrAugglmy5au8b8tB2NAEp2lA",
  authDomain: "kelsa-events.firebaseapp.com",
  projectId: "kelsa-events",
  storageBucket: "kelsa-events.firebasestorage.app",
  messagingSenderId: "137881039928",
  appId: "1:137881039928:web:701eb84377311f84c9e2cd"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize Firebase Auth
const auth = firebase.auth();

// Configure auth settings
auth.settings.appVerificationDisabledForTesting = false;