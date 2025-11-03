import React, { createContext, useState, useEffect, useCallback } from "react";
import { analytics } from "../firebase";
import { setUserId, logEvent } from "firebase/analytics";

import { useIsMobile } from "../hooks/use-mobile";
import { Bed, MapPin, Mountain, Car, Users, Home as HomeIcon, Bike } from 'lucide-react';
import { auth, db } from "../firebase";
import { onAuthStateChanged, signOut, signInAnonymously } from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp, collection, query, where, getDocs, writeBatch } from "firebase/firestore";
import { toast } from "sonner";

export const GlobalContext = createContext();

const categoriesData = [
  { icon: Bed, title: "Hotels & Resorts", description: "Comfortable stays" },
  { icon: MapPin, title: "Places to Visit", description: "Top attractions" },
  { icon: Mountain, title: "Tours & Treks", description: "Adventure trails" },
  { icon: Car, title: "Cabs & Taxis", description: "Local transport" },
  { icon: Users, title: "Local Guides", description: "Expert guidance" },
  { icon: HomeIcon, title: "Hill Stays", description: "Mountain resorts" },
  { icon: Bike, title: "Rental Bikes", description: "Scooters & bikes" },
];

const GlobalProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loadingUser, setLoadingUser] = useState(true);
  const [userType, setUserType] = useState(""); // 'user', 'owner', 'guest' - This will now directly store the guest's chosen role
  const [ownerId, setOwnerId] = useState(null);

  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userPhone, setUserPhone] = useState("");
  const [userPhoneVerified, setUserPhoneVerified] = useState(false);
  const [loginPlatform, setLoginPlatform] = useState("");

  const [profession, setProfession] = useState("");
  const [businessAddress, setBusinessAddress] = useState("");
  const [licenseNumber, setLicenseNumber] = useState("");

  const [showAIChat, setShowAIChat] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [language, setLanguage] = useState("en");

  const [userVisitedPlaces, setUserVisitedPlaces] = useState([]);
  const [userRecentBookings, setUserRecentBookings] = useState([]);
  const [userSavedPlaces, setUserSavedPlaces] = useState([]);
  const [userViewpoints, setUserViewpoints] = useState([]);
  const [userRoutes, setUserRoutes] = useState([]);
  const [categories] = useState(categoriesData);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [focusArea, setFocusArea] = useState("");
  const [selectedItemId, setSelectedItemId] = useState("");
  const [selectedDetailType, setSelectedDetailType] = useState("");
  const [selectedLocationId, setSelectedLocationId] = useState(null);
  const [locationDetails, setLocationDetails] = useState(null);

  const isMobile = useIsMobile();

  const resetUserState = useCallback(() => {
    setIsLoggedIn(false);
    setUserName("");
    setUserEmail("");
    setUserPhone("");
    setUserPhoneVerified(false);
    setLoginPlatform("");
    setUserType(""); // Reset user type to empty
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

  const fetchAndSetUser = useCallback(async (user) => {
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

      // --- MODIFIED LOGIC FOR userType ---
      // If user is anonymous, use the userType from Firestore (which will be their chosen role)
      // Otherwise, use user.isAnonymous to distinguish actual guest from registered user, then fallback to 'user'
      // This ensures guest's chosen role ('user' or 'owner') is directly set to userType
      setUserType(userData.userType || (user.isAnonymous ? 'guest' : 'user'));

      // Determine login platform
      const providerId = user.providerData[0]?.providerId || 'anonymous';
      if (user.isAnonymous) setLoginPlatform('Guest');
      else if (providerId.includes('google.com')) setLoginPlatform('Google');
      else if (providerId.includes('phone')) setLoginPlatform('Phone');
      else if (providerId.includes('password')) setLoginPlatform('Email');
      else setLoginPlatform('Unknown');

      // Owner specific data: Check if the userType (from Firestore) is 'owner'
      if (userData.userType === 'owner') {
        setProfession(userData.profession || "");
        setBusinessAddress(userData.businessAddress || "");
        setLicenseNumber(userData.licenseNumber || "");
        setOwnerId(user.uid);
      } else {
        setOwnerId(null);
        setProfession("");
        setBusinessAddress("");
        setLicenseNumber("");
      }

      setUserVisitedPlaces(userData.visitedPlaces || []);
      setUserRecentBookings(userData.recentBookings || []);
      setUserSavedPlaces(userData.savedPlaces || []);
      setUserViewpoints(userData.viewpoints || []);
      setUserRoutes(userData.routes || []);

    } catch (error) {
      toast.error("Error fetching user profile: " + error.message);
      await signOut(auth); // Force logout on error
    }
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        if (analytics) {
          setUserId(analytics, user.uid);
        }
        await fetchAndSetUser(user);
      } else {
        if (analytics) {
          setUserId(analytics, null);
        }
        resetUserState();
      }
      setLoadingUser(false);
    });
    return () => unsubscribe();
  }, [fetchAndSetUser, resetUserState]);

  const signInAnonymouslyAsGuest = async (selectedUserType) => {
    if (!selectedUserType) {
        toast.error("A role must be selected to continue as a guest.");
        return { success: false, error: "Role not selected" };
    }
    try {
      const userCredential = await signInAnonymously(auth);
      const user = userCredential.user;

      const userDocRef = doc(db, "users", user.uid);
      await setDoc(userDocRef, {
        uid: user.uid,
        displayName: 'Guest User',
        userType: selectedUserType, // Store the selected role in Firestore
        isAnonymous: true, // Mark as anonymous
        createdAt: serverTimestamp(),
      }, { merge: true });

      if (analytics) {
          logEvent(analytics, 'login', {
              method: 'guest',
              user_role: selectedUserType
          });
      }

      await fetchAndSetUser(user); // This will now fetch the userType as the selected role
      return { success: true };
    } catch (error) {
      toast.error("Anonymous sign-in failed: " + error.message);
      return { success: false, error: error.message };
    }
  };

  const updateUserProfileInFirestore = async (updates) => {
    if (!auth.currentUser) {
      toast.error("You must be logged in to update your profile.");
      return false;
    }
    try {
      const userRef = doc(db, "users", auth.currentUser.uid);
      // Ensure 'userType' is not inadvertently changed by a general update
      // unless specifically intended and passed in 'updates'.
      const currentUserData = (await getDoc(userRef)).data();
      const finalUpdates = {
          ...updates,
          updatedAt: serverTimestamp(),
          userType: updates.userType || currentUserData.userType // Preserve userType if not explicitly updated
      };
      await setDoc(userRef, finalUpdates, { merge: true });
      await fetchAndSetUser(auth.currentUser);

      if (analytics) {
        logEvent(analytics, 'user_profile_update', {
          user_id: auth.currentUser.uid,
          updated_fields: Object.keys(updates).join(',')
        });
      }

      return true;
    } catch (error) {
      toast.error("Firestore profile update failed: " + error.message);
      return false;
    }
  };

  const readOwnerListingsRemote = async (id) => {
    if (!id) return [];
    try {
      const q = query(collection(db, "listings"), where("ownerId", "==", id));
      const querySnapshot = await getDocs(q);
      const listings = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      if (analytics) {
        logEvent(analytics, 'read_owner_listings', {
          owner_id: id,
          listing_count: listings.length
        });
      }

      return listings;
    } catch (error) {
      toast.error("Failed to fetch listings from the cloud.");
      return [];
    }
  };

  const writeOwnerListingsRemote = async (listings, id) => {
    if (!id) {
      toast.error("Owner ID is required to sync listings.");
      return false;
    }
    try {
      const batch = writeBatch(db);
      const listingsCollectionRef = collection(db, "listings");

      const existingListings = await readOwnerListingsRemote(id);
      const existingIds = new Set(existingListings.map(l => l.id));
      const currentIds = new Set(listings.map(l => l.id));

      let addedCount = 0;
      let updatedCount = 0;
      let deletedCount = 0;

      for (const listing of listings) {
        const docRef = listing.id ? doc(listingsCollectionRef, listing.id) : doc(listingsCollectionRef);
        batch.set(docRef, { ...listing, ownerId: id, updatedAt: serverTimestamp() }, { merge: true });
        if (listing.id && existingIds.has(listing.id)) {
          updatedCount++;
        } else {
          addedCount++;
        }
      }

      for (const oldId of existingIds) {
        if (!currentIds.has(oldId)) {
          const docRef = doc(listingsCollectionRef, oldId);
          batch.delete(docRef);
          deletedCount++;
        }
      }

      await batch.commit();
      toast.success("Listings synchronized with the cloud!");

      if (analytics) {
        logEvent(analytics, 'write_owner_listings', {
          owner_id: id,
          added_listings: addedCount,
          updated_listings: updatedCount,
          deleted_listings: deletedCount,
          total_synced_listings: listings.length
        });
      }

      return true;
    } catch (error) {
      toast.error("Cloud synchronization failed: " + error.message);
      return false;
    }
  };

  const logout1 = useCallback(async () => {
    try {
      if (auth.currentUser?.isAnonymous) {
        // If it's an anonymous user, delete their Firestore document
        await setDoc(doc(db, "users", auth.currentUser.uid), { isDeleted: true, deletedAt: serverTimestamp() }, { merge: true }); // Mark as deleted, or delete entirely
      }
      await signOut(auth);
      toast.info("You have been logged out.");

      if (analytics) {
        logEvent(analytics, 'logout');
      }
    } catch (error) {
      toast.error("Error logging out: " + error.message);
    }
  }, []);

  const contextValue = {
    isLoggedIn,
    loadingUser,
    userType, // This will now reflect the guest's chosen role directly
    ownerId,

    userName, setUserName,
    userEmail, setUserEmail,
    fetchAndSetUser,
    userPhone, setUserPhone,
    userPhoneVerified,
    loginPlatform,

    profession, setProfession,
    businessAddress, setBusinessAddress,
    licenseNumber, setLicenseNumber,

    language, setLanguage,
    showAIChat, setShowAIChat,
    showMobileMenu, setShowMobileMenu,
    isMobile,

    categories,
    userVisitedPlaces,
    userRecentBookings,
    userSavedPlaces,
    userViewpoints,
    userRoutes,

    searchQuery, setSearchQuery,
    selectedCategory, setSelectedCategory,
    focusArea, setFocusArea,
    selectedItemId, setSelectedItemId,
    selectedDetailType, setSelectedDetailType,
    selectedLocationId, setSelectedLocationId,
    locationDetails, setLocationDetails,

    signInAnonymouslyAsGuest,
    updateUserProfileInFirestore,
    logout1,
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