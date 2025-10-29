import React, { createContext, useState, useEffect, useCallback } from "react";
import { useIsMobile } from "../hooks/use-mobile";
import { Bed, MapPin, Mountain, Car, Users, Home as HomeIcon, Bike } from 'lucide-react';
import { auth, db } from "../firebase";
import { onAuthStateChanged, signOut, signInAnonymously } from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { toast } from "sonner";

export const GlobalContext = createContext();

// --- Static Data ---
const categoriesData = [
  { icon: Bed, title: "Hotels & Resorts", description: "Comfortable stays" },
  { icon: MapPin, title: "Places to Visit", description: "Top attractions" },
  { icon: Mountain, title: "Tours & Treks", description: "Adventure trails" },
  { icon: Car, title: "Cabs & Taxis", description: "Local transport" },
  { icon: Users, title: "Local Guides", description: "Expert guidance" },
  { icon: HomeIcon, title: "Hill Stays", description: "Mountain resorts" },
  { icon: Bike, title: "Rental Bikes", description: "Scooters & bikes" },
];

const STORAGE_OWNER_PREFIX = "owner_listings_v3:";

// --- Global Provider Component ---
const GlobalProvider = ({ children }) => {
  // --- State Management ---

  // Authentication & Core User State
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loadingUser, setLoadingUser] = useState(true);
  const [userType, setUserType] = useState(""); // 'user', 'owner', 'guest'
  const [ownerId, setOwnerId] = useState(null);

  // User Profile State
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userPhone, setUserPhone] = useState("");
  const [userPhoneVerified, setUserPhoneVerified] = useState(false);
  const [loginPlatform, setLoginPlatform] = useState("");

  // Owner-specific Profile State
  const [profession, setProfession] = useState("");
  const [businessAddress, setBusinessAddress] = useState("");
  const [licenseNumber, setLicenseNumber] = useState("");

  // App-wide UI State
  const [showAIChat, setShowAIChat] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [language, setLanguage] = useState("en");

  // User-Specific Data State
  const [userVisitedPlaces, setUserVisitedPlaces] = useState([]);
  const [userRecentBookings, setUserRecentBookings] = useState([]);
  const [userSavedPlaces, setUserSavedPlaces] = useState([]);
  const [userViewpoints, setUserViewpoints] = useState([]);
  const [userRoutes, setUserRoutes] = useState([]);
  const [categories] = useState(categoriesData);

  // App Navigation & Search State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [focusArea, setFocusArea] = useState("");
  const [selectedItemId, setSelectedItemId] = useState("");
  const [selectedDetailType, setSelectedDetailType] = useState(" ");
  const [selectedLocationId, setSelectedLocationId] = useState(null);
  const [locationDetails, setLocationDetails] = useState(null);

  const isMobile = useIsMobile();

  // --- Core Logic & Data Fetching ---

  /**
   * Fetches user data from Firestore or identifies a guest, then updates the global state.
   * @param {object} user - The Firebase Auth user object.
   */
  const fetchAndSetUser = async (user) => {
    if (!user) return;
    try {
      let userData = {};
      if (!user.isAnonymous) {
        const userDocRef = doc(db, "users", user.uid);
        const userDocSnap = await getDoc(userDocRef);
        userData = userDocSnap.exists() ? userDocSnap.data() : {};
      }

      setIsLoggedIn(true);
      setUserName(user.displayName || userData.displayName || (user.isAnonymous ? 'Guest User' : 'New User'));
      setUserEmail(user.email || userData.email || "");
      setUserPhone(user.phoneNumber || userData.phoneNumber || "");
      setUserPhoneVerified(!!userData.phoneVerified);

      const finalUserType = user.isAnonymous ? 'guest' : (userData.userType || 'user');
      setUserType(finalUserType);
      
      const providerId = user.providerData[0]?.providerId || 'anonymous';
      if (user.isAnonymous) setLoginPlatform('Guest');
      else if (providerId.includes('google.com')) setLoginPlatform('Google');
      else if (providerId.includes('phone')) setLoginPlatform('Phone');
      else if (providerId.includes('password')) setLoginPlatform('Email');

      if (finalUserType === 'owner') {
        setProfession(userData.profession || "");
        setBusinessAddress(userData.businessAddress || "");
        setLicenseNumber(userData.licenseNumber || "");
        setOwnerId(user.uid);
      } else {
        setOwnerId(null);
      }
      
      setUserVisitedPlaces(userData.visitedPlaces || []);
      setUserRecentBookings(userData.recentBookings || []);
      setUserSavedPlaces(userData.savedPlaces || []);

    } catch (error) {
      toast.error("Error fetching user profile:", error.message);
      await signOut(auth);
    }
  };

  /** Resets all user-related state on logout. */
  const resetUserState = () => {
    setIsLoggedIn(false);
    setUserName("");
    setUserEmail("");
    setUserPhone("");
    setUserPhoneVerified(false);
    setLoginPlatform("");
    setUserType("");
    setProfession("");
    setBusinessAddress("");
    setLicenseNumber("");
    setOwnerId(null);
    setUserVisitedPlaces([]);
    setUserRecentBookings([]);
    setUserSavedPlaces([]);
    setUserViewpoints([]);
    setUserRoutes([]);
  };

  /** Main effect to listen for authentication changes. */
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) await fetchAndSetUser(user);
      else resetUserState();
      setLoadingUser(false);
    });
    return () => unsubscribe();
  }, []);

  /** Signs in a user anonymously to create a guest session. */
  const signInAnonymouslyAsGuest = async () => {
    try {
      await signInAnonymously(auth);
      return { success: true };
    } catch (error) {
      console.error("Anonymous sign-in failed:", error);
      return { success: false, error: error.message };
    }
  };

  /** Universal function to update a user's profile in Firestore. */
  const updateUserProfileInFirestore = async (updates) => {
    if (!auth.currentUser || auth.currentUser.isAnonymous) {
      toast.error("Guests cannot update profiles.");
      return false;
    }
    try {
      const userRef = doc(db, "users", auth.currentUser.uid);
      await setDoc(userRef, { ...updates, updatedAt: serverTimestamp() }, { merge: true });
      await fetchAndSetUser(auth.currentUser);
      return true;
    } catch (error) {
      toast.error("Firestore update failed:", error.message);
      return false;
    }
  };
  
  // Functions for managing owner listings in local storage (can be replaced with Firestore).
  const getOwnerKey = (id) => `${STORAGE_OWNER_PREFIX}${id || ownerId}`;
  const readOwnerListings = (id) => JSON.parse(localStorage.getItem(getOwnerKey(id)) || '[]');
  const writeOwnerListings = (listings, id) => {
    localStorage.setItem(getOwnerKey(id), JSON.stringify(listings));
    return true;
  };
  const readOwnerListingsRemote = async (id) => {
    await new Promise(resolve => setTimeout(resolve, 500)); 
    return readOwnerListings(id);
  };
  const writeOwnerListingsRemote = async (listings, id) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return writeOwnerListings(listings, id);
  };

  /** Logs out the current user and resets state. */
  const logout1 = useCallback(async () => {
    await signOut(auth);
    setSearchQuery('');
    setSelectedCategory('');
    setFocusArea('');
    setSelectedItemId('');
    setSelectedDetailType('');
    setLocationDetails(null);
    setSelectedLocationId(null);
  }, []);

  // --- Context Value ---
  const contextValue = {
    isLoggedIn, loadingUser, userType, userName, setUserName, userEmail, setUserEmail, userPhone, setUserPhone,
    userPhoneVerified, loginPlatform, ownerId, profession, setProfession, businessAddress, setBusinessAddress,
    licenseNumber, setLicenseNumber, language, setLanguage, showAIChat, setShowAIChat, showMobileMenu, setShowMobileMenu,
    isMobile, categories, userVisitedPlaces, userRecentBookings, userSavedPlaces, userViewpoints, userRoutes,
    searchQuery, setSearchQuery, selectedCategory, setSelectedCategory, focusArea, setFocusArea, selectedItemId,
    setSelectedItemId, selectedDetailType, setSelectedDetailType, selectedLocationId, setSelectedLocationId,
    locationDetails, setLocationDetails,
    // Functions
    signInAnonymouslyAsGuest,
    updateUserProfileInFirestore,
    logout1,
    readOwnerListings,
    writeOwnerListings,
    readOwnerListingsRemote,
    writeOwnerListingsRemote,
  };

  return (
    <GlobalContext.Provider value={contextValue}>
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalProvider;