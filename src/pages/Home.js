import React, { useState, useCallback, useContext, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { GlobalContext } from "../component/GlobalContext";
import Header from "../component/Header";
import MobileMenu from "../component/MobileMenu";
import HeroCarousel from "../component/HeroCarousel";
import CategoryCard from "../component/CategoryCard";
import FeaturedCard from "../component/FeaturedCard";
import LocationCarousel from "../component/LocationCarousel";
import Footer from "../component/Footer";
import { analytics } from "../firebase"; // Import Firebase Analytics
import { logEvent } from "firebase/analytics"; // Import logEvent

import {
  Bed,
  MapPin,
  Mountain,
  Car,
  Users,
  Home as HomeIcon,
  Bike,
  Navigation,
} from "lucide-react";
import { Card } from "../component/Card";
import { Button } from "../component/button";
import { featuredPlaces } from "../assets/dummy";

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
    setFocusArea,
  } = useContext(GlobalContext);

  // No need for a separate useEffect for page views with Firebase Analytics,
  // as it automatically tracks screen views if configured correctly in Firebase.
  // However, you can manually log a screen_view event if needed for more detail.
  useEffect(() => {
    if (analytics) {
      logEvent(analytics, 'screen_view', {
        firebase_screen: 'Home',
        firebase_screen_class: 'Home',
      });
    }
  }, []);

  const handleViewDetails = useCallback((id, type = " ") => {
    const routeMap = {
      hotel: `/hotel-details/${id}`,
      popular: `/popular-details/${id}`,
      place: `/place-details/${id}`,
      trek: `/trek-details/${id}`,
      bike: `/bike-details/${id}`,
      cab: `/cab-details/${id}`,
      guide: `/guide-details/${id}`,
      resort: `/hotel-details/${id}`,
    };
    const path = routeMap[type.toLowerCase()] || "/";
    navigate(path);

    if (analytics) {
      logEvent(analytics, 'view_item', {
        content_type: 'Featured Card',
        item_id: id,
        item_category: type,
      });
    }
  }, [navigate]);

  const handleSearch = useCallback((query) => {
    setSearchQuery(query);
    setSelectedCategory("");
    navigate("/search");

    if (analytics) {
      logEvent(analytics, 'search', {
        search_term: query
      });
    }
  }, [navigate, setSearchQuery, setSelectedCategory]);

  const handleLogoClick = useCallback(() => {
    navigate(`/`);
    if (analytics) {
      logEvent(analytics, 'select_content', {
        content_type: 'Logo',
        item_id: 'logo_click'
      });
    }
  }, [navigate]);

  const handleProfileClick = useCallback(() => {
    if (userType === "owner") {
      navigate(`/owner-dashboard/${profession}`);
      if (analytics) {
        logEvent(analytics, 'select_content', {
          content_type: 'Profile Click',
          item_id: 'owner_dashboard_profile',
          user_type: userType
        });
      }
    } else {
      navigate("/profile");
      if (analytics) {
        logEvent(analytics, 'select_content', {
          content_type: 'Profile Click',
          item_id: 'user_profile',
          user_type: userType
        });
      }
    }
  }, [navigate, userType, profession]);

  const handleCategoryClick = useCallback((categoryTitle, categoryId) => {
    if (analytics) {
      logEvent(analytics, 'select_content', {
        content_type: 'Category Card',
        item_id: categoryTitle
      });
    }
    
    setSelectedCategory(categoryTitle);
    
    // Route logic based on category ID
    if (categoryTitle === 'Hotels & Resorts') {
      navigate('/hotels');
    } else {
      // Fallback for other coming soon pages
     navigate("/book-item/:itemId")
    }
  }, [navigate, setSelectedCategory]);

  const handleExploreMore = useCallback((locationName) => {
    if (analytics) {
      logEvent(analytics, 'select_content', {
        content_type: 'Location Carousel',
        item_id: locationName
      });
    }
    const locationId = locationName.toLowerCase().replace(/\s/g, '-');
    setSelectedLocationId(locationId);
    navigate(`/location-details/${locationId}`);
  }, [navigate, setSelectedLocationId]);

  const handleGetDirections = useCallback((locationIdParam, lat, lng, name) => {
    if (analytics) {
      logEvent(analytics, 'get_directions', {
        source: 'Home Banner',
        item_name: name,
        destination_latitude: lat,
        destination_longitude: lng
      });
    }
    const focusId = locationIdParam.toLowerCase().replace(/\s/g, '-');
    setFocusArea(focusId);
    navigate(`/map-view/${focusId}?destLat=${lat}&destLng=${lng}&destName=${encodeURIComponent(name)}`);
  }, [navigate, setFocusArea]);

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        <Header
          isLoggedIn={isLoggedIn}
          onSearch={handleSearch}
          userName={userName}
          onLogoClick={handleLogoClick}
          onProfileClick={handleProfileClick}
          onMenuToggle={() => setShowMobileMenu(!showMobileMenu)}
          showMobileMenu={showMobileMenu}
        />

        {/* Mobile Menu Overlay */}
        {showMobileMenu && (
          <MobileMenu
            onClose={() => setShowMobileMenu(false)}
            userType={userType}
            profession={profession}
          />
        )}

        <main className="container mx-auto px-4 py-8 space-y-12">
          {/* Hero Carousel */}
          <HeroCarousel />

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
            <Card className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow" onClick={() => handleGetDirections("nainital", 29.391775, 79.455979, "Nainital Lake")}>
              <div className="relative h-48">
                <div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{
                    backgroundImage: `url('https://images.unsplash.com/photo-1656828059867-3fb503eb2214?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuYWluaiBhbCUyMGxha2UlMjBzdW5zZXQlMjBtb3VudGFpbnN8ZW58MXx8fHwxNzU3NjE2OTg3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral')`
                  }}
                />
                <div className="absolute inset-0" /> {/* Added overlay */}
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

            <Card className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow" onClick={() => handleGetDirections("bhimtal", 29.3503, 79.5539, "Bhimtal Lake")}>
              <div className="relative h-48">
                <div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{
                    backgroundImage: `url('https://images.unsplash.com/photo-1683973200791-47539048cf63?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiaGltdGFsJTIwbGFrZSUyMHV0dGFyYWtoYW5kfGVufDF8fHwxNzU3NjE2OTg4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral')`
                  }}
                />
                <div className="absolute inset-0" /> {/* Added overlay */}
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
                  onViewDetails={() => handleViewDetails(place.id, place.type)}
                />
              ))}
            </div>
          </section>

          {/* About Section */}
          <section className="bg-white rounded-lg p-8 text-center">
            <h2 className="text-3xl font-bold mb-4">Why Choose Buddy In Hills?</h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Your local Uttarakhand guide, covering Nainital to remote hills. We provide
              real-time local guide availability, detailed trekking paths with maps, and
              insider tips you won't find on Google. All-in-one search without leaving our site.
            </p>
          </section>
        </main>

        {/* Footer Component */}
        <Footer />
      </div>
    </>
  );
}