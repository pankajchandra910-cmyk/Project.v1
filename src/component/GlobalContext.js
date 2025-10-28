import React, { createContext, useState, useEffect, useCallback } from "react";
import { useIsMobile } from "../hooks/use-mobile";
import { Bed, MapPin, Mountain, Car, Users, Home as HomeIcon, Bike } from 'lucide-react';
import { locationsData, featuredPlaces } from "../assets/dummy"; // Ensure locationsData is imported

// --- Firebase Imports ---
import { auth, db } from "../firebase"; // Assuming firebase.js is in src/
import { onAuthStateChanged, signOut, signInAnonymously } from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";

export const GlobalContext = createContext();

// Mock data (kept as provided, if specific changes are needed here, let me know)
const mockUserData = {
  userName: "",
  userEmail: "",
  userPhone: "",
  loginPlatform: "",
  userType: "",
  isLoggedIn: false,
  userRole: "",

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
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState("");
  const [userType, setUserType] = useState("");
  const [loadingUser, setLoadingUser] = useState(true);

  const [profession, setProfession] = useState("");
  const [language, setLanguage] = useState("en");
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userPhone, setUserPhone] = useState("");
  const [userPhoneVerified, setUserPhoneVerified] = useState(false);
  const [loginPlatform, setLoginPlatform] = useState("");
  const [signupMethod, setSignupMethod] = useState("");

  const [businessAddress, setBusinessAddress] = useState("");
  const [licenseNumber, setLicenseNumber] = useState("");

  const [ownerId, setOwnerId] = useState(null);
  const [onBack, setOnBack] = useState(null);

  const [userVisitedPlaces, setUserVisitedPlaces] = useState(mockUserData.visitedPlaces);
  const [userRecentBookings, setUserRecentBookings] = useState(mockUserData.recentBookings);
  const [userSavedPlaces, setUserSavedPlaces] = useState(mockUserData.savedPlaces);
  const [userViewpoints, setUserViewpoints] = useState(mockUserData.userViewpoints);
  const [userRoutes, setUserRoutes] = useState(mockUserData.userRoutes);
  const [categories, setCategories] = useState(categoriesData);

  const [selectedLocationId, setSelectedLocationId] = useState(null);
  const [locationDetails, setLocationDetails] = useState(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [focusArea, setFocusArea] = useState("");
  const [selectedItemId, setSelectedItemId] = useState("");
  const [selectedDetailType, setSelectedDetailType] = useState(" ");

  const [showAIChat, setShowAIChat] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const isMobile = useIsMobile();
  const [lastAuthError, setLastAuthError] = useState(null);

  const getOwnerKey = (id) => {
    const keyId = id || ownerId || userEmail || userName || "unknown_owner";
    return `${STORAGE_OWNER_PREFIX}${String(keyId).replace(/[^a-z0-9]/gi, "_").toLowerCase()}`;
  };

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
      console.warn("Failed to read owner listings from Firestore:", e);
      return [];
    }
  };

  const writeOwnerListingsRemote = async (listings, id) => {
    try {
      if (!id) throw new Error("ownerId is required to write listings remotely");
      const ownerRef = doc(db, "owners", id);
      await setDoc(ownerRef, { listings, updatedAt: serverTimestamp() }, { merge: true });
      writeOwnerListings(listings, id);
      return true;
    } catch (e) {
      console.warn("Failed to write owner listings to Firestore:", e);
      return false;
    }
  };

  const signInAnonymouslyAsGuest = async () => {
    try {
      const result = await signInAnonymously(auth);
      return { success: true, result };
    } catch (e) {
      console.warn("Anonymous sign-in failed:", e);
      return { success: false, error: e };
    }
  };

  const updateUserProfileInFirestore = async (updates = {}) => {
    try {
      const current = auth.currentUser;
      if (!current) throw new Error("No authenticated user");
      const userRef = doc(db, "users", current.uid);
      const payload = { ...updates, updatedAt: serverTimestamp() };
      await setDoc(userRef, payload, { merge: true });

      // Update local state to reflect changes immediately
      if (updates.displayName || updates.userName) setUserName(updates.displayName || updates.userName);
      if (updates.email) setUserEmail(updates.email);
      if (updates.phoneNumber) setUserPhone(updates.phoneNumber);
      if (typeof updates.phoneVerified !== 'undefined') setUserPhoneVerified(!!updates.phoneVerified);
      if (updates.userType) setUserType(updates.userType);
      if (updates.profession) setProfession(updates.profession);
      if (updates.businessAddress) setBusinessAddress(updates.businessAddress);
      if (updates.licenseNumber) setLicenseNumber(updates.licenseNumber);
      if (updates.signupMethod) setSignupMethod(updates.signupMethod);

      return true;
    } catch (e) {
      console.error("Failed to update user profile in Firestore:", e);
      return false;
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setIsLoggedIn(true);
        setUserName(user.displayName || (user.email ? user.email.split('@')[0] : (user.isAnonymous ? 'Guest' : '')));
        setUserEmail(user.email || "");
        setUserPhone(user.phoneNumber || "");
        
        // Determine login platform more robustly
        let platform = 'Email/Phone';
        if (user.isAnonymous) {
          platform = 'Guest';
        } else if (user.providerData.some(p => p.providerId === 'google.com')) {
          platform = 'Gmail';
        } else if (user.providerData.some(p => p.providerId === 'phone')) {
          platform = 'Phone';
        }
        setLoginPlatform(platform);

        const userDocRef = doc(db, "users", user.uid);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          const userData = userDocSnap.data();
          setUserType(userData.userType || "user");
          setProfession(userData.profession || "");
          setSignupMethod(userData.signupMethod || platform.toLowerCase()); // Use platform as fallback for signup method
          setUserPhoneVerified(!!userData.phoneVerified); // Use explicit value from Firestore

          setUserRole(userData.userType === "owner" ? "owner" : "user");

          if (userData.userType === "owner") {
            setBusinessAddress(userData.businessAddress || "");
            setLicenseNumber(userData.licenseNumber || "");
            setOwnerId(user.uid);
          } else {
            setOwnerId(null);
          }

          setUserVisitedPlaces(userData.visitedPlaces || []);
          setUserRecentBookings(userData.recentBookings || []);
          setUserSavedPlaces(userData.savedPlaces || []);
          setUserViewpoints(userData.userViewpoints || []);
          setUserRoutes(userData.userRoutes || []);

        } else {
          // New user (or old user without a user doc) - create a basic one
          setUserType("user");
          setProfession("");
          setUserRole("user");
          setOwnerId(null);
          setUserPhoneVerified(false);
          
          // Determine initial signup method for new user doc
          let initialSignupMethod = 'unknown';
          if (user.isAnonymous) {
            initialSignupMethod = 'guest';
          } else if (user.providerData?.[0]?.providerId === 'google.com') {
            initialSignupMethod = 'google';
          } else if (user.phoneNumber) {
            initialSignupMethod = 'phone';
          } else if (user.email) {
            initialSignupMethod = 'email';
          }
          setSignupMethod(initialSignupMethod);

          await setDoc(userDocRef, {
            email: user.email || null,
            phoneNumber: user.phoneNumber || null,
            userType: "user",
            profession: "",
            signupMethod: initialSignupMethod,
            phoneVerified: user.phoneNumber && user.phoneNumber.length > 0 ? true : false, // If phone exists at auth level, assume verified for new doc. Adjust if specific verification logic is needed.
            createdAt: serverTimestamp(),
            displayName: user.displayName || null,
          }, { merge: true });
        }
      } else {
        // No user logged in
        setIsLoggedIn(false);
        setUserName("");
        setUserEmail("");
        setUserPhone("");
        setUserPhoneVerified(false);
        setLoginPlatform("");
        setSignupMethod("");
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
      setLoadingUser(false);
    });

    return () => unsubscribe();
  }, []);

  const logout1 = useCallback(async () => {
    try {
      await signOut(auth);
      console.log("User logged out successfully!");
    } catch (error) {
      console.error("Error signing out:", error);
    }
    // Reset all context states upon logout to ensure a clean slate
    setSearchQuery('');
    setSelectedCategory('');
    setFocusArea('');
    setSelectedItemId('');
    setSelectedDetailType('');
    setShowAIChat(false);
    setShowMobileMenu(false);
    setSelectedLocationId(null);
    setLocationDetails(null);
    localStorage.removeItem('authToken'); // Assuming you might have custom tokens
    localStorage.removeItem('userPreferences'); // Any other app-specific storage
    // Ensure all user-specific states are reset
    setIsLoggedIn(false);
    setUserName("");
    setUserEmail("");
    setUserPhone("");
    setUserPhoneVerified(false);
    setLoginPlatform("");
    setSignupMethod("");
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
  }, []);

  useEffect(() => {
    // Ensure ownerId is correctly set/unset based on userType
    if (isLoggedIn && auth.currentUser) {
      if (userType === "owner" && !ownerId) {
          setOwnerId(auth.currentUser.uid);
      } else if (userType !== "owner" && ownerId) {
          setOwnerId(null);
      }
    } else {
      setOwnerId(null); // If not logged in, no ownerId
    }
  }, [userType, ownerId, isLoggedIn, auth.currentUser]);

  const contextValue = {
    isLoggedIn, setIsLoggedIn,
    userType, setUserType,
    userRole, setUserRole,
    profession, setProfession,
    language, setLanguage,
    logout1,
    loadingUser,

    businessAddress, setBusinessAddress,
    licenseNumber, setLicenseNumber,

    userName, setUserName,
    userEmail, setUserEmail,
    userPhone, setUserPhone,
    userPhoneVerified, setUserPhoneVerified,
    loginPlatform, setLoginPlatform,
    signupMethod, setSignupMethod,

    ownerId, setOwnerId,
    onBack, setOnBack,
    getOwnerKey,
    readOwnerListings,
    writeOwnerListings,
    readOwnerListingsRemote,
    writeOwnerListingsRemote,

    signInAnonymouslyAsGuest,

    updateUserProfileInFirestore,

    userVisitedPlaces, setUserVisitedPlaces,
    userRecentBookings, setUserRecentBookings,
    userSavedPlaces, setUserSavedPlaces,
    userViewpoints, setUserViewpoints,
    userRoutes, setUserRoutes,
    categories, setCategories,

    selectedLocationId, setSelectedLocationId,

    searchQuery, setSearchQuery,
    selectedCategory, setSelectedCategory,
    focusArea, setFocusArea,
    selectedItemId, setSelectedItemId,
    selectedDetailType, setSelectedDetailType,

    showAIChat, setShowAIChat,
    showMobileMenu, setShowMobileMenu,
    isMobile,
    locationDetails, setLocationDetails,
    lastAuthError, setLastAuthError
  };

  return (
    <GlobalContext.Provider value={contextValue}>
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalProvider;