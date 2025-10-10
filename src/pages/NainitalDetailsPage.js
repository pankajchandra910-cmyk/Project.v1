import React, { useState, useContext, useCallback, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom"; 
import { GlobalContext } from "../component/GlobalContext"; 

import { Button } from "../component/button"; 
import { Card, CardContent, CardHeader, CardTitle } from "../component/Card"; 
import { Badge } from "../component/badge"; 
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../component/tabs";
import { FAQSection } from "../component/FAQSection"; 
import { locationsData } from "../assets/dummy"; 

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
} from "lucide-react";

// Map icon names (strings) to Lucide React components
const iconMap = {
  Car: Car,
  Train: Train,
  Mountain: Mountain,
  Home: Home,
  Users: Users,
  Thermometer: Thermometer,
  // Add other icons if you use them as strings in locationsData
};

export default function NainitalDetailsPage() {
  const navigate = useNavigate();
  const { locationId } = useParams(); // Get locationId from URL
  const { setSelectedItemId, setSelectedDetailType } = useContext(GlobalContext);

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showAllViewpoints, setShowAllViewpoints] = useState(false);
  const [showAllHotels, setShowAllHotels] = useState(false);
  const [locationDetails, setLocationDetails] = useState(null); // State to hold dynamic location data
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    if (locationId) {
      const data = locationsData[locationId]; // Access data using the ID
      if (data) {
        setLocationDetails(data);
        setLoading(false);
        setCurrentImageIndex(0); // Reset image index for new location
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
  }, [locationId]); // Re-run effect when locationId changes

  const nextImage = useCallback(() => {
    if (locationDetails && locationDetails.images.length > 0) {
      setCurrentImageIndex((prev) => (prev + 1) % locationDetails.images.length);
    }
  }, [locationDetails]);

  const prevImage = useCallback(() => {
    if (locationDetails && locationDetails.images.length > 0) {
      setCurrentImageIndex((prev) => (prev - 1 + locationDetails.images.length) % locationDetails.images.length);
    }
  }, [locationDetails]);

  const handleBack = useCallback(() => {
    navigate(-1); // Go back to the previous page in history
  }, [navigate]);

  const handleGetDirections = useCallback((location) => {
    navigate(`/directions?to=${encodeURIComponent(location)}`);
  }, [navigate]);

  const handleViewDetails = useCallback((id, type) => {
    setSelectedItemId(id);
    setSelectedDetailType(type);
    const routeMap = {
      hotel: `/hotel-details/${id}`,
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
    };
    const path = routeMap[type.toLowerCase()] || "/";
    navigate(path);
  }, [navigate, setSelectedItemId, setSelectedDetailType]);

  const handleBookHotel = useCallback((hotelId) => {
    navigate(`/book-hotel/${hotelId}`);
  }, [navigate]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen text-red-600">
        Error: {error}
      </div>
    );
  }

  if (!locationDetails) {
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-600">
        No location data available.
      </div>
    );
  }

  // Use locationDetails for rendering
  const displayImage = locationDetails.images[currentImageIndex];
  const mainBackgroundImage = locationDetails.images[0]; // Or choose another default

  return (
    <div
      className="min-h-screen"
      style={{
        background: `linear-gradient(rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.1)), url('${mainBackgroundImage}') center/cover fixed`,
        backgroundColor: '#f9fafb'
      }}
    >
      {/* Header */}
      <div className="bg-white/95 backdrop-blur-sm shadow-sm px-4 py-3 md:px-6 sticky top-0 z-10">
        <Button variant="ghost" onClick={handleBack} className="mb-0">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Explore
        </Button>
      </div>

      <div className="container mx-auto px-4 py-6 max-w-6xl">
        {/* Image Carousel */}
        <div className="relative mb-6">
          <div className="relative h-64 md:h-96 rounded-lg overflow-hidden">
            <img
              src={displayImage} // Use displayImage for current carousel image
              alt={`${locationDetails.name} - Image ${currentImageIndex + 1}`}
              className="w-full h-full object-cover"
            />
            <Button
              variant="secondary"
              size="sm"
              onClick={prevImage}
              className="absolute left-4 top-1/2 -translate-y-1/2 opacity-80 hover:opacity-100"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={nextImage}
              className="absolute right-4 top-1/2 -translate-y-1/2 opacity-80 hover:opacity-100"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
              {locationDetails.images.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full cursor-pointer transition-colors ${
                    index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                  }`}
                  onClick={() => setCurrentImageIndex(index)}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Place Info */}
            <div className="bg-white/95 backdrop-blur-sm rounded-lg p-6 shadow-sm">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold mb-2">{locationDetails.name}</h1>
                  <div className="flex items-center space-x-2 text-muted-foreground mb-2">
                    <MapPin className="w-4 h-4" />
                    <span>{locationDetails.location}</span>
                  </div>
                  <div className="flex items-center space-x-4 flex-wrap gap-2">
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium">{locationDetails.rating}</span>
                      <span className="text-muted-foreground">({locationDetails.reviewCount.toLocaleString()} reviews)</span>
                    </div>
                    <Badge className="bg-green-100 text-green-800">{locationDetails.elevation}</Badge>
                    <Badge variant="outline">{locationDetails.bestTime}</Badge>
                  </div>
                </div>
              </div>

              {/* Quick Info */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6 p-4 bg-blue-50/80 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Thermometer className="w-4 h-4 text-primary" />
                  <div>
                    <div className="text-sm font-medium">Best Weather</div>
                    <div className="text-xs text-muted-foreground">{locationDetails.bestTime}</div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Mountain className="w-4 h-4 text-primary" />
                  <div>
                    <div className="text-sm font-medium">Elevation</div>
                    <div className="text-xs text-muted-foreground">{locationDetails.elevation}</div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4 text-primary" />
                  <div>
                    <div className="text-sm font-medium">Annual Visitors</div>
                    <div className="text-xs text-muted-foreground">500K+</div> {/* Placeholder, or add to data */}
                  </div>
                </div>
              </div>

              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="grid w-full grid-cols-5">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="routes">Routes</TabsTrigger>
                  <TabsTrigger value="attractions">Attractions</TabsTrigger>
                  <TabsTrigger value="hotels">Hotels</TabsTrigger>
                  <TabsTrigger value="activities">Activities</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-6 mt-6">
                  <div>
                    <h3 className="font-semibold mb-3">About {locationDetails.name.split(' - ')[0]}</h3>
                    <p className="text-muted-foreground leading-relaxed">{locationDetails.description}</p>
                  </div>

                  {locationDetails.localFood && locationDetails.localFood.length > 0 && (
                    <div>
                      <h3 className="font-semibold mb-3">Local Food Specialties</h3>
                      <div className="flex flex-wrap gap-2">
                        {locationDetails.localFood.map((food, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {food}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="routes" className="space-y-6 mt-6">
                  <div>
                    <h3 className="font-semibold mb-4">How to Reach {locationDetails.name.split(' - ')[0]}</h3>
                    <div className="space-y-4">
                      {locationDetails.routes.map((route, index) => {
                        const IconComponent = iconMap[route.icon] || Car; // Default to Car if icon not found
                        return (
                          <div key={index} className="border rounded-lg p-4 hover:bg-gray-50/50">
                            <div className="flex items-start space-x-3">
                              <IconComponent className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                              <div className="flex-1">
                                <h4 className="font-medium text-sm mb-1">{route.mode}</h4>
                                <div className="grid md:grid-cols-2 gap-2 text-xs text-muted-foreground mb-2">
                                  <span>Distance: {route.distance}</span>
                                  <span>Duration: {route.duration}</span>
                                </div>
                                <p className="text-xs text-muted-foreground mb-2">{route.route}</p>
                                <p className="text-xs">{route.details}</p>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="attractions" className="space-y-6 mt-6">
                  <div>
                    <h3 className="font-semibold mb-4">Popular Attractions ({locationDetails.popularSpots.length}+ Spots)</h3>
                    <div className="grid gap-4">
                      {locationDetails.popularSpots.slice(0, showAllViewpoints ? locationDetails.popularSpots.length : 6).map((spot, index) => (
                        <div key={index} className="border rounded-lg p-4 hover:bg-gray-50/50 cursor-pointer" onClick={() => handleViewDetails(spot.id, spot.type)}>
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-1">
                                <h4 className="font-medium text-sm">{spot.name}</h4>
                                <Badge variant="outline" className="text-xs">{spot.type}</Badge>
                              </div>
                              <p className="text-xs text-muted-foreground mb-2">{spot.description}</p>
                              <div className="flex items-center space-x-4 text-xs">
                                <div className="flex items-center space-x-1">
                                  <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                  <span>{spot.rating}</span>
                                </div>
                                <span className="text-muted-foreground">{spot.visitors} annual visitors</span>
                              </div>
                              <div className="flex flex-wrap gap-1 mt-2">
                                {spot.activities.map((activity, idx) => (
                                  <Badge key={idx} variant="secondary" className="text-xs py-0 px-2">
                                    {activity}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                            <Button variant="outline" size="sm">
                              <Navigation className="w-3 h-3 mr-1" />
                              Visit
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                    {!showAllViewpoints && locationDetails.popularSpots.length > 6 && (
                      <Button
                        variant="outline"
                        onClick={() => setShowAllViewpoints(true)}
                        className="w-full mt-4"
                      >
                        See More Attractions ({locationDetails.popularSpots.length - 6} more)
                      </Button>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="hotels" className="space-y-6 mt-6">
                  <div>
                    <h3 className="font-semibold mb-4">Recommended Hotels</h3>
                    <div className="grid gap-4">
                      {locationDetails.hotels.slice(0, showAllHotels ? locationDetails.hotels.length : 3).map((hotel, index) => (
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
                                {hotel.features.map((feature, idx) => (
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
                      ))}
                    </div>
                    {!showAllHotels && locationDetails.hotels.length > 3 && (
                      <Button
                        variant="outline"
                        onClick={() => setShowAllHotels(true)}
                        className="w-full mt-4"
                      >
                        See More Hotels ({locationDetails.hotels.length - 3} more)
                      </Button>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="activities" className="space-y-6 mt-6">
                  {locationDetails.boatingPoints && locationDetails.boatingPoints.length > 0 && (
                    <div>
                      <h3 className="font-semibold mb-4">Boating Points & Activities</h3>
                      <div className="space-y-4">
                        {locationDetails.boatingPoints.map((point, index) => (
                          <div key={index} className="border rounded-lg p-4 bg-blue-50/50">
                            <h4 className="font-medium text-sm mb-2">{point.name}</h4>
                            <p className="text-xs text-muted-foreground mb-3">{point.description}</p>
                            <div className="grid md:grid-cols-2 gap-4 text-xs">
                              <div>
                                <span className="font-medium">Location:</span> {point.location}
                              </div>
                              <div>
                                <span className="font-medium">Timings:</span> {point.timings}
                              </div>
                            </div>
                            <div className="mt-3">
                              <span className="font-medium text-xs">Rates:</span>
                              <div className="flex flex-wrap gap-2 mt-1">
                                {Object.entries(point.rates).map(([type, rate]) => (
                                  <Badge key={type} variant="outline" className="text-xs">
                                    {type}: {rate}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                            <div className="mt-2">
                              <span className="font-medium text-xs">Views:</span>
                              <span className="text-xs text-muted-foreground ml-1">
                                {point.views.join(", ")}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {(!locationDetails.boatingPoints || locationDetails.boatingPoints.length === 0) && (
                      <p className="text-muted-foreground">No specific boating activities listed for this location.</p>
                  )}
                </TabsContent>
              </Tabs>
            </div>
          </div>

          {/* Quick Actions Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-20 space-y-4">
              <Card className="bg-white/95 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>Plan Your Visit</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button
                    className="w-full bg-primary hover:bg-primary/90"
                    size="lg"
                    onClick={() => handleGetDirections(locationDetails.name)}
                  >
                    <Navigation className="w-4 h-4 mr-2" />
                    Get Directions
                  </Button>

                  <div className="space-y-3 text-sm">
                    <div className="p-3 bg-green-50/80 rounded-lg">
                      <h4 className="font-medium mb-2">Quick Info</h4>
                      <div className="space-y-1">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">From Delhi:</span>
                          <span className="font-medium">
                            {locationDetails.routes.find(r => r.mode.includes("Delhi"))?.distance || "N/A"} /
                            {locationDetails.routes.find(r => r.mode.includes("Delhi"))?.duration || "N/A"}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Best Season:</span>
                          <span>{locationDetails.bestTime}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Annual Visitors:</span>
                          <span className="text-green-600">500K+</span> {/* Still hardcoded as it wasn't in dynamic data */}
                        </div>
                      </div>
                    </div>
                  </div>

                  <Button variant="outline" className="w-full" onClick={() => handleViewDetails("local-guides", "guide")}>
                    <Users className="w-4 h-4 mr-2" />
                    Find Local Guides
                  </Button>
                </CardContent>
              </Card>

              {/* FAQ Section */}
              {locationDetails.faqs && locationDetails.faqs.length > 0 && (
                <FAQSection faqs={locationDetails.faqs} className="bg-white/95 backdrop-blur-sm" />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}