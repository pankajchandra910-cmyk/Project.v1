import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  ArrowLeft, Home, MapPin, Wifi, Car, Coffee, 
  Phone, Filter, Loader2, ChevronLeft, ChevronRight, 
  CheckCircle2, ShieldCheck, UserCircle, Star, User, Send, Mail
} from 'lucide-react';

// --- FIREBASE IMPORTS ---
import { 
  collection, query, where, getDocs, doc, getDoc, 
  addDoc, serverTimestamp, updateDoc, increment, orderBy, limit, startAfter 
} from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { db } from '../firebase'; 

// --- UI IMPORTS ---
import { Card, CardContent } from '../component/Card';
import { Button } from '../component/button';
import { Badge } from '../component/badge';
import { Input } from '../component/Input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../component/select';
import { Textarea } from '../component/textarea'; 
import { toast } from 'sonner'; 

// ==========================================
// 1. REUSABLE COMPONENT: REVIEW SECTION
// ==========================================
const ReviewSection = ({ listingId, ownerId, currentUser }) => {
  const [reviews, setReviews] = useState([]);
  const [lastDoc, setLastDoc] = useState(null);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  
  // Submission State
  const [newRating, setNewRating] = useState(0);
  const [newComment, setNewComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Fetch Reviews
  const fetchReviews = async (isMore = false) => {
    try {
      setLoading(true);
      const reviewsRef = collection(db, "listings", listingId, "reviews");
      let q = query(reviewsRef, orderBy("createdAt", "desc"), limit(isMore ? 10 : 5));

      if (isMore && lastDoc) {
        q = query(reviewsRef, orderBy("createdAt", "desc"), startAfter(lastDoc), limit(10));
      }

      const snapshot = await getDocs(q);
      const fetchedReviews = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      if (snapshot.docs.length > 0) {
        setLastDoc(snapshot.docs[snapshot.docs.length - 1]);
        if (isMore) setReviews(prev => [...prev, ...fetchedReviews]);
        else setReviews(fetchedReviews);
      } else {
        setHasMore(false);
      }
      
      if (snapshot.docs.length < (isMore ? 10 : 5)) setHasMore(false);

    } catch (error) {
      console.error("Error fetching reviews:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (listingId) fetchReviews();
  }, [listingId]);

  // Submit Review
  const handleSubmit = async () => {
    if (!currentUser) return toast.error("Please login to submit a review");
    if (newRating === 0) return toast.error("Please select a star rating");
    if (!newComment.trim()) return toast.error("Please write a comment");

    setSubmitting(true);
    try {
      await addDoc(collection(db, "listings", listingId, "reviews"), {
        userName: currentUser.displayName || "Guest User",
        userId: currentUser.uid,
        rating: newRating,
        comment: newComment,
        createdAt: serverTimestamp(),
        hostId: ownerId || "unknown" 
      });

      // Update Listing Aggregates
      const listingRef = doc(db, "listings", listingId);
      const listingSnap = await getDoc(listingRef);
      
      if (listingSnap.exists()) {
        const data = listingSnap.data();
        const currentCount = data.reviews || 0;
        const currentRating = data.rating || 0;
        const newAvg = ((currentRating * currentCount) + newRating) / (currentCount + 1);

        await updateDoc(listingRef, {
          reviews: increment(1),
          rating: Number(newAvg.toFixed(1))
        });
      }

      toast.success("Review submitted!");
      setNewComment("");
      setNewRating(0);
      setReviews([]); 
      setLastDoc(null);
      fetchReviews(false); 
    } catch (error) {
      toast.error("Failed to submit review");
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6 mt-8 border border-gray-100">
      <h3 className="text-xl font-bold mb-6">Guest Feedback & Reviews</h3>

      <div className="bg-gray-50 p-4 rounded-lg mb-8 border border-gray-200">
        <h4 className="font-semibold mb-3">Rate your experience</h4>
        <div className="flex gap-2 mb-4">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className={`cursor-pointer h-8 w-8 ${star <= newRating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
              onClick={() => setNewRating(star)}
            />
          ))}
        </div>
        <Textarea 
          placeholder="Share your experience..." 
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className="bg-white mb-3 min-h-[100px] w-full p-2 border rounded"
        />
        <Button onClick={handleSubmit} disabled={submitting} className="w-full sm:w-auto">
          {submitting ? <Loader2 className="animate-spin h-4 w-4 mr-2"/> : <Send className="h-4 w-4 mr-2"/>}
          Submit Feedback
        </Button>
      </div>

      <div className="space-y-6">
        {reviews.length > 0 ? (
          reviews.map((review) => (
            <div key={review.id} className="border-b border-gray-100 pb-4 last:border-0">
              <div className="flex items-center gap-2 mb-2">
                <div className="bg-blue-100 p-2 rounded-full">
                  <User className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <p className="font-semibold text-sm">{review.userName}</p>
                  <div className="flex items-center gap-2">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`h-3 w-3 ${i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                      ))}
                    </div>
                    <span className="text-xs text-gray-400">
                       {review.createdAt?.toDate ? new Date(review.createdAt.toDate()).toLocaleDateString() : ''}
                    </span>
                  </div>
                </div>
              </div>
              <p className="text-gray-600 text-sm ml-10">{review.comment}</p>
            </div>
          ))
        ) : (
          <p className="text-gray-500 italic text-center py-4">No reviews yet.</p>
        )}

        {hasMore && reviews.length > 0 && (
          <Button variant="outline" className="w-full mt-4" onClick={() => fetchReviews(true)} disabled={loading}>
            {loading ? <Loader2 className="animate-spin h-4 w-4 mr-2" /> : 'Load More Feedback'}
          </Button>
        )}
      </div>
    </div>
  );
};

// ==========================================
// 2. MAIN COMPONENT: HOTEL DETAILS
// ==========================================
export default function HotelDetails() {
  const navigate = useNavigate();
  const { id } = useParams(); // GRAB ID FROM URL

  // --- State Management ---
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedHotel, setSelectedHotel] = useState(null); 
  
  // Auth State
  const [currentUser, setCurrentUser] = useState(null);

  // Detail View Specific State
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Filter State (For List View)
  const [filters, setFilters] = useState({
    location: 'all',
    price: 'all',
    search: ''
  });

  // --- 1. Check Auth State ---
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser({
            uid: user.uid,
            displayName: user.displayName || "Anonymous User"
        });
      } else {
        setCurrentUser(null);
      }
    });
    return () => unsubscribe();
  }, []);

  // --- 2. MAIN FETCH LOGIC ---
  useEffect(() => {
    const loadContent = async () => {
      setLoading(true);
      try {
        if (id) {
          // A. DIRECT ID MODE: Fetch single document
          const docRef = doc(db, "listings", id);
          const docSnap = await getDoc(docRef);
          
          if (docSnap.exists()) {
            const data = { id: docSnap.id, ...docSnap.data() };
            setSelectedHotel(data);
          } else {
            toast.error("Hotel not found");
            navigate('/hotel-details'); // Redirect to list
          }
        } else {
          // B. LIST MODE: Fetch ONLY resort-hotel documents
          const q = query(
            collection(db, "listings"), 
            where("profession", "==", "resort-hotel") // UPDATED: Only fetching resort-hotel
          );
          
          const querySnapshot = await getDocs(q);
          const fetchedData = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          
          setListings(fetchedData);
          setSelectedHotel(null); 
        }
      } catch (error) {
        console.error("Error loading content:", error);
      } finally {
        setLoading(false);
      }
    };

    loadContent();
  }, [id, navigate]); 

  // --- Helper Functions ---
  const getPrice = (hotel) => {
    if (hotel.listingDetails?.rooms?.length > 0) {
      const prices = hotel.listingDetails.rooms.map(r => Number(r.price));
      return Math.min(...prices);
    }
    return Number(hotel.price) || 0;
  };

  const getDisplayAmenities = (hotel) => {
    if (hotel.listingDetails?.hillStayAmenities?.length > 0) {
      return hotel.listingDetails.hillStayAmenities;
    }
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
    if (key.includes('food') || key.includes('break') || key.includes('din')) return <Coffee className="h-4 w-4" />;
    return <CheckCircle2 className="h-4 w-4 text-green-600" />;
  };

  // --- Handlers ---
  const handleHotelClick = (hotel) => {
    navigate(`/hotel-details/${hotel.id}`);
  };

  const handleBack = () => {
    if (id) {
        navigate(-1); 
    } else {
        setSelectedHotel(null);
    }
  };

  const nextImage = (e) => {
    e?.stopPropagation();
    if (!selectedHotel?.photos) return;
    setCurrentImageIndex((prev) => prev === selectedHotel.photos.length - 1 ? 0 : prev + 1);
  };

  const prevImage = (e) => {
    e?.stopPropagation();
    if (!selectedHotel?.photos) return;
    setCurrentImageIndex((prev) => prev === 0 ? selectedHotel.photos.length - 1 : prev - 1);
  };

  // --- Filtering Logic ---
  const filteredListings = listings.filter(hotel => {
    const price = getPrice(hotel);
    const matchesLoc = filters.location === 'all' || hotel.location.toLowerCase() === filters.location.toLowerCase();
    const matchesSearch = !filters.search || hotel.name.toLowerCase().includes(filters.search.toLowerCase());
    
    let matchesPrice = true;
    if (filters.price === 'budget') matchesPrice = price <= 3000;
    if (filters.price === 'mid') matchesPrice = price > 3000 && price <= 6000;
    if (filters.price === 'luxury') matchesPrice = price > 6000;

    return matchesLoc && matchesSearch && matchesPrice;
  });

  // ==========================================
  // VIEW 1: DETAIL PAGE (If ID exists)
  // ==========================================
  if (loading) {
      return (
          <div className="flex flex-col justify-center items-center h-screen bg-gray-50">
            <Loader2 className="h-10 w-10 animate-spin text-primary mb-2" />
            <p className="text-gray-500">Loading...</p>
          </div>
      );
  }

  if (selectedHotel) {
    const amenities = getDisplayAmenities(selectedHotel);
    const displayPrice = getPrice(selectedHotel);
    const photos = selectedHotel.photos?.length ? selectedHotel.photos : ["https://placehold.co/1200x600?text=No+Image"];

    return (
      <div className="min-h-screen bg-gray-50 pb-12">
        {/* Nav */}
        <div className="bg-white shadow-sm border-b sticky top-0 z-20">
          <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
            <Button variant="ghost" onClick={handleBack} className="gap-2">
              <ArrowLeft className="h-4 w-4" /> Back 
            </Button>
            <Button variant="ghost" onClick={() => navigate('/')} className="gap-2">
              <Home className="h-4 w-4" /> Home
            </Button>
          </div>
        </div>

        {/* --- HERO IMAGE SLIDER --- */}
        <div className="relative h-[40vh] md:h-[70vh] w-full bg-gray-900 group">
            {/* Image Layers */}
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
                <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent" />
              </div>
            ))}

            {/* Controls */}
            {photos.length > 1 && (
              <>
                <button 
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/20 hover:bg-black/40 text-white p-2 rounded-full backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100 z-10"
                >
                  <ChevronLeft className="h-8 w-8" />
                </button>
                <button 
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/20 hover:bg-black/40 text-white p-2 rounded-full backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100 z-10"
                >
                  <ChevronRight className="h-8 w-8" />
                </button>
                
                {/* Dots Indicators */}
                <div className="absolute bottom-28 left-1/2 -translate-x-1/2 flex gap-2 z-20">
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

            {/* Text Overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-4 md:p-8 pb-8 md:pb-12 text-white z-10">
              <div className="max-w-7xl mx-auto">
                <div className="flex items-center gap-3">
                    <h1 className="text-3xl md:text-5xl font-bold mb-2 shadow-sm drop-shadow-xl">{selectedHotel.name}</h1>
                    {selectedHotel.verified && (
                        <ShieldCheck className="h-8 w-8 text-blue-400 fill-blue-400/20" />
                    )}
                </div>
                <div className="flex items-center gap-2 text-lg text-gray-200">
                    <MapPin className="h-5 w-5" />
                    {selectedHotel.location}, Uttarakhand
                </div>
              </div>
            </div>
        </div>

        {/* Content Grid with Floating Effect */}
        <div className="max-w-7xl mx-auto px-4 -mt-6 relative z-10">
            <div className="grid lg:grid-cols-3 gap-8">
                {/* Left Column */}
                <div className="lg:col-span-2 space-y-8">
                
                    {/* About & Amenities */}
                    <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6 md:p-8">
                        <h2 className="text-2xl font-bold mb-4 text-gray-900">About the Hotel</h2>
                        <p className="text-gray-600 whitespace-pre-line leading-relaxed text-lg mb-6">{selectedHotel.description}</p>
                        
                        <div className="border-t border-gray-100 pt-6">
                            <h3 className="font-semibold mb-4 text-lg">Amenities</h3>
                            <div className="flex gap-3 flex-wrap">
                                {amenities.map((a, i) => (
                                    <Badge key={i} variant="secondary" className="px-3 py-2 text-sm flex items-center gap-2 bg-gray-50 text-gray-700 border border-gray-100">
                                    {getAmenityIcon(a)} {a}
                                    </Badge>
                                ))}
                                {amenities.length === 0 && <span className="text-gray-500 italic">No amenities listed.</span>}
                            </div>
                        </div>
                    </div>

                    {/* Accommodation UI */}
                    {selectedHotel.listingDetails?.rooms?.length > 0 && (
                        <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6 md:p-8">
                            <h2 className="text-2xl font-bold mb-6">Available Rooms</h2>
                            <div className="space-y-4">
                                {selectedHotel.listingDetails.rooms.map((room, i) => (
                                <div 
                                    key={i} 
                                    className="border border-gray-200 rounded-xl p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:bg-gray-50 transition-colors duration-200"
                                >
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-3">
                                            <h4 className="font-bold text-lg text-gray-900">{room.type}</h4>
                                            {room.view && <Badge variant="outline" className="text-xs font-normal">{room.view} View</Badge>}
                                        </div>
                                        
                                        <div className="flex flex-wrap gap-2">
                                            {room.features?.slice(0,5).map((f, idx) => (
                                            <span key={idx} className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
                                                {f}
                                            </span>
                                            ))}
                                        </div>
                                    </div>
                                    
                                    <div className="text-right w-full md:w-auto pt-2 md:pt-0 border-t md:border-t-0 mt-2 md:mt-0">
                                        <p className="text-2xl font-bold text-primary">₹{room.price}</p>
                                        <p className="text-xs text-gray-500">per night</p>
                                    </div>
                                </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* --- FEEDBACK SECTION --- */}
                    {currentUser ? (
                        <ReviewSection 
                                listingId={selectedHotel.id} 
                                ownerId={selectedHotel.ownerId}
                                currentUser={currentUser} 
                        />
                    ) : (
                        <Card className="p-8 bg-gray-50 border-dashed border-gray-200 shadow-none">
                            <div className="flex flex-col items-center justify-center text-center space-y-3">
                                <div className="bg-gray-200 p-3 rounded-full">
                                    <UserCircle className="h-8 w-8 text-gray-500" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900">Login to leave a review</h3>
                                    <p className="text-gray-500 max-w-sm mx-auto">
                                        Share your experience with us! Please sign in to post your feedback and rating.
                                    </p>
                                </div>
                                <Button variant="outline" onClick={() => navigate('/login')}>
                                    Login Now
                                </Button>
                            </div>
                        </Card>
                    )}
                </div>

                {/* Right Column (Sticky Booking Card) */}
                <div className="lg:col-span-1">
                    <Card className="p-6 sticky top-24 shadow-lg border-t-4 border-t-primary rounded-xl border-x border-b border-gray-100 bg-white">
                        <div className="flex justify-between items-end mb-6 pb-6 border-b border-gray-100">
                            <div>
                                <p className="text-sm text-gray-500 font-medium">Starting from</p>
                                <p className="text-3xl font-bold text-primary">₹{displayPrice.toLocaleString()}</p>
                            </div>
                            <Badge className="bg-green-100 text-green-700 hover:bg-green-100">{selectedHotel.status || 'Available'}</Badge>
                        </div>
                        
                        <Button className="w-full mb-4 h-12 text-lg font-semibold shadow-md">Book Now</Button>
                        
                        <div className="bg-blue-50/50 p-4 rounded-lg border border-blue-100">
                            <p className="font-semibold text-sm text-gray-900 mb-3">Host Contact Details</p>
                            <div className="space-y-3">
                                <div className="flex items-center gap-3 group cursor-pointer">
                                    <div className="bg-white p-2 rounded-full shadow-xs">
                                        <Phone className="h-4 w-4 text-primary" />
                                        </div>
                                    { selectedHotel.contactSnapshot?.phone ? (
                                        <a href={`tel:${selectedHotel.contactSnapshot.phone }`} className="font-medium text-gray-700 group-hover:text-primary transition-colors">
                                            {selectedHotel.contactSnapshot.phone }
                                        </a>
                                    ) : (
                                        <span className="text-gray-400 text-sm italic">Loading number...</span>
                                    )}
                                </div>
                                
                                {selectedHotel.contactSnapshot?.email && (
                                    <div className="flex items-center gap-3">
                                        <div className="bg-white p-2 rounded-full shadow-xs">
                                            <Mail className="h-4 w-4 text-primary"/>
                                        </div>
                                        <span className="text-sm text-gray-600 truncate max-w-[200px]">
                                            {selectedHotel.contactSnapshot.email}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                        <p className="text-xs text-center text-gray-400 mt-4">Free cancellation up to 24hrs before check-in</p>
                    </Card>
                </div>
            </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // VIEW 2: LIST PAGE (If NO ID in URL)
  // ==========================================
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header & Filter Bar */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <Button variant="ghost" onClick={() => navigate('/')} className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" /> Back Home
            </Button>
            <h1 className="text-xl font-bold hidden md:block">Hotels & Resorts</h1>
          </div>
          
          <div className="flex flex-col md:flex-row gap-3">
            <div className="flex-1">
               <Input 
                placeholder="Search hotels..." 
                value={filters.search}
                onChange={(e) => setFilters({...filters, search: e.target.value})}
                className="bg-gray-50 border-gray-200"
               />
            </div>
            <div className="flex gap-2">
               <Select value={filters.location} onValueChange={(v) => setFilters({...filters, location: v})}>
                  <SelectTrigger className="w-[140px] bg-gray-50"><SelectValue placeholder="Location" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Locations</SelectItem>
                    <SelectItem value="nainital">Nainital</SelectItem>
                    <SelectItem value="bhimtal">Bhimtal</SelectItem>
                    <SelectItem value="mukteshwar">Mukteshwar</SelectItem>
                  </SelectContent>
               </Select>

               <Select value={filters.price} onValueChange={(v) => setFilters({...filters, price: v})}>
                  <SelectTrigger className="w-[140px] bg-gray-50"><SelectValue placeholder="Price" /></SelectTrigger>
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

      {/* Results Grid */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {filteredListings.length === 0 ? (
          <div className="text-center py-12">
            <div className="bg-white rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center shadow-sm">
              <Filter className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold">No hotels found</h3>
            <Button variant="link" onClick={() => setFilters({location:'all', price:'all', search:''})}>Reset filters</Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredListings.map((hotel) => {
              const startPrice = getPrice(hotel);
              const amenities = getDisplayAmenities(hotel);

              return (
                <Card 
                  key={hotel.id} 
                  className="overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer group flex flex-col h-full border-0 shadow-md rounded-xl"
                  onClick={() => handleHotelClick(hotel)}
                >
                  <div className="relative h-56 overflow-hidden">
                    <img
                      src={hotel.photos?.[0] || "https://placehold.co/600x400?text=No+Image"}
                      alt={hotel.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur px-2 py-1 rounded text-xs font-bold shadow-sm text-gray-800">
                      {hotel.profession === 'hill-stays' ? 'Hill Stay' : 'Resort/Hotel'}
                    </div>
                  </div>
                  
                  <CardContent className="p-5 flex flex-col grow">
                    <div className="flex justify-between items-start mb-1">
                        <h3 className="text-xl font-bold line-clamp-1 text-gray-900">{hotel.name}</h3>
                        {/* --- LIST VIEW: Verified Badge --- */}
                        {hotel.verified && (
                            <div title="Verified Listing">
                                <ShieldCheck className="h-5 w-5 text-blue-500 fill-blue-100" />
                            </div>
                        )}
                    </div>
                    
                    <div className="flex items-center gap-1 text-sm text-gray-500 mb-4">
                      <MapPin className="h-3.5 w-3.5" /> <span className="capitalize">{hotel.location}</span>
                    </div>

                    <div className="flex gap-2 mb-4 overflow-hidden h-6">
                      {amenities.slice(0, 3).map((am, i) => (
                         <div key={i} className="flex items-center gap-1 text-xs bg-gray-50 px-2 py-0.5 rounded text-gray-600 whitespace-nowrap border border-gray-100">
                            {getAmenityIcon(am)} {am}
                         </div>
                      ))}
                      {amenities.length > 3 && <span className="text-xs text-gray-400 flex items-center">+{amenities.length - 3}</span>}
                    </div>

                    <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
                      <div>
                        <span className="text-sm text-gray-400">from </span>
                        <span className="text-lg font-bold text-primary">₹{startPrice.toLocaleString()}</span>
                      </div>
                      <Button size="sm" className="bg-primary hover:bg-primary/90 rounded-lg">View Details</Button>
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