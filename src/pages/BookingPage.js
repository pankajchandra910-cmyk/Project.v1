import React, { useState, useCallback, useEffect, useContext, useRef } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { GlobalContext } from "../component/GlobalContext";
import { hotelDetailsData } from "../assets/dummy";

import { Button } from "../component/button";
import { Card, CardContent, CardHeader, CardTitle } from "../component/Card";
import { Input } from "../component/input";
import { Label } from "../component/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../component/select";
import { Checkbox } from "../component/checkbox";
import { Separator } from "../component/separator";
import { Badge } from "../component/badge";
import { ImageWithFallback } from "../component/ImageWithFallback";

import {
  ArrowLeft,
  Star,
  MapPin,
  Check,
  PartyPopper
} from "lucide-react";

export default function BookingPage() {
  const navigate = useNavigate();
  const { itemId } = useParams();
  const location = useLocation();
  const { setFocusArea, setSelectedItemId, setSelectedDetailType } = useContext(GlobalContext);

  const [itemData, setItemData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [bookingData, setBookingData] = useState({
    checkIn: "",
    checkOut: "",
    guests: "2",
    rooms: "1",
    selectedRoomTypeName: "",
    addOns: []
  });

  const [guestInfo, setGuestInfo] = useState({
    fullName: "",
    phoneNumber: "",
    email: "",
    idProof: ""
  });

  const [showSuccess, setShowSuccess] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const addOns = [
    { id: "cab", name: "Airport Pickup", price: 800, description: "Private cab from Pantnagar Airport" },
    { id: "bike", name: "Bike Rental", price: 500, description: "Scooter rental for 1 day" },
    { id: "guide", name: "Local Guide", price: 800, description: "Professional guide for sightseeing" },
    { id: "meals", name: "All Meals", price: 1200, description: "Breakfast, lunch, and dinner" },
    { id: "spa", name: "Spa Package", price: 2000, description: "Relaxing spa treatment package" }
  ];

  useEffect(() => {
    setLoading(true);
    setError(null);
    if (itemId) {
      const data = hotelDetailsData[itemId];
      if (data) {
        setItemData(data);
        setLoading(false);

        const params = new URLSearchParams(location.search);
        setBookingData(prev => ({
          ...prev,
          checkIn: params.get("checkIn") || "",
          checkOut: params.get("checkOut") || "",
          guests: params.get("guests") || "2",
          selectedRoomTypeName: params.get("roomType") || (data.roomTypes.length > 0 ? data.roomTypes[0].name : ""),
        }));
      } else {
        setError("Item not found.");
        setLoading(false);
        setItemData(null);
      }
    } else {
      setError("No item ID provided.");
      setLoading(false);
      setItemData(null);
    }
  }, [itemId, location.search]);

  const handleBack = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  const handleAddOnChange = (addOnId, checked) => {
    setBookingData(prev => {
      const newAddOns = checked
        ? [...prev.addOns, addOnId]
        : prev.addOns.filter(id => id !== addOnId);
      return { ...prev, addOns: newAddOns };
    });
  };

  const calculateNumberOfNights = () => {
    if (!bookingData.checkIn || !bookingData.checkOut) return 0;
    const checkInDate = new Date(bookingData.checkIn);
    const checkOutDate = new Date(bookingData.checkOut);
    const timeDiff = checkOutDate.getTime() - checkInDate.getTime();
    const dayDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
    return dayDiff > 0 ? dayDiff : 0;
  };

  const calculateTotal = () => {
    if (!itemData || !bookingData.selectedRoomTypeName) return 0;

    const selectedRoom = itemData.roomTypes.find(
      (room) => room.name === bookingData.selectedRoomTypeName
    );
    if (!selectedRoom) return 0;

    const roomPrice = parseFloat(selectedRoom.price.replace("₹", "").replace(",", ""));
    const numRooms = parseInt(bookingData.rooms);
    const numNights = calculateNumberOfNights();

    const basePrice = roomPrice * numRooms * numNights;
    const addOnTotal = bookingData.addOns.reduce((total, addOnId) => {
      const addOn = addOns.find(a => a.id === addOnId);
      return total + (addOn?.price || 0);
    }, 0);

    const taxesAndFees = 500 * numRooms;
    
    return basePrice + addOnTotal + taxesAndFees;
  };

  const handleBooking = () => {
    setIsProcessing(true);
    
    setTimeout(() => {
      setIsProcessing(false);
      setShowSuccess(true);
      
      setTimeout(() => {
        navigate(-1);
      }, 3000);
    }, 2000);
  };

  const today = new Date().toISOString().split('T')[0];
  const minCheckoutDate = bookingData.checkIn || today;

  const isBookingDisabled =
    !bookingData.checkIn ||
    !bookingData.checkOut ||
    calculateNumberOfNights() <= 0 ||
    !bookingData.selectedRoomTypeName ||
    !guestInfo.fullName ||
    !guestInfo.phoneNumber ||
    !guestInfo.email ||
    isProcessing;

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        Loading details...
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

  if (!itemData) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-gray-50 text-gray-600">
        <p>No item data available for booking.</p>
        <Button variant="link" onClick={handleBack}>Go Back</Button>
      </div>
    );
  }

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <Card className="w-full max-w-md mx-4">
          <CardContent className="p-8 text-center">
            <div className="animate-bounce mb-4">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto">
                <Check className="w-8 h-8 text-white" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-green-600 mb-2">Booking Successful!</h2>
            <p className="text-muted-foreground mb-4">
              Your booking has been confirmed. Check your email for details.
            </p>
            <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
              <PartyPopper className="w-4 h-4" />
              <span>Booking ID: NE-{Date.now().toString().slice(-6)}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const selectedRoomDetails = itemData.roomTypes.find(
    (room) => room.name === bookingData.selectedRoomTypeName
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm px-4 py-3 md:px-6 sticky top-0 z-10">
        <Button variant="ghost" onClick={handleBack} className="mb-0">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Details
        </Button>
      </div>

      <div className="container mx-auto px-4 py-6 max-w-6xl">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold mb-2">{itemData.name}</h1>
                  <div className="flex items-center space-x-2 text-muted-foreground mb-2">
                    <MapPin className="w-4 h-4" />
                    <span>{itemData.location}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium">{itemData.rating}</span>
                    </div>
                    <span className="text-muted-foreground">({itemData.reviewCount} reviews)</span>
                    <Badge className="bg-green-100 text-green-800">Available</Badge>
                  </div>
                </div>
              </div>
              
              <div className="space-y-6 mt-6">
                  <h3 className="font-semibold mb-4">Your Reservation Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="checkin">Check-in Date</Label>
                      <Input
                        id="checkin"
                        type="date"
                        value={bookingData.checkIn}
                        onChange={(e) => setBookingData(prev => ({...prev, checkIn: e.target.value}))}
                        min={today}
                      />
                    </div>
                    <div>
                      <Label htmlFor="checkout">Check-out Date</Label>
                      <Input
                        id="checkout"
                        type="date"
                        value={bookingData.checkOut}
                        onChange={(e) => setBookingData(prev => ({...prev, checkOut: e.target.value}))}
                        min={minCheckoutDate}
                        disabled={!bookingData.checkIn}
                      />
                    </div>
                    <div>
                      <Label>Guests</Label>
                      <Select value={bookingData.guests} onValueChange={(value) => setBookingData(prev => ({...prev, guests: value}))}>
                        <SelectTrigger>
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
                    <div>
                      <Label>Rooms</Label>
                      <Select value={bookingData.rooms} onValueChange={(value) => setBookingData(prev => ({...prev, rooms: value}))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select rooms" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1 Room</SelectItem>
                          <SelectItem value="2">2 Rooms</SelectItem>
                          <SelectItem value="3">3 Rooms</SelectItem>
                          <SelectItem value="4">4+ Rooms</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    {itemData.roomTypes && itemData.roomTypes.length > 0 && (
                      <div>
                        <Label>Room Type</Label>
                        <Select
                          value={bookingData.selectedRoomTypeName}
                          onValueChange={(value) => setBookingData(prev => ({...prev, selectedRoomTypeName: value}))}
                          disabled={itemData.roomTypes.filter(room => room.available).length === 0}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select a room type" />
                          </SelectTrigger>
                          <SelectContent>
                            {itemData.roomTypes.map((room) => (
                              <SelectItem key={room.name} value={room.name} disabled={!room.available}>
                                {room.name} (₹{room.price}/night) {!room.available && "(Sold Out)"}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                  </div>

                  <Separator />

                  <div>
                    <h3 className="font-semibold mb-4">Add-on Services</h3>
                    <div className="space-y-4">
                      {addOns.map((addOn) => (
                        <div key={addOn.id} className="flex items-start space-x-3 p-3 border rounded-lg">
                          <Checkbox id={addOn.id}
                          checked={bookingData.addOns.includes(addOn.id)}
                          onCheckedChange={(checked) => handleAddOnChange(addOn.id, checked)}
                          className="mt-1"
                        />
                        <div className="flex-1">
                          <Label htmlFor={addOn.id} className="cursor-pointer">
                            <div className="flex items-center justify-between">
                              <span className="font-medium">{addOn.name}</span>
                              <span className="font-semibold">₹{addOn.price}</span>
                            </div>
                            <p className="text-sm text-muted-foreground">{addOn.description}</p>
                          </Label>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="font-semibold mb-4">Guest Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="fullName">Full Name</Label>
                      <Input
                        id="fullName"
                        placeholder="John Doe"
                        value={guestInfo.fullName}
                        onChange={(e) => setGuestInfo(prev => ({...prev, fullName: e.target.value}))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="phoneNumber">Phone Number</Label>
                      <Input
                        id="phoneNumber"
                        placeholder="+91 9876543210"
                        value={guestInfo.phoneNumber}
                        onChange={(e) => setGuestInfo(prev => ({...prev, phoneNumber: e.target.value}))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="john@example.com"
                        value={guestInfo.email}
                        onChange={(e) => setGuestInfo(prev => ({...prev, email: e.target.value}))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="idProof">ID Proof Number</Label>
                      <Input
                        id="idProof"
                        placeholder="Aadhaar/PAN/Passport"
                        value={guestInfo.idProof}
                        onChange={(e) => setGuestInfo(prev => ({...prev, idProof: e.target.value}))}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1 flex flex-col gap-4">
            <Card className="sticky top-20 shadow-sm">
              <CardContent className="p-0">
                <div className="aspect-video">
                  <ImageWithFallback
                    src={itemData.images[0]}
                    alt={itemData.name}
                    className="w-full h-full object-cover rounded-t-lg"
                  />
                </div>

                <div className="p-6 space-y-4">
                  <div>
                    <h3 className="font-semibold text-lg">{itemData.name}</h3>
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <MapPin className="w-4 h-4" />
                      <span>{itemData.location}</span>
                    </div>
                    <div className="flex items-center space-x-2 mt-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm">{itemData.rating} ({itemData.reviewCount} reviews)</span>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-3">
                    <h4 className="font-medium">Booking Summary</h4>

                    {bookingData.checkIn && bookingData.checkOut && (
                      <div className="flex justify-between text-sm">
                        <span>Dates:</span>
                        <span>{bookingData.checkIn} to {bookingData.checkOut} ({calculateNumberOfNights()} nights)</span>
                      </div>
                    )}

                    <div className="flex justify-between text-sm">
                      <span>Guests:</span>
                      <span>{bookingData.guests}</span>
                    </div>

                    <div className="flex justify-between text-sm">
                      <span>Rooms:</span>
                      <span>{bookingData.rooms}</span>
                    </div>

                    {selectedRoomDetails && (
                      <div className="flex justify-between text-sm">
                        <span>Room Type:</span>
                        <span>{selectedRoomDetails.name}</span>
                      </div>
                    )}

                    <Separator />

                    <div className="space-y-2">
                      {selectedRoomDetails && (
                        <div className="flex justify-between text-sm">
                          <span>{selectedRoomDetails.name} (₹{parseFloat(selectedRoomDetails.price.replace("₹", "")).toFixed(2)}/night) × {bookingData.rooms} rooms × {calculateNumberOfNights()} nights</span>
                          <span>₹{(parseFloat(selectedRoomDetails.price.replace("₹", "")) * parseInt(bookingData.rooms) * calculateNumberOfNights()).toFixed(2)}</span>
                        </div>
                      )}

                      {bookingData.addOns.map(addOnId => {
                        const addOn = addOns.find(a => a.id === addOnId);
                        if (!addOn) return null;
                        return (
                          <div key={addOnId} className="flex justify-between text-sm">
                            <span>{addOn.name}</span>
                            <span>₹{addOn.price.toFixed(2)}</span>
                          </div>
                        );
                      })}
                      
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>Taxes & fees</span>
                        <span>₹{(500 * parseInt(bookingData.rooms)).toFixed(2)}</span>
                      </div>

                      <Separator />

                      <div className="flex justify-between font-semibold">
                        <span>Total</span>
                        <span>₹{calculateTotal().toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  <Button
                    className="w-full bg-primary hover:bg-primary/90"
                    size="lg"
                    onClick={handleBooking}
                    disabled={isBookingDisabled}
                  >
                    {isProcessing ? "Processing..." : "Confirm Booking"}
                  </Button>

                  <p className="text-xs text-muted-foreground text-center">
                    Free cancellation up to 24 hours before check-in
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}