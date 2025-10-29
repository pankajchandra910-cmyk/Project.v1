import React, { createContext, useState, useEffect, useCallback } from "react";
import { useIsMobile } from "../hooks/use-mobile"; // Assuming you have this custom hook
import { Bed, MapPin, Mountain, Car, Users, Home as HomeIcon, Bike } from 'lucide-react';
import { auth, db } from "../firebase"; // Ensure your firebase config is correctly exported
import { onAuthStateChanged, signOut, signInAnonymously } from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { toast } from "sonner";

export const GlobalContext = createContext();

// Mock data, as it was in your example
const categoriesData = [
  { icon: Bed, title: "Hotels & Resorts", description: "Comfortable stays" },
  { icon: MapPin, title: "Places to Visit", description: "Top attractions" },
  { icon: Mountain, title: "Tours & Treks", description: "Adventure trails" },
  { icon: Car, title: "Cabs & Taxis", description: "Local transport" },
  { icon: Users, title: "Local Guides", description: "Expert guidance" },
  { icon: HomeIcon, title: "Hill Stays", description: "Mountain resorts" },
  { icon: Bike, title: "Rental Bikes", description: "Scooters & bikes" },
];

const STORAGE_OWNER_PREFIX = "owner_listings_v3:"; // Using v3 for clarity

const GlobalProvider = ({ children }) => {
  // Authentication & User State
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

  // App UI State
  const [showAIChat, setShowAIChat] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [language, setLanguage] = useState("en");

  // User Data State (examples)
  const [userVisitedPlaces, setUserVisitedPlaces] = useState([]);
  const [userRecentBookings, setUserRecentBookings] = useState([]);
  const [userSavedPlaces, setUserSavedPlaces] = useState([]);
  const [userViewpoints, setUserViewpoints] = useState([]);
  const [userRoutes, setUserRoutes] = useState([]);
  const [categories] = useState(categoriesData);

  const isMobile = useIsMobile(); // Custom hook

  const [selectedLocationId, setSelectedLocationId] = useState(null);
  const [locationDetails, setLocationDetails] = useState(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [focusArea, setFocusArea] = useState("");
  const [selectedItemId, setSelectedItemId] = useState("");
  const [selectedDetailType, setSelectedDetailType] = useState(" ");

  // Fetches user profile from Firestore and populates the context state.
  const fetchAndSetUser = async (user) => {
    if (!user) return;

    try {
      const userDocRef = doc(db, "users", user.uid);
      const userDocSnap = await getDoc(userDocRef);
      const userData = userDocSnap.exists() ? userDocSnap.data() : {};

      setIsLoggedIn(true);
      setUserName(user.displayName || userData.displayName || (user.isAnonymous ? 'Guest User' : 'New User'));
      setUserEmail(user.email || userData.email || "");
      setUserPhone(user.phoneNumber || userData.phoneNumber || "");
      setUserPhoneVerified(!!userData.phoneVerified);
      setLoginPlatform(user.isAnonymous ? 'Guest' : (user.providerData?.[0]?.providerId.includes('google') ? 'Google' : 'Email'));

      const finalUserType = user.isAnonymous ? 'guest' : (userData.userType || 'user');
      setUserType(finalUserType);

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
      toast.error("Error fetching user profile:", error);
      // It's safer to sign out if the profile can't be loaded to avoid a broken state.
      await signOut(auth);
    }
  };

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
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        await fetchAndSetUser(user);
      } else {
        resetUserState();
      }
      setLoadingUser(false);
    });

    return () => unsubscribe();
  }, []);

  // Universal function to update the user's profile in Firestore.
  const updateUserProfileInFirestore = async (updates) => {
    if (!auth.currentUser) {
      toast.error("Update failed: No user is currently logged in.");
      return false;
    }
    try {
      const userRef = doc(db, "users", auth.currentUser.uid);
      // Add `updatedAt` timestamp to every update for tracking.
      await setDoc(userRef, { ...updates, updatedAt: serverTimestamp() }, { merge: true });
      // Re-fetch user data to keep context fresh
      await fetchAndSetUser(auth.currentUser); 
      return true;
    } catch (error) {
      toast.error("Firestore update failed:", error);
      return false;
    }
  };
  
  // Example functions for local/remote storage, can be expanded.
  const getOwnerKey = (id) => `${STORAGE_OWNER_PREFIX}${id || ownerId}`;
  
  // Reads listings from local storage
  const readOwnerListings = (id) => {
      const key = getOwnerKey(id);
      return JSON.parse(localStorage.getItem(key) || '[]');
  };

  // Writes listings to local storage
  const writeOwnerListings = (listings, id) => {
      const key = getOwnerKey(id);
      localStorage.setItem(key, JSON.stringify(listings));
      return true;
  };
  
  // Mock async remote functions for demonstration
  // In a real app, these would interact with your backend/Firestore
  const readOwnerListingsRemote = async (id) => {
    // console.log(`Simulating remote read for owner: ${id}`);
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500)); 
    return readOwnerListings(id); // For now, reads from local storage
  };

  const writeOwnerListingsRemote = async (listings, id) => {
    console.log(`Simulating remote write for owner: ${id}`, listings);
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return writeOwnerListings(listings, id); // For now, writes to local storage
  };

  // Logout function
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

  const contextValue = {
    isLoggedIn,
    loadingUser,
    userType,
    userName, setUserName,
    userEmail, setUserEmail,
    userPhone, setUserPhone,
    userPhoneVerified,
    loginPlatform,
    ownerId,
    profession, setProfession,
    businessAddress, setBusinessAddress,
    licenseNumber, setLicenseNumber,
    updateUserProfileInFirestore,
    language, setLanguage,
    showAIChat, setShowAIChat,
    showMobileMenu, setShowMobileMenu,
    userVisitedPlaces,
    userRecentBookings,
    userSavedPlaces,
    userViewpoints,
    userRoutes,
    categories,
    isMobile,
    // Owner listing functions
    readOwnerListings,
    writeOwnerListings,
    readOwnerListingsRemote,
    writeOwnerListingsRemote,
    logout1,// Renamed from logout1 for clarity
    locationDetails,
     setLocationDetails, 
    selectedLocationId,
     setSelectedLocationId, 
    searchQuery,
     setSearchQuery,
    selectedCategory,
     setSelectedCategory,
    focusArea, 
     setFocusArea,
    selectedItemId, 
     setSelectedItemId,
    selectedDetailType, 
     setSelectedDetailType,

  };

  return (
    <GlobalContext.Provider value={contextValue}>
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalProvider;