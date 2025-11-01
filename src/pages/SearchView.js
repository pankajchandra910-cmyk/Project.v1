import React, { useState, useContext, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { GlobalContext } from "../component/GlobalContext";
import { analytics } from "../firebase"; // Import Firebase Analytics
import { logEvent } from "firebase/analytics"; // Import logEvent

// --- Component Imports ---
import Header from "../component/Header";
import MobileMenu from "../component/MobileMenu";
import { Button } from "../component/button";
import FilterSidebar from "../component/FilterSidebar";
import ListingCard from "../component/ListingCard";
import { ArrowLeft } from "lucide-react";

export default function SearchView() {
    const navigate = useNavigate();

    const {
        isLoggedIn,
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        userName,
        showMobileMenu,
        setShowMobileMenu,
        isMobile,
        userType,
    } = useContext(GlobalContext);

    // Local state for all filter options
    const [filters, setFilters] = useState({
        priceRange: [500, 15000],
        rating: [],
        type: [],
        location: [],
        amenities: [],
        sortBy: "popularity", // Default sort
    });

    // Mock data for demonstration purposes
    const allResults = useMemo(() => ([
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
            rating: 2,
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
            rating: 3,
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
            type: "Hotels",
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
            type: "Guides",
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
            type: "Cabs",
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
            type: "Hotels",
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

    ]), []);


    // Derived unique lists for FilterSidebar options, memoized for performance
    const allResultTypes = useMemo(() => Array.from(new Set(allResults.map(item => item.type))), [allResults]);
    const allResultLocations = useMemo(() => Array.from(new Set(allResults.map(item => item.location))), [allResults]);
    const allResultAmenities = useMemo(() => Array.from(new Set(allResults.flatMap(item => item.amenities || []))), [allResults]);

    // Effect to log screen view for Firebase Analytics
    useEffect(() => {
        if (analytics) {
            logEvent(analytics, 'screen_view', {
                firebase_screen: 'Search',
                firebase_screen_class: 'SearchView',
                search_query: searchQuery || 'N/A',
                selected_category: selectedCategory || 'N/A'
            });
        }
    }, [searchQuery, selectedCategory]);

    // Effect to initialize filters based on global context (e.g., clicking a category on the Home page)
    useEffect(() => {
        if (selectedCategory && !filters.type.includes(selectedCategory)) {
            const categoryMap = { "Hotels & Resorts": "Resort", "Places to Visit": "Place", "Tours & Treks": "Trek", "Cabs & Taxis": "Cabs", "Local Guides": "Guides", "Rental Bikes": "Bike", "Hill Stays": "Hotels" };
            const mappedCategory = categoryMap[selectedCategory] || selectedCategory;
            setFilters(prev => ({ ...prev, type: [mappedCategory] }));
        }
    }, [selectedCategory, filters.type]);

    // Cleanup effect to reset the global category when leaving the search page
    useEffect(() => {
        return () => {
            setSelectedCategory("");
        };
    }, [setSelectedCategory]);

    // --- Handlers with GA Tracking ---

    const handleFilterChange = (newFilters) => {
        const activeFilters = Object.entries(newFilters)
            .filter(([key, value]) => (Array.isArray(value) ? value.length > 0 : value && key !== 'sortBy'))
            .map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(',') : value}`)
            .join(' | ');

        if (analytics && activeFilters) {
            logEvent(analytics, 'filter_search', { filter_details: activeFilters });
        }
        setFilters(newFilters);
    };

    const clearFilters = useCallback(() => {
        if (analytics) {
            logEvent(analytics, 'clear_filters', { source_page: 'Search' });
        }
        setFilters({ priceRange: [500, 15000], rating: [], type: [], location: [], amenities: [], sortBy: "popularity" });
        setSearchQuery("");
        setSelectedCategory("");
    }, [setSearchQuery, setSelectedCategory]);

    const handleViewDetails = useCallback((id, type, title) => {
        if (analytics) {
            logEvent(analytics, 'select_item', {
                item_list_name: 'Search Results',
                item_id: id,
                item_name: title,
                item_category: type
            });
        }
        navigate(`/details/${type}/${id}`);
    }, [navigate]);

    const handleBookNow = useCallback((id, title) => {
        if (analytics) {
            logEvent(analytics, 'begin_checkout', {
                source_page: 'Search',
                item_id: id,
                item_name: title
            });
        }
        navigate(`/book-item/${id}`);
    }, [navigate]);

    const handleBackToHome = useCallback(() => {
        setSearchQuery("");
        setSelectedCategory("");
        navigate("/");
        if (analytics) {
            logEvent(analytics, 'navigation', {
                action: 'back_to_home',
                from_page: 'Search',
            });
        }
    }, [navigate, setSearchQuery, setSelectedCategory]);

    const getDetailType = useCallback((type) => {
        // Map common categories to their detail page routes if needed, otherwise lowercase
        const typeMap = {
            "Resort": "popular",
            "Hotels": "hotel",
            "Trek": "trek",
            "Place": "place",
            "Bike": "bike",
            "Cabs": "cab",
            "Guides": "guide",
            // Add more mappings if your routes differ from item.type directly
        };
        return typeMap[type] || type.toLowerCase();
    }, []);

    // --- Filtering & Sorting Logic (Memoized) ---

    const filteredResults = useMemo(() => {
        let results = [...allResults];

        if (searchQuery) {
            const lowerQuery = searchQuery.toLowerCase();
            results = results.filter(item =>
                item.title.toLowerCase().includes(lowerQuery) ||
                item.description.toLowerCase().includes(lowerQuery) ||
                item.location.toLowerCase().includes(lowerQuery) ||
                item.type.toLowerCase().includes(lowerQuery)
            );
        }

        return results.filter(item => {
            const itemPrice = parseInt(item.price.replace(/[^\d]/g, "")) || 0;
            if (item.price.toLowerCase() !== "free" && (itemPrice < filters.priceRange[0] || itemPrice > filters.priceRange[1])) return false;
            if (filters.rating.length > 0 && !filters.rating.some(r => item.rating >= parseInt(r))) return false;
            if (filters.type.length > 0 && !filters.type.includes(item.type)) return false;
            if (filters.location.length > 0 && !filters.location.includes(item.location)) return false;
            if (filters.amenities.length > 0 && !filters.amenities.every(a => item.amenities && item.amenities.includes(a))) return false; // Ensure item.amenities exists
            return true;
        });
    }, [allResults, searchQuery, filters]);

    const sortedAndFilteredResults = useMemo(() => {
        const sortableResults = [...filteredResults];
        switch (filters.sortBy) {
            case "price-low": return sortableResults.sort((a, b) => (parseInt(a.price.replace(/[^\d]/g, "")) || 0) - (parseInt(b.price.replace(/[^\d]/g, "")) || 0));
            case "price-high": return sortableResults.sort((a, b) => (parseInt(b.price.replace(/[^\d]/g, "")) || 0) - (parseInt(a.price.replace(/[^\d]/g, "")) || 0));
            case "rating": return sortableResults.sort((a, b) => b.rating - a.rating);
            case "popularity":
            default: return sortableResults.sort((a, b) => (b.reviewCount || 0) - (a.reviewCount || 0));
        }
    }, [filteredResults, filters.sortBy]);

    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            <Header
                isLoggedIn={isLoggedIn}
                onSearch={setSearchQuery}
                userName={userName}
                onMenuToggle={() => setShowMobileMenu(!showMobileMenu)}
                showMobileMenu={showMobileMenu}
            />
            {showMobileMenu && <MobileMenu onClose={() => setShowMobileMenu(false)} userType={userType} />}

            <main className="container mx-auto px-4 py-8 flex-1">
                <div className="mb-6">
                    <Button variant="ghost" onClick={handleBackToHome} className="mb-4 pl-0">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Home
                    </Button>
                    <h1 className="text-3xl font-bold mb-1">
                        Search Results
                        {searchQuery && ` for "${searchQuery}"`}
                        {selectedCategory && !searchQuery && ` in ${selectedCategory}`}
                    </h1>
                    <p className="text-muted-foreground text-lg">
                        {sortedAndFilteredResults.length} results found
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    <div className="lg:col-span-1">
                        <FilterSidebar
                            filters={filters}
                            onFilterChange={handleFilterChange}
                            onClearFilters={clearFilters}
                            isMobile={isMobile}
                            allResultTypes={allResultTypes}
                            allResultLocations={allResultLocations}
                            allResultAmenities={allResultAmenities}
                        />
                    </div>

                    <div className="lg:col-span-3 space-y-6">
                        {sortedAndFilteredResults.length > 0 ? (
                            sortedAndFilteredResults.map((result) => (
                                <ListingCard
                                    key={result.id}
                                    {...result}
                                    onViewDetails={() => handleViewDetails(result.id, getDetailType(result.type), result.title)}
                                    onBookNow={() => handleBookNow(result.id, result.title)}
                                />
                            ))
                        ) : (
                            <div className="text-center py-20 bg-white rounded-lg shadow-sm">
                                <p className="text-xl font-semibold">No Results Found</p>
                                <p className="text-muted-foreground mt-2">Try adjusting your filters or search for something else.</p>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}