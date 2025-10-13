import React, { createContext, useState, useEffect, useCallback } from "react";
import { useIsMobile } from "../hooks/use-mobile";
import { Bed, MapPin, Mountain, Car, Users, HomeIcon, Bike } from 'lucide-react';
import { locationsData, featuredPlaces } from "../assets/dummy"; // Ensure locationsData is imported

export const GlobalContext = createContext();

// Mock User Data (Dynamic part) - This will be the initial state
const mockUserData = {
  // Common user info
  userName: "Priya Sharma",
  userEmail: "priya.sharma@example.com",
  userPhone: "+91 xxxxxxxxxx",
  loginPlatform: "Gmail",
  userType: "", // Default user type for testing - changed from " " to "user" or "owner"
  profession: "resort-hotel", // Default profession for owner dashboard testing
  isLoggedIn: false, // Default to logged in for testing, change to false for production
  userRole: "", // Default role for testing, can be 'user', 'owner', or null/undefined
  // ... rest of your mock user data

  // Owner-specific profile data (if you want to manage globally)
  businessAddress: "123 Mountain View, Nainital, Uttarakhand",
  licenseNumber: "UTH987654321",
  visitedPlaces: [
    { id: 'vp1', name: 'Nainital Lake', status: 'visited' },
    { id: 'vp2', name: 'Tiffin Top', status: 'visited' },
    { id: 'vp3', name: 'Snow View Point', status: 'visited' },
    { id: 'vp4', name: 'Bhimtal Lake', status: 'unvisited' },
    { id: 'vp5', name: 'Naina Peak', status: 'unvisited' },
  ],
  recentBookings: [
    { id: 'b1', title: 'Mountain View Resort', dates: 'Dec 25-27, 2024', status: 'Confirmed' },
    { id: 'b2', title: 'Naina Peak Trek', dates: 'Jan 15, 2025', status: 'Upcoming' },
    { id: 'b3', title: 'Cab to Bhimtal', dates: 'Jan 10, 2025', status: 'Upcoming' },
  ],
  savedPlaces: [
    {
      id: 's1',
      title: 'Eco Cave Gardens',
      location: 'Nainital',
      rating: 4.2,
      type: 'place',
      image: "https://nainitaltourism.org.in/images/places-to-visit/headers/naina-devi-temple-nainital-tourism-entry-fee-timings-holidays-reviews-header.jpg"
    },
    {
      id: 's2',
      title: 'Jim Corbett National Park',
      location: 'Ramnagar',
      rating: 4.7,
      type: 'place',
      image: "https://images.unsplash.com/photo-1717050788940-189e308415fb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3VudGFpbiUyMHRyZWtraW5nJTIwaGltYWxheWFzfGVufDF8fHx8MTc1NzYxNjk4OHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
    },
    {
      id: 's3',
      title: 'The Naini Retreat',
      location: 'Nainital',
      rating: 4.5,
      type: 'hotel',
      image: "https://images.unsplash.com/photo-1670555383991-ae6ad4bb39df?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHxoaWxsJTIwcmVzb3J0JTIwbW91bnRhaW4lMjB2aWV3fGVuMXx8fHwxNzU3NjE2OTg5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
    },
  ],
  userViewpoints: [
    { id: 'uvp1', name: 'Camel’s Back Road', description: 'Scenic road with lake views', distance: '2 km', rating: 4.5 },
    { id: 'uvp2', name: 'Lover’s Point', description: 'Romantic spot with panoramic views', distance: '4 km', rating: 4.1 },
    { id: "uvp3", name: "Tiffin Top (Dorothy's Seat)", description: "Panoramic views, 4km trek from Nainital", distance: "4km", rating: 4.7 },
    { id: "uvp4", name: "Snow View Point", description: "Cable car access, Himalayan vistas", distance: "2.5km", rating: 4.6 },
    { id: "uvp5", name: "Naina Peak (China Peak)", description: "Highest point, trekking spot", distance: "6km", rating: 4.9 },
    { id: "uvp6", name: "Himalaya Darshan Point", description: "Snow-capped peaks view", distance: "3km", rating: 4.5 },
    { id: "uvp7", name: "Land's End", description: "Cliff-edge views", distance: "5km", rating: 4.4 },
    { id: "uvp8", name: "Mukteshwar", description: "Temple and orchards", distance: "50km", rating: 4.8 },
    { id: "uvp9", name: "Sariyatal", distance: "10km", rating: 4.2, description: "Lake viewpoint" },
    { id: "uvp10", name: "Khurpatal", distance: "12km", rating: 4.1, description: "Hidden lake spot" },
    { id: "uvp11", name: "Kilbury", distance: "15km", rating: 4.6, description: "Bird watching views" }
   
  ],
  userRoutes: [
    { id: 'ur1', name: 'Trekking to Tiffin Top', difficulty: 'Easy', distance: '3 km', rating: 4.4 },
    { id: 'ur2', name: 'Boating in Naini Lake', difficulty: 'Easy', distance: '2 km', rating: 4.8 },
    { id: "ur3", name: "Naina Peak Trek", difficulty: "Moderate", distance: "6km loop", rating: 4.8 },
    { id: "ur4", name: "Tiffin Top Hike", difficulty: "Easy", distance: "4km to viewpoint", rating: 4.7 },
    { id: "ur5", name: "Snow View Trek", difficulty: "Easy", distance: "2km uphill", rating: 4.5 },
    { id: "ur6", name: "Guano Hills Trail", difficulty: "Moderate", distance: "10km birding adventure", rating: 4.4 },
    { id: "ur7", name: "Pangot Trek", difficulty: "Easy", distance: "15km nature walk", rating: 4.3 },
    { id: "ur8", name: "Kunjkharak Trek", difficulty: "Hard", distance: "20km wildlife path", rating: 4.6 },
    { id: "ur9", name: "Hartola Shiv Mandir Hike", difficulty: "Easy", distance: "8km spiritual trail", rating: 4.2 },
    { id: "ur10", name: "Sattal Waterfall Trail", difficulty: "Moderate", distance: "25km waterfall route", rating: 4.5 },
    { id: "ur11", name: "Lands End Trail", difficulty: "Easy", distance: "5km scenic end-point", rating: 4.1 },
    { id: "ur12", name: "Kilbury Trek", difficulty: "Moderate", distance: "15km forest adventure", rating: 4.4 }
  
  ],
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
  const [isLoggedIn, setIsLoggedIn] = useState(mockUserData.isLoggedIn); // Initialized from mockUserData
  const [userRole, setUserRole] = useState(mockUserData.userRole);     // New state for user role
  const [userType, setUserType] = useState(mockUserData.userType);

  // User info - Now initialized from mockUserData
  const [profession, setProfession] = useState(mockUserData.profession);
  const [language, setLanguage] = useState("en");
  const [userName, setUserName] = useState(mockUserData.userName);
  const [userEmail, setUserEmail] = useState(mockUserData.userEmail);
  const [userPhone, setUserPhone] = useState(mockUserData.userPhone);
  const [loginPlatform, setLoginPlatform] = useState(mockUserData.loginPlatform);

  // Owner-specific extended profile details (if managed globally)
  const [businessAddress, setBusinessAddress] = useState(mockUserData.businessAddress);
  const [licenseNumber, setLicenseNumber] = useState(mockUserData.licenseNumber);

  // Owner-specific id
  const [ownerId, setOwnerId] = useState(null);
  // Optional "back" callback
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

  // Effect to infer and set ownerId when userType changes or user info is available
  useEffect(() => {
    if (userType === "owner" && !ownerId) {
      const inferred = userEmail
        ? `owner_${userEmail.replace(/[^a-z0-9]/gi, "_")}`
        : userName
          ? `owner_${userName.replace(/\s+/g, "_")}`
          : `owner_default_${Date.now()}`;
      setOwnerId(inferred.toLowerCase());
    } else if (userType !== "owner" && ownerId) {
      setOwnerId(null);
    }
  }, [userType, ownerId, userEmail, userName]);

  const logout1 = useCallback(() => { // Renamed from logout1 to logout for consistency
    // Clear authentication state
    setIsLoggedIn(false);
    setUserRole(null);
    setUserType('');
    // Clear user/owner profile information
    setUserName('');
    setUserEmail('');
    setUserPhone('');
    setLoginPlatform('');
    setLanguage("en"); // Reset to default language
    setProfession('');

    // Clear owner-specific profile data
    setBusinessAddress('');
    setLicenseNumber('');
    setOwnerId(null); // Clear ownerId

    // Clear dynamic user data
    setUserVisitedPlaces([]);
    setUserRecentBookings([]);
    setUserSavedPlaces([]);
    setUserViewpoints([]);
    setUserRoutes([]);

    // Clear search and UI state
    setSearchQuery('');
    setSelectedCategory('');
    setFocusArea('');
    setSelectedItemId('');
    setSelectedDetailType('');
    setShowAIChat(false);
    setShowMobileMenu(false);
    setSelectedLocationId(null); // Clear selected location ID on logout

    
    // Remove authentication tokens or other sensitive data from localStorage
    localStorage.removeItem('authToken'); // Example
    localStorage.removeItem('userPreferences'); // Example

    console.log("User logged out successfully!");
  }, []);

  // Bundle all state into context
  const contextValue = {
    // auth & user
    isLoggedIn, setIsLoggedIn,
    userType, setUserType,
    userRole, setUserRole, // Added userRole to context
    profession, setProfession,
    language, setLanguage,
    logout1, // Added logout function to context

    // Owner-specific extended profile details
    businessAddress, setBusinessAddress,
    licenseNumber, setLicenseNumber,

    // user info
    userName, setUserName,
    userEmail, setUserEmail,
    userPhone, setUserPhone,
    loginPlatform, setLoginPlatform,

    // owner support
    ownerId, setOwnerId,
    onBack, setOnBack,
    getOwnerKey,
    readOwnerListings,
    writeOwnerListings,

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
  };

  return (
    <GlobalContext.Provider value={contextValue}>
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalProvider;