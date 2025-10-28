import React, { createContext, useState, useEffect, useCallback } from "react";
import { useIsMobile } from "../hooks/use-mobile";
import { Bed, MapPin, Mountain, Car, Users, Home as HomeIcon, Bike } from 'lucide-react';
import { locationsData, featuredPlaces } from "../assets/dummy"; // Ensure locationsData is imported

// --- Firebase Imports ---
import { auth, db } from "../firebase"; // Assuming firebase.js is in src/
import { onAuthStateChanged, signOut, signInAnonymously } from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";

export const GlobalContext = createContext();

// Mock User Data (Dynamic part) - This will be the initial state
// Now, most of these will be managed by Firebase and Firestore
const mockUserData = {
  // Common user info
  userName: "", // Will be fetched from Firebase Auth or Firestore
  userEmail: "", // Will be fetched from Firebase Auth
  userPhone: "", // Will be fetched from Firebase Auth or Firestore
  loginPlatform: "",
  userType: "",
  isLoggedIn: false,
  userRole: "",

  // Owner-specific profile data
  businessAddress: "",
  licenseNumber: "",
  visitedPlaces: [],
  recentBookings: [],
  savedPlaces: [],
  userViewpoints: [],
  userRoutes: [],
};

const categoriesData = [
  { icon: Bed, title: "Hotels & Resorts", description: "Comfortable stays" },
  { icon: MapPin, title: "Places to Visit", description: "Top attractions" },
  { icon: Mountain, title: "Tours & Treks", description: "Adventure trails" },
  { icon: Car, title: "Cabs & Taxis", description: "Local transport" },
  { icon: Users, title: "Local Guides", description: "Expert guidance" },
  { icon: HomeIcon, title: "Hill Stays", description: "Mountain resorts" },
  { icon: Bike, title: "Rental Bikes", description: "Scooters & bikes" },
];

const STORAGE_OWNER_PREFIX = "owner_listings_v2:";

const GlobalProvider = ({ children }) => {
  // View and auth
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Managed by Firebase auth state
  const [userRole, setUserRole] = useState("");
  const [userType, setUserType] = useState(""); // Stored in Firestore
  const [loadingUser, setLoadingUser] = useState(true); // New loading state for auth

  // User info
  const [profession, setProfession] = useState(""); // Stored in Firestore
  const [language, setLanguage] = useState("en");
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userPhone, setUserPhone] = useState("");
  const [userPhoneVerified, setUserPhoneVerified] = useState(false); // NEW STATE for phone verification status
  const [loginPlatform, setLoginPlatform] = useState("");
  const [signupMethod, setSignupMethod] = useState(""); // NEW STATE to track original signup method

  // Owner-specific extended profile details (if managed globally)
  const [businessAddress, setBusinessAddress] = useState("");
  const [licenseNumber, setLicenseNumber] = useState("");

  // Owner-specific id
  const [ownerId, setOwnerId] = useState(null);
  const [onBack, setOnBack] = useState(null);

  // Dynamic user data
  const [userVisitedPlaces, setUserVisitedPlaces] = useState(mockUserData.visitedPlaces);
  const [userRecentBookings, setUserRecentBookings] = useState(mockUserData.recentBookings);
  const [userSavedPlaces, setUserSavedPlaces] = useState(mockUserData.savedPlaces);
  const [userViewpoints, setUserViewpoints] = useState(mockUserData.userViewpoints);
  const [userRoutes, setUserRoutes] = useState(mockUserData.userRoutes);
  const [categories, setCategories] = useState(categoriesData);

  // New state for currently selected location ID for details page
  const [selectedLocationId, setSelectedLocationId] = useState(null);
  const [locationDetails, setLocationDetails] = useState(null);

  // Search and selection
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [focusArea, setFocusArea] = useState("");
  const [selectedItemId, setSelectedItemId] = useState("");
  const [selectedDetailType, setSelectedDetailType] = useState(" ");

  // UI state
  const [showAIChat, setShowAIChat] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const isMobile = useIsMobile();
  // Last auth error for dev debugging
  const [lastAuthError, setLastAuthError] = useState(null);

  // Helper: derive owner storage key
  const getOwnerKey = (id) => {
    const keyId = id || ownerId || userEmail || userName || "unknown_owner";
    return `${STORAGE_OWNER_PREFIX}${String(keyId).replace(/[^a-z0-9]/gi, "_").toLowerCase()}`;
  };

  // Helpers to read/write owner-scoped listings (frontend localStorage)
  const readOwnerListings = (id) => {
    try {
      const raw = localStorage.getItem(getOwnerKey(id));
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      console.error("Failed to parse owner listings from localStorage:", e);
      return [];
    }
  };

  const writeOwnerListings = (listings, id) => {
    try {
      localStorage.setItem(getOwnerKey(id), JSON.stringify(listings));
      return true;
    } catch (e) {
      console.error("Failed to write owner listings to localStorage:", e);
      return false;
    }
  };

  // Firestore-backed owner listings helpers (async)
  const readOwnerListingsRemote = async (id) => {
    try {
      if (!id) return [];
      const ownerRef = doc(db, "owners", id);
      const snap = await getDoc(ownerRef);
      if (snap.exists()) {
        const data = snap.data();
        return data.listings || [];
      }
      return [];
    } catch (e) {
      // Log as a warning because remote Firestore may be unavailable or blocked by rules
      // and this is an expected fallback case; avoid surfacing as a dev-overlay error.
      console.warn("Failed to read owner listings from Firestore:", e);
      return [];
    }
  };

  const writeOwnerListingsRemote = async (listings, id) => {
    try {
      if (!id) throw new Error("ownerId is required to write listings remotely");
      const ownerRef = doc(db, "owners", id);
      await setDoc(ownerRef, { listings, updatedAt: serverTimestamp() }, { merge: true });
      // also cache locally
      writeOwnerListings(listings, id);
      return true;
    } catch (e) {
      // Log as a warning for the same reason as read: avoid triggering dev-overlay for expected failures
      console.warn("Failed to write owner listings to Firestore:", e);
      return false;
    }
  };

  // Convenience: sign in anonymously (guest) and ensure a users doc exists
  const signInAnonymouslyAsGuest = async () => {
    try {
      const result = await signInAnonymously(auth);
      // onAuthStateChanged will create user doc if missing
      return { success: true, result };
    } catch (e) {
      // Use warn to avoid dev-overlay for expected auth config problems (e.g., anonymous disabled)
      console.warn("Anonymous sign-in failed:", e);
      // Return a safe failure result instead of throwing so callers can handle gracefully
      return { success: false, error: e };
    }
  };

  // Update the current user's Firestore profile with provided fields and keep context in sync
  const updateUserProfileInFirestore = async (updates = {}) => {
    try {
      const current = auth.currentUser;
      if (!current) throw new Error("No authenticated user");
      const userRef = doc(db, "users", current.uid);
      const payload = { ...updates, updatedAt: serverTimestamp() };
      await setDoc(userRef, payload, { merge: true });

      // Update local context state for common fields
      if (updates.displayName || updates.userName) setUserName(updates.displayName || updates.userName);
      if (updates.email) setUserEmail(updates.email);
      if (updates.phoneNumber) setUserPhone(updates.phoneNumber);
      if (typeof updates.phoneVerified !== 'undefined') setUserPhoneVerified(!!updates.phoneVerified); // Update new phone verified state
      if (updates.userType) setUserType(updates.userType);
      if (updates.profession) setProfession(updates.profession);
      if (updates.businessAddress) setBusinessAddress(updates.businessAddress);
      if (updates.licenseNumber) setLicenseNumber(updates.licenseNumber);
      if (updates.signupMethod) setSignupMethod(updates.signupMethod); // Update new signup method state

      return true;
    } catch (e) {
      console.error("Failed to update user profile in Firestore:", e);
      return false;
    }
  };

  // --- Firebase Auth State Listener & Firestore User Data Fetching ---
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // User is signed in.
        setIsLoggedIn(true);
        setUserName(user.displayName || (user.email ? user.email.split('@')[0] : (user.isAnonymous ? 'Guest' : '')));
        setUserEmail(user.email || "");
        setUserPhone(user.phoneNumber || "");
        setLoginPlatform(user.isAnonymous ? 'Guest' : (user.providerData[0]?.providerId === 'google.com' ? 'Gmail' : 'Email/Phone'));

        // Fetch additional user data from Firestore
        const userDocRef = doc(db, "users", user.uid);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          const userData = userDocSnap.data();
          setUserType(userData.userType || "user");
          setProfession(userData.profession || "");
          setSignupMethod(userData.signupMethod || "");
          setUserPhoneVerified(!!userData.phoneVerified); // Set phone verified status from Firestore
          setUserRole(userData.userType === "owner" ? "owner" : "user"); // Simple role mapping

          // Set owner-specific data if applicable
          if (userData.userType === "owner") {
            setBusinessAddress(userData.businessAddress || "");
            setLicenseNumber(userData.licenseNumber || "");
            setOwnerId(user.uid); // Use Firebase UID as ownerId
          } else {
            setOwnerId(null);
          }

          // You can also load more specific user profile data here from Firestore
          setUserVisitedPlaces(userData.visitedPlaces || []);
          setUserRecentBookings(userData.recentBookings || []);
          setUserSavedPlaces(userData.savedPlaces || []);
          setUserViewpoints(userData.userViewpoints || []);
          setUserRoutes(userData.userRoutes || []);

        } else {
          // New user or existing user without Firestore profile.
          // Set defaults or prompt for details.
          setUserType("user");
          setProfession("");
          setUserRole("user");
          setOwnerId(null);
          setUserPhoneVerified(false); // Default to false for new users
          // Set a default Firestore document for the user if it doesn't exist
          await setDoc(userDocRef, {
            email: user.email || null,
            userType: "user", // Default
            profession: "",    // Default
            signupMethod: user.isAnonymous ? 'guest' : (user.providerData?.[0]?.providerId === 'google.com' ? 'google' : (user.phoneNumber ? 'phone' : 'email')), // Infer signup method
            phoneVerified: user.phoneNumber && user.phoneNumber.length > 0 ? false : false, // Phone is present but needs explicit verification
            createdAt: serverTimestamp(),
          }, { merge: true });
        }
      } else {
        // User is signed out.
        setIsLoggedIn(false);
        setUserName("");
        setUserEmail("");
        setUserPhone("");
        setUserPhoneVerified(false); // Clear on logout
        setLoginPlatform("");
        setSignupMethod(""); // Clear on logout
        setUserType("");
        setProfession("");
        setUserRole("");
        setBusinessAddress("");
        setLicenseNumber("");
        setOwnerId(null);
        setUserVisitedPlaces([]);
        setUserRecentBookings([]);
        setUserSavedPlaces([]);
        setUserViewpoints([]);
        setUserRoutes([]);
      }
      setLoadingUser(false); // Auth state and user data loaded
    });

    return () => unsubscribe();
  }, []); // Run only once on component mount

  const logout1 = useCallback(async () => {
    try {
      await signOut(auth);
      // All states will be cleared by the onAuthStateChanged listener
      console.log("User logged out successfully!");
    } catch (error) {
      console.error("Error signing out:", error);
    }
    // Clear other non-auth related local states if necessary
    setSearchQuery('');
    setSelectedCategory('');
    setFocusArea('');
    setSelectedItemId('');
    setSelectedDetailType('');
    setShowAIChat(false);
    setShowMobileMenu(false);
    setSelectedLocationId(null);
    setLocationDetails(null);
    localStorage.removeItem('authToken');
    localStorage.removeItem('userPreferences');
  }, []);

  // Effect to infer and set ownerId when userType changes or user info is available
  useEffect(() => {
    if (userType === "owner" && !ownerId && isLoggedIn && auth.currentUser) {
        setOwnerId(auth.currentUser.uid); // Use Firebase UID as ownerId
    } else if (userType !== "owner" && ownerId) {
        setOwnerId(null);
    }
  }, [userType, ownerId, isLoggedIn, auth.currentUser]);


  // Bundle all state into context
  const contextValue = {
    // auth & user
    isLoggedIn, setIsLoggedIn,
    userType, setUserType,
    userRole, setUserRole,
    profession, setProfession,
    language, setLanguage,
    logout1, 
    loadingUser, // New: indicates if auth state is still being loaded

    // Owner-specific extended profile details
    businessAddress, setBusinessAddress,
    licenseNumber, setLicenseNumber,

    // user info
    userName, setUserName,
    userEmail, setUserEmail,
    userPhone, setUserPhone,
    userPhoneVerified, setUserPhoneVerified, // Expose phone verification status
    loginPlatform, setLoginPlatform,
    signupMethod, setSignupMethod, // Expose signup method

    // owner support
    ownerId, setOwnerId,
    onBack, setOnBack,
    getOwnerKey,
    readOwnerListings,
    writeOwnerListings,
    // Remote Firestore-backed helpers
    readOwnerListingsRemote,
    writeOwnerListingsRemote,

    // Guest sign-in helper
    signInAnonymouslyAsGuest,

    // Profile updater
    updateUserProfileInFirestore,

    // dynamic profile data
    userVisitedPlaces, setUserVisitedPlaces,
    userRecentBookings, setUserRecentBookings,
    userSavedPlaces, setUserSavedPlaces,
    userViewpoints, setUserViewpoints,
    userRoutes, setUserRoutes,
    categories, setCategories,

    // New: Selected Location ID for dynamic details pages
    selectedLocationId, setSelectedLocationId,

    // search & UI
    searchQuery, setSearchQuery,
    selectedCategory, setSelectedCategory,
    focusArea, setFocusArea,
    selectedItemId, setSelectedItemId,
    selectedDetailType, setSelectedDetailType,

    showAIChat, setShowAIChat,
    showMobileMenu, setShowMobileMenu,
    isMobile,
    locationDetails, setLocationDetails,
    // dev/debug
    lastAuthError, setLastAuthError
  };

  return (
    <GlobalContext.Provider value={contextValue}>
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalProvider;