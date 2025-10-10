import React, { useState, useContext,useCallback} from "react";
import { useNavigate } from "react-router-dom";
import { GlobalContext } from "../component/GlobalContext";
import Header from "../component/Header";
import MobileMenu from "../component/MobileMenu";
import HeroCarousel from "../component/HeroCarousel";
import CategoryCard from "../component/CategoryCard";
import FeaturedCard from "../component/FeaturedCard";
import LocationCarousel from "../component/LocationCarousel";

import {
  Bed,
  MapPin,
  Mountain,
  Car,
  Users,
  Home as HomeIcon, // Renamed to avoid conflict with component name
  Bike,
  Navigation,
  Phone,
  Mail
} from "lucide-react";
import { Card } from "../component/Card";
import { Button } from "../component/button";
import {featuredPlaces}from"../assets/dummy"

export default function Home() {
  const navigate = useNavigate();

  const categories = [
      { icon: Bed, title: "Hotels & Resorts", description: "Comfortable stays" },
      { icon: MapPin, title: "Places to Visit", description: "Top attractions" },
      { icon: Mountain, title: "Tours & Treks", description: "Adventure trails" },
      { icon: Car, title: "Cabs & Taxis", description: "Local transport" },
      { icon: Users, title: "Local Guides", description: "Expert guidance" },
      { icon: HomeIcon, title: "Hill Stays", description: "Mountain resorts" },
      { icon: Bike, title: "Rental Bikes", description: "Scooters & bikes" },
  ];

 const {
    setSearchQuery,
    setSelectedCategory,
    userName,
    showMobileMenu,
    setShowMobileMenu,
    userType,
    isLoggedIn,
    profession,
    setSelectedLocationId, 
  } = useContext(GlobalContext);

   const handleViewDetails = useCallback((id, type = "hotel") => {
    const routeMap = {
      hotel: `/hotel-details/${id}`,
      place: `/place-details/${id}`,
      trek: `/trek-details/${id}`,
      bike: `/bike-details/${id}`,
      cab: `/cab-details/${id}`,
      guide: `/guide-details/${id}`,
      resort: `/hotel-details/${id}`
    };
    const path = routeMap[type.toLowerCase()] || "/";
    navigate(path);
    }, [navigate]);


    const handleSearch = useCallback((query) => {
    setSearchQuery(query);
    setSelectedCategory("");
    navigate("/search");
    }, [navigate, setSearchQuery, setSelectedCategory]);

  // This handleLogoClick is for the header logo, not for a general "profile" in mobile menu.
  // It handles if the user is an owner, navigate to dashboard, otherwise to a generic profile.
  const handleLogoClick = useCallback(() => {
    if (userType === "owner") {
      // Ensure profession is available here if needed for owner dashboard navigation
      // If profession is always set when userType is 'owner', this is fine.
      // Otherwise, you might need to fetch it or get it from context.
      // For now, assuming profession is available in context when userType is 'owner'.
      navigate(`/owner-dashboard/${profession}`); // Navigate to specific owner dashboard
    } else {
      navigate("/profile"); // Generic user profile
    }
  }, [navigate, userType, profession]); 

  // // Handle logo click to navigate to home :in genral
  // const handleLogoClick = useCallback(() => {
  //   navigate("/");
  // }, [navigate]);


  const handleBooking = useCallback(() => {
    navigate("/search");
  }, [navigate]);

  const handleCategoryClick = useCallback((category) => {
    setSelectedCategory(category);
    setSearchQuery("");
    navigate("/search");
  }, [navigate, setSelectedCategory, setSearchQuery]);

  const handleExploreMore = useCallback((locationName) => {
    const locationId = locationName.toLowerCase().replace(/\s/g, '-');
    setSelectedLocationId(locationId); // Set the global context state
    navigate(`/location-details/${locationId}`); // Navigate to the dynamic route
  }, [navigate, setSelectedLocationId]);

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        <Header
          isLoggedIn={isLoggedIn}
          onSearch={handleSearch}
          userName={userName}
          onLogoClick={handleLogoClick}
          onMenuToggle={() => setShowMobileMenu(!showMobileMenu)}
          showMobileMenu={showMobileMenu}
        />

        {/* Mobile Menu Overlay */}
        {showMobileMenu && (
          <MobileMenu
            onClose={() => setShowMobileMenu(false)}
            userType={userType} // Pass userType
            profession={profession} // Pass profession
          />
        )}

        <main className="container mx-auto px-4 py-8 space-y-12">
          {/* Hero Carousel */}
          <HeroCarousel onBooking={handleBooking} />

          {/* Location Carousel */}
          <LocationCarousel onLocationClick={handleExploreMore} />

          {/* Categories */}
          <section>
            <h2 className="text-3xl font-bold text-center mb-8">Services</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-4">
              {categories.map((category) => (
                <CategoryCard
                  key={category.title}
                  icon={category.icon}
                  title={category.title}
                  description={category.description}
                  onClick={() => handleCategoryClick(category.title)}
                />
              ))}
            </div>
          </section>

          {/* Enhanced Banners */}
          <section className="grid md:grid-cols-2 gap-6">
            <Card className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow" onClick={() => handleExploreMore("Nainital")}>
              <div className="relative h-48">
                <div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{
                    backgroundImage: `url('https://images.unsplash.com/photo-1656828059867-3fb503eb2214?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuYWluaXRhbCUyMGxha2UlMjBzdW5zZXQlMjBtb3VudGFpbnN8ZW58MXx8fHwxNzU3NjE2OTg3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral')`
                  }}
                />
                <div className="absolute inset-0  bg-opacity-30" /> {/* Changed to bg-black for consistency */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-white">
                    <h3 className="text-2xl font-bold mb-2">Explore Nainital</h3>
                    <p className="mb-4">Discover the Queen of Hills</p>
                    <Button variant="secondary">
                      <Navigation className="w-4 h-4 mr-2" />
                      View Map
                    </Button>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow" onClick={() => handleExploreMore("Lakes")}>
              <div className="relative h-48">
                <div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{
                    backgroundImage: `url('https://images.unsplash.com/photo-1683973200791-47539048cf63?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiaGltdGFsJTIwbGFrZSUyMHV0dGFyYWtoYW5kfGVufDF8fHx8MTc1NzYxNjk4OHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral')`
                  }}
                />
                <div className="absolute inset-0  bg-opacity-30" /> 
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-white">
                    <h3 className="text-2xl font-bold mb-2">Explore Lakes</h3>
                    <p className="mb-4">Bhimtal, Sukhatal & More</p>
                    <Button variant="secondary">
                      <Navigation className="w-4 h-4 mr-2" />
                      View Map
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </section>


          {/* Featured Section */}
          <section>
            <h2 className="text-3xl font-bold text-center mb-8">Top Popular Picks Across Hills</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredPlaces.map((place) => (
                <FeaturedCard
                  key={place.id}
                  {...place}
                  // Pass place.type to handleViewDetails for correct routing
                  onViewDetails={() => handleViewDetails(place.id, place.type)}
                />
              ))}
            </div>
          </section>

          {/* About Section */}
          <section className="bg-white rounded-lg p-8 text-center">
            <h2 className="text-3xl font-bold mb-4">Why Choose NainiExplore?</h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Your local Uttarakhand guide, covering Nainital to remote hills. We provide
              real-time local guide availability, detailed trekking paths with maps, and
              insider tips you won't find on Google. All-in-one search without leaving our site.
            </p>
          </section>

        </main>

        <footer className="bg-gray-900 text-white py-12">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-4 gap-8">
              <div>
                <h3 className="text-xl font-bold mb-4">Buddy In Hills</h3>
                <p className="text-gray-400">
                  Your gateway to exploring the beautiful lakes and mountains of Uttarakhand.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Quick Links</h4>
                <ul className="space-y-2 text-gray-400">
                  <li>About Us</li>
                  <li>Contact</li>
                  <li>Privacy Policy</li>
                  <li>Terms of Service</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Destinations</h4>
                <ul className="space-y-2 text-gray-400">
                  <li>Nainital</li>
                  <li>Bhimtal</li>
                  <li>Sukhatal</li>
                  <li>Naukuchiatal</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Contact Us</h4>
                <div className="space-y-2 text-gray-400">
                  <div className="flex items-center space-x-2">
                    <Phone className="w-4 h-4" />
                    <span>+91 9876543210</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Mail className="w-4 h-4" />
                    <span>info@buddyinhills.com</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
              <p>&copy; 2024 Buddy In Hills. All rights reserved.</p>
            </div>
          </div>
        </footer>

      </div>

    </>
  );
}