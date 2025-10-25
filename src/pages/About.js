import React, { useContext, useCallback } from 'react';
import { useNavigate, Link } from "react-router-dom";
import Header from '../component/Header';
import MobileMenu from '../component/MobileMenu';
import Footer from '../component/Footer';
import { GlobalContext } from "../component/GlobalContext";

export default function About() {
  const navigate = useNavigate();
  const {
    setSearchQuery,
    setSelectedCategory,
    userName,
    showMobileMenu,
    setShowMobileMenu,
    userType,
    isLoggedIn,
    profession,
  } = useContext(GlobalContext);

  const handleSearch = useCallback((query) => {
    setSearchQuery(query);
    setSelectedCategory("");
    navigate("/search");
  }, [navigate, setSearchQuery, setSelectedCategory]);

  const handleLogoClick = useCallback(() => {
   
      navigate(`/`);
   
  }, [navigate,]);
  const handleProfileClick = useCallback(() => {
    if (userType === "owner") {
      navigate(`/owner-dashboard/${profession}`);
    } else {
      navigate("/profile");
    }
  }, [navigate, userType, profession]);


  return (
    <div className="min-h-screen flex flex-col">
      <Header
        isLoggedIn={isLoggedIn}
        onSearch={handleSearch}
        userName={userName}
        onLogoClick={handleLogoClick}
        onProfileClick={handleProfileClick}
        onMenuToggle={() => setShowMobileMenu(!showMobileMenu)}
        showMobileMenu={showMobileMenu}
      />

      {showMobileMenu && (
        <MobileMenu
          onClose={() => setShowMobileMenu(false)}
          userType={userType}
          profession={profession}
        />
      )}

      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-8">About Us</h1>
        <p className="text-lg text-center max-w-2xl mx-auto">
          Welcome to Buddy In Hills, your dedicated companion for exploring the majestic beauty of Uttarakhand.
          We connect you with local guides, provide detailed trek routes, and offer unique insights for an unforgettable journey.
        </p>
        {/* Add more content here */}
        <div className="mt-10 grid md:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
            <p className="text-gray-700">
              To empower travelers with authentic local experiences and provide a platform for local service providers
              to connect with a wider audience, fostering sustainable tourism in the Himalayan region.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4">Our Vision</h2>
            <p className="text-gray-700">
              To be the leading digital gateway for exploring Uttarakhand, known for our comprehensive, reliable,
              and community-driven travel solutions.
            </p>
          </div>
        </div>
        <div className="mt-10 text-center">
          <h2 className="text-3xl font-bold mb-6">Meet Our Team</h2>
          <p className="text-lg text-gray-700">
            We are a passionate team of travel enthusiasts, tech innovators, and local experts dedicated to making your
            Uttarakhand adventure seamless and memorable.
          </p>
          {/* You can add team member cards here */}
        </div>
      </main>
      <Footer />
    </div>
  );
}