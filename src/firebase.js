import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  PhoneAuthProvider,
  setPersistence,
  browserLocalPersistence,
  indexedDBLocalPersistence,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// --- 1. Load Firebase Configuration from Environment Variables (for Parcel) ---
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
let app;
if (typeof window !== 'undefined' && !window._firebaseAppInstance) {
  window._firebaseAppInstance = initializeApp(firebaseConfig);
  app = window._firebaseAppInstance;
} else if (typeof window !== 'undefined') {
  app = window._firebaseAppInstance;
} else {
  app = initializeApp(firebaseConfig);
}

// --- 3. Initialize Firebase Services ---
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();
// PhoneAuthProvider is still useful for creating phone credentials if needed for linking,
// even if not directly used with RecaptchaVerifier for initial sign-in.
export const phoneProvider = new PhoneAuthProvider(); 

// --- 4. Configure Authentication Persistence for User Experience ---
setPersistence(auth, indexedDBLocalPersistence)
  .then(() => {
    console.log("Firebase Auth persistence set to IndexedDB Local.");
  })
  .catch((error) => {
    console.error("Error setting Firebase Auth persistence (IndexedDB):", error);
    // Fallback to browserLocalPersistence if IndexedDB fails
    return setPersistence(auth, browserLocalPersistence)
      .then(() => console.log("Firebase Auth persistence fell back to browserLocalPersistence."))
      .catch((fallbackError) => {
        console.error("Error setting Firebase Auth persistence (browserLocal):", fallbackError);
      });
  });

// --- 5. Export for convenience ---
export { app };