import React, { createContext, useState } from "react";
import { useIsMobile } from "../hooks/use-mobile"; // Make sure this hook is defined or imported correctly
// Import Lucide icons if you plan to use them directly in the categories array here
import { Bed, MapPin, Mountain, Car, Users, HomeIcon, Bike } from 'lucide-react';


export const GlobalContext = createContext();

// Mock User Data (Dynamic part)
const mockUserData = {
  // Common user info
  userName: "Priya Sharma",
  userEmail: "priya.sharma@gmail.com",
  userPhone: "+91 9876543210",
  loginPlatform: "Gmail",
  userType: "user", // 'user' | 'owner'
  profession: "Travel Enthusiast",
  
  // Profile-specific data (dynamic)
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
  savedPlaces: [ // These mimic your featuredPlaces structure
    { 
      id: 's1', 
      title: 'Eco Cave Gardens', 
      location: 'Nainital', 
      rating: 4.2, 
      type: 'place',
      image: "https://nainitaltourism.org.in/images/places-to-visit/headers/naina-devi-temple-nainital-tourism-entry-fee-timings-holidays-reviews-header.jpg" // Example image
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
  userViewpoints: [ // These mimic your viewpoints structure
    { id: 'uvp1', name: 'Camel’s Back Road', description: 'Scenic road with lake views', distance: '2 km', rating: 4.5 },
    { id: 'uvp2', name: 'Lover’s Point', description: 'Romantic spot with panoramic views', distance: '4 km', rating: 4.1 },
    { id: "uvp3", name: "Tiffin Top (Dorothy's Seat)", description: "Panoramic views, 4km trek from Nainital", distance: "4km", rating: 4.7 },
    { id: "uvp4", name: "Snow View Point", description: "Cable car access, Himalayan vistas", distance: "2.5km", rating: 4.6 },
    { id: "uvp5", name: "Naina Peak (China Peak)", description: "Highest point, trekking spot", distance: "6km", rating: 4.9 },
    { id: "uvp6", name: "Himalaya Darshan Point", description: "Snow-capped peaks view", distance: "3km", rating: 4.5 },
    { id: "uvp7", name: "Land's End", description: "Cliff-edge views", distance: "5km", rating: 4.4 },
    { id: "uvp8", name: "Mukteshwar", description: "Temple and orchards", distance: "50km", rating: 4.8 },
  ],
  userRoutes: [ // These mimic your routes structure
    { id: 'ur1', name: 'Trekking to Tiffin Top', difficulty: 'Easy', distance: '3 km', rating: 4.4 },
    { id: 'ur2', name: 'Boating in Naini Lake', difficulty: 'Easy', distance: '2 km', rating: 4.8 },
    { id: "ur3", name: "Naina Peak Trek", difficulty: "Moderate", distance: "6km loop", rating: 4.8 },
    { id: "ur4", name: "Tiffin Top Hike", difficulty: "Easy", distance: "4km to viewpoint", rating: 4.7 },
    { id: "ur5", name: "Snow View Trek", difficulty: "Easy", distance: "2km uphill", rating: 4.5 },
    { id: "ur6", name: "Guano Hills Trail", difficulty: "Moderate", distance: "10km birding adventure", rating: 4.4 },
    { id: "ur7", name: "Pangot Trek", difficulty: "Easy", distance: "15km nature walk", rating: 4.3 },
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


const GlobalProvider = ({ children }) => {
  // View and auth
  const [isLoggedIn, setIsLoggedIn] = useState(true); // Default to logged in for profile testing
  const [userType, setUserType] = useState(mockUserData.userType);
  
  // User info - Now initialized from mockUserData
  const [profession, setProfession] = useState(mockUserData.profession);
  const [language, setLanguage] = useState("en");
  const [userName, setUserName] = useState(mockUserData.userName); // Added setter for potential edits
  const [userEmail, setUserEmail] = useState(mockUserData.userEmail); // Added setter
  const [userPhone, setUserPhone] = useState(mockUserData.userPhone); // Added setter
  const [loginPlatform, setLoginPlatform] = useState(mockUserData.loginPlatform); // Added setter

  // Dynamic user data
  const [userVisitedPlaces, setUserVisitedPlaces] = useState(mockUserData.visitedPlaces);
  const [userRecentBookings, setUserRecentBookings] = useState(mockUserData.recentBookings);
  const [userSavedPlaces, setUserSavedPlaces] = useState(mockUserData.savedPlaces);
  const [userViewpoints, setUserViewpoints] = useState(mockUserData.userViewpoints);
  const [userRoutes, setUserRoutes] = useState(mockUserData.userRoutes);
  const [categories, setCategories] = useState(categoriesData); // Added categories to context


  // Search and selection
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [focusArea, setFocusArea] = useState("");
  const [selectedItemId, setSelectedItemId] = useState("");
  const [selectedDetailType, setSelectedDetailType] = useState("hotel"); 

  // UI state
  const [showAIChat, setShowAIChat] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const isMobile = useIsMobile(); // This hook should be defined elsewhere.

  // Bundle all state into context
  const contextValue = {
    isLoggedIn, setIsLoggedIn,
    userType, setUserType,
    profession, setProfession,
    language, setLanguage,
    searchQuery, setSearchQuery,
    selectedCategory, setSelectedCategory,
    focusArea, setFocusArea,
    selectedItemId, setSelectedItemId,
    selectedDetailType, setSelectedDetailType,

    // User Info (now with setters for editing)
    userName, setUserName,
    userEmail, setUserEmail,
    userPhone, setUserPhone,
    loginPlatform, setLoginPlatform,

    // Dynamic User Profile Data
    userVisitedPlaces, setUserVisitedPlaces,
    userRecentBookings, setUserRecentBookings,
    userSavedPlaces, setUserSavedPlaces,
    userViewpoints, setUserViewpoints,
    userRoutes, setUserRoutes,
    categories, setCategories, // Provided categories data via context
    
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