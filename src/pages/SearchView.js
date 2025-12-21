
import React, { useState, useContext, useEffect, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { GlobalContext } from "../component/GlobalContext";
import { analytics, db } from "../firebase";
import { collection, query, where, getDocs, limit } from "firebase/firestore";
import { logEvent } from "firebase/analytics";

// --- Components ---
import Header from "../component/Header";
import MobileMenu from "../component/MobileMenu";
import ListingCard from "../component/ListingCard"; 
import { Button } from "../component/button";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle, SheetFooter } from "../component/Sheet"; 
import { Badge } from "../component/badge";
import { Slider } from "../component/slider"; 
import Footer from "../component/Footer";

// --- Icons ---
import { ArrowLeft, Loader2, Filter as FilterIcon, Frown, Check, SlidersHorizontal, ArrowUpDown } from "lucide-react";

// --- CONSTANTS ---
// Moved outside components so it can be accessed globally
const CATEGORY_MAP = [
    { label: 'Resort/Hotel', value: 'resort-hotel' },
    { label: 'Hill Stays', value: 'hill-stays' },
    { label: 'Rental Bikes', value: 'rental-bikes' },
    { label: 'Cabs/Taxis', value: 'cabs-taxis' },
    { label: 'Local Guides', value: 'local-guides' },
    { label: 'Tours & Treks', value: 'tours-treks' },
    { label: 'General Services', value: 'other' } // Updated label for clarity
];

// --- UTILITY FUNCTIONS ---
const formatLabel = (str) => {
    if (!str || typeof str !== 'string') return "";
    return str
        .split(/[-_]/)
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
};

const calculateDisplayPrice = (item) => {
    const rawPrice = item.price ? parseInt(item.price.toString().replace(/[^\d]/g, "")) : 0;
    if (rawPrice > 0) return rawPrice;
    
    const findMin = (arr) => {
        if (!arr || !Array.isArray(arr) || arr.length === 0) return Infinity;
        const prices = arr.map(x => parseInt(x?.price || 0)).filter(x => !isNaN(x) && x > 0);
        return prices.length ? Math.min(...prices) : Infinity;
    };
    
    const cabPrice = item.listingDetails?.cabData?.pricing?.local ? parseInt(item.listingDetails.cabData.pricing.local) : Infinity;
    const roomPrice = findMin(item.listingDetails?.rooms);
    const bikePrice = findMin(item.listingDetails?.bikes);
    
    const validPrices = [rawPrice, roomPrice, bikePrice, cabPrice].filter(p => p !== Infinity && !isNaN(p) && p > 0);
    return validPrices.length > 0 ? Math.min(...validPrices) : 0;
};

// --- COMPONENT: CHECKBOX GROUP ---
const CheckboxGroup = ({ title, options, selected, onChange }) => {
    if (!options || options.length === 0) return null;
    return (
        <div className="mb-6 border-b border-gray-100 pb-5 last:border-0 last:pb-0">
            <h4 className="font-semibold text-gray-900 mb-3 text-sm flex items-center justify-between">
                {title}
                {selected.length > 0 && (
                   <span className="text-[10px] text-primary bg-primary/10 px-2 py-0.5 rounded-full">{selected.length}</span>
                )}
            </h4>
            <div className="space-y-1 max-h-[220px] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
                {options.map((opt) => {
                    const isSelected = selected.includes(opt);
                    return (
                        <label key={opt} className="flex items-center gap-3 cursor-pointer group select-none py-1.5 px-2 hover:bg-gray-50 rounded-md transition-all">
                            <div className={`
                                w-4 h-4 rounded-lg border flex items-center justify-center transition-all duration-200 shrink-0
                                ${isSelected ? 'bg-primary border-primary' : 'border-gray-300 bg-white group-hover:border-primary'}
                            `}>
                                {isSelected && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
                            </div>
                            <input 
                                type="checkbox" 
                                className="hidden"
                                checked={isSelected}
                                onChange={() => onChange(opt)}
                            />
                            <span className={`text-sm leading-none ${isSelected ? 'text-gray-900 font-medium' : 'text-gray-600 group-hover:text-gray-900'}`}>
                                {opt}
                            </span>
                        </label>
                    );
                })}
            </div>
        </div>
    );
};

// --- SIDEBAR CONTENT ---
const FilterSidebarContent = React.memo(({ filters, setFilters, filterOptions, onReset }) => {
    
    // Unified Toggle Function
    const toggleFilter = (field, value) => {
        setFilters(prev => {
            const list = prev[field] || [];
            return {
                ...prev,
                [field]: list.includes(value) ? list.filter(x => x !== value) : [...list, value]
            };
        });
    };

    // Determine which labels are currently selected based on internal values
    const selectedCategoryLabels = CATEGORY_MAP
        .filter(item => filters.type.includes(item.value))
        .map(item => item.label);

    const handleCategoryChange = (label) => {
        const item = CATEGORY_MAP.find(i => i.label === label);
        if (item) {
            toggleFilter('type', item.value);
        }
    };

    const hasCategory = filters.type.length > 0;
    
    // Visibility logic
    const showDifficulty = !hasCategory || filters.type.includes('tours-treks');
    const showVehicles = !hasCategory || filters.type.some(t => ['rental-bikes', 'cabs-taxis'].includes(t));
    const showGuides = !hasCategory || filters.type.includes('local-guides');
    const showGeneralServices = !hasCategory || filters.type.includes('other');
    
    return (
        <div className="h-full flex flex-col bg-white">
            <div className="flex-1 overflow-y-auto pb-24 lg:pb-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
                
                {/* 1. SORT BY */}
                <div className="mb-6 border-b border-gray-100 pb-5">
                    <h4 className="font-semibold text-gray-900 mb-3 text-sm flex items-center gap-2">
                        <ArrowUpDown className="w-3.5 h-3.5" /> Sort Results
                    </h4>
                    <div className="space-y-1">
                        {[
                            { label: 'Popularity', value: 'popularity' },
                            { label: 'Price: Low to High', value: 'price-low' },
                            { label: 'Price: High to Low', value: 'price-high' },
                            { label: 'Top Rated', value: 'rating' }
                        ].map((opt) => (
                            <div 
                                key={opt.value}
                                onClick={() => setFilters(prev => ({ ...prev, sortBy: opt.value }))}
                                className={`cursor-pointer text-sm py-2 px-2 -mx-2 rounded-md transition-colors flex items-center justify-between ${
                                    filters.sortBy === opt.value 
                                    ? 'bg-primary/5 text-primary font-medium' 
                                    : 'text-gray-600 hover:bg-gray-50'
                                }`}
                            >
                                {opt.label}
                                {filters.sortBy === opt.value && <Check className="w-4 h-4" />}
                            </div>
                        ))}
                    </div>
                </div>

                {/* 2. PRICE RANGE */}
                <div className="mb-6 border-b border-gray-100 pb-6 px-1">
                    <div className="flex items-center justify-between mb-4">
                        <h4 className="font-semibold text-gray-900 text-sm">Price Range</h4>
                        <span className="text-xs text-gray-500 font-medium">
                            ₹{filters.priceRange[0]} - ₹{filters.priceRange[1].toLocaleString()}
                        </span>
                    </div>
                    <div className="px-1">
                        <Slider
                            defaultValue={[0, 50000]}
                            value={filters.priceRange}
                            min={0}
                            max={50000}
                            step={500}
                            onValueChange={(val) => setFilters(prev => ({ ...prev, priceRange: val }))}
                            className="w-full cursor-pointer"
                        />
                    </div>
                </div>

                {/* 3. CATEGORY - FIXED LOGIC */}
                <CheckboxGroup 
                    title="Category" 
                    options={CATEGORY_MAP.map(i => i.label)}
                    selected={selectedCategoryLabels} 
                    onChange={handleCategoryChange}
                />

                {/* 4. LOCATIONS */}
                <CheckboxGroup 
                    title="Locations" 
                    options={filterOptions.locations} 
                    selected={filters.locations} 
                    onChange={(val) => toggleFilter('locations', val)} 
                />

                {/* 5. TREK DIFFICULTY */}
                {showDifficulty && filterOptions.difficulties.length > 0 && (
                    <CheckboxGroup 
                        title="Trek Difficulty" 
                        options={filterOptions.difficulties} 
                        selected={filters.difficulties} 
                        onChange={(val) => toggleFilter('difficulties', val)} 
                    />
                )}

                {/* 6. VEHICLE TYPES (Cabs & Bikes) */}
                {showVehicles && filterOptions.vehicleTypes.length > 0 && (
                    <CheckboxGroup 
                        title="Vehicle Types" 
                        options={filterOptions.vehicleTypes} 
                        selected={filters.vehicleTypes} 
                        onChange={(val) => toggleFilter('vehicleTypes', val)} 
                    />
                )}
                
                {/* 7. LOCAL GUIDES: LANGUAGES & EXPERTISE */}
                {showGuides && (
                    <>
                        {filterOptions.languages.length > 0 && (
                            <CheckboxGroup 
                                title="Languages Spoken" 
                                options={filterOptions.languages} 
                                selected={filters.languages} 
                                onChange={(val) => toggleFilter('languages', val)} 
                            />
                        )}
                        {filterOptions.guideSpecializations.length > 0 && (
                            <CheckboxGroup 
                                title="Guide Expertise" 
                                options={filterOptions.guideSpecializations} 
                                selected={filters.guideSpecializations} 
                                onChange={(val) => toggleFilter('guideSpecializations', val)} 
                            />
                        )}
                    </>
                )}

                {/* 8. GENERAL SERVICES */}
                {showGeneralServices && (
                     <>
                        {filterOptions.serviceTypes.length > 0 && (
                             <CheckboxGroup 
                                 title="Profession Type" 
                                 options={filterOptions.serviceTypes} 
                                 selected={filters.serviceTypes} 
                                 onChange={(val) => toggleFilter('serviceTypes', val)} 
                             />
                        )}
                        {filterOptions.serviceOfferings.length > 0 && (
                             <CheckboxGroup 
                                 title="Services Offered" 
                                 options={filterOptions.serviceOfferings} 
                                 selected={filters.serviceOfferings} 
                                 onChange={(val) => toggleFilter('serviceOfferings', val)} 
                             />
                        )}
                        {filterOptions.availabilities.length > 0 && (
                             <CheckboxGroup 
                                 title="Availability" 
                                 options={filterOptions.availabilities} 
                                 selected={filters.availabilities} 
                                 onChange={(val) => toggleFilter('availabilities', val)} 
                             />
                        )}
                     </>
                )}

                {/* 9. GENERAL AMENITIES */}
                {filterOptions.amenities.length > 0 && (
                    <CheckboxGroup 
                        title="Amenities & Features" 
                        options={filterOptions.amenities} 
                        selected={filters.amenities} 
                        onChange={(val) => toggleFilter('amenities', val)} 
                    />
                )}

            </div>

            {/* Mobile Footer */}
            <div className="lg:hidden absolute bottom-0 left-0 right-0 bg-white border-t p-4">
                 <Button className="w-full" onClick={onReset}>Clear Filters</Button>
            </div>
        </div>
    );
});

// --- MAIN SEARCH VIEW ---
export default function SearchView() {
    const navigate = useNavigate();
    const { 
        isLoggedIn, userName, showMobileMenu, setShowMobileMenu, userType,profession,
        searchQuery, setSearchQuery, selectedCategory, setSelectedCategory 
    } = useContext(GlobalContext);

    // State
    const [listings, setListings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

    // Filter State 
    const [filters, setFilters] = useState({
        priceRange: [0, 50000],
        type: [],
        locations: [],
        amenities: [],
        difficulties: [], 
        vehicleTypes: [],
        languages: [],
        guideSpecializations: [], 
        serviceTypes: [],        
        serviceOfferings: [],    
        availabilities: [],
        sortBy: "popularity" 
    });

    // 1. Fetch Listings
    useEffect(() => {
        let isMounted = true;
        const fetchListings = async () => {
            setLoading(true);
            try {
                const q = query(collection(db, "listings"), where("status", "==", "Active"), limit(200));
                const snapshot = await getDocs(q);
                
                if (isMounted) {
                    const data = snapshot.docs.map(doc => {
                        const raw = doc.data();
                        return { 
                            id: doc.id, 
                            ...raw, 
                            displayPrice: calculateDisplayPrice(raw),
                            reviewCount: raw.reviews || 0,
                            rating: raw.rating || 4.5
                        };
                    });
                    setListings(data);
                }
            } catch (err) {
                console.error("Fetch Error:", err);
            } finally {
                if(isMounted) setLoading(false);
            }
        };
        fetchListings();
        return () => { isMounted = false; };
    }, []);

    // 2. Initialize Category (Home Click)
    useEffect(() => {
        if (selectedCategory) {
            // Mapping incoming home page click strings to DB values
            const map = {
                "Hotels & Resorts": "resort-hotel",
                "Hill Stays": "hill-stays",
                "Rental Bikes": "rental-bikes",
                "Cabs & Taxis": "cabs-taxis",
                "Local Guides": "local-guides",
                "Tours & Treks": "tours-treks",
                "General Services": "other"
            };
            const key = map[selectedCategory] || selectedCategory;
            
            // Only update if not already selected to avoid infinite loops or overwrites
            if (key && !filters.type.includes(key)) {
                setFilters({
                   priceRange: [0, 50000],
                   type: [key], 
                   locations: [],
                   amenities: [],
                   difficulties: [],
                   vehicleTypes: [],
                   languages: [],
                   guideSpecializations: [],
                   serviceTypes: [],
                   serviceOfferings: [],
                   availabilities: [],
                   sortBy: "popularity"
                });
            }
        }
    }, [selectedCategory]); 

    // 3. Compute Dynamic Filter Options
    const filterOptions = useMemo(() => {
        const activeScope = filters.type.length > 0 
            ? listings.filter(l => filters.type.includes(l.profession))
            : listings;

        const options = {
            locations: new Set(),
            amenities: new Set(),
            difficulties: new Set(),
            vehicleTypes: new Set(),
            languages: new Set(),
            guideSpecializations: new Set(),
            serviceTypes: new Set(),
            serviceOfferings: new Set(),
            availabilities: new Set(),
        };

        const addOne = (set, val) => val && typeof val === 'string' && set.add(formatLabel(val));
        const addArr = (set, arr) => arr?.forEach(x => addOne(set, x));

        activeScope.forEach(item => {
            addOne(options.locations, item.location);
            
            const det = item.listingDetails || {};
            
            addArr(options.amenities, item.amenities); 
            addArr(options.amenities, det.roomAmenities);
            addArr(options.amenities, det.hillStayAmenities); 
            addArr(options.amenities, det.uniqueFeatures); 
            addArr(options.amenities, det.features); 
            addArr(options.amenities, det.inclusions); 
            
            if(det.tourData?.difficulty) addOne(options.difficulties, det.tourData.difficulty);

            det.bikes?.forEach(b => addOne(options.vehicleTypes, b.type));
            addArr(options.vehicleTypes, det.cabData?.availableVehicleTypes);

            addArr(options.languages, det.guideData?.languages);
            addArr(options.guideSpecializations, det.guideData?.specializations); 

            if(det.generalServiceData) {
                 addOne(options.serviceTypes, det.generalServiceData.serviceType); 
                 addArr(options.serviceOfferings, det.generalServiceData.services); 
                 if(det.generalServiceData.specializations) {
                     addArr(options.serviceOfferings, det.generalServiceData.specializations);
                 }
                 addOne(options.availabilities, det.generalServiceData.availability);
            }
        });

        const sortSet = (s) => Array.from(s).sort();
        return {
            locations: sortSet(options.locations),
            amenities: sortSet(options.amenities),
            difficulties: sortSet(options.difficulties),
            vehicleTypes: sortSet(options.vehicleTypes),
            languages: sortSet(options.languages),
            guideSpecializations: sortSet(options.guideSpecializations),
            serviceTypes: sortSet(options.serviceTypes),
            serviceOfferings: sortSet(options.serviceOfferings),
            availabilities: sortSet(options.availabilities)
        };
    }, [listings, filters.type]);

    // 4. Filtering Logic
    const filteredAndSortedResults = useMemo(() => {
        let results = listings.filter(item => {
            const det = item.listingDetails || {};

            // 1. Text Search
            if (searchQuery) {
                const q = searchQuery.toLowerCase();
                const textMatch = 
                    item.name?.toLowerCase().includes(q) || 
                    item.location?.toLowerCase().includes(q) ||
                    item.description?.toLowerCase().includes(q);
                if (!textMatch) return false;
            }

            // 2. Category
            if (filters.type.length > 0 && !filters.type.includes(item.profession)) return false;

            // 3. Price
            if (item.displayPrice < filters.priceRange[0] || item.displayPrice > filters.priceRange[1]) return false;

            // 4. Location
            if (filters.locations.length > 0 && !filters.locations.includes(formatLabel(item.location))) return false;

            // 5. Trek Difficulty
            if (filters.difficulties.length > 0) {
                 const d = formatLabel(det.tourData?.difficulty);
                 if (!filters.difficulties.includes(d)) return false;
            }

            // 6. Vehicle Types
            if (filters.vehicleTypes.length > 0) {
                 const available = new Set([
                     ...(det.bikes?.map(b => b.type) || []),
                     ...(det.cabData?.availableVehicleTypes || [])
                 ].map(formatLabel));
                 
                 const matches = filters.vehicleTypes.some(selected => available.has(selected));
                 if(!matches) return false;
            }

            // 7. Guides - Language
            if (filters.languages.length > 0) {
                 const speaks = (det.guideData?.languages || []).map(formatLabel);
                 if(!filters.languages.some(l => speaks.includes(l))) return false;
            }

            // 8. Guides - Expertise
            if (filters.guideSpecializations.length > 0) {
                 const specs = (det.guideData?.specializations || []).map(formatLabel);
                 if(!filters.guideSpecializations.some(s => specs.includes(s))) return false;
            }

            // 9. General Service - Type
            if (filters.serviceTypes.length > 0) {
                 const t = formatLabel(det.generalServiceData?.serviceType);
                 if (!filters.serviceTypes.includes(t)) return false;
            }

            // 10. General Service - Offerings
            if (filters.serviceOfferings.length > 0) {
                 const offers = [
                     ...(det.generalServiceData?.services || []),
                     ...(det.generalServiceData?.specializations || [])
                 ].map(formatLabel);
                 
                 if (!filters.serviceOfferings.some(o => offers.includes(o))) return false;
            }

            // 11. Availability
            if (filters.availabilities.length > 0) {
                 const avail = formatLabel(det.generalServiceData?.availability);
                 if(!filters.availabilities.includes(avail)) return false;
            }

            // 12. Amenities
            if (filters.amenities.length > 0) {
                 const features = [
                     ...(item.amenities || []),
                     ...(det.roomAmenities || []),
                     ...(det.hillStayAmenities || []),
                     ...(det.uniqueFeatures || []),
                     ...(det.features || []),
                     ...(det.inclusions || [])
                 ].map(formatLabel);

                 if(!filters.amenities.some(chk => features.includes(chk))) return false;
            }

            return true;
        });

        switch (filters.sortBy) {
            case "price-low": return results.sort((a, b) => a.displayPrice - b.displayPrice);
            case "price-high": return results.sort((a, b) => b.displayPrice - a.displayPrice);
            case "rating": return results.sort((a, b) => b.rating - a.rating);
            case "popularity": default: return results.sort((a, b) => b.reviewCount - a.reviewCount);
        }

    }, [listings, searchQuery, filters]);

    // Handlers
    const handleReset = useCallback(() => {
        setFilters({ 
            priceRange: [0, 50000], type: [], locations: [], 
            amenities: [], difficulties: [], vehicleTypes: [], 
            languages: [], guideSpecializations: [],
            serviceTypes: [], serviceOfferings: [], availabilities: [],
            sortBy: "popularity"
        });
        setSearchQuery("");
        setSelectedCategory("");
    }, [setSearchQuery, setSelectedCategory]);

    const handleBackToHome = useCallback(() => {
        handleReset();
        navigate("/");
    }, [navigate, handleReset]);

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

    const handleViewDetails = useCallback((id, profession) => {
        if(analytics) logEvent(analytics, 'select_item', { item_id: id });
        const routeMap = {
            "resort-hotel": `/hotel-details/${id}`, "hill-stays": `/hill-stays/${id}`, 
            "rental-bikes": `/rental-bikes/${id}`, "cabs-taxis": `/cab-details/${id}`, 
            "local-guides": `/local-guide-details/${id}`, "tours-treks": `/tours-details/${id}`,
            "other": `/general-services/${id}`
        };
        const path = routeMap[profession] || `/details/${id}`;
        navigate(path);
    }, [navigate]);

    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            <Header
                isLoggedIn={isLoggedIn}
                onSearch={setSearchQuery}
                userName={userName}
                onLogoClick={handleLogoClick}
                onProfileClick={handleProfileClick}
                onMenuToggle={() => setShowMobileMenu(!showMobileMenu)}
                showMobileMenu={showMobileMenu}
            />
            {showMobileMenu && <MobileMenu onClose={() => setShowMobileMenu(false)} userType={userType} />}

            <main className="container mx-auto px-4 py-8 flex-1 max-w-7xl">
                {/* Title & Mobile Filter Trigger */}
                <div className="mb-6">
                    <Button variant="ghost" onClick={handleBackToHome} className="mb-4 pl-0 hover:bg-transparent hover:text-primary transition-colors">
                        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
                    </Button>
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
                                {/* Use CATEGORY_MAP safely */}
                                {filters.type.length === 1 
                                    ? (CATEGORY_MAP.find(c => c.value === filters.type[0])?.label || formatLabel(filters.type[0]))
                                    : (searchQuery ? `"${searchQuery}" Results` : "Explore All")
                                }
                            </h1>
                            <p className="text-gray-500 mt-1">
                                {filteredAndSortedResults.length} properties found
                            </p>
                        </div>
                        
                        {/* Mobile Trigger */}
                        <div className="lg:hidden w-full md:w-auto">
                            <Sheet open={isMobileFilterOpen} onOpenChange={setIsMobileFilterOpen}>
                                <SheetTrigger asChild>
                                    <Button variant="outline" className="w-full justify-center bg-white h-12 border-gray-300">
                                        <SlidersHorizontal className="w-4 h-4 mr-2" /> Filters & Sort
                                        {(filters.amenities.length > 0 || filters.type.length > 0) && (
                                            <Badge variant="secondary" className="ml-2 bg-gray-900 text-white rounded-full h-5 w-5 p-0 flex items-center justify-center">!</Badge>
                                        )}
                                    </Button>
                                </SheetTrigger>
                                <SheetContent side="bottom" className="h-[90vh] rounded-t-[20px] p-0 bg-white">
                                    <SheetHeader className="px-5 py-4 border-b border-gray-100 text-left">
                                        <SheetTitle>Filters</SheetTitle>
                                    </SheetHeader>
                                    <div className="p-5 h-full overflow-hidden">
                                        <FilterSidebarContent 
                                            filters={filters} setFilters={setFilters} 
                                            filterOptions={filterOptions} onReset={handleReset} 
                                            onClose={() => setIsMobileFilterOpen(false)}
                                        />
                                    </div>
                                    <SheetFooter className="p-4 border-t">
                                        <Button className="w-full" onClick={() => setIsMobileFilterOpen(false)}>
                                            Show {filteredAndSortedResults.length} Results
                                        </Button>
                                    </SheetFooter>
                                </SheetContent>
                            </Sheet>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
                    
                    {/* Desktop Sidebar */}
                    <aside className="hidden lg:block lg:col-span-1 sticky top-24">
                        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col h-[calc(100vh-100px)]">
                            {/* Sticky Sidebar Header */}
                            <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50 backdrop-blur">
                                <div className="flex items-center gap-2 text-gray-900 font-semibold">
                                    <FilterIcon className="w-4 h-4 text-primary" /> Filters
                                </div>
                                {(filters.type.length > 0 || filters.locations.length > 0) && (
                                    <button onClick={handleReset} className="text-xs font-bold text-primary uppercase hover:underline">
                                        Clear
                                    </button>
                                )}
                            </div>
                            
                            <div className="p-5 overflow-y-auto flex-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
                                <FilterSidebarContent 
                                    filters={filters} setFilters={setFilters} 
                                    filterOptions={filterOptions} onReset={handleReset} 
                                    onClose={() => {}} 
                                />
                            </div>
                        </div>
                    </aside>

                    {/* Listings Results */}
                    <div className="lg:col-span-3 space-y-6 w-full min-h-[50vh]">
                         {loading ? (
                             <div className="flex flex-col items-center justify-center py-20 bg-white rounded-lg border border-dashed border-gray-200">
                                 <Loader2 className="w-8 h-8 animate-spin text-primary mb-3" />
                                 <p className="text-gray-500 text-sm animate-pulse">Finding matching listings...</p>
                             </div>
                         ) : filteredAndSortedResults.length > 0 ? (
                             filteredAndSortedResults.map(item => (
                                 <ListingCard
                                     key={item.id}
                                     id={item.id}
                                     image={item.photos?.[0] || ""}
                                     title={item.name}
                                     type={formatLabel(item.profession)}
                                     location={formatLabel(item.location)}
                                     price={item.displayPrice}
                                     description={item.description}
                                     availability={item.status === 'Active' ? 'Available' : 'Sold Out'}
                                     amenities={(() => {
                                         const allAm = new Set();
                                         const d = item.listingDetails || {};
                                         const add = arr => arr?.forEach(x => x && allAm.add(formatLabel(x)));
                                         add(item.amenities); 
                                         add(d.services); 
                                         add(d.uniqueFeatures); 
                                         add(d.cabData?.availableVehicleTypes);
                                         return Array.from(allAm).slice(0, 5); 
                                     })()}
                                     onViewDetails={() => handleViewDetails(item.id, item.profession)}
                                     onBookNow={() => navigate(`/book-item/${item.id}`)}
                                 />
                             ))
                         ) : (
                             <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl shadow-sm border border-gray-100 text-center px-4">
                                 <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                                     <Frown className="w-8 h-8 text-gray-300" />
                                 </div>
                                 <h3 className="text-xl font-bold text-gray-900 mb-1">No Matches Found</h3>
                                 <p className="text-gray-500 max-w-sm mb-6 text-sm">We couldn't find listings matching your exact filters.</p>
                                 <Button variant="outline" onClick={handleReset} className="min-w-[140px]">Reset Filters</Button>
                             </div>
                         )}
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}