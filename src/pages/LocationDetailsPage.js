import React, { useState, useContext, useCallback, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { analytics } from "../firebase"; // Import Firebase Analytics
import { logEvent } from "firebase/analytics"; // Import logEvent
import { GlobalContext } from "../component/GlobalContext";
import { Button } from "../component/button";
import { Card, CardContent, CardHeader, CardTitle } from "../component/Card";
import { Badge } from "../component/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../component/tabs";
import { FAQSection } from "../component/FAQSection";
import { locationsData } from "../assets/dummy"; // Assuming this path is correct
import {
  ArrowLeft,
  Star,
  MapPin,
  Navigation,
  Clock,
  Camera,
  Mountain,
  ChevronLeft,
  ChevronRight,
  Sunrise,
  TreePine,
  Car,
  Train,
  Bus,
  Phone,
  Waves,
  Binoculars,
  Home,
  Users,
  Thermometer,
  Info,
  ShoppingCart,
  Utensils,
  Footprints
} from "lucide-react";

// Mapping of icon names to Lucide-React components
const iconMap = {
  Car: Car,
  Train: Train,
  Bus: Bus,
  Mountain: Mountain,
  Home: Home,
  Users: Users,
  Thermometer: Thermometer,
  Sunrise: Sunrise,
  Camera: Camera,
  TreePine: TreePine,
  Clock: Clock,
  Waves: Waves,
  Binoculars: Binoculars,
  Info: Info,
  ShoppingCart: ShoppingCart,
  Utensils: Utensils,
  Walking: Footprints,
};

export default function LocationDetailsPage() {
  const navigate = useNavigate();
  const { locationId } = useParams();
  const { setSelectedItemId, setSelectedDetailType, setFocusArea, locationDetails, setLocationDetails } = useContext(GlobalContext);

  // State variables for UI logic
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showAllViewpoints, setShowAllViewpoints] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Effect hook to load location details and track page view
  useEffect(() => {
    setLoading(true);
    setError(null);

    if (locationId) {
      // Safely access data from locationsData, handling potential array wrapping
      // The original code `locationsData[locationId]` already handles this implicitly if the data structure is consistent.
      // If `locationsData[locationId]` could sometimes be an array of one item, then the previous line was correct.
      // Assuming `locationsData[locationId]` directly returns the object.
      const data = locationsData[locationId];

      if (data) {
        setLocationDetails(data);
        setLoading(false);
        setCurrentImageIndex(0); // Reset image index on new location load

        // --- Firebase Analytics Event Tracking for Location View ---
        if (analytics) {
          logEvent(analytics, 'view_item', {
            item_category: 'Location',
            item_id: locationId,
            item_name: data.name,
            value: data.annualVisitors || 0
          });
        }
        // --- End of Firebase Analytics Tracking ---

      } else {
        setError("Location not found.");
        setLoading(false);
        setLocationDetails(null);
      }
    } else {
      setError("No location ID provided.");
      setLoading(false);
      setLocationDetails(null);
    }
  }, [locationId, setLocationDetails]);

  // Callback for navigating to the next image in the gallery
  const nextImage = useCallback(() => {
    if (locationDetails?.gallery?.length > 0) {
      const newIndex = (currentImageIndex + 1) % locationDetails.gallery.length;
      setCurrentImageIndex(newIndex);
      // Firebase Analytics event for next image navigation
      if (analytics) {
        logEvent(analytics, 'select_content', { content_type: 'image_gallery', item_id: `${locationDetails.name} - Image ${newIndex + 1}` });
      }
    }
  }, [locationDetails, currentImageIndex]);

  // Callback for navigating to the previous image in the gallery
  const prevImage = useCallback(() => {
    if (locationDetails?.gallery?.length > 0) {
      const newIndex = (currentImageIndex - 1 + locationDetails.gallery.length) % locationDetails.gallery.length;
      setCurrentImageIndex(newIndex);
      // Firebase Analytics event for previous image navigation
      if (analytics) {
        logEvent(analytics, 'select_content', { content_type: 'image_gallery', item_id: `${locationDetails.name} - Image ${newIndex + 1}` });
      }
    }
  }, [locationDetails, currentImageIndex]);

  // Callback for direct image selection via dots
  const handleImageDotClick = useCallback((index) => {
    setCurrentImageIndex(index);
    // Firebase Analytics event for image dot navigation
    if (analytics) {
      logEvent(analytics, 'select_content', { content_type: 'image_dot_nav', item_id: `${locationDetails.name} - Image ${index + 1}` });
    }
  }, [locationDetails]);

  // Callback for handling the back button click
  const handleBack = useCallback(() => {
    // Firebase Analytics event for back button click
    if (analytics) {
      logEvent(analytics, 'navigation_back', { from_page: 'LocationDetails' });
    }
    navigate(-1);
  }, [navigate]);

  // Callback for getting directions to a specific point
  const handleGetDirections = useCallback((lat, lng, name) => {
    // Firebase Analytics event for getting directions
    if (analytics) {
      logEvent(analytics, 'get_directions', { item_name: name, location_context: locationDetails?.name });
    }
    const currentFocusId = locationDetails?.id || "nainital-area"; // Fallback focus area
    setFocusArea(currentFocusId);
    navigate(`/map-view/${currentFocusId}?destLat=${lat}&destLng=${lng}&destName=${encodeURIComponent(name)}`);
  }, [navigate, setFocusArea, locationDetails]);

  // Callback for viewing details of an item (hotel, place, etc.)
  const handleViewDetails = useCallback((id, type) => {
    // Firebase Analytics event for viewing item details
    if (analytics) {
      logEvent(analytics, 'select_item', { item_list_name: 'Location Details Page', item_id: id, item_category: type });
    }
    setSelectedItemId(id);
    setSelectedDetailType(type);

    // Map item types to their respective detail routes
    const routeMap = {
      hotel: `/hotel-details/${id}`,
      popular: `/popular-details/${id}`,
      place: `/place-details/${id}`,
      trek: `/trek-details/${id}`,
      bike: `/bike-details/${id}`,
      cab: `/cab-details/${id}`,
      guide: `/guide-details/${id}`,
      resort: `/hotel-details/${id}`,
      viewpoint: `/place-details/${id}`,
      lake: `/place-details/${id}`,
      adventure: `/place-details/${id}`,
      wildlife: `/place-details/${id}`,
      temple: `/place-details/${id}`,
      "nature trail": `/place-details/${id}`,
      "wildlife sanctuary": `/place-details/${id}`,
      "temple/ashram": `/place-details/${id}`,
    };
    const path = routeMap[type.toLowerCase()] || "/";
    navigate(path);
  }, [navigate, setSelectedItemId, setSelectedDetailType]);

  // Callback for booking a hotel - This is currently not used in the UI, but kept for future use if hotels tab becomes active
  // const handleBookHotel = useCallback((hotelId) => {
  //   // Firebase Analytics event for initiating hotel booking
  //   if (analytics) {
  //     logEvent(analytics, 'begin_checkout', { item_category: 'Hotel', item_id: hotelId, source_page: 'LocationDetails', location_context: locationDetails?.name });
  //   }
  //   navigate(`/book-hotel/${hotelId}`);
  // }, [navigate, locationDetails]);

  // Callback for handling tab changes
  const handleTabChange = useCallback((value) => {
    // Firebase Analytics event for tab selection
    if (analytics) {
      logEvent(analytics, 'select_content', { content_type: 'tab', item_id: value, location_context: locationDetails?.name });
    }
  }, [locationDetails]);

  // Callback for seeing more attractions
  const handleSeeMoreAttractions = useCallback(() => {
    setShowAllViewpoints(true);
    // Firebase Analytics event for "See More Attractions"
    if (analytics) {
      logEvent(analytics, 'view_more', { content_type: 'Attractions', location_context: locationDetails?.name });
    }
  }, [locationDetails]);

  // Callback for finding local guides
  const handleFindLocalGuides = useCallback(() => {
    // Firebase Analytics event for "Find Local Guides"
    if (analytics) {
      logEvent(analytics, 'find_guides', { source_page: 'LocationDetails', location_context: locationDetails?.name });
    }
    handleViewDetails("local-guides", "guide"); // Assuming "local-guides" is a valid ID for guides
  }, [locationDetails, handleViewDetails]);

  // --- Render Loading, Error, or No Data States ---
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-700">
        Loading location details...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen text-red-600 p-4">
        <p className="text-lg font-semibold mb-4">Error: {error}</p>
        <Button variant="link" onClick={handleBack}>Go Back</Button>
      </div>
    );
  }

  if (!locationDetails) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen text-gray-600 p-4">
        <p className="text-lg font-semibold mb-4">No location data available.</p>
        <Button variant="link" onClick={handleBack}>Go Back</Button>
      </div>
    );
  }

  // Determine image and background image
  const displayImage = locationDetails.gallery?.[currentImageIndex] || locationDetails.image;
  const mainBackgroundImage = locationDetails.gallery?.[0] || locationDetails.image;

  // Prepare data for "What to Expect" and "Other Activities"
  const whatToExpectItems = locationDetails.whatToExpect?.map(item => ({
    ...item,
    icon: iconMap[item.icon] || Info
  })) || [];

  const otherActivitiesItems = locationDetails.otherActivities?.map(activity => ({
    ...activity,
    icon: iconMap[activity.icon] || Info
  })) || [];

  // Helper function to get Delhi route info
  const delhiRoute = locationDetails.routes?.find(r => r.mode.includes("Delhi"));

  return (
    <div
      className="min-h-screen bg-gray-50"
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.1)), url('${mainBackgroundImage}')`,
        backgroundPosition: 'center',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed',
      }}
    >
      {/* Back Button and Header */}
      <div className="bg-white/95 backdrop-blur-sm shadow-sm px-4 py-3 md:px-6 sticky top-0 z-10">
        <Button variant="ghost" onClick={handleBack} className="mb-0">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Explore
        </Button>
      </div>

      <div className="container mx-auto px-4 py-6 max-w-6xl">
        {/* Image Gallery Section */}
        <div className="relative mb-6">
          <div className="relative h-56 sm:h-64 md:h-80 lg:h-96 rounded-lg overflow-hidden shadow-lg">
            <img
              src={displayImage}
              alt={`${locationDetails.name} - Image ${currentImageIndex + 1}`}
              className="w-full h-full object-cover"
            />
            {locationDetails.gallery && locationDetails.gallery.length > 1 && (
              <>
                <Button
                  variant="secondary"
                  size="icon"
                  onClick={prevImage}
                  className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 opacity-80 hover:opacity-100 rounded-full h-8 w-8 sm:h-10 sm:w-10"
                >
                  <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                </Button>
                <Button
                  variant="secondary"
                  size="icon"
                  onClick={nextImage}
                  className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 opacity-80 hover:opacity-100 rounded-full h-8 w-8 sm:h-10 sm:w-10"
                >
                  <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                </Button>
                <div className="absolute bottom-2 sm:bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
                  {locationDetails.gallery.map((_, index) => (
                    <div
                      key={index}
                      className={`w-2 h-2 rounded-full cursor-pointer transition-colors ${
                        index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                      }`}
                      onClick={() => handleImageDotClick(index)}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Details and Tabs */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white/95 backdrop-blur-sm rounded-lg p-4 sm:p-6 shadow-md">
              {/* Location Header */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold mb-1">{locationDetails.name.split(' - ')[0]}</h1>
                  <div className="flex items-center space-x-2 text-muted-foreground text-sm mb-2">
                    <MapPin className="w-4 h-4" />
                    <span>{locationDetails.location}</span>
                  </div>
                  <div className="flex items-center flex-wrap gap-x-4 gap-y-2">
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium text-sm">{locationDetails.rating}</span>
                      <span className="text-muted-foreground text-xs">({locationDetails.reviewCount?.toLocaleString() || 0} reviews)</span>
                    </div>
                    {locationDetails.elevation && (
                      <Badge className="bg-green-100 text-green-800 text-xs">{locationDetails.elevation}</Badge>
                    )}
                    {locationDetails.bestTime && (
                      <Badge variant="outline" className="text-xs">{locationDetails.bestTime}</Badge>
                    )}
                  </div>
                </div>
              </div>

              {/* Quick Facts Section */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6 p-4 bg-blue-50/80 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Thermometer className="w-5 h-5 text-primary shrink-0" />
                  <div>
                    <div className="text-sm font-medium">Weather</div>
                    <div className="text-xs text-muted-foreground">{locationDetails.bestTime || "N/A"}</div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Mountain className="w-5 h-5 text-primary shrink-0" />
                  <div>
                    <div className="text-sm font-medium">Elevation</div>
                    <div className="text-xs text-muted-foreground">{locationDetails.elevation || "N/A"}</div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="w-5 h-5 text-primary shrink-0" />
                  <div>
                    <div className="text-sm font-medium">Visitors</div>
                    <div className="text-xs text-muted-foreground">{locationDetails.annualVisitors?.toLocaleString() || "N/A"}</div>
                  </div>
                </div>
              </div>

              {/* Tabs Section */}
              <Tabs defaultValue="overview" className="w-full" onValueChange={handleTabChange}>
                <TabsList className="grid w-full grid-cols-5 sm:grid-cols-5 md:grid-cols-5">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="routes">Routes</TabsTrigger>
                  <TabsTrigger value="attractions">Attractions</TabsTrigger>
                  <TabsTrigger value="hotels">Hotels</TabsTrigger>
                  <TabsTrigger value="activities">Activities</TabsTrigger>
                </TabsList>

                {/* Overview Tab Content */}
                <TabsContent value="overview" className="space-y-6 mt-6">
                  <div>
                    <h3 className="font-semibold mb-3">About {locationDetails.name.split(' - ')[0]}</h3>
                    <p className="text-muted-foreground leading-relaxed text-sm">{locationDetails.description}</p>
                  </div>

                  {locationDetails.highlights?.length > 0 && (
                    <div>
                      <h3 className="font-semibold mb-3">Highlights</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {locationDetails.highlights.map((highlight, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-primary rounded-full shrink-0" />
                            <span className="text-sm">{highlight}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {whatToExpectItems.length > 0 && (
                    <div>
                      <h3 className="font-semibold mb-3">What to Expect</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {whatToExpectItems.map((item, index) => {
                          const IconComponent = item.icon;
                          return (
                            <div key={index} className="flex items-start space-x-3 p-3 border rounded-lg">
                              <IconComponent className="w-5 h-5 text-primary mt-1 shrink-0" />
                              <div>
                                <h4 className="font-medium text-sm">{item.title}</h4>
                                <p className="text-xs text-muted-foreground mt-1">{item.desc}</p>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )}

                  {locationDetails.localFood?.length > 0 && (
                     <div>
                      <h3 className="font-semibold mb-3">Local Food Specialties</h3>
                       <div className="flex flex-wrap gap-2">
                         {locationDetails.localFood.map((food, index) => (
                           <Badge key={index} variant="secondary" className="text-xs">{food}</Badge>
                         ))}
                       </div>
                     </div>
                   )}

                  {locationDetails.tips?.length > 0 && (
                    <div>
                      <h3 className="font-semibold mb-3 flex items-center"><Info className="w-4 h-4 mr-2" /> Visitor Tips</h3>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        {locationDetails.tips.map((tip, index) => (
                          <li key={index} className="flex items-start">
                            <span className="text-primary mr-2 mt-1">•</span>
                            <span>{tip}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </TabsContent>

                {/* Routes Tab Content */}
                <TabsContent value="routes" className="space-y-6 mt-6">
                    <div>
                        <h3 className="font-semibold mb-4">How to Reach {locationDetails.name.split(' - ')[0]}</h3>
                        <div className="space-y-4">
                        {locationDetails.routes?.length > 0 ? (
                            locationDetails.routes.map((route, index) => {
                            const IconComponent = iconMap[route.icon] || Car;
                            return (
                                <div key={index} className="border rounded-lg p-4 hover:bg-gray-50/50">
                                <div className="flex items-start space-x-3">
                                    <IconComponent className="w-5 h-5 text-primary mt-1 shrink-0" />
                                    <div className="flex-1">
                                    <h4 className="font-medium text-sm mb-1">{route.mode}</h4>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 text-xs text-muted-foreground mb-2">
                                        <span>Distance: {route.distance}</span>
                                        <span>Duration: {route.duration}</span>
                                    </div>
                                    <p className="text-xs text-muted-foreground mb-2">{route.route}</p>
                                    <p className="text-xs">{route.details}</p>
                                    </div>
                                </div>
                                </div>
                            );
                            })
                        ) : (
                            <p className="text-muted-foreground">No route information available for this location.</p>
                        )}
                        </div>
                    </div>
                </TabsContent>

                {/* Attractions Tab Content */}
                <TabsContent value="attractions" className="space-y-6 mt-6">
                  <div>
                    <h3 className="font-semibold mb-4">Popular Attractions ({locationDetails.popularSpots?.length || 0}+ Spots)</h3>
                    <div className="grid gap-4">
                      {locationDetails.popularSpots?.length > 0 ? (
                        locationDetails.popularSpots.slice(0, showAllViewpoints ? locationDetails.popularSpots.length : 6).map((spot) => (
                          <div key={spot.id} className="border rounded-lg p-4 hover:bg-gray-50/50 transition-colors cursor-pointer" onClick={() => handleViewDetails(spot.id, spot.type)}>
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                              <div className="flex-1">
                                <div className="flex items-center flex-wrap gap-x-2 mb-1">
                                  <h4 className="font-medium text-sm">{spot.name}</h4>
                                  <Badge variant="outline" className="text-xs">{spot.type}</Badge>
                                </div>
                                <p className="text-xs text-muted-foreground mb-2">{spot.description}</p>
                                <div className="flex items-center flex-wrap gap-x-4 gap-y-1 text-xs">
                                  <div className="flex items-center space-x-1">
                                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                    <span>{spot.rating}</span>
                                  </div>
                                  {spot.visitors && <span className="text-muted-foreground">{spot.visitors} annual visitors</span>}
                                </div>
                                {spot.activities?.length > 0 &&
                                    <div className="flex flex-wrap gap-1 mt-2">
                                    {spot.activities.map((activity, idx) => (
                                        <Badge key={idx} variant="secondary" className="text-xs py-0.5 px-2">{activity}</Badge>
                                    ))}
                                    </div>
                                }
                              </div>
                              <Button variant="outline" size="sm" className="w-full sm:w-auto mt-2 sm:mt-0" onClick={(e) => { e.stopPropagation(); handleViewDetails(spot.id, spot.type); }}>
                                <Navigation className="w-3 h-3 mr-1.5" />
                                Visit
                              </Button>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-muted-foreground">No popular attractions listed for this location.</p>
                      )}
                    </div>
                    {!showAllViewpoints && locationDetails.popularSpots && locationDetails.popularSpots.length > 6 && (
                      <Button variant="outline" onClick={handleSeeMoreAttractions} className="w-full mt-4">
                        See More Attractions ({locationDetails.popularSpots.length - 6} more)
                      </Button>
                    )}
                  </div>
                </TabsContent>

                {/* Hotels Tab Content - Coming Soon */}
                <TabsContent value="hotels" className="space-y-6 mt-6">
                    <div className="min-h-[200px] flex items-center justify-center bg-gray-100 p-4 rounded-lg">
                        <div className="text-center">
                            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#228B22] mb-4 animate-pulse">
                              Page Coming Soon
                            </h2>
                            <p className="text-lg md:text-xl text-gray-600">
                              We're working hard to bring you something great!
                            </p>
                        </div>
                        <style jsx>{`
                          @keyframes pulse {
                            0%, 100% { opacity: 1; }
                            50% { opacity: 0.7; }
                          }
                          .animate-pulse {
                            animation: pulse 2s infinite ease-in-out;
                          }
                        `}</style>
                    </div>
                    {/* <div>
                    <h3 className="font-semibold mb-4">Recommended Hotels</h3>
                    <div className="grid gap-4">
                      {locationDetails.hotels && locationDetails.hotels.length > 0 ? (
                        locationDetails.hotels.slice(0, showAllHotels ? locationDetails.hotels.length : 3).map((hotel, index) => (
                          <div key={index} className="border rounded-lg p-4 hover:bg-gray-50/50">
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                <div className="flex items-center space-x-2 mb-1">
                                  <h4 className="font-medium text-sm">{hotel.name}</h4>
                                  <div className="flex items-center space-x-1">
                                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                    <span className="text-xs">{hotel.rating}</span>
                                  </div>
                                </div>
                                <p className="text-xs text-muted-foreground mb-2">{hotel.description}</p>
                                <div className="flex items-center space-x-4 text-xs mb-2">
                                  <span className="text-muted-foreground">{hotel.distance}</span>
                                  <span className="text-primary font-medium">{hotel.price}/night</span>
                                </div>
                                <div className="flex flex-wrap gap-1">
                                  {hotel.features && hotel.features.map((feature, idx) => (
                                    <Badge key={idx} variant="secondary" className="text-xs py-0 px-2">
                                      {feature}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleBookHotel(hotel.id)}
                              >
                                <Home className="w-3 h-3 mr-1" />
                                Book
                              </Button>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-muted-foreground">No recommended hotels listed for this location.</p>
                      )}
                    </div>
                    {!showAllHotels && locationDetails.hotels && locationDetails.hotels.length > 3 && (
                      <Button
                        variant="outline"
                        onClick={handleSeeMoreHotels}
                        className="w-full mt-4"
                      >
                        See More Hotels ({locationDetails.hotels.length - 3} more)
                      </Button>
                    )}
                  </div> */}
                </TabsContent>

                {/* Activities Tab Content */}
                <TabsContent value="activities" className="space-y-6 mt-6">
                 {locationDetails.boatingPoints?.length > 0 && (
                    <div>
                      <h3 className="font-semibold mb-4">Boating Points & Activities</h3>
                      <div className="space-y-4">
                        {locationDetails.boatingPoints.map((point, index) => (
                          <div key={index} className="border rounded-lg p-4 bg-blue-50/50 shadow-sm">
                            <h4 className="font-medium text-sm mb-2">{point.name}</h4>
                            <p className="text-xs text-muted-foreground mb-3">{point.description}</p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                              <div><span className="font-medium">Location:</span> {point.location}</div>
                              <div><span className="font-medium">Timings:</span> {point.timings}</div>
                            </div>
                            <div className="mt-3">
                              <span className="font-medium text-xs">Rates:</span>
                              <div className="flex flex-wrap gap-2 mt-1">
                                {Object.entries(point.rates || {}).map(([type, rate]) => (
                                  <Badge key={type} variant="outline" className="text-xs">{type}: {rate}</Badge>
                                ))}
                              </div>
                            </div>
                            <div className="mt-2">
                              <span className="font-medium text-xs">Views:</span>
                              <span className="text-xs text-muted-foreground ml-1">{point.views?.join(", ") || "N/A"}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {otherActivitiesItems.length > 0 && (
                    <div className={locationDetails.boatingPoints?.length > 0 ? "mt-6" : ""}>
                      <h3 className="font-semibold mb-4">Other Adventures & Activities</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {otherActivitiesItems.map((activity, index) => {
                          const IconComponent = activity.icon;
                          return (
                            <div key={index} className="border rounded-lg p-4 hover:bg-gray-50/50 shadow-sm">
                              <div className="flex items-start space-x-3">
                                <IconComponent className="w-5 h-5 text-primary mt-1 shrink-0" />
                                <div>
                                  <h4 className="font-medium text-sm mb-1">{activity.name}</h4>
                                  <p className="text-xs text-muted-foreground">{activity.description}</p>
                                  {activity.price && <p className="text-xs font-medium mt-1">Price: {activity.price}</p>}
                                </div>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )}

                  {otherActivitiesItems.length === 0 && (locationDetails.boatingPoints?.length === 0 || !locationDetails.boatingPoints) && (
                       <p className="text-muted-foreground">No specific activities listed for this location.</p>
                  )}
                </TabsContent>
              </Tabs>
            </div>
          </div>

          {/* Right Column - Plan Your Visit & FAQs */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-4">
              <Card className="bg-white/95 backdrop-blur-sm shadow-md">
                <CardHeader>
                  <CardTitle>Plan Your Visit</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button
                    className="w-full bg-primary hover:bg-primary/90"
                    size="lg"
                    onClick={() => handleGetDirections(locationDetails.lat, locationDetails.lng, locationDetails.name)}
                  >
                    <Navigation className="w-4 h-4 mr-2" />
                    Get Directions
                  </Button>

                  <div className="space-y-3 text-sm">
                    <div className="p-3 bg-green-50/80 rounded-lg">
                      <h4 className="font-medium mb-2">Quick Info</h4>
                      <div className="space-y-1.5">
                        {delhiRoute &&
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">From Delhi:</span>
                            <span className="font-medium text-right">
                              {delhiRoute.distance} / {delhiRoute.duration}
                            </span>
                          </div>
                        }
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Best Season:</span>
                          <span className="font-medium text-right">{locationDetails.bestTime || "N/A"}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Visitors:</span>
                          <span className="font-medium text-green-600">{locationDetails.annualVisitors?.toLocaleString() || "N/A"}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Button variant="outline" className="w-full" onClick={handleFindLocalGuides}>
                    <Users className="w-4 h-4 mr-2" />
                    Find Local Guides
                  </Button>
                </CardContent>
              </Card>

              {locationDetails.faqs?.length > 0 && (
                <FAQSection faqs={locationDetails.faqs} className="bg-white/95 backdrop-blur-sm shadow-md" />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}