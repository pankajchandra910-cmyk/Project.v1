import React, { useState, useCallback, useEffect, useContext, useRef } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { GlobalContext } from "../component/GlobalContext";
import { hotelDetailsData } from "../assets/dummy";

import { Button } from "../component/button";
import { Card, CardContent, CardHeader, CardTitle } from "../component/Card";
import { Input } from "../component/Input"; // Import Input for date selection
import { Badge } from "../component/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../component/tabs";
import { FAQSection } from "../component/FAQSection";
import { ImageWithFallback } from "../component/ImageWithFallback";
// ADD THESE IMPORTS:
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../component/select";


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
  Info
} from "lucide-react";

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
  Info: Info,
};

export default function PopularDetailsPage() {
  const navigate = useNavigate();
  const { popularId } = useParams();
  const location = useLocation();
  const { setFocusArea, setSelectedItemId, setSelectedDetailType } = useContext(GlobalContext);

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [popularItemData, setPopularItemData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [checkInDate, setCheckInDate] = useState("");
  const [checkOutDate, setCheckOutDate] = useState("");
  const [guests, setGuests] = useState("2");
  const [selectedRoomType, setSelectedRoomType] = useState("");

  const bookingCardRef = useRef(null);
  const [faqStickyTop, setFaqStickyTop] = useState(450);

  useEffect(() => {
    setLoading(true);
    setError(null);
    if (popularId) {
      const data = hotelDetailsData[popularId];
      if (data) {
        setPopularItemData(data);
        setLoading(false);
        setCurrentImageIndex(0); // Reset image index for new item

        // Parse query parameters for pre-filled booking data
        const params = new URLSearchParams(location.search);
        setCheckInDate(params.get("checkIn") || "");
        setCheckOutDate(params.get("checkOut") || "");
        setGuests(params.get("guests") || "2");
        setSelectedRoomType(params.get("roomType") || (data.roomTypes.length > 0 ? data.roomTypes[0].name : ""));

      } else {
        setError("Popular item not found.");
        setLoading(false);
        setPopularItemData(null);
      }
    } else {
      setError("No popular ID provided.");
      setLoading(false);
      setPopularItemData(null);
    }
  }, [popularId, location.search]); // Re-run effect when popularId or location.search changes

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
    window.addEventListener('resize', calculateFaqStickyTop); // Changed to calculateFaqStickyTop
    // Recalculate if popularItemData changes (content might change height)
    // Small delay to ensure content is rendered before calculating height
    const timer = setTimeout(calculateFaqStickyTop, 100);


    return () => {
      window.removeEventListener('resize', calculateFaqStickyTop);
      clearTimeout(timer);
    };
  }, [popularItemData, checkInDate, checkOutDate, guests, selectedRoomType]); // Recalculate when popularItemData or booking inputs change

  const handleBack = useCallback(() => {
    navigate(-1); // Go back to the previous page in history
  }, [navigate]);

  const handleBookNow = useCallback((id) => {
    // Navigate to the booking page with the item ID and current booking data
    const queryParams = new URLSearchParams();
    if (checkInDate) queryParams.append("checkIn", checkInDate);
    if (checkOutDate) queryParams.append("checkOut", checkOutDate);
    if (guests) queryParams.append("guests", guests);
    if (selectedRoomType) queryParams.append("roomType", selectedRoomType);

    navigate(`/book-item/${id}?${queryParams.toString()}`);
  }, [navigate, checkInDate, checkOutDate, guests, selectedRoomType]);

  const handleViewMap = useCallback((locationName) => {
    const focusId = popularId.toLowerCase().replace(/\s/g, '-');
    setFocusArea(focusId); // Set focus area in global context for the map
    navigate(`/map-view/${focusId}?destName=${encodeURIComponent(locationName)}`);
  }, [navigate, setFocusArea, popularId]);

  const handleViewNearbyDetails = useCallback((id, type) => {
    setSelectedItemId(id);
    setSelectedDetailType(type);
    const routeMap = {
      hotel: `/hotel-details/${id}`,
      popular: `/popular-details/${id}`,
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
    if (popularItemData && popularItemData.images && popularItemData.images.length > 0) {
      setCurrentImageIndex((prev) => (prev + 1) % popularItemData.images.length);
    }
  }, [popularItemData]);

  const prevImage = useCallback(() => {
    if (popularItemData && popularItemData.images && popularItemData.images.length > 0) {
      setCurrentImageIndex((prev) => (prev - 1 + popularItemData.images.length) % popularItemData.images.length);
    }
  }, [popularItemData]);

  const calculateNumberOfNights = () => {
    if (!checkInDate || !checkOutDate) return 0;
    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);
    const timeDiff = checkOut.getTime() - checkIn.getTime();
    const dayDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
    return dayDiff > 0 ? dayDiff : 0;
  };

  const calculateTotalPreview = () => {
    if (!popularItemData || !selectedRoomType) return 0;
    const room = popularItemData.roomTypes.find(rt => rt.name === selectedRoomType);
    if (!room) return 0;

    const roomPrice = parseFloat(room.price); // Parse directly as it's just a number string now
    const nights = calculateNumberOfNights();
    const basePrice = roomPrice * nights;
    const taxesAndFees = 500; // Mock taxes and fees
    return basePrice + taxesAndFees;
  };

  const today = new Date().toISOString().split('T')[0];
  const minCheckoutDate = checkInDate || today;

  const isBookNowDisabled = !checkInDate || !checkOutDate || calculateNumberOfNights() <= 0 || !selectedRoomType;

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        Loading popular item details...
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

  if (!popularItemData) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-gray-50 text-gray-600">
        <p>No popular item data available.</p>
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
            <ImageWithFallback
              src={popularItemData.images[currentImageIndex]}
              alt={`${popularItemData.name} - Image ${currentImageIndex + 1}`}
              className="w-full h-full object-cover"
            />
            {popularItemData.images.length > 1 && (
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
                  {popularItemData.images.map((_, index) => (
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
            {/* Popular Item Info */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold mb-2">{popularItemData.name}</h1>
                  <div className="flex items-center space-x-2 text-muted-foreground mb-2">
                    <MapPin className="w-4 h-4" />
                    <span>{popularItemData.location}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium">{popularItemData.rating}</span>
                    </div>
                    <span className="text-muted-foreground">({popularItemData.reviewCount} reviews)</span>
                    <Badge className="bg-green-100 text-green-800">Available Today</Badge>
                  </div>
                </div>
                <div className="mt-4 md:mt-0 text-right">
                  <div className="text-2xl font-bold text-primary">₹{popularItemData.price}</div>
                  <div className="text-sm text-muted-foreground">{popularItemData.priceNote || "/night"}</div>
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
                    <p className="text-muted-foreground leading-relaxed">{popularItemData.description}</p>
                  </div>

                  {popularItemData.amenities && popularItemData.amenities.length > 0 && (
                    <div>
                      <h3 className="font-semibold mb-3">Amenities</h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {popularItemData.amenities.map((amenity, index) => {
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

                  {popularItemData.roomTypes && popularItemData.roomTypes.length > 0 && (
                    <div>
                      <h3 className="font-semibold mb-3">Room Types</h3>
                      <div className="space-y-3">
                        {popularItemData.roomTypes.map((room, index) => (
                          <div key={index} className={`p-4 border rounded-lg ${!room.available ? 'opacity-60 bg-gray-50' : ''}`}>
                            <div className="flex justify-between items-start mb-2">
                              <h4 className="font-medium">{room.name}</h4>
                              <div className="text-right">
                                <div className="font-semibold text-primary">₹{room.price}/night</div>
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

                  {popularItemData.policies && popularItemData.policies.length > 0 && (
                    <div>
                      <h3 className="font-semibold mb-3">Policies</h3>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        {popularItemData.policies.map((policy, index) => (
                          <li key={index}>• {policy}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="photos" className="mt-6">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {popularItemData.images.map((image, index) => (
                      <img
                        key={index}
                        src={image}
                        alt={`${popularItemData.name} - Photo ${index + 1}`}
                        className="w-full h-32 md:h-40 object-cover rounded-lg cursor-pointer hover:opacity-80 transition-opacity shadow-sm"
                        onClick={() => setCurrentImageIndex(index)}
                      />
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="reviews" className="mt-6">
                  <div className="space-y-4">
                    {popularItemData.reviews && popularItemData.reviews.length > 0 ? (
                        popularItemData.reviews.map((review, index) => (
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
                    {popularItemData.nearbyAttractions && popularItemData.nearbyAttractions.length > 0 ? (
                      popularItemData.nearbyAttractions.map((place, index) => (
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
                    <label htmlFor="popular-checkin" className="text-sm font-medium">Check-in Date</label>
                    <Input
                      id="popular-checkin"
                      type="date"
                      value={checkInDate}
                      onChange={(e) => setCheckInDate(e.target.value)}
                      min={today}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <label htmlFor="popular-checkout" className="text-sm font-medium">Check-out Date</label>
                    <Input
                      id="popular-checkout"
                      type="date"
                      value={checkOutDate}
                      onChange={(e) => setCheckOutDate(e.target.value)}
                      min={minCheckoutDate}
                      disabled={!checkInDate}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <label htmlFor="popular-guests" className="text-sm font-medium">Guests</label>
                    <Select value={guests} onValueChange={setGuests}>
                      <SelectTrigger id="popular-guests" className="mt-1">
                        <SelectValue placeholder="Select guests" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 Guest</SelectItem>
                        <SelectItem value="2">2 Guests</SelectItem>
                        <SelectItem value="3">3 Guests</SelectItem>
                        <SelectItem value="4">4 Guests</SelectItem>
                        <SelectItem value="5">5+ Guests</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  {popularItemData.roomTypes && popularItemData.roomTypes.length > 0 && (
                    <div>
                      <label htmlFor="popular-room-type" className="text-sm font-medium">Room Type</label>
                      <Select
                        value={selectedRoomType}
                        onValueChange={setSelectedRoomType}
                        disabled={popularItemData.roomTypes.filter(room => room.available).length === 0}
                      >
                        <SelectTrigger id="popular-room-type" className="mt-1">
                          <SelectValue placeholder="Select a room type" />
                        </SelectTrigger>
                        <SelectContent>
                          {popularItemData.roomTypes.map((room) => (
                            <SelectItem key={room.name} value={room.name} disabled={!room.available}>
                              {room.name} (₹{room.price}/night) {!room.available && "(Sold Out)"}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between mb-2">
                    <span>Room rate {selectedRoomType && popularItemData.roomTypes.find(rt => rt.name === selectedRoomType) ? `(₹${popularItemData.roomTypes.find(rt => rt.name === selectedRoomType).price}/night)` : ''} × {calculateNumberOfNights()} nights</span>
                    <span>₹{popularItemData.roomTypes.find(rt => rt.name === selectedRoomType) ? (parseFloat(popularItemData.roomTypes.find(rt => rt.name === selectedRoomType).price) * calculateNumberOfNights()).toFixed(2) : '0.00'}</span>
                  </div>
                  <div className="flex justify-between mb-2 text-sm text-muted-foreground">
                    <span>Taxes & fees</span>
                    <span>₹500.00</span>
                  </div>
                  <div className="flex justify-between font-semibold text-lg border-t pt-2">
                    <span>Total</span>
                    <span>₹{calculateTotalPreview().toFixed(2)}</span>
                  </div>
                </div>

                <Button
                  className="w-full bg-primary hover:bg-primary/90"
                  size="lg"
                  onClick={() => handleBookNow(popularItemData.id)}
                  disabled={isBookNowDisabled}
                >
                  Book Now
                </Button>

                <div className="text-center space-y-2 text-sm text-muted-foreground">
                  {popularItemData.contact?.phone && (
                    <div className="flex items-center justify-center space-x-2">
                      <Phone className="w-4 h-4" />
                      <span>{popularItemData.contact.phone}</span>
                    </div>
                  )}
                  {popularItemData.contact?.email && (
                    <div className="flex items-center justify-center space-x-2">
                      <Mail className="w-4 h-4" />
                      <span>{popularItemData.contact.email}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {popularItemData.faqs && popularItemData.faqs.length > 0 && (
              <FAQSection
                faqs={popularItemData.faqs}
                className={`bg-white shadow-sm sticky`}
                style={{ top: faqStickyTop }}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}