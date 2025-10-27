import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  PhoneAuthProvider,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence,
  indexedDBLocalPersistence,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// --- 1. Load Firebase Configuration from Environment Variables (for Parcel) ---
// Parcel requires environment variables to be prefixed with 'PARCEL_' to be
// available in the client-side code.
const firebaseConfig = {
  apiKey: process.env.PARCEL_FIREBASE_API_KEY,
  authDomain: process.env.PARCEL_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.PARCEL_FIREBASE_PROJECT_ID,
  storageBucket: process.env.PARCEL_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.PARCEL_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.PARCEL_FIREBASE_APP_ID,
  measurementId: process.env.PARCEL_FIREBASE_MEASUREMENT_ID, // Optional: if using Google Analytics
};

// --- 2. Initialize Firebase App ---
// Ensure the app is initialized only once.
// Using a global or a check to prevent re-initialization on hot-reloads.
let app;
if (typeof window !== 'undefined' && !window._firebaseAppInstance) { // Check for window to ensure client-side
  window._firebaseAppInstance = initializeApp(firebaseConfig);
  app = window._firebaseAppInstance;
} else if (typeof window !== 'undefined') {
  app = window._firebaseAppInstance;
} else {
  // Fallback for SSR or if window is not defined (unlikely in this context)
  app = initializeApp(firebaseConfig);
}

// --- 3. Initialize Firebase Services ---
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();
export const phoneProvider = new PhoneAuthProvider();

// --- 4. Configure Authentication Persistence for User Experience ---
// This determines how long a user stays logged in.
// We set this persistence immediately after getting the auth instance.
setPersistence(auth, indexedDBLocalPersistence)
  .then(() => {
    // console.log("Firebase Auth persistence set to IndexedDB Local.");
  })
  .catch((error) => {
    console.error("Error setting Firebase Auth persistence (IndexedDB):", error);
    // Fallback to browserLocalPersistence if IndexedDB fails
    return setPersistence(auth, browserLocalPersistence);
  })
  .catch((error) => {
    console.error("Error setting Firebase Auth persistence (browserLocal):", error);
  });

// --- 5. Export for convenience ---
export { app };