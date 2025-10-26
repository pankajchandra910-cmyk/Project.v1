import React, { useState, useCallback, useContext, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { GlobalContext } from "../component/GlobalContext"; // Import GlobalContext
import { placeDetailsData } from "../assets/dummy"; // Import the dummy data

import { Button } from "../component/button";
import { Card, CardContent, CardHeader, CardTitle } from "../component/Card";
import { Badge } from "../component/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../component/tabs";
import { FAQSection } from "../component/FAQSection";
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
  Info,
  Car,
  Plane,
  Train,
  Bike,
  Users,
  Home,
  Bed,
  Wifi,
  Fish,
  Bird,
  Activity,
  Book,
} from "lucide-react";

const iconMap = {
  Car: Car,
  Plane: Plane,
  Train: Train,
  Bike: Bike,
  Mountain: Mountain,
  Sunrise: Sunrise,
  Camera: Camera,
  TreePine: TreePine,
  Info: Info,
  Clock: Clock,
  Users: Users,
  Home: Home,
  Bed: Bed,
  Wifi: Wifi,
  Fish: Fish,
  Bird: Bird,
  Activity: Activity,
  Book: Book,
};

export default function PlaceDetailsPage() {
  const navigate = useNavigate();
  const { placeId } = useParams();
  const { setSelectedItemId, setSelectedDetailType ,setFocusArea} = useContext(GlobalContext);

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [placeData, setPlaceData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    if (placeId) {
      const data = placeDetailsData[placeId];
      if (data) {
        setPlaceData(data);
        setLoading(false);
        setCurrentImageIndex(0);
      } else {
        setError("Place not found.");
        setLoading(false);
        setPlaceData(null);
      }
    } else {
      setError("No place ID provided.");
      setLoading(false);
      setPlaceData(null);
    }
  }, [placeId]);

  const handleBack = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  const handleGetDirections = useCallback((lat, lng, name) => {
    const focusId = placeId.toLowerCase().replace(/\s/g, '-');
    setFocusArea(focusId);
    navigate(`/map-view/${focusId}?destLat=${lat}&destLng=${lng}&destName=${encodeURIComponent(name)}`);
  }, [navigate, setFocusArea, placeId]);

  const handleViewDetails = useCallback((id, type) => {
    setSelectedItemId(id);
    setSelectedDetailType(type);
    const routeMap = {
      hotel: `/hotel-details/${id}`,
      popular:`/popular-details/${id}`,
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
      "historic site": `/place-details/${id}`,
    };
    const path = routeMap[type.toLowerCase()] || "/";
    navigate(path);
  }, [navigate, setSelectedItemId, setSelectedDetailType]);

  const nextImage = useCallback(() => {
    if (placeData && placeData.images && placeData.images.length > 0) {
      setCurrentImageIndex((prev) => (prev + 1) % placeData.images.length);
    }
  }, [placeData]);

  const prevImage = useCallback(() => {
    if (placeData && placeData.images && placeData.images.length > 0) {
      setCurrentImageIndex((prev) => (prev - 1 + placeData.images.length) % placeData.images.length);
    }
  }, [placeData]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        Loading place details...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen text-red-600">
        Error: {error}
        <Button variant="link" onClick={handleBack}>Go Back</Button>
      </div>
    );
  }

  if (!placeData) {
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-600">
        No place data available.
        <Button variant="link" onClick={handleBack}>Go Back</Button>
      </div>
    );
  }

  const whatToExpectItems = placeData.whatToExpect
    ? placeData.whatToExpect.map(item => ({
        ...item,
        icon: iconMap[item.icon] || Info
      }))
    : [];

  const isHotelPage = placeData.id.includes("hotel") || placeData.id.includes("resort");

  return (
    <div
      className="min-h-screen"
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.1)), url('${placeData.images[0]}')`,
        backgroundPosition: 'center',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed',
        backgroundColor: '#f9fafb'
      }}
    >
      <div className="bg-white/95 backdrop-blur-sm shadow-sm px-4 py-3 md:px-6 sticky top-0 z-10">
        <Button variant="ghost" onClick={handleBack} className="mb-0">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Places
        </Button>
      </div>

      <div className="container mx-auto px-4 py-6 max-w-6xl">
        <div className="relative mb-6">
          <div className="relative h-64 md:h-96 rounded-lg overflow-hidden shadow-lg">
            <img
              src={placeData.images[currentImageIndex]}
              alt={`${placeData.name} - Image ${currentImageIndex + 1}`}
              className="w-full h-full object-cover"
            />
            {placeData.images.length > 1 && (
              <>
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
                  {placeData.images.map((_, index) => (
                    <div
                      key={index}
                      className={`w-2 h-2 rounded-full cursor-pointer transition-colors ${
                        index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                      }`}
                      onClick={() => setCurrentImageIndex(index)}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white/95 backdrop-blur-sm rounded-lg p-6 shadow-sm">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold mb-2">{placeData.name}</h1>
                  <div className="flex items-center space-x-2 text-muted-foreground mb-2">
                    <MapPin className="w-4 h-4" />
                    <span>{placeData.location}</span>
                  </div>
                  <div className="flex items-center space-x-4 flex-wrap gap-2">
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium">{placeData.rating}</span>
                      <span className="text-muted-foreground">({placeData.reviewCount} reviews)</span>
                    </div>
                    {!isHotelPage && placeData.entryFee && (
                       <Badge className="bg-green-100 text-green-800">{placeData.entryFee}</Badge>
                    )}
                    {placeData.difficulty && (
                      <Badge variant="outline">{placeData.difficulty}</Badge>
                    )}
                    {isHotelPage && placeData.price && (
                       <Badge className="bg-primary text-primary-foreground">Starting from {placeData.price}</Badge>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
                {!isHotelPage ? (
                  <>
                    {placeData.duration && (
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4 text-primary" />
                        <div>
                          <div className="text-sm font-medium">Duration</div>
                          <div className="text-xs text-muted-foreground">{placeData.duration}</div>
                        </div>
                      </div>
                    )}
                    {placeData.bestTime && (
                      <div className="flex items-center space-x-2">
                        <Sunrise className="w-4 h-4 text-primary" />
                        <div>
                          <div className="text-sm font-medium">Best Time</div>
                          <div className="text-xs text-muted-foreground">{placeData.bestTime}</div>
                        </div>
                      </div>
                    )}
                    {placeData.difficulty && (
                      <div className="flex items-center space-x-2">
                        <Mountain className="w-4 h-4 text-primary" />
                        <div>
                          <div className="text-sm font-medium">Difficulty</div>
                          <div className="text-xs text-muted-foreground">{placeData.difficulty}</div>
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    <div className="flex items-center space-x-2">
                      <Star className="w-4 h-4 text-primary" />
                      <div>
                        <div className="text-sm font-medium">Rating</div>
                        <div className="text-xs text-muted-foreground">{placeData.rating} ({placeData.reviewCount} reviews)</div>
                      </div>
                    </div>
                    {placeData.checkInTime && (
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4 text-primary" />
                        <div>
                          <div className="text-sm font-medium">Check-in</div>
                          <div className="text-xs text-muted-foreground">{placeData.checkInTime}</div>
                        </div>
                      </div>
                    )}
                    {placeData.checkOutTime && (
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4 text-primary" />
                        <div>
                          <div className="text-sm font-medium">Check-out</div>
                          <div className="text-xs text-muted-foreground">{placeData.checkOutTime}</div>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>

              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="photos">Photos</TabsTrigger>
                  <TabsTrigger value="reviews">Reviews</TabsTrigger>
                  <TabsTrigger value="nearby">Nearby</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-6 mt-6">
                  <div>
                    <h3 className="font-semibold mb-3">About {placeData.name}</h3>
                    <p className="text-muted-foreground leading-relaxed">{placeData.description}</p>
                  </div>

                  {placeData.highlights && placeData.highlights.length > 0 && (
                    <div>
                      <h3 className="font-semibold mb-3">Highlights</h3>
                      <div className="grid md:grid-cols-2 gap-2">
                        {placeData.highlights.map((highlight, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-primary rounded-full shrink-0" />
                            <span className="text-sm">{highlight}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {whatToExpectItems && whatToExpectItems.length > 0 && (
                    <div>
                      <h3 className="font-semibold mb-3">What to Expect</h3>
                      <div className="grid md:grid-cols-2 gap-4">
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
                        )})}
                      </div>
                    </div>
                  )}

                  {placeData.accessibility && (
                    <div>
                      <h3 className="font-semibold mb-3">Accessibility & Info</h3>
                      <div className="space-y-3 p-4 bg-blue-50 rounded-lg">
                        <div className="grid md:grid-cols-2 gap-4">
                          {placeData.accessibility.difficulty && (
                            <div>
                              <span className="text-sm font-medium">Difficulty:</span>
                              <span className="text-sm ml-2">{placeData.accessibility.difficulty}</span>
                            </div>
                          )}
                          {placeData.accessibility.duration && (
                            <div>
                              <span className="text-sm font-medium">Duration:</span>
                              <span className="text-sm ml-2">{placeData.accessibility.duration}</span>
                            </div>
                          )}
                          {placeData.accessibility.distance && (
                            <div>
                              <span className="text-sm font-medium">Distance:</span>
                              <span className="text-sm ml-2">{placeData.accessibility.distance}</span>
                            </div>
                          )}
                          {placeData.accessibility.transport && (
                            <div>
                              <span className="text-sm font-medium">Transport:</span>
                              <span className="text-sm ml-2">{placeData.accessibility.transport}</span>
                            </div>
                          )}
                        </div>
                        {placeData.accessibility.facilities && placeData.accessibility.facilities.length > 0 && (
                          <div>
                            <span className="text-sm font-medium">Facilities:</span>
                            <div className="flex flex-wrap gap-2 mt-1">
                              {placeData.accessibility.facilities.map((facility, idx) => (
                                <Badge key={idx} variant="secondary" className="text-xs">{facility}</Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {placeData.tips && placeData.tips.length > 0 && (
                    <div>
                      <h3 className="font-semibold mb-3">
                        <Info className="w-4 h-4 inline mr-2" />
                        Visitor Tips
                      </h3>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        {placeData.tips.map((tip, index) => (
                          <li key={index} className="flex items-start">
                            <span className="text-primary mr-2">•</span>
                            {tip}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="photos" className="mt-6">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {placeData.images.map((image, index) => (
                      <img
                        key={index}
                        src={image}
                        alt={`${placeData.name} - Photo ${index + 1}`}
                        className="w-full h-32 md:h-40 object-cover rounded-lg cursor-pointer hover:opacity-80 transition-opacity shadow-sm"
                        onClick={() => setCurrentImageIndex(index)}
                      />
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="reviews" className="mt-6">
                  <div className="space-y-4">
                    {placeData.reviews && placeData.reviews.length > 0 ? (
                        placeData.reviews.map((review, index) => (
                            <div key={index} className="border-b pb-4 last:border-b-0">
                                <div className="flex items-center space-x-2 mb-2">
                                    <div className="flex">
                                        {Array(5).fill(0).map((_, i) => (
                                            <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                                        ))}
                                    </div>
                                    <span className="font-medium">{review.author}</span>
                                    <span className="text-sm text-muted-foreground">{review.date}</span>
                                </div>
                                <p className="text-muted-foreground leading-relaxed">{review.comment}</p>
                            </div>
                        ))
                    ) : (
                        <p className="text-muted-foreground">No reviews available yet.</p>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="nearby" className="mt-6">
                  <div className="space-y-6">
                    {placeData.nearbyAttractions && placeData.nearbyAttractions.length > 0 && (
                      <div>
                        <h3 className="font-semibold mb-3">Nearby Attractions</h3>
                        <div className="grid md:grid-cols-2 gap-4">
                          {placeData.nearbyAttractions.map((attraction, index) => (
                            <div
                                key={index}
                                className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors shadow-sm"
                                onClick={() => handleViewDetails(attraction.id, attraction.type)}
                            >
                              <div>
                                <h4 className="font-medium">{attraction.name}</h4>
                                <p className="text-sm text-muted-foreground">{attraction.type}</p>
                                <div className="flex items-center space-x-1 mt-1">
                                  <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                  <span className="text-xs">{attraction.rating}</span>
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="text-sm font-medium">{attraction.distance}</div>
                                <Button variant="outline" size="sm" className="mt-1" onClick={(e) => { e.stopPropagation(); handleViewDetails(attraction.id, attraction.type); }}>
                                  <Navigation className="w-3 h-3 mr-1" />
                                  View
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {placeData.nearbyHotels && placeData.nearbyHotels.length > 0 && (
                      <div>
                        <h3 className="font-semibold mb-3">Nearby Hotels</h3>
                        <div className="grid md:grid-cols-2 gap-4">
                          {placeData.nearbyHotels.map((hotel, index) => (
                            <div
                                key={index}
                                className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors shadow-sm"
                                onClick={() => handleViewDetails(hotel.id, "hotel")}
                            >
                              <div>
                                <h4 className="font-medium">{hotel.name}</h4>
                                <div className="flex items-center space-x-1 mt-1">
                                  <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                  <span className="text-xs">{hotel.rating}</span>
                                </div>
                                <p className="text-sm text-primary font-medium">{hotel.price}/night</p>
                              </div>
                              <div className="text-right">
                                <div className="text-sm font-medium">{hotel.distance}</div>
                                <Button variant="outline" size="sm" className="mt-1" onClick={(e) => { e.stopPropagation(); handleViewDetails(hotel.id, "hotel"); }}>
                                  View Hotel
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-20 space-y-4">
              <Card className="bg-white/95 backdrop-blur-sm shadow-sm">
                <CardHeader>
                  <CardTitle>{isHotelPage ? "Book Your Stay" : "Visit This Place"}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {isHotelPage ? (
                    <Button
                      className="w-full bg-primary hover:bg-primary/90"
                      size="lg"
                      onClick={() => console.log(`Booking ${placeData.name}`)}
                    >
                      <Home className="w-4 h-4 mr-2" />
                      Book Now
                    </Button>
                  ) : (
                    <Button
                      className="w-full bg-primary hover:bg-primary/90"
                      size="lg"
                      // Ensure lat and lng are passed for directions
                      onClick={() => handleGetDirections(placeData.lat, placeData.lng, placeData.name)}
                    >
                      <Navigation className="w-4 h-4 mr-2" />
                      Get Directions
                    </Button>
                  )}

                  <div className="space-y-3 text-sm">
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <h4 className="font-medium mb-2">Quick Info</h4>
                      <div className="space-y-1">
                        {!isHotelPage && placeData.entryFee && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Entry Fee:</span>
                            <span className="font-medium text-green-600">{placeData.entryFee}</span>
                          </div>
                        )}
                        {!isHotelPage && placeData.duration && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Duration:</span>
                            <span>{placeData.duration}</span>
                          </div>
                        )}
                        {placeData.bestTime && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Best Time:</span>
                            <span>{placeData.bestTime}</span>
                          </div>
                        )}
                        {isHotelPage && placeData.price && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Starting Price:</span>
                            <span className="font-medium">{placeData.price}/night</span>
                          </div>
                        )}
                        {isHotelPage && placeData.checkInTime && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Check-in:</span>
                            <span>{placeData.checkInTime}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {!isHotelPage && (
                <Card className="bg-white/95 backdrop-blur-sm shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-base">Need a Guide?</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-3">
                      Get a local guide for the best experience and safety.
                    </p>
                    <Button variant="outline" className="w-full" size="sm" onClick={() => handleViewDetails("local-guides", "guide")}>
                      Find Local Guides
                    </Button>
                  </CardContent>
                </Card>
              )}

              {placeData.faqs && placeData.faqs.length > 0 && (
                <FAQSection faqs={placeData.faqs} className="bg-white/95 backdrop-blur-sm shadow-sm" />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}