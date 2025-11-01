import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics"; // 1. Import getAnalytics
import {
  getAuth,
  GoogleAuthProvider,
  PhoneAuthProvider,
  setPersistence,
  indexedDBLocalPersistence,
  browserLocalPersistence,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// --- 1. Load All Configuration from Environment Variables ---
const firebaseConfig = {
  apiKey: process.env.PARCEL_FIREBASE_API_KEY,
  authDomain: process.env.PARCEL_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.PARCEL_FIREBASE_PROJECT_ID,
  storageBucket: process.env.PARCEL_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.PARCEL_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.PARCEL_FIREBASE_APP_ID,
  measurementId: process.env.PARCEL_FIREBASE_MEASUREMENT_ID // 2. Add measurementId here
};

// --- 2. Initialize Firebase App (Singleton Check) ---
let app;
if (typeof window !== 'undefined' && !window._firebaseAppInstance) {
  window._firebaseAppInstance = initializeApp(firebaseConfig);
  app = window._firebaseAppInstance;
} else if (typeof window !== 'undefined') {
  app = window._firebaseAppInstance;
} else {
  app = initializeApp(firebaseConfig);
}

// --- 3. Initialize and Export Firebase Services ---
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();
export const phoneProvider = new PhoneAuthProvider();

// --- 4. Initialize and Export Firebase Analytics ---
let analytics;
// We check if the measurementId is provided before initializing
if (firebaseConfig.measurementId) {
  analytics = getAnalytics(app);
} else {
  console.warn("Firebase Analytics measurementId is not defined in .env. Tracking is disabled.");
}
export { analytics }; // 3. Export the analytics instance

// --- 5. Configure Authentication Persistence ---
setPersistence(auth, indexedDBLocalPersistence)
  .catch((error) => {
    console.warn("Firebase: Could not enable IndexedDB persistence. Falling back.", error.code);
    return setPersistence(auth, browserLocalPersistence);
  })
  .catch((error) => {
    console.error("Firebase: Could not enable any offline persistence.", error.code);
  });

// --- 6. Export the main app instance ---
export { app };