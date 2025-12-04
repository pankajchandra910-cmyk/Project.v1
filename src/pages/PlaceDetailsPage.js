import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Home, MapPin, Wifi, Car, Coffee, Phone, Filter, 
  Loader2, ChevronLeft, ChevronRight, Star, Clock, Info, 
  CheckCircle2, Mountain, Users, BedDouble, Camera
} from 'lucide-react';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore'; 
import { db } from '../firebase'; 
// Assuming these components exist based on your provided code
import { Card, CardContent, CardHeader, CardTitle } from '../component/Card';
import { Button } from '../component/button';
import { Badge } from '../component/badge';
import { Input } from '../component/Input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../component/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../component/tabs';
import { FAQSection } from '../component/FAQSection'; // Optional if you have it

export default function HotelDetails() {
  const navigate = useNavigate();
  
  // --- State Management ---
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedHotel, setSelectedHotel] = useState(null);
  
  // Owner & Interaction State
  const [ownerPhone, setOwnerPhone] = useState(null);
  const [loadingOwner, setLoadingOwner] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  // Filters State
  const [filters, setFilters] = useState({
    location: 'all',
    price: 'all',
    search: ''
  });

  // --- 1. Fetch Hotels List ---
  useEffect(() => {
    const fetchHotels = async () => {
      try {
        setLoading(true);
        // Querying for both resorts and hill-stays
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

  // --- 2. Fetch Owner Phone Number dynamically ---
  useEffect(() => {
    const fetchOwnerDetails = async () => {
      setOwnerPhone(null);
      if (selectedHotel && selectedHotel.ownerId) {
        setLoadingOwner(true);
        try {
          const userDocRef = doc(db, "users", selectedHotel.ownerId);
          const userDocSnap = await getDoc(userDocRef);
          
          if (userDocSnap.exists()) {
            const userData = userDocSnap.data();
            setOwnerPhone(userData.phoneNumber || null);
          }
        } catch (error) {
          console.error("Error fetching owner details:", error);
        } finally {
          setLoadingOwner(false);
        }
      }
    };

    fetchOwnerDetails();
    if (selectedHotel) {
      setCurrentImageIndex(0);
      window.scrollTo(0, 0); // Scroll to top when opening details
    }
  }, [selectedHotel]);

  // --- Helper Functions ---
  const formatPhoneNumber = (phone) => {
    if (!phone) return null;
    let cleaned = phone.toString().trim();
    if (cleaned.startsWith('0')) cleaned = cleaned.substring(1);
    if (!cleaned.startsWith('+91')) cleaned = '+91' + cleaned;
    return cleaned;
  };

  const getPrice = (hotel) => {
    if (hotel.listingDetails?.rooms?.length > 0) {
      const prices = hotel.listingDetails.rooms.map(r => Number(r.price));
      return Math.min(...prices);
    }
    return Number(hotel.price) || 0;
  };

  const getAmenities = (hotel) => {
    let amenities = new Set();
    // Check global features
    if (hotel.features && Array.isArray(hotel.features)) {
        hotel.features.forEach(f => amenities.add(f));
    }
    // Check room specific features
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
    if (key.includes('park') || key.includes('car')) return <Car className="h-4 w-4" />;
    if (key.includes('food') || key.includes('dining')) return <Coffee className="h-4 w-4" />;
    if (key.includes('view') || key.includes('mountain')) return <Mountain className="h-4 w-4" />;
    return <CheckCircle2 className="h-4 w-4" />;
  };

  // --- Slider Logic ---
  const nextImage = useCallback((e) => {
    e?.stopPropagation();
    if (!selectedHotel?.photos) return;
    setCurrentImageIndex((prev) => 
      prev === selectedHotel.photos.length - 1 ? 0 : prev + 1
    );
  }, [selectedHotel]);

  const prevImage = useCallback((e) => {
    e?.stopPropagation();
    if (!selectedHotel?.photos) return;
    setCurrentImageIndex((prev) => 
      prev === 0 ? selectedHotel.photos.length - 1 : prev - 1
    );
  }, [selectedHotel]);

  // --- Filter Logic ---
  const filteredListings = listings.filter(hotel => {
    const price = getPrice(hotel);
    if (filters.location !== 'all' && hotel.location.toLowerCase() !== filters.location.toLowerCase()) return false;
    if (filters.search && !hotel.name.toLowerCase().includes(filters.search.toLowerCase())) return false;
    if (filters.price === 'budget' && price > 3000) return false;
    if (filters.price === 'mid' && (price < 3000 || price > 6000)) return false;
    if (filters.price === 'luxury' && price < 6000) return false;
    return true;
  });


  // ==========================================
  // VIEW 1: DETAILS PAGE (Uses PlaceDetails UI)
  // ==========================================
  if (selectedHotel) {
    const amenities = getAmenities(selectedHotel);
    const displayPrice = getPrice(selectedHotel);
    const displayPhone = formatPhoneNumber(ownerPhone);
    const photos = selectedHotel.photos && selectedHotel.photos.length > 0 
      ? selectedHotel.photos 
      : ["https://placehold.co/1200x600?text=No+Image"];

    return (
      <div className="min-h-screen bg-gray-50">
        {/* Sticky Header */}
        <div className="bg-white/95 backdrop-blur-sm shadow-sm px-4 py-3 sticky top-0 z-20 flex justify-between items-center">
            <Button variant="ghost" onClick={() => setSelectedHotel(null)} className="mb-0 text-gray-600 hover:text-primary">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Hotels
            </Button>
            <div className="hidden md:flex items-center gap-2 text-sm font-semibold text-gray-700">
               {selectedHotel.name}
            </div>
        </div>

        <div className="container mx-auto px-4 py-6 max-w-6xl">
          
          {/* Hero Image Slider */}
          <div className="relative mb-6 group">
            <div className="relative h-64 md:h-[500px] rounded-xl overflow-hidden shadow-lg bg-gray-200">
              <img
                src={photos[currentImageIndex]}
                alt={`${selectedHotel.name} view`}
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent" />
              
              {/* Slider Controls */}
              {photos.length > 1 && (
                <>
                  <button onClick={prevImage} className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 backdrop-blur-md p-2 rounded-full text-white transition-all opacity-0 group-hover:opacity-100">
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button onClick={nextImage} className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 backdrop-blur-md p-2 rounded-full text-white transition-all opacity-0 group-hover:opacity-100">
                    <ChevronRight className="w-6 h-6" />
                  </button>
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
                    {photos.map((_, index) => (
                      <div
                        key={index}
                        className={`w-2 h-2 rounded-full cursor-pointer transition-all ${index === currentImageIndex ? 'bg-white w-4' : 'bg-white/50'}`}
                        onClick={() => setCurrentImageIndex(index)}
                      />
                    ))}
                  </div>
                </>
              )}
              
              <div className="absolute bottom-6 left-6 text-white">
                 <Badge className="mb-2 bg-primary/90 text-white border-none">{selectedHotel.profession === 'hill-stays' ? 'Hill Stay' : 'Resort'}</Badge>
                 <h1 className="text-3xl md:text-5xl font-bold drop-shadow-md">{selectedHotel.name}</h1>
                 <div className="flex items-center gap-2 mt-2 text-gray-100 drop-shadow-sm">
                    <MapPin className="w-4 h-4" /> {selectedHotel.location}, Uttarakhand
                 </div>
              </div>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid lg:grid-cols-3 gap-8">
            
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Quick Info Bar */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex flex-wrap gap-6 md:justify-between items-center">
                 <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                        <Star className="w-5 h-5 fill-blue-600" />
                    </div>
                    <div>
                        <p className="text-xs text-gray-500 uppercase font-semibold">Rating</p>
                        <p className="font-medium">4.8 (New)</p>
                    </div>
                 </div>
                 <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-50 rounded-lg text-green-600">
                        <Clock className="w-5 h-5" />
                    </div>
                    <div>
                        <p className="text-xs text-gray-500 uppercase font-semibold">Check-in</p>
                        <p className="font-medium">12:00 PM</p>
                    </div>
                 </div>
                 <div className="flex items-center gap-3">
                    <div className="p-2 bg-orange-50 rounded-lg text-orange-600">
                        <Clock className="w-5 h-5" />
                    </div>
                    <div>
                        <p className="text-xs text-gray-500 uppercase font-semibold">Check-out</p>
                        <p className="font-medium">11:00 AM</p>
                    </div>
                 </div>
              </div>

              {/* Tabs Section */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <Tabs defaultValue="overview" className="w-full">
                  <div className="border-b px-6 pt-4">
                    <TabsList className="grid w-full grid-cols-3 md:w-[400px]">
                      <TabsTrigger value="overview">Overview</TabsTrigger>
                      <TabsTrigger value="rooms">Rooms</TabsTrigger>
                      <TabsTrigger value="photos">Photos</TabsTrigger>
                    </TabsList>
                  </div>

                  {/* Overview Tab */}
                  <TabsContent value="overview" className="p-6 space-y-8">
                    <div>
                        <h3 className="text-xl font-bold mb-3 text-gray-900">About the Place</h3>
                        <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                            {selectedHotel.description}
                        </p>
                    </div>

                    <div>
                        <h3 className="text-xl font-bold mb-4 text-gray-900">Amenities</h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {amenities.map((am, i) => (
                                <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 border border-gray-100">
                                    <div className="text-primary">{getAmenityIcon(am)}</div>
                                    <span className="text-sm font-medium text-gray-700">{am}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                  </TabsContent>

                  {/* Rooms Tab */}
                  <TabsContent value="rooms" className="p-6">
                    <h3 className="text-xl font-bold mb-6 text-gray-900">Available Accommodation</h3>
                    {selectedHotel.listingDetails?.rooms?.length > 0 ? (
                        <div className="space-y-4">
                            {selectedHotel.listingDetails.rooms.map((room, idx) => (
                                <div key={idx} className="border border-gray-200 rounded-xl p-5 hover:border-primary/50 transition-colors flex flex-col md:flex-row gap-4 justify-between bg-white">
                                    <div className="flex gap-4">
                                        <div className="h-20 w-20 bg-gray-100 rounded-lg flex items-center justify-center shrink-0">
                                            <BedDouble className="h-8 w-8 text-gray-400" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-lg text-gray-900">{room.type}</h4>
                                            <p className="text-sm text-gray-500 mb-2 capitalize">{room.view} View</p>
                                            <div className="flex flex-wrap gap-2">
                                                {room.features?.map((f, fIdx) => (
                                                    <span key={fIdx} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-md">
                                                        {f}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex flex-row md:flex-col justify-between items-center md:items-end border-t md:border-t-0 pt-4 md:pt-0 mt-2 md:mt-0">
                                        <div className="text-right">
                                            <p className="text-2xl font-bold text-primary">₹{room.price}</p>
                                            <p className="text-xs text-gray-400">per night</p>
                                        </div>
                                        <Button size="sm" variant="outline" className="mt-2" onClick={() => window.alert("Select dates to proceed")}>
                                            Select Room
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg">
                            No specific room details listed. Contact host for options.
                        </div>
                    )}
                  </TabsContent>

                  {/* Photos Tab */}
                  <TabsContent value="photos" className="p-6">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {photos.map((photo, i) => (
                            <div key={i} className="aspect-square rounded-lg overflow-hidden cursor-pointer group" onClick={() => setCurrentImageIndex(i)}>
                                <img src={photo} alt="Gallery" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                            </div>
                        ))}
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </div>

            {/* Right Column (Sticky Sidebar) */}
            <div className="lg:col-span-1">
               <div className="sticky top-24 space-y-6">
                  
                  {/* Booking Card */}
                  <Card className="shadow-lg border-t-4 border-t-primary">
                    <CardHeader>
                        <CardTitle className="flex justify-between items-end">
                            <div>
                                <span className="text-sm text-gray-500 font-normal">Starting from</span>
                                <div className="text-3xl font-bold text-gray-900">₹{displayPrice.toLocaleString()}</div>
                            </div>
                            <Badge variant="secondary" className="mb-1 bg-green-100 text-green-700">Available</Badge>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="p-4 bg-gray-50 rounded-lg space-y-3 border border-gray-100">
                             {/* Dynamic Phone Logic */}
                             <div className="flex items-center gap-3">
                                <Phone className="h-5 w-5 text-primary" />
                                {loadingOwner ? (
                                    <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
                                ) : displayPhone ? (
                                    <div className="flex flex-col">
                                        <span className="text-xs text-gray-500">Contact Host</span>
                                        <a href={`tel:${displayPhone}`} className="font-bold text-blue-600 hover:text-blue-800 hover:underline">
                                            {displayPhone}
                                        </a>
                                    </div>
                                ) : (
                                    <span className="text-sm font-medium text-gray-600">
                                        {selectedHotel.ownerId ? "Login to view contact" : "Contact hidden"}
                                    </span>
                                )}
                            </div>
                        </div>

                        <Button className="w-full py-6 text-lg shadow-md hover:shadow-lg transition-all" onClick={() => window.alert('Booking Engine integration coming soon!')}>
                            Book Your Stay
                        </Button>
                        
                        <div className="text-center">
                             <p className="text-xs text-gray-500 flex items-center justify-center gap-1">
                                <Info className="h-3 w-3" /> No booking fees involved
                             </p>
                        </div>
                    </CardContent>
                  </Card>

                  {/* Host Info Card */}
                  <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="h-12 w-12 bg-gray-200 rounded-full flex items-center justify-center">
                                <Users className="h-6 w-6 text-gray-500" />
                            </div>
                            <div>
                                <h4 className="font-bold text-gray-900">Property Host</h4>
                                <p className="text-xs text-gray-500">Member since 2024</p>
                            </div>
                        </div>
                        <p className="text-sm text-gray-600 mb-4">
                            Usually responds within an hour. Known for great hospitality and local tips.
                        </p>
                        <Button variant="outline" className="w-full text-xs">Message Host</Button>
                    </CardContent>
                  </Card>

               </div>
            </div>

          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // VIEW 2: LIST PAGE (Browsing Hotels)
  // ==========================================
  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* Header & Filter Section */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <Button variant="ghost" onClick={() => navigate('/')} className="flex items-center gap-2 pl-0 hover:bg-transparent hover:text-primary">
                <ArrowLeft className="h-5 w-5" /> Back Home
              </Button>
            </div>
            <h1 className="text-xl font-bold hidden md:block text-gray-800">Hotels & Resorts</h1>
          </div>
          
          <div className="flex flex-col md:flex-row gap-3">
            <div className="flex-1 relative">
               <Input 
                placeholder="Search hotels by name..." 
                value={filters.search}
                onChange={(e) => setFilters({...filters, search: e.target.value})}
                className="bg-gray-50 pl-10"
               />
               <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <Filter className="h-4 w-4" />
               </div>
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 no-scrollbar">
               <Select value={filters.location} onValueChange={(v) => setFilters({...filters, location: v})}>
                  <SelectTrigger className="w-40 bg-gray-50">
                    <SelectValue placeholder="Location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Locations</SelectItem>
                    <SelectItem value="nainital">Nainital</SelectItem>
                    <SelectItem value="bhimtal">Bhimtal</SelectItem>
                    <SelectItem value="mukteshwar">Mukteshwar</SelectItem>
                    <SelectItem value="pangot">Pangot</SelectItem>
                  </SelectContent>
               </Select>

               <Select value={filters.price} onValueChange={(v) => setFilters({...filters, price: v})}>
                  <SelectTrigger className="w-40 bg-gray-50">
                    <SelectValue placeholder="Price" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Prices</SelectItem>
                    <SelectItem value="budget">Budget (Under ₹3k)</SelectItem>
                    <SelectItem value="mid">Mid (₹3k - ₹6k)</SelectItem>
                    <SelectItem value="luxury">Luxury (Above ₹6k)</SelectItem>
                  </SelectContent>
               </Select>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {loading ? (
          <div className="flex flex-col justify-center items-center h-64">
            <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
            <span className="text-gray-500 font-medium">Finding best stays for you...</span>
          </div>
        ) : filteredListings.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-dashed border-gray-300">
            <div className="bg-gray-50 rounded-full p-4 w-20 h-20 mx-auto mb-4 flex items-center justify-center">
              <Home className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No hotels found</h3>
            <p className="text-gray-500 mb-6">We couldn't find any stays matching your criteria.</p>
            <Button variant="outline" onClick={() => setFilters({location:'all', price:'all', search:''})}>
                Clear all filters
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredListings.map((hotel) => {
              const startPrice = getPrice(hotel);
              const amenities = getAmenities(hotel);

              return (
                <Card 
                  key={hotel.id} 
                  className="overflow-hidden hover:shadow-2xl transition-all duration-300 cursor-pointer group flex flex-col h-full border-gray-100"
                  onClick={() => setSelectedHotel(hotel)}
                >
                  <div className="relative h-60 overflow-hidden">
                    <img
                      src={hotel.photos?.[0] || "https://placehold.co/600x400?text=No+Image"}
                      alt={hotel.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
                    
                    <div className="absolute top-3 right-3 bg-white/95 backdrop-blur px-3 py-1 rounded-full text-xs font-bold shadow-sm uppercase tracking-wide text-gray-800">
                      {hotel.profession === 'hill-stays' ? 'Hill Stay' : 'Hotel'}
                    </div>
                    
                    <div className="absolute bottom-3 left-3 text-white">
                        <div className="flex items-center gap-1 text-sm font-medium drop-shadow-md">
                           <MapPin className="h-3 w-3" /> {hotel.location}
                        </div>
                    </div>
                  </div>
                  
                  <CardContent className="p-5 flex flex-col grow">
                    <div className="mb-3">
                      <h3 className="text-xl font-bold line-clamp-1 group-hover:text-primary transition-colors text-gray-900">{hotel.name}</h3>
                      <div className="flex items-center gap-1 mt-1">
                          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                          <span className="text-xs text-gray-500 font-medium">4.5 (12 reviews)</span>
                      </div>
                    </div>
                    
                    {/* Amenities Preview */}
                    <div className="flex gap-2 mb-6 overflow-hidden">
                      {amenities.slice(0, 3).map((am, i) => (
                         <Badge key={i} variant="secondary" className="px-2 py-0.5 font-normal text-xs bg-gray-100 text-gray-600 border-none">
                            {am}
                         </Badge>
                      ))}
                      {amenities.length > 3 && (
                        <span className="text-xs text-gray-400 flex items-center pl-1">+{amenities.length - 3} more</span>
                      )}
                    </div>

                    <div className="mt-auto pt-4 border-t border-gray-100 flex items-end justify-between">
                      <div>
                        <span className="text-xs text-gray-400 uppercase font-semibold">Starts from </span>
                        <div className="flex items-center gap-1">
                            <span className="text-xl font-bold text-primary">₹{startPrice.toLocaleString()}</span>
                            <span className="text-xs text-gray-400 font-normal">/ night</span>
                        </div>
                      </div>
                      <div className="bg-primary/5 p-2 rounded-full group-hover:bg-primary group-hover:text-white transition-colors">
                        <ChevronRight className="h-5 w-5" />
                      </div>
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