import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { GlobalContext } from "../component/GlobalContext";

import Header from "../component/Header";
import { Button } from "../component/button";
import { ArrowLeft } from "lucide-react";
import FilterSidebar from "../component/FilterSidebar";
import ListingCard from "../component/ListingCard";

export default function SearchView (){
  const navigate = useNavigate();

  const {
    isLoggedIn,
    searchQuery,
    selectedCategory,
    userName,
    showMobileMenu,
    setShowMobileMenu,
    setSearchQuery,
    isMobile
  } = useContext(GlobalContext);

  const [filters, setFilters] = useState({
    priceRange: [500, 15000],
    rating: [],
    type: [],
    location: [],
    amenities: [],
    sortBy: "",
  });

  const handleSearch = (query) => {
    setSearchQuery(query);
    navigate("/search");
  };

   const handleLogoClick = () => {
    if (userType === "owner") {
      navigate("/owner-dashboard");
    } else {
      navigate("/profile");
    }
  };

  const handleViewDetails = (id, type) => {
    navigate(`/details/${type}/${id}`);
  };

  const handleBookNow = (id) => {
   navigate(`/booking/${id}`);
  };


  const clearFilters = () => setFilters({
    priceRange: [500, 15000],
    rating: [],
    type: [],
    location: [],
    amenities: [],
    sortBy: "",
  });

  

  const getDetailType = (type) => {
    const lower = type.toLowerCase();
    if (["hotel", "resort"].includes(lower)) return "hotel";
    if (lower === "place") return "place";
    if (lower === "trek") return "trek";
    if (lower === "bike") return "bike";
    if (lower === "cab") return "cab";
    if (lower === "guide") return "guide";
    return "hotel";
  };

  const handleBackToHome = () => {
    navigate("/");
  };
  // All possible results (unfiltered)
  const allResults = [
    {
      id: "1",
      image: "https://images.unsplash.com/photo-1670555383991-ae6ad4bb39df?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHxoaWxsJTIwcmVzb3J0JTIwbW91bnRhaW4lMjB2aWV3fGVufDF8fHx8MTc1NzYxNjk4OXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      title: "Mountain View Resort",
      type: "Resort",
      location: "Bhimtal",
      price: "₹4,500",
      rating: 4.5,
      reviewCount: 128,
      description: "Luxury resort with spectacular lake views, spa, and fine dining",
      amenities: ["WiFi", "Pool", "Spa", "Restaurant", "Parking", "Room Service"],
      availability: "Available"
    },
    {
      id: "2",
      image: "https://images.unsplash.com/photo-1717050788940-189e308415fb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3VudGFpbiUyMHRyZWtraW5nJTIwaGltYWxheWFzfGVufDF8fHx8MTc1NzYxNjk4OHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      title: "Brahmasthali Trek",
      type: "Trek",
      location: "Nainital",
      price: "₹1,200",
      rating: 4.8,
      reviewCount: 89,
      description: "Spiritual trekking experience with panoramic Himalayan views",
      amenities: ["Guide", "Trek Gear", "Meals", "Transportation"],
      availability: "3 spots left"
    },
    {
      id: "3",
      image: "https://images.unsplash.com/photo-1683973200791-47539048cf63?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiaGltdGFsJTIwbGFrZSUyMHV0dGFyYWtoYW5kfGVufDF8fHx8MTc1NzYxNjk4OHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      title: "Naukuchiatal Lake",
      type: "Place",
      location: "Naukuchiatal",
      price: "Free",
      rating: 4.7,
      reviewCount: 234,
      description: "Nine-cornered lake perfect for boating and nature photography",
      amenities: ["Boating", "Photography", "Picnic Area", "Parking"]
    },
    {
      id: "4",
      image: "https://images.unsplash.com/photo-1623206762365-dd8b21fb2c10?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiaWtlJTIwcmVudGFsJTIwc2Nvb3RlciUyMG1vdW50YWlufGVufDF8fHx8MTc1NzYyMTU0Mnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      title: "Hill Station Bikes",
      type: "Bike",
      location: "Nainital",
      price: "₹500",
      rating: 4.6,
      reviewCount: 156,
      description: "Premium scooters and bikes for mountain exploration",
      amenities: ["Helmet", "GPS", "Fuel", "Insurance"],
      availability: "10 bikes available"
    }
  ];


  // Filtering logic
  const getFilteredResults = () => {
    return allResults.filter((item) => {
      // Price Range
      const priceNum = parseInt(item.price.replace(/[^\d]/g, "")) || 0;
      if (filters.priceRange && (priceNum < filters.priceRange[0] || priceNum > filters.priceRange[1])) {
        return false;
      }
      // Rating
      if (filters.rating && filters.rating.length > 0) {
        const minRating = Math.max(...filters.rating.map(r => parseInt(r)));
        if (item.rating < minRating) return false;
      }
      // Type
      if (filters.type && filters.type.length > 0 && !filters.type.includes(item.type) && !filters.type.includes(item.type + 's')) {
        return false;
      }
      // Location
      if (filters.location && filters.location.length > 0 && !filters.location.includes(item.location)) {
        return false;
      }
      // Amenities
      if (filters.amenities && filters.amenities.length > 0) {
        const hasAll = filters.amenities.every(a => item.amenities && item.amenities.includes(a));
        if (!hasAll) return false;
      }
      return true;
    });
  };

  // Sorting logic
  const sortResults = (results) => {
    switch (filters.sortBy) {
      case "price-low":
        return [...results].sort((a, b) => (parseInt(a.price.replace(/[^\d]/g, "")) || 0) - (parseInt(b.price.replace(/[^\d]/g, "")) || 0));
      case "price-high":
        return [...results].sort((a, b) => (parseInt(b.price.replace(/[^\d]/g, "")) || 0) - (parseInt(a.price.replace(/[^\d]/g, "")) || 0));
      case "rating":
        return [...results].sort((a, b) => b.rating - a.rating);
      default:
        return results;
    }
  };

  const filteredResults = sortResults(getFilteredResults());

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        isLoggedIn={isLoggedIn}
        onSearch={handleSearch}
        userName={userName}
        onLogoClick={handleLogoClick}
        onMenuToggle={() => setShowMobileMenu(!showMobileMenu)}
        showMobileMenu={showMobileMenu}
      />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Button variant="ghost" onClick={handleBackToHome} className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>

          <h1 className="text-2xl font-bold">
            Search Results
            {searchQuery && ` for "${searchQuery}"`}
            {selectedCategory && ` in ${selectedCategory}`}
          </h1>
          <p className="text-muted-foreground">
            {filteredResults.length} results found
          </p>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <FilterSidebar
              filters={filters}
              onFilterChange={setFilters}
              onClearFilters={clearFilters}
              isMobile={isMobile}
            />
          </div>

          <div className="lg:col-span-3 space-y-6">
            {filteredResults.length > 0 ? (
              filteredResults.map((result) => (
                <ListingCard
                  key={result.id}
                  {...result}
                  onViewDetails={() =>
                    handleViewDetails(result.id, getDetailType(result.type), true)
                  }
                  onBookNow={() => handleBookNow(result.id)}
                />
              ))
            ) : (
              <div className="text-center py-10 text-muted-foreground">
                <p className="text-xl">No results found.</p>
                <p className="text-md">
                  Try adjusting your filters or search query.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};


