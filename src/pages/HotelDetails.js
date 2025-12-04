import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Home, MapPin, Wifi, Car, Coffee, 
  Phone, Filter, Loader2, ChevronLeft, ChevronRight, Circle 
} from 'lucide-react';
// 1. IMPORT doc and getDoc
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase'; 
import { Card, CardContent } from '../component/Card';
import { Button } from '../component/button';
import { Badge } from '../component/badge';
import { Input } from '../component/Input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../component/select';

export default function HotelDetails() {
  const navigate = useNavigate();
  
  // State
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedHotel, setSelectedHotel] = useState(null);
  
  // 2. NEW STATE for storing the fetched phone number
  const [hostPhoneNumber, setHostPhoneNumber] = useState(null);

  // Slider State
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  // Filters
  const [filters, setFilters] = useState({
    location: 'all',
    price: 'all',
    search: ''
  });

  // Fetch Data from Firebase
  useEffect(() => {
    const fetchHotels = async () => {
      try {
        setLoading(true);
        const q = query(
          collection(db, "listings"), 
          where("profession", "in", ["resort-hotel", "hill-stays"])
        );
        
        const querySnapshot = await getDocs(q);
        const fetchedData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        setListings(fetchedData);
      } catch (error) {
        console.error("Error fetching hotels:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHotels();
  }, []);

  // 3. NEW USE EFFECT: Fetch Host Details when selectedHotel changes
  useEffect(() => {
    const fetchHostDetails = async () => {
      // Reset phone number when changing hotels
      setHostPhoneNumber(null);

      if (selectedHotel && selectedHotel.ownerId) {
        try {
          // Reference the specific user document in the 'users' collection
          const userDocRef = doc(db, "users", selectedHotel.ownerId);
          
          const userDocSnap = await getDoc(userDocRef);
          

          if (userDocSnap.exists()) {
            const userData = userDocSnap.data();
            
            // Set the phone number from the user document
            setHostPhoneNumber(userData.phoneNumber);
          } else {
            console.log("No such host document!");
          }
        } catch (error) {
        //   console.error("Error fetching host details:", error);
        }
      }
    };

    fetchHostDetails();
    
    // Reset slider when opening a new hotel
    if (selectedHotel) {
      setCurrentImageIndex(0);
    }
  }, [selectedHotel]);

  // --- Helper Functions ---
  const getPrice = (hotel) => {
    if (hotel.listingDetails?.rooms?.length > 0) {
      const prices = hotel.listingDetails.rooms.map(r => Number(r.price));
      return Math.min(...prices);
    }
    return Number(hotel.price) || 0;
  };

  const getAmenities = (hotel) => {
    let amenities = new Set();
    if (hotel.listingDetails?.rooms) {
      hotel.listingDetails.rooms.forEach(room => {
        if(room.features) room.features.forEach(f => amenities.add(f));
      });
    }
    return Array.from(amenities);
  };

  const getAmenityIcon = (amenity) => {
    const key = amenity.toLowerCase();
    if (key.includes('wifi')) return <Wifi className="h-4 w-4" />;
    if (key.includes('park')) return <Car className="h-4 w-4" />;
    if (key.includes('food') || key.includes('rest') || key.includes('service')) return <Coffee className="h-4 w-4" />;
    return <span className="h-2 w-2 bg-green-500 rounded-full" />;
  };

  // --- Slider Handlers ---
  const nextImage = (e) => {
    e?.stopPropagation();
    if (!selectedHotel?.photos) return;
    setCurrentImageIndex((prev) => 
      prev === selectedHotel.photos.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = (e) => {
    e?.stopPropagation();
    if (!selectedHotel?.photos) return;
    setCurrentImageIndex((prev) => 
      prev === 0 ? selectedHotel.photos.length - 1 : prev - 1
    );
  };

  // --- Filtering Logic ---
  const filteredListings = listings.filter(hotel => {
    const price = getPrice(hotel);
    
    if (filters.location !== 'all' && hotel.location.toLowerCase() !== filters.location.toLowerCase()) return false;
    if (filters.search && !hotel.name.toLowerCase().includes(filters.search.toLowerCase())) return false;
    if (filters.price === 'budget' && price > 3000) return false;
    if (filters.price === 'mid' && (price < 3000 || price > 6000)) return false;
    if (filters.price === 'luxury' && price < 6000) return false;

    return true;
  });

  // --- Render Details View ---
  if (selectedHotel) {
    const amenities = getAmenities(selectedHotel);
    const displayPrice = getPrice(selectedHotel);
    const photos = selectedHotel.photos && selectedHotel.photos.length > 0 
      ? selectedHotel.photos 
      : ["https://placehold.co/1200x600?text=No+Image"];

    return (
      <div className="min-h-screen bg-gray-50 pb-12">
        {/* Sticky Header */}
        <div className="bg-white shadow-sm border-b sticky top-0 z-20">
          <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
            <Button variant="ghost" onClick={() => setSelectedHotel(null)} className="gap-2">
              <ArrowLeft className="h-4 w-4" /> Back to List
            </Button>
            <Button variant="ghost" onClick={() => navigate('/')} className="gap-2">
              <Home className="h-4 w-4" /> Home
            </Button>
          </div>
        </div>

        {/* Hero Image Slider Section */}
        <div className="relative h-[40vh] md:h-[70vh] w-full bg-gray-100 group">
            {photos.map((photo, index) => (
              <div 
                key={index}
                className={`absolute inset-0 transition-opacity duration-500 ease-in-out ${index === currentImageIndex ? 'opacity-100' : 'opacity-0'}`}
              >
                <img 
                  src={photo} 
                  alt={`${selectedHotel.name} view ${index + 1}`} 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/70 to-transparent" />
              </div>
            ))}

            {photos.length > 1 && (
              <>
                <button 
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/20 hover:bg-black/40 text-white p-2 rounded-full backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100 "
                >
                  <ChevronLeft className="h-8 w-8" />
                </button>
                <button 
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/20 hover:bg-black/40 text-white p-2 rounded-full backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100 "
                >
                  <ChevronRight className="h-8 w-8" />
                </button>
                
                <div className="absolute bottom-28 left-1/2 -translate-x-1/2 flex gap-2">
                   {photos.map((_, idx) => (
                     <div 
                       key={idx}
                       onClick={() => setCurrentImageIndex(idx)}
                       className={`w-2 h-2 rounded-full cursor-pointer transition-all ${idx === currentImageIndex ? 'bg-white w-4' : 'bg-white/50 hover:bg-white/80'}`}
                     />
                   ))}
                </div>
              </>
            )}

            <div className="absolute bottom-2 left-0 right-0 p-4 md:p-8 pb-6 md:pb-8 text-white z-10">
              <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl md:text-5xl font-bold mb-2 drop-shadow-lg">{selectedHotel.name}</h1>
                <div className="flex items-center gap-2 text-lg drop-shadow-md text-gray-200">
                    <MapPin className="h-5 w-5" />
                    {selectedHotel.location}, Nainital District
                </div>
              </div>
            </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 -mt-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Content */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-2xl font-semibold mb-4">About</h2>
                <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                  {selectedHotel.description}
                </p>
                <div className="mt-6">
                  <h3 className="font-semibold mb-3">Amenities</h3>
                  <div className="flex flex-wrap gap-3">
                    {amenities.length > 0 ? amenities.map((am, i) => (
                      <Badge key={i} variant="secondary" className="px-3 py-1 flex items-center gap-2">
                        {getAmenityIcon(am)} {am}
                      </Badge>
                    )) : <span className="text-gray-500 italic">No specific amenities listed.</span>}
                  </div>
                </div>
              </div>

              {selectedHotel.listingDetails?.rooms?.length > 0 && (
                <div className="bg-white rounded-xl shadow-md p-6">
                  <h2 className="text-2xl font-semibold mb-4">Available Rooms</h2>
                  <div className="space-y-4">
                    {selectedHotel.listingDetails.rooms.map((room) => (
                      <div key={room.id} className="border rounded-lg p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:bg-gray-50 transition">
                        <div>
                          <h4 className="font-bold text-lg">{room.type}</h4>
                          <p className="text-sm text-gray-500 capitalize">{room.view} View</p>
                          <div className="flex gap-2 mt-2">
                            {room.features?.map((f, idx) => (
                              <span key={idx} className="text-xs bg-gray-100 px-2 py-1 rounded">{f}</span>
                            ))}
                          </div>
                        </div>
                        <div className="text-right w-full md:w-auto">
                          <div className="text-xl font-bold text-primary">₹{room.price}</div>
                          <div className="text-xs text-gray-500">per night</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Sidebar (Booking) */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-lg p-6 sticky top-24">
                <div className="flex justify-between items-end mb-6">
                  <div>
                    <span className="text-sm text-gray-500">Starting from</span>
                    <div className="text-3xl font-bold text-primary">₹{displayPrice.toLocaleString()}</div>
                  </div>
                  <Badge variant="outline" className="mb-1">{selectedHotel.status || 'Available'}</Badge>
                </div>

                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 rounded-lg space-y-3">
                    {/* 4. UPDATED UI: Display the fetched phone number */}
                    <div className="flex items-center gap-3">
                      <Phone className="h-5 w-5 text-gray-400" />
                      {hostPhoneNumber ? (
                        <a href={`tel:${hostPhoneNumber}`} className="font-medium hover:text-primary transition-colors">
                          {hostPhoneNumber}
                        </a>
                      ) : (
                        <span className="font-medium text-gray-500">
                           {selectedHotel.ownerId ? "Contact via a App contact page" : "Contact Unavailable"}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-3">
                      <MapPin className="h-5 w-5 text-gray-400" />
                      <span className="capitalize">{selectedHotel.location}</span>
                    </div>
                  </div>

                  <Button className="w-full py-6 text-lg" onClick={() => window.alert('Booking feature coming next update!')}>
                    Book Now
                  </Button>
                  <p className="text-xs text-center text-gray-500">
                    Free cancellation available on selected rooms
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- Render List View ---
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <Button variant="ghost" onClick={() => navigate('/')} className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" /> Back Home
              </Button>
            </div>
            <h1 className="text-xl font-bold hidden md:block">Hotels & Resorts</h1>
          </div>
          
          <div className="flex flex-col md:flex-row gap-3">
            <div className="flex-1">
               <Input 
                placeholder="Search hotels by name..." 
                value={filters.search}
                onChange={(e) => setFilters({...filters, search: e.target.value})}
                className="bg-gray-50"
               />
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
               <Select value={filters.location} onValueChange={(v) => setFilters({...filters, location: v})}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Locations</SelectItem>
                    <SelectItem value="nainital">Nainital</SelectItem>
                    <SelectItem value="bhimtal">Bhimtal</SelectItem>
                    <SelectItem value="sukhatal">Sukhatal</SelectItem>
                    <SelectItem value="naukuchiatal">Naukuchiatal</SelectItem>
                  </SelectContent>
               </Select>

               <Select value={filters.price} onValueChange={(v) => setFilters({...filters, price: v})}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Price" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Prices</SelectItem>
                    <SelectItem value="budget">Under ₹3k</SelectItem>
                    <SelectItem value="mid">₹3k - ₹6k</SelectItem>
                    <SelectItem value="luxury">Above ₹6k</SelectItem>
                  </SelectContent>
               </Select>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2 text-gray-500">Loading stays...</span>
          </div>
        ) : filteredListings.length === 0 ? (
          <div className="text-center py-12">
            <div className="bg-white rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center shadow-sm">
              <Filter className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">No hotels found</h3>
            <p className="text-gray-500">Try adjusting your filters or search criteria.</p>
            <Button variant="link" onClick={() => setFilters({location:'all', price:'all', search:''})}>Clear all filters</Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredListings.map((hotel) => {
              const startPrice = getPrice(hotel);
              const amenities = getAmenities(hotel);

              return (
                <Card 
                  key={hotel.id} 
                  className="overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer group flex flex-col h-full"
                  onClick={() => setSelectedHotel(hotel)}
                >
                  <div className="relative h-56 overflow-hidden">
                    <img
                      src={hotel.photos?.[0] || "https://placehold.co/600x400?text=No+Image"}
                      alt={hotel.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur px-2 py-1 rounded text-xs font-bold shadow-sm">
                      {hotel.profession === 'hill-stays' ? 'Hill Stay' : 'Resort/Hotel'}
                    </div>
                  </div>
                  
                  <CardContent className="p-5 flex flex-col grow">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-xl font-bold line-clamp-1">{hotel.name}</h3>
                    </div>
                    
                    <div className="flex items-center gap-1 text-sm text-gray-500 mb-4">
                      <MapPin className="h-3.5 w-3.5" />
                      <span className="capitalize">{hotel.location}</span>
                    </div>

                    <div className="flex gap-2 mb-4 overflow-hidden h-6">
                      {amenities.slice(0, 3).map((am, i) => (
                         <div key={i} className="flex items-center gap-1 text-xs bg-gray-100 px-2 py-0.5 rounded text-gray-600 whitespace-nowrap">
                            {getAmenityIcon(am)} {am}
                         </div>
                      ))}
                      {amenities.length > 3 && (
                        <span className="text-xs text-gray-400 flex items-center">+{amenities.length - 3}</span>
                      )}
                    </div>

                    <div className="mt-auto pt-4 border-t flex items-center justify-between">
                      <div>
                        <span className="text-sm text-gray-400">from </span>
                        <span className="text-lg font-bold text-primary">₹{startPrice.toLocaleString()}</span>
                      </div>
                      <Button size="sm" className="group-hover:bg-primary/90">
                        View Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}