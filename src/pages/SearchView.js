import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { GlobalContext } from "../component/GlobalContext"; // Ensure this path is correct

import Header from "../component/Header"; // Ensure this path is correct
import { Button } from "../component/button"; // Ensure this path is correct
import { ArrowLeft } from "lucide-react";
import FilterSidebar from "../component/FilterSidebar"; // Ensure this path is correct
import ListingCard from "../component/ListingCard"; // Ensure this path is correct

export default function SearchView() {
  const navigate = useNavigate();

  const {
    isLoggedIn,
    searchQuery, // Used for filtering
    selectedCategory, // Used for initial filter population
    userName,
    showMobileMenu,
    setShowMobileMenu,
    setSearchQuery,
    isMobile,
    userType // Assuming userType is available in GlobalContext
  } = useContext(GlobalContext);

  const [filters, setFilters] = useState({
    priceRange: [500, 15000],
    rating: [],
    type: [],
    location: [],
    amenities: [],
    sortBy: "",
  });

  // Effect to initialize filters based on global context (selectedCategory)
  useEffect(() => {
    let initialFilters = { ...filters }; // Start with the current default filters

    // Pre-populate 'type' filter if a category was selected from the Home page
    if (selectedCategory && selectedCategory !== "All") {
      const categoryMap = {
        "Hotels & Resorts": "Hotels",
        "Places to Visit": "Places",
        "Tours & Treks": "Treks",
        "Cabs & Taxis": "Cabs",
        "Local Guides": "Guides",
        "Rental Bikes": "Bike",
        "Hill Stays": "Hotels", // Maps "Hill Stays" category to "Hotels" type filter
      };
      const mappedCategory = categoryMap[selectedCategory] || selectedCategory;

      if (mappedCategory && !initialFilters.type.includes(mappedCategory)) {
        initialFilters.type = Array.isArray(initialFilters.type)
          ? [...initialFilters.type, mappedCategory]
          : [mappedCategory];
      }
    }

    // Only update if filters actually changed to avoid unnecessary re-renders
    if (JSON.stringify(initialFilters) !== JSON.stringify(filters)) {
      setFilters(initialFilters);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCategory]); // Depend on selectedCategory. `filters` is intentionally not a dependency here to prevent infinite loops from `setFilters`.


  const handleSearch = (query) => {
    setSearchQuery(query);
    // When searching from within SearchView, the `searchQuery` from GlobalContext will automatically trigger re-filtering
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

  const clearFilters = () => {
    setFilters({
      priceRange: [500, 15000],
      rating: [],
      type: [],
      location: [],
      amenities: [],
      sortBy: "",
    });
    setSearchQuery(""); // Also clear search query when clearing filters
  };

  const getDetailType = (type) => {
    const lower = type.toLowerCase();
    if (["hotel", "resort"].includes(lower)) return "hotel";
    if (lower === "place") return "place";
    if (lower === "trek") return "trek";
    if (lower === "bike") return "bike";
    if (lower === "cab") return "cab";
    if (lower === "guide") return "guide";
    return "hotel"; // Default
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
      amenities: ["Guide", "Trek Gear", "Meals", "Transportation", "Local Transport"],
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
      amenities: ["Boating", "Photography", "Picnic Area", "Parking"],
      availability: "Always open"
    },
    {
      id: "4",
      image: "https://images.unsplash.com/photo-1623206762365-dd8b21fb2c10?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiaWtlJTIwcmVntalJTIwc2Nvb3RlciUyMG1vdW50YWlufGVufDF8fHx8MTc1NzYyMTU0Mnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      title: "Hill Station Bikes",
      type: "Bike",
      location: "Nainital",
      price: "₹500",
      rating: 4.6,
      reviewCount: 156,
      description: "Premium scooters and bikes for mountain exploration",
      amenities: ["Helmet", "GPS", "Fuel", "Insurance"],
      availability: "10 bikes available"
    },
    {
      id: "5",
      image: "https://images.unsplash.com/photo-1570183189953-f4219195a97d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuYWluaXRhbCUyMGhvdGVsfGVufDF8fHx8MTc1NzY0MjQ4OXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      title: "Lakeview Hotel",
      type: "Hotels", // Matches "Hotels" in filter sidebar
      location: "Nainital",
      price: "₹3,000",
      rating: 4.2,
      reviewCount: 90,
      description: "Cozy hotel with direct lake access and complimentary breakfast.",
      amenities: ["WiFi", "Restaurant", "Parking", "Room Service"],
      availability: "Available"
    },
    {
      id: "6",
      image: "https://images.unsplash.com/photo-1549487561-22e698188151?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuYWluaXRhbCUyMGd1aWRlfGVufDF8fHx8MTc1NzY0MjQ5MHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      title: "Local Nainital Guide - Ramesh",
      type: "Guides", // Matches "Guides" in filter sidebar
      location: "Nainital",
      price: "₹800",
      rating: 4.9,
      reviewCount: 200,
      description: "Experienced local guide for treks and sightseeing tours.",
      amenities: ["Local Transport", "Guide", "Photography"],
      availability: "Available"
    },
    {
      id: "7",
      image: "https://images.unsplash.com/photo-1621213328224-118e7e1b5b5c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYWJ T3wxfHx8fDE3NTc2NDI0OTF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      title: "Bhimtal Taxi Service",
      type: "Cabs", // Matches "Cabs" in filter sidebar
      location: "Bhimtal",
      price: "₹1,500",
      rating: 4.3,
      reviewCount: 75,
      description: "Reliable taxi service for local and inter-city travel.",
      amenities: ["AC", "Comfortable Seats", "Local Transport"],
      availability: "Available"
    },
    {
      id: "8",
      image: "https://images.unsplash.com/photo-1543781358-001d9f10927c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiaHJhaG1hc3RoYWxpJTIwaG90ZWxfZ3VpZGV8ZW58MXx8fHwxNzU3NjQyNDkyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      title: "Brahmasthali Lodge",
      type: "Hotels", // Matches "Hotels" in filter sidebar
      location: "Brahmasthali",
      price: "₹2,500",
      rating: 4.1,
      reviewCount: 50,
      description: "Secluded lodge perfect for spiritual retreats near ancient temples.",
      amenities: ["WiFi", "Restaurant", "Parking"],
      availability: "Available"
    },
    {
      id: "9",
      image: "https://images.unsplash.com/photo-1607746882042-944635dfe10e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
      title: "Sunset Valley Resort",
      type: "Resort",
      location: "Mukteshwar",
      price: "₹5,200",
      rating: 4.6,
      reviewCount: 112,
      description: "Hilltop resort with panoramic sunset views and yoga retreats.",
      amenities: ["WiFi", "Yoga Deck", "Restaurant", "Parking", "Room Service"],
      availability: "Available"
    },
    {
      id: "10",
      image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
      title: "Kainchi Dham Trek",
      type: "Trek",
      location: "Kainchi",
      price: "₹900",
      rating: 4.7,
      reviewCount: 65,
      description: "Peaceful forest trek to Neem Karoli Baba’s ashram.",
      amenities: ["Guide", "Snacks", "Transport", "Photography"],
      availability: "5 spots left"
    },
    {
      id: "11",
      image: "https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
      title: "Sattal Lakeside",
      type: "Place",
      location: "Sattal",
      price: "Free",
      rating: 4.6,
      reviewCount: 180,
      description: "Cluster of seven lakes surrounded by pine forests.",
      amenities: ["Boating", "Bird Watching", "Picnic", "Parking"],
      availability: "Always open"
    },
    {
      id: "12",
      image: "https://images.unsplash.com/photo-1583337130417-3346a1f4f8d1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
      title: "Scooter Rentals - Mukteshwar",
      type: "Bike",
      location: "Mukteshwar",
      price: "₹600",
      rating: 4.4,
      reviewCount: 98,
      description: "Affordable scooters for hill station travel.",
      amenities: ["Helmet", "Fuel", "Insurance"],
      availability: "6 scooters available"
    },
    {
      id: "13",
      image: "https://images.unsplash.com/photo-1560347876-aeef00ee58a1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
      title: "Pine Crest Hotel",
      type: "Hotels",
      location: "Bhimtal",
      price: "₹3,200",
      rating: 4.3,
      reviewCount: 110,
      description: "Elegant hotel with pine forest views and modern amenities.",
      amenities: ["WiFi", "Restaurant", "Parking", "Room Service"],
      availability: "Available"
    },
    {
      id: "14",
      image: "https://images.unsplash.com/photo-1549921296-3a6b3b3c3b3e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
      title: "Guide - Meena from Sattal",
      type: "Guides",
      location: "Sattal",
      price: "₹700",
      rating: 4.8,
      reviewCount: 140,
      description: "Friendly local guide for birdwatching and nature walks.",
      amenities: ["Guide", "Photography", "Local Transport"],
      availability: "Available"
    },
    {
      id: "15",
      image: "https://images.unsplash.com/photo-1607746882042-944635dfe10e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
      title: "Taxi Service - Mukteshwar",
      type: "Cabs",
      location: "Mukteshwar",
      price: "₹1,800",
      rating: 4.2,
      reviewCount: 60,
      description: "Comfortable cabs for sightseeing and airport transfers.",
      amenities: ["AC", "Driver", "Local Transport"],
      availability: "Available"
    },
    {
      id: "16",
      image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
      title: "Temple View Lodge",
      type: "Hotels",
      location: "Kainchi",
      price: "₹2,800",
      rating: 4.0,
      reviewCount: 45,
      description: "Simple lodge near Kainchi Dham with vegetarian meals.",
      amenities: ["WiFi", "Restaurant", "Parking"],
      availability: "Available"
    },
    {
      id: "17",
      image: "https://images.unsplash.com/photo-1583337130417-3346a1f4f8d1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
      title: "Adventure Trek - Pangot",
      type: "Trek",
      location: "Pangot",
      price: "₹1,500",
      rating: 4.6,
      reviewCount: 78,
      description: "Thrilling trek through dense oak forests and bird habitats.",
      amenities: ["Guide", "Meals", "Trek Gear", "Transport"],
      availability: "2 spots left"
    },
    {
      id: "18",
      image: "https://images.unsplash.com/photo-1560347876-aeef00ee58a1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
      title: "Pangot Birding Spot",
      type: "Place",
      location: "Pangot",
      price: "Free",
      rating: 4.9,
      reviewCount: 210,
      description: "Famous birdwatching destination with over 200 species.",
      amenities: ["Photography", "Picnic", "Parking"],
      availability: "Always open"
    },
    {
      id: "19",
      image: "https://images.unsplash.com/photo-1549921296-3a6b3b3c3b3e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
      title: "Bike Rentals - Pangot",
      type: "Bike",
      location: "Pangot",
      price: "₹550",
      rating: 4.5,
      reviewCount: 88,
      description: "Mountain bikes for forest trails and village rides.",
      amenities: ["Helmet", "Fuel", "Insurance"],
      availability: "8 bikes available"
    },
    {
      id: "20",
      image: "https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
      title: "Taxi Service - Pangot",
      type: "Cabs",
      location: "Pangot",
      price: "₹1,200",
      rating: 4.4,
      reviewCount: 55,
      description: "Local taxi service for forest and village tours.",
      amenities: ["AC", "Driver", "Local Transport"],
      availability: "Available"
    }

  ];

  // Filtering logic
  const getFilteredResults = () => {
    let currentResults = [...allResults]; // Always start with a fresh copy of all results

    // 1. Filter by global searchQuery first (fuzzy search across relevant fields)
    if (searchQuery) {
      const lowerCaseSearchQuery = searchQuery.toLowerCase();
      currentResults = currentResults.filter((item) => {
        const titleMatch = item.title.toLowerCase().includes(lowerCaseSearchQuery);
        const descriptionMatch = item.description.toLowerCase().includes(lowerCaseSearchQuery);
        const locationMatch = item.location.toLowerCase().includes(lowerCaseSearchQuery);
        // Handle "Hotels" vs "Hotel", "Resorts" vs "Resort", etc.
        const typeMatch = item.type.toLowerCase().startsWith(lowerCaseSearchQuery.replace(/s$/, ''));
        const amenitiesMatch = item.amenities && item.amenities.some(amenity => amenity.toLowerCase().includes(lowerCaseSearchQuery));

        return titleMatch || descriptionMatch || locationMatch || typeMatch || amenitiesMatch;
      });
    }

    // 2. Apply filters from FilterSidebar to the search-filtered results
    return currentResults.filter((item) => {
      // Price Range
      const priceNum = parseInt(item.price.replace(/[^\d]/g, "")) || 0;
      // If price is 'Free', it's usually assumed to pass. Adjust logic if 'Free' should be affected by min price.
      if (item.price.toLowerCase() !== "free" && filters.priceRange && (priceNum < filters.priceRange[0] || priceNum > filters.priceRange[1])) {
        return false;
      }

      // Rating
      if (filters.rating && filters.rating.length > 0) {
        // If any selected rating (e.g., "4+ stars") is met, pass
        const passesRating = filters.rating.some(r => item.rating >= parseInt(r));
        if (!passesRating) return false;
      }

      // Type
      if (filters.type && filters.type.length > 0) {
        const itemTypeLower = item.type.toLowerCase(); // e.g., "resort"
        const filterTypesLower = filters.type.map(f => f.toLowerCase().replace(/s$/, '')); // e.g., "hotels" -> "hotel", "resorts" -> "resort"

        // Check if the item's type (singular) matches any of the filter types (singular)
        const matchesType = filterTypesLower.some(ft => itemTypeLower.startsWith(ft));
        if (!matchesType) return false;
      }

      // Location
      if (filters.location && filters.location.length > 0 && !filters.location.includes(item.location)) {
        return false;
      }

      // Amenities
      if (filters.amenities && filters.amenities.length > 0) {
        // Check if the item has ALL of the selected amenities
        const hasAllAmenities = filters.amenities.every(a => item.amenities && item.amenities.includes(a));
        if (!hasAllAmenities) return false;
      }

      return true; // If all filters pass
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
      case "popularity":
        // Assuming 'reviewCount' could represent popularity
        return [...results].sort((a, b) => (b.reviewCount || 0) - (a.reviewCount || 0));
      case "distance":
        // This would require actual distance data, currently just returns as is
        return results;
      default:
        return results;
    }
  };

  const filteredAndSortedResults = sortResults(getFilteredResults());

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header
        isLoggedIn={isLoggedIn}
        onSearch={handleSearch}
        userName={userName}
        onLogoClick={handleLogoClick}
        onMenuToggle={() => setShowMobileMenu(!showMobileMenu)}
        showMobileMenu={showMobileMenu}
      />

      <main className="container mx-auto px-4 py-8 flex-1"> {/* Flex-1 to make it grow, container for max-width */}
        {/* Top Section: Back button and Search Results title */}
        <div className="mb-6"> {/* Added margin-bottom for spacing */}
          <Button variant="ghost" onClick={handleBackToHome} className="mb-4 pl-0"> {/* Removed left padding for button */}
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>

          <h1 className="text-3xl font-bold mb-1"> {/* Increased font size for prominence */}
            Search Results
            {searchQuery && ` for "${searchQuery}"`}
            {selectedCategory && ` in ${selectedCategory}`}
          </h1>
          <p className="text-muted-foreground text-lg"> {/* Increased font size */}
            {filteredAndSortedResults.length} results found
          </p>
        </div>

        {/* Main Content: Filters and Listing Cards */}
        {/* On mobile, it will stack. On large screens (lg), it will be a grid. */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filter Sidebar - occupies 1 column on desktop, full width on mobile */}
          <div className="lg:col-span-1 overflow-y-auto  ">
            <FilterSidebar
              filters={filters}
              onFilterChange={setFilters}
              onClearFilters={clearFilters}
              isMobile={isMobile}
              allResults={allResults}
            />
          </div>

          {/* Listing Cards - occupies 3 columns on desktop, full width on mobile */}
          {/* Added custom scrollbar hiding for both directions */}
          <div className="lg:col-span-3 space-y-6 lg:overflow-y-auto lg:max-h-[calc(100vh-theme(spacing.16)-theme(spacing.8))] scrollbar-hide">
            {filteredAndSortedResults.length > 0 ? (
              filteredAndSortedResults.map((result) => (
                <ListingCard
                  key={result.id}
                  {...result}
                  onViewDetails={() =>
                    handleViewDetails(result.id, getDetailType(result.type))
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
}