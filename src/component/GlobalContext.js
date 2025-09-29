// GlobalContext.js
import React, { createContext, useState } from "react";
import { useIsMobile } from "../hooks/use-mobile"; // Make sure this hook is defined or imported correctly

export const GlobalContext = createContext();
const GlobalProvider = ({ children }) => {
  // View and auth
  const [currentView, setCurrentView] = useState("login"); // AppView type assumed as string
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userType, setUserType] = useState("user"); // 'user' | 'owner'
  

  // User info
  const [profession, setProfession] = useState("");
  const [language, setLanguage] = useState("en");
  const [userName] = useState("Priya Sharma");
  const [userEmail] = useState("priya.sharma@gmail.com");
  const [userPhone] = useState("+91 9876543210");
  const [loginPlatform] = useState("Gmail");

  // Search and selection
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [focusArea, setFocusArea] = useState("");
  const [selectedItemId, setSelectedItemId] = useState("");
  const [selectedDetailType, setSelectedDetailType] = useState("hotel"); // DetailType assumed as string

  // UI state
  const [showAIChat, setShowAIChat] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const isMobile = useIsMobile();

  // Bundle all state into context
  const contextValue = {
    currentView,
    setCurrentView,
    isLoggedIn,
    setIsLoggedIn,
    userType,
    setUserType,
    profession,
    setProfession,
    language,
    setLanguage,
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
    userName,
    userEmail,
    userPhone,
    loginPlatform,
    showAIChat,
    setShowAIChat,
    showMobileMenu,
    setShowMobileMenu,
    isMobile,
  };

  return (
    <GlobalContext.Provider value={contextValue}>
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalProvider;
