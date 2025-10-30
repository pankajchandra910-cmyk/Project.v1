import React, { createContext, useState, useEffect, useCallback } from "react";
import { useIsMobile } from "../hooks/use-mobile";
import { Bed, MapPin, Mountain, Car, Users, Home as HomeIcon, Bike } from 'lucide-react';
import { auth, db } from "../firebase";
import { onAuthStateChanged, signOut, signInAnonymously } from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp, collection, query, where, getDocs, writeBatch } from "firebase/firestore";
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
  const [userViewpoints, setUserViewpoints] = useState([]); // Assuming this will be populated later
  const [userRoutes, setUserRoutes] = useState([]);       // Assuming this will be populated later
  const [categories] = useState(categoriesData);

  // App Navigation & Search State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [focusArea, setFocusArea] = useState("");
  const [selectedItemId, setSelectedItemId] = useState("");
  const [selectedDetailType, setSelectedDetailType] = useState("");
  const [selectedLocationId, setSelectedLocationId] = useState(null);
  const [locationDetails, setLocationDetails] = useState(null);

  const isMobile = useIsMobile();

  // --- Core Logic & Data Fetching ---

  /**
   * Fetches user data from Firestore, then updates the global state.
   * Handles registered users, guests, and owners.
   * @param {object} user - The Firebase Auth user object.
   */
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

      const finalUserType = user.isAnonymous ? 'guest' : (userData.userType || 'user');
      setUserType(finalUserType);

      // Determine login platform from Firebase provider data
      const providerId = user.providerData[0]?.providerId || 'anonymous';
      if (user.isAnonymous) setLoginPlatform('Guest');
      else if (providerId.includes('google.com')) setLoginPlatform('Google');
      else if (providerId.includes('phone')) setLoginPlatform('Phone');
      else if (providerId.includes('password')) setLoginPlatform('Email');
      else setLoginPlatform('Unknown'); // Fallback for other potential providers

      if (finalUserType === 'owner') {
        setProfession(userData.profession || "");
        setBusinessAddress(userData.businessAddress || "");
        setLicenseNumber(userData.licenseNumber || "");
        setOwnerId(user.uid);
      } else {
        setOwnerId(null);
      }

      // Populate user-specific data from Firestore document
      setUserVisitedPlaces(userData.visitedPlaces || []);
      setUserRecentBookings(userData.recentBookings || []);
      setUserSavedPlaces(userData.savedPlaces || []);
      // Assuming viewpoints and routes might also be stored here
      setUserViewpoints(userData.viewpoints || []);
      setUserRoutes(userData.routes || []);

    } catch (error) {
      toast.error("Error fetching user profile: " + error.message);
      // console.error("Error fetching user profile:", error);
      // If there's an error, it's safer to log out and reset state
      await signOut(auth);
    }
  };

  /** Resets all user-related state on logout. */
  const resetUserState = useCallback(() => {
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
    setSearchQuery('');
    setSelectedCategory('');
    setFocusArea('');
    setSelectedItemId('');
    setSelectedDetailType('');
    setLocationDetails(null);
    setSelectedLocationId(null);
  }, []);

  /** Main effect to listen for authentication changes. */
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        await fetchAndSetUser(user);
      } else {
        resetUserState(); // Reset state when no user is logged in
      }
      setLoadingUser(false);
    });
    return () => unsubscribe(); // Cleanup subscription on component unmount
  }, [resetUserState]); // Dependency array includes resetUserState

  /** Signs in a user anonymously and creates a guest record in Firestore. */
  const signInAnonymouslyAsGuest = async () => {
    try {
      const userCredential = await signInAnonymously(auth);
      const user = userCredential.user;

      // Create a guest document in Firestore to persist data
      const userDocRef = doc(db, "users", user.uid);
      await setDoc(userDocRef, {
        uid: user.uid,
        displayName: 'Guest User',
        userType: 'guest',
        createdAt: serverTimestamp(),
      }, { merge: true }); // Use merge: true to avoid overwriting if doc exists

      // Set user state after creating the document
      await fetchAndSetUser(user);
      return { success: true };
    } catch (error) {
      toast.error("Anonymous sign-in failed: " + error.message);
      // console.error("Anonymous sign-in failed:", error);
      return { success: false, error: error.message };
    }
  };

  /** Universal function to update a user's profile in Firestore. */
  const updateUserProfileInFirestore = async (updates) => {
    if (!auth.currentUser) {
      toast.error("You must be logged in to update your profile.");
      return false;
    }
    try {
      const userRef = doc(db, "users", auth.currentUser.uid);
      await setDoc(userRef, { ...updates, updatedAt: serverTimestamp() }, { merge: true });
      // Re-fetch user data to ensure all global context states are up-to-date
      await fetchAndSetUser(auth.currentUser);
      return true;
    } catch (error) {
      toast.error("Firestore profile update failed: " + error.message);
      // console.error("Firestore update failed:", error);
      return false;
    }
  };

  /**
   * Reads all listings for a specific owner from Firestore.
   * @param {string} id - The owner's user ID.
   * @returns {Promise<Array>} A promise that resolves to an array of listings.
   */
  const readOwnerListingsRemote = async (id) => {
    if (!id) return [];
    try {
      const q = query(collection(db, "listings"), where("ownerId", "==", id));
      const querySnapshot = await getDocs(q);
      const listings = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      return listings;
    } catch (error) {
      toast.error("Failed to fetch listings from the cloud.");
      // console.error("Firestore read error:", error);
      return [];
    }
  };

  /**
   * Synchronizes the local listings state with Firestore using a batch write.
   * This is for the "Sync" button functionality.
   * @param {Array} listings - The current array of listings from the owner's dashboard.
   * @param {string} id - The owner's user ID.
   * @returns {Promise<boolean>} A promise that resolves to true on success, false on failure.
   */
  const writeOwnerListingsRemote = async (listings, id) => {
    if (!id) {
      toast.error("Owner ID is required to sync listings.");
      return false;
    }
    try {
      const batch = writeBatch(db);
      const listingsCollectionRef = collection(db, "listings");

      // First, fetch existing listings to compare against
      const existingListings = await readOwnerListingsRemote(id);
      const existingIds = new Set(existingListings.map(l => l.id));
      const currentIds = new Set(listings.map(l => l.id));

      // Add or update listings
      for (const listing of listings) {
        // Use listing.id if available, otherwise Firebase will generate one
        const docRef = listing.id ? doc(listingsCollectionRef, listing.id) : doc(listingsCollectionRef);
        batch.set(docRef, { ...listing, ownerId: id, updatedAt: serverTimestamp() }, { merge: true });
      }

      // Delete listings that are no longer in the local state
      for (const oldId of existingIds) {
        if (!currentIds.has(oldId)) {
          const docRef = doc(listingsCollectionRef, oldId);
          batch.delete(docRef);
        }
      }

      await batch.commit();
      toast.success("Listings synchronized with the cloud!");
      return true;
    } catch (error) {
      toast.error("Cloud synchronization failed: " + error.message);
      // console.error("Firestore batch write error:", error);
      return false;
    }
  };

  /** Logs out the current user and resets state. */
  const logout1 = useCallback(async () => {
    try {
      await signOut(auth);
      // resetUserState will be called by onAuthStateChanged listener
      toast.info("You have been logged out.");
    } catch (error) {
      toast.error("Error logging out: " + error.message);
      // console.error("Error logging out:", error);
    }
  }, []);

  // --- Context Value ---
  const contextValue = {
    // Auth & Core User State
    isLoggedIn,
    loadingUser,
    userType,
    ownerId,

    // User Profile State
    userName, setUserName,
    userEmail, setUserEmail,
    userPhone, setUserPhone,
    userPhoneVerified,
    loginPlatform,

    // Owner-specific Profile State
    profession, setProfession,
    businessAddress, setBusinessAddress,
    licenseNumber, setLicenseNumber,

    // App-wide UI State
    language, setLanguage,
    showAIChat, setShowAIChat,
    showMobileMenu, setShowMobileMenu,
    isMobile,

    // User-Specific Data State
    categories,
    userVisitedPlaces,
    userRecentBookings,
    userSavedPlaces,
    userViewpoints,
    userRoutes,

    // App Navigation & Search State
    searchQuery, setSearchQuery,
    selectedCategory, setSelectedCategory,
    focusArea, setFocusArea,
    selectedItemId, setSelectedItemId,
    selectedDetailType, setSelectedDetailType,
    selectedLocationId, setSelectedLocationId,
    locationDetails, setLocationDetails,

    // Functions
    signInAnonymouslyAsGuest,
    updateUserProfileInFirestore,
    logout1, // Renamed from logout1 to logout for clarity
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