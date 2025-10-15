import React, { useState, useCallback, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { GlobalContext } from "../component/GlobalContext"; // Adjust path as needed
import { hotelDetailsData } from "../assets/dummy"; // Import hotelDetailsData

import { Button } from "../component/button";
import { Card, CardContent, CardHeader, CardTitle } from "../component/Card";
import { Badge } from "../component/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../component/tabs";
import { FAQSection } from "../component/FAQSection"; // Assuming you have an FAQSection component

import {
  ArrowLeft,
  Star,
  MapPin,
  Wifi,
  Car,
  Waves,
  Coffee,
  Utensils,
  Calendar,
  Users,
  ChevronLeft,
  ChevronRight,
  Navigation,
  Phone,
  Mail,
  Shield,
  Info // Default icon for unmapped amenities
} from "lucide-react";

// Map icon names (strings) to Lucide React components
const iconMap = {
  Wifi: Wifi,
  Car: Car,
  Waves: Waves,
  Coffee: Coffee,
  Utensils: Utensils,
  Shield: Shield,
  Calendar: Calendar,
  Users: Users,
  Phone: Phone,
  Mail: Mail,
  Star: Star,
  MapPin: MapPin,
  Navigation: Navigation,
  Info: Info, // Default fallback
  // Add any other Lucide icons you might use as strings in your amenity data
};

export default function HotelDetailsPage() {
  const navigate = useNavigate();
  const { hotelId } = useParams(); // Get hotelId from the URL (e.g., /hotel-details/:hotelId)
  const { setFocusArea, setSelectedItemId, setSelectedDetailType } = useContext(GlobalContext);

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [hotelData, setHotelData] = useState(null); // State to hold dynamic hotel data
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Ref to measure the height of the booking card for dynamic FAQ sticky top
  const bookingCardRef = React.useRef(null);
  const [faqStickyTop, setFaqStickyTop] = useState(450); // Default, will be calculated dynamically

  useEffect(() => {
    setLoading(true);
    setError(null);
    if (hotelId) {
      const data = hotelDetailsData[hotelId]; // Fetch data using the ID
      if (data) {
        setHotelData(data);
        setLoading(false);
        setCurrentImageIndex(0); // Reset image index for new hotel
      } else {
        setError("Hotel not found.");
        setLoading(false);
        setHotelData(null);
      }
    } else {
      setError("No hotel ID provided.");
      setLoading(false);
      setHotelData(null);
    }
  }, [hotelId]); // Re-run effect when hotelId changes

  // Effect to calculate the sticky top for FAQ section
  useEffect(() => {
    const calculateFaqStickyTop = () => {
      if (bookingCardRef.current) {
        const bookingCardHeight = bookingCardRef.current.offsetHeight;
        const bookingCardTopOffset = 80; // This corresponds to 'top-20' in Tailwind CSS
        const gapBetweenElements = 16; // This corresponds to 'gap-4' in Tailwind CSS
        setFaqStickyTop(bookingCardTopOffset + bookingCardHeight + gapBetweenElements);
      }
    };

    calculateFaqStickyTop(); // Calculate on initial render

    // Recalculate if window resizes (heights might change)
    window.addEventListener('resize', calculateFaqStickyTop);
    // Recalculate if hotelData changes (content might change height)
    // This is a simplified approach, a MutationObserver might be more robust for content changes
    if (hotelData) {
      setTimeout(calculateFaqStickyTop, 100); // Small delay to ensure content is rendered
    }


    return () => {
      window.removeEventListener('resize', calculateFaqStickyTop);
    };
  }, [hotelData]); // Recalculate when hotelData changes

  const handleBack = useCallback(() => {
    navigate(-1); // Go back to the previous page in history
  }, [navigate]);

  const handleBookNow = useCallback((id) => {
    console.log("Booking hotel with ID:", id);
    // Implement actual booking logic here, e.g., navigate to a booking form
    // navigate(`/book-hotel/${id}`);
  }, []);

  const handleViewMap = useCallback((locationName) => {
    // This assumes your map view can handle a location name directly, or you'd pass coordinates
    const focusId = hotelId.toLowerCase().replace(/\s/g, '-');
    setFocusArea(focusId); // Set focus area in global context for the map
    navigate(`/map-view/${focusId}?destName=${encodeURIComponent(locationName)}`);
  }, [navigate, setFocusArea, hotelId]);

  const handleViewNearbyDetails = useCallback((id, type) => {
    setSelectedItemId(id);
    setSelectedDetailType(type);
    const routeMap = {
      hotel: `/hotel-details/${id}`,
      place: `/place-details/${id}`,
      trek: `/trek-details/${id}`,
      lake: `/place-details/${id}`,
      viewpoint: `/place-details/${id}`,
      // Add other types as needed
    };
    const path = routeMap[type.toLowerCase()] || "/";
    navigate(path);
  }, [navigate, setSelectedItemId, setSelectedDetailType]);

  const nextImage = useCallback(() => {
    if (hotelData && hotelData.images && hotelData.images.length > 0) {
      setCurrentImageIndex((prev) => (prev + 1) % hotelData.images.length);
    }
  }, [hotelData]);

  const prevImage = useCallback(() => {
    if (hotelData && hotelData.images && hotelData.images.length > 0) {
      setCurrentImageIndex((prev) => (prev - 1 + hotelData.images.length) % hotelData.images.length);
    }
  }, [hotelData]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        Loading hotel details...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-gray-50 text-red-600">
        <p>Error: {error}</p>
        <Button variant="link" onClick={handleBack}>Go Back</Button>
      </div>
    );
  }

  if (!hotelData) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-gray-50 text-gray-600">
        <p>No hotel data available.</p>
        <Button variant="link" onClick={handleBack}>Go Back</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm px-4 py-3 md:px-6 sticky top-0 z-10">
        <Button variant="ghost" onClick={handleBack} className="mb-0">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Results
        </Button>
      </div>

      <div className="container mx-auto px-4 py-6 max-w-6xl">
        {/* Image Carousel */}
        <div className="relative mb-6">
          <div className="relative h-64 md:h-96 rounded-lg overflow-hidden shadow-lg">
            <img
              src={hotelData.images[currentImageIndex]}
              alt={`${hotelData.name} - Image ${currentImageIndex + 1}`}
              className="w-full h-full object-cover"
            />
            {hotelData.images.length > 1 && (
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
                  {hotelData.images.map((_, index) => (
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
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Hotel Info */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold mb-2">{hotelData.name}</h1>
                  <div className="flex items-center space-x-2 text-muted-foreground mb-2">
                    <MapPin className="w-4 h-4" />
                    <span>{hotelData.location}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium">{hotelData.rating}</span>
                    </div>
                    <span className="text-muted-foreground">({hotelData.reviewCount} reviews)</span>
                    <Badge className="bg-green-100 text-green-800">Available Today</Badge>
                  </div>
                </div>
                <div className="mt-4 md:mt-0 text-right">
                  <div className="text-2xl font-bold text-primary">{hotelData.price}</div>
                  <div className="text-sm text-muted-foreground">{hotelData.priceNote}</div>
                </div>
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
                    <h3 className="font-semibold mb-3">About This Property</h3>
                    <p className="text-muted-foreground leading-relaxed">{hotelData.description}</p>
                  </div>

                  {hotelData.amenities && hotelData.amenities.length > 0 && (
                    <div>
                      <h3 className="font-semibold mb-3">Amenities</h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {hotelData.amenities.map((amenity, index) => {
                          const IconComponent = iconMap[amenity.icon] || Info; // Use mapped icon or fallback
                          return (
                            <div key={index} className="flex items-center space-x-2">
                              <IconComponent className="w-4 h-4 text-primary" />
                              <span className="text-sm">{amenity.name}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {hotelData.roomTypes && hotelData.roomTypes.length > 0 && (
                    <div>
                      <h3 className="font-semibold mb-3">Room Types</h3>
                      <div className="space-y-3">
                        {hotelData.roomTypes.map((room, index) => (
                          <div key={index} className={`p-4 border rounded-lg ${!room.available ? 'opacity-60 bg-gray-50' : ''}`}>
                            <div className="flex justify-between items-start mb-2">
                              <h4 className="font-medium">{room.name}</h4>
                              <div className="text-right">
                                <div className="font-semibold text-primary">{room.price}/night</div>
                                {!room.available && <Badge variant="secondary">Sold Out</Badge>}
                              </div>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {room.features.map((feature, idx) => (
                                <Badge key={idx} variant="outline" className="text-xs">{feature}</Badge>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {hotelData.policies && hotelData.policies.length > 0 && (
                    <div>
                      <h3 className="font-semibold mb-3">Policies</h3>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        {hotelData.policies.map((policy, index) => (
                          <li key={index}>• {policy}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="photos" className="mt-6">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {hotelData.images.map((image, index) => (
                      <img
                        key={index}
                        src={image}
                        alt={`${hotelData.name} - Photo ${index + 1}`}
                        className="w-full h-32 md:h-40 object-cover rounded-lg cursor-pointer hover:opacity-80 transition-opacity shadow-sm"
                        onClick={() => setCurrentImageIndex(index)}
                      />
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="reviews" className="mt-6">
                  <div className="space-y-4">
                    {hotelData.reviews && hotelData.reviews.length > 0 ? (
                        hotelData.reviews.map((review, index) => (
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
                  <div className="grid md:grid-cols-2 gap-4">
                    {hotelData.nearbyAttractions && hotelData.nearbyAttractions.length > 0 ? (
                      hotelData.nearbyAttractions.map((place, index) => (
                        <div key={index} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors shadow-sm">
                          <div>
                            <h4 className="font-medium">{place.name}</h4>
                            <p className="text-sm text-muted-foreground">{place.type}</p>
                            <div className="flex items-center space-x-1 mt-1">
                              <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                              <span className="text-xs">{place.rating}</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-medium">{place.distance}</div>
                            <Button
                              variant="outline"
                              size="sm"
                              className="mt-1"
                              onClick={(e) => { e.stopPropagation(); handleViewNearbyDetails(place.id, place.type); }}
                            >
                              <Navigation className="w-3 h-3 mr-1" />
                              View
                            </Button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-muted-foreground">No nearby attractions listed.</p>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>

          {/* Booking Sidebar and FAQs */}
          <div className="lg:col-span-1 flex flex-col gap-4"> {/* Added flex-col and gap for spacing */}
            <Card ref={bookingCardRef} className="sticky top-20 shadow-sm"> {/* Book Your Stay card, sticks at 80px from top */}
              <CardHeader>
                <CardTitle>Book Your Stay</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium">Check-in Date</label>
                    <div className="flex items-center mt-1 p-2 border rounded-md bg-gray-50">
                      <Calendar className="w-4 h-4 mr-2 text-muted-foreground" />
                      <span className="text-sm">Select date</span>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Check-out Date</label>
                    <div className="flex items-center mt-1 p-2 border rounded-md bg-gray-50">
                      <Calendar className="w-4 h-4 mr-2 text-muted-foreground" />
                      <span className="text-sm">Select date</span>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Guests</label>
                    <div className="flex items-center mt-1 p-2 border rounded-md bg-gray-50">
                      <Users className="w-4 h-4 mr-2 text-muted-foreground" />
                      <span className="text-sm">2 adults</span>
                    </div>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between mb-2">
                    <span>Room rate (per night)</span>
                    <span>{hotelData.price}</span>
                  </div>
                  <div className="flex justify-between mb-2 text-sm text-muted-foreground">
                    <span>Taxes & fees</span>
                    <span>₹500</span>
                  </div>
                  <div className="flex justify-between font-semibold text-lg border-t pt-2">
                    <span>Total</span>
                    <span>₹5,000</span> {/* This total is hardcoded for now, calculate dynamically if needed */}
                  </div>
                </div>

                <Button
                  className="w-full bg-primary hover:bg-primary/90"
                  size="lg"
                  onClick={() => handleBookNow(hotelData.id)}
                >
                  Book Now
                </Button>

                <div className="text-center space-y-2 text-sm text-muted-foreground">
                  {hotelData.contact?.phone && (
                    <div className="flex items-center justify-center space-x-2">
                      <Phone className="w-4 h-4" />
                      <span>{hotelData.contact.phone}</span>
                    </div>
                  )}
                  {hotelData.contact?.email && (
                    <div className="flex items-center justify-center space-x-2">
                      <Mail className="w-4 h-4" />
                      <span>{hotelData.contact.email}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {hotelData.faqs && hotelData.faqs.length > 0 && (
              <FAQSection
                faqs={hotelData.faqs}
                className={`bg-white shadow-sm sticky`}
                style={{ top: faqStickyTop }} // Dynamically set the top value
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}