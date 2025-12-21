import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  ArrowLeft, Home, MapPin, Phone, MessageCircle, 
  ShieldCheck, Search, Filter, Loader2, Star, User, 
  UserCircle, Send, ChevronLeft, ChevronRight, Bike, 
  Fuel, Banknote, FileCheck, Info, CheckCircle2, 
  Gauge, Settings, AlertCircle, CalendarClock, Zap, 
  Calendar, Mail
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
// 1. REUSABLE REVIEW SECTION
// ==========================================
const ReviewSection = ({ listingId, ownerId, currentUser }) => {
  const [reviews, setReviews] = useState([]);
  const [lastDoc, setLastDoc] = useState(null);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  
  const [newRating, setNewRating] = useState(0);
  const [newComment, setNewComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

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
      <h3 className="text-xl font-bold mb-6">Rider Reviews</h3>
      {/* Review Form */}
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
          placeholder="Bike condition? Shop service? Share details..." 
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className="bg-white mb-3 min-h-[100px] w-full p-2 border rounded"
        />
        <Button onClick={handleSubmit} disabled={submitting} className="w-full sm:w-auto">
          {submitting ? <Loader2 className="animate-spin h-4 w-4 mr-2"/> : <Send className="h-4 w-4 mr-2"/>}
          Submit Feedback
        </Button>
      </div>

      {/* Review List */}
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
            {loading ? <Loader2 className="animate-spin h-4 w-4 mr-2" /> : 'Load More Reviews'}
          </Button>
        )}
      </div>
    </div>
  );
};

// ==========================================
// 2. MAIN COMPONENT: RENTAL BIKES PAGE
// ==========================================
export default function RentalBikesPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  
  // State
  const [rentals, setRentals] = useState([]);
  const [selectedShop, setSelectedShop] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  
  // UI State
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Filters State
  const [searchQuery, setSearchQuery] = useState(''); 
  const [filters, setFilters] = useState({
    location: 'all',
    type: 'all'
  });

  // --- Auth Listener ---
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user ? { uid: user.uid, displayName: user.displayName || "User" } : null);
    });
    return () => unsubscribe();
  }, []);

  // --- Fetch Data ---
  useEffect(() => {
    const fetchRentals = async () => {
      try {
        setLoading(true);
        
        if (id) {
            // A. FETCH SINGLE SHOP (Detail View)
            const docRef = doc(db, "listings", id);
            const docSnap = await getDoc(docRef);
            
            if (docSnap.exists()) {
                const data = docSnap.data();
                const listingDetails = data.listingDetails || {};
                
                // Calculate start price from fleet
                const fleet = listingDetails.bikes || [];
                const startPrice = fleet.length > 0 
                    ? Math.min(...fleet.map(b => Number(b.price) || 0)) 
                    : 0;

                setSelectedShop({
                    id: docSnap.id,
                    name: data.name,
                    description: data.description || 'Premium bike rental service in Uttarakhand.',
                    location: data.location || 'Uttarakhand',
                    verified: data.verified || false,
                    status: data.status,
                    ownerId: data.ownerId,
                    contact: data.contactSnapshot?.phone || '',
                    shopownerName: data.contactSnapshot?.name || '',
                    email: data.contactSnapshot?.email || '',
                    
                    // Fleet & Details
                    bikes: fleet,
                    startPrice: startPrice,
                    photos: data.photos?.length ? data.photos : ['https://images.unsplash.com/photo-1558981806-ec527fa84f3d?auto=format&fit=crop&q=80&w=1200'],
                    
                    policies: {
                        mileage: listingDetails.policies?.mileage || 'Unlimited within Uttarakhand',
                        securityDeposit: listingDetails.policies?.securityDeposit || '₹2,000 - ₹5,000',
                        fuelPolicy: listingDetails.policies?.fuelPolicy || 'Return with same fuel level',
                        delivery: listingDetails.policies?.delivery ? 'Available' : 'Shop Pickup Only'
                    },
                    services: listingDetails.services || ['Helmet Included', '24/7 Support'],
                    documents: listingDetails.documents || ['Valid driving license', 'Government ID proof']
                });
            } else {
                toast.error("Rental shop not found");
                navigate('/rental-bikes');
            }
        } else {
            // B. FETCH ALL SHOPS (List View)
            const q = query(
                collection(db, "listings"), 
                where("profession", "==", "rental-bikes"),
                where("status", "==", "Active")
            );
            
            const querySnapshot = await getDocs(q);
            const fetchedData = querySnapshot.docs.map(doc => {
                const data = doc.data();
                const rentalData = data.listingDetails || {};
                return {
                    id: doc.id,
                    name: data.name,
                    description: data.description,
                    location: data.location,
                    contact: data.contactSnapshot?.phone,
                    verified: data.verified || false,
                    photos: data.photos || ['https://images.unsplash.com/photo-1558981806-ec527fa84f3d?auto=format&fit=crop&q=80&w=1200'],
                    bikes: rentalData.bikes || [],
                    startPrice: rentalData.bikes?.length > 0 
                        ? Math.min(...rentalData.bikes.map(b => Number(b.price))) 
                        : 0
                };
            });
            setRentals(fetchedData);
            setSelectedShop(null);
        }
      } catch (error) {
        console.error("Error fetching rentals:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRentals();
  }, [id, navigate]);

  // --- Handlers ---
  const handleContact = (number, type) => {
    if (!number) {
        toast.error("Contact number not available");
        return;
    }
    
    // Clean string, remove non-digits
    let cleanNum = number.replace(/\D/g, ''); 
    
    // Add 91 if length is 10 (India standard)
    if (cleanNum.length === 10) cleanNum = '91' + cleanNum;
    
    if(type === 'whatsapp') {
        window.open(`https://wa.me/${cleanNum}`, '_blank');
    } else {
        window.open(`tel:+${cleanNum}`, '_self');
    }
  };

  const nextImage = (e) => {
    e?.stopPropagation();
    if (!selectedShop?.photos) return;
    setCurrentImageIndex((prev) => prev === selectedShop.photos.length - 1 ? 0 : prev + 1);
  };

  const prevImage = (e) => {
    e?.stopPropagation();
    if (!selectedShop?.photos) return;
    setCurrentImageIndex((prev) => prev === 0 ? selectedShop.photos.length - 1 : prev - 1);
  };

  // --- Filter Logic ---
  const filteredRentals = rentals.filter(shop => {
    if (filters.location !== 'all' && shop.location.toLowerCase() !== filters.location.toLowerCase()) return false;
    
    if (filters.type !== 'all') {
        const hasType = shop.bikes.some(b => b.type && b.type.toLowerCase().includes(filters.type.toLowerCase()));
        if (!hasType) return false;
    }

    if (searchQuery) {
        const lowerQ = searchQuery.toLowerCase();
        return shop.name.toLowerCase().includes(lowerQ) || shop.location.toLowerCase().includes(lowerQ);
    }
    return true;
  });

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-gray-50">
         <Loader2 className="h-10 w-10 animate-spin text-primary mb-2" />
         <span className="text-gray-500">Loading bikes...</span>
      </div>
    );
  }

  // ==========================================
  // VIEW 1: DETAIL VIEW (Single Shop with Inventory)
  // ==========================================
  if (selectedShop) {
    return (
      <div className="min-h-screen bg-gray-50 pb-12">
        {/* Sticky Header */}
        <div className="bg-white shadow-sm border-b sticky top-0 z-20">
          <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
            <Button variant="ghost" onClick={() => navigate(-1)} className="gap-2">
                <ArrowLeft className="h-4 w-4" /> Back
            </Button>
            <Button variant="ghost" onClick={() => navigate('/')} className="gap-2">
                <Home className="h-4 w-4" /> Home
            </Button>
          </div>
        </div>

        {/* Hero Slider */}
        <div className="relative h-[40vh] md:h-[60vh] w-full bg-gray-900 group">
            {selectedShop.photos.map((photo, index) => (
                <div 
                    key={index} 
                    className={`absolute inset-0 transition-opacity duration-500 ease-in-out ${index === currentImageIndex ? 'opacity-100' : 'opacity-0'}`}
                >
                    <img src={photo} alt={selectedShop.name} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/20 to-transparent" />
                </div>
            ))}
            
            {/* Arrows */}
            {selectedShop.photos.length > 1 && (
                <>
                    <button onClick={prevImage} className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-3 rounded-full backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100 z-20">
                        <ChevronLeft className="h-6 w-6" />
                    </button>
                    <button onClick={nextImage} className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-3 rounded-full backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100 z-20">
                        <ChevronRight className="h-6 w-6" />
                    </button>
                    
                    {/* Dots */}
                    <div className="absolute bottom-32 left-1/2 -translate-x-1/2 flex gap-2 z-20">
                        {selectedShop.photos.map((_, idx) => (
                        <div 
                            key={idx}
                            onClick={() => setCurrentImageIndex(idx)}
                            className={`w-2 h-2 rounded-full cursor-pointer transition-all shadow-sm ${
                                idx === currentImageIndex ? 'bg-white w-6' : 'bg-white/50 hover:bg-white/80'
                            }`}
                        />
                        ))}
                    </div>
                </>
            )}

            {/* Hero Content */}
            <div className="absolute bottom-0 left-0 right-0 p-4 md:p-8 pb-8 md:pb-12 text-white z-10">
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-center gap-3">
                        <h1 className="text-3xl md:text-5xl font-extrabold mb-2 drop-shadow-xl">{selectedShop.name}</h1>
                        {/* Verified Icon (Detail View) */}
                        {selectedShop.verified && (
                             <div title="Verified Shop" className="mb-2">
                                <ShieldCheck className="h-8 w-8 text-blue-400 fill-blue-500/20" />
                             </div>
                        )}
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-4 text-sm md:text-lg text-gray-200 font-medium">
                        <div className="flex items-center gap-1">
                             <MapPin className="h-5 w-5" />
                             {selectedShop.location}
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/* Main Content Grid */}
        <div className="max-w-7xl mx-auto px-4 -mt-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left Column (Info & Inventory) */}
            <div className="lg:col-span-2 space-y-8">
                
                {/* About & Services Section */}
                <div className="bg-white rounded-xl shadow-md p-6 md:p-8 border border-gray-100">
                    <h2 className="text-2xl font-bold mb-4 text-gray-900">About the Shop</h2>
                    <p className="text-gray-600 leading-relaxed text-lg whitespace-pre-line mb-6">
                        {selectedShop.description}
                    </p>
                    
                    {/* Services Included */}
                    {selectedShop.services.length > 0 && (
                        <div className="mb-8">
                            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                                <CheckCircle2 className="h-5 w-5 text-green-600" /> Services Included
                            </h3>
                            <div className="flex flex-wrap gap-3">
                                {selectedShop.services.map((service, idx) => (
                                    <Badge key={idx} variant="secondary" className="px-3 py-1.5 text-sm bg-blue-50 text-blue-700 border border-blue-100">
                                        {service}
                                    </Badge>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Dynamic Rental Policies */}
                    <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                        <h3 className="text-lg font-bold text-gray-900 mb-5 flex items-center gap-2">
                            <Info className="h-5 w-5 text-primary" /> Rental Policies
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div className="flex items-start gap-3">
                                <div className="bg-white p-2 rounded-lg shadow-sm text-blue-600">
                                    <Gauge className="h-5 w-5" />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">Mileage Policy</p>
                                    <p className="font-semibold text-gray-800">{selectedShop.policies.mileage}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="bg-white p-2 rounded-lg shadow-sm text-green-600">
                                    <Banknote className="h-5 w-5" />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">Security Deposit</p>
                                    <p className="font-semibold text-gray-800">{selectedShop.policies.securityDeposit}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="bg-white p-2 rounded-lg shadow-sm text-orange-600">
                                    <Fuel className="h-5 w-5" />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">Fuel Policy</p>
                                    <p className="font-semibold text-gray-800">{selectedShop.policies.fuelPolicy}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="bg-white p-2 rounded-lg shadow-sm text-purple-600">
                                    <Home className="h-5 w-5" />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">Delivery</p>
                                    <p className="font-semibold text-gray-800">{selectedShop.policies.delivery}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Detailed Fleet Inventory */}
                <div className="bg-white rounded-xl shadow-md p-6 md:p-8 border border-gray-100">
                    <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                        <Bike className="h-6 w-6 text-primary" /> Available Fleet
                    </h2>
                    
                    {selectedShop.bikes.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {selectedShop.bikes.map((bike, index) => (
                                <div key={index} className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow bg-white flex flex-col group">
                                    {/* Image Area */}
                                    <div className="h-52 overflow-hidden relative bg-gray-100">
                                        <img 
                                            src={bike.image || "https://placehold.co/600x400?text=Bike+Image"} 
                                            alt={bike.name}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                        <div className="absolute top-2 right-2">
                                            {bike.available ? (
                                                <Badge className="bg-green-100 text-green-800 border-green-200 shadow-sm font-semibold">Available</Badge>
                                            ) : (
                                                <Badge className="bg-red-100 text-red-800 border-red-200 shadow-sm font-semibold">Booked</Badge>
                                            )}
                                        </div>
                                    </div>

                                    {/* Content Area */}
                                    <div className="p-4 flex flex-col flex-1">
                                        <div className="flex justify-between items-start mb-3">
                                            <h3 className="font-bold text-gray-900 text-lg leading-tight line-clamp-1">{bike.name}</h3>
                                            <div className="text-right shrink-0 ml-2">
                                                <p className="font-bold text-xl text-primary">₹{bike.price}</p>
                                                <p className="text-[10px] text-gray-500">per day</p>
                                            </div>
                                        </div>
                                        
                                        {/* Dynamic Specifications Grid */}
                                        <div className="bg-gray-50 p-3 rounded-lg border border-gray-100 mb-4 text-xs">
                                            <div className="grid grid-cols-2 gap-y-2 gap-x-2">
                                                <div className="flex items-center gap-2 text-gray-600">
                                                    <Settings className="h-3.5 w-3.5 text-gray-400" />
                                                    <span className="font-medium truncate">{bike.type || 'Standard'}</span>
                                                </div>
                                                
                                                {/* Conditionally show other specs if they exist */}
                                                {bike.engine && (
                                                    <div className="flex items-center gap-2 text-gray-600">
                                                        <Gauge className="h-3.5 w-3.5 text-gray-400" />
                                                        <span className="font-medium truncate">{bike.engine}</span>
                                                    </div>
                                                )}
                                                {bike.brand && (
                                                    <div className="flex items-center gap-2 text-gray-600">
                                                        <Zap className="h-3.5 w-3.5 text-gray-400" />
                                                        <span className="font-medium truncate">{bike.brand}</span>
                                                    </div>
                                                )}
                                                {bike.mileage && (
                                                    <div className="flex items-center gap-2 text-gray-600">
                                                        <Fuel className="h-3.5 w-3.5 text-gray-400" />
                                                        <span className="font-medium truncate">{bike.mileage}</span>
                                                    </div>
                                                )}
                                                {bike.year && (
                                                    <div className="flex items-center gap-2 text-gray-600">
                                                        <Calendar className="h-3.5 w-3.5 text-gray-400" />
                                                        <span className="font-medium truncate">{bike.year}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        
                                        <div className="mt-auto">
                                            <Button 
                                                size="sm" 
                                                className={`w-full ${bike.available ? 'bg-primary hover:bg-primary/90' : 'bg-gray-300 cursor-not-allowed text-gray-500 hover:bg-gray-300'}`}
                                                disabled={!bike.available}
                                                onClick={() => bike.available && handleContact(selectedShop.contact, 'call')}
                                            >
                                                {bike.available ? 'Book Now' : 'Out of Stock'}
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500 italic text-center py-6">No specific bikes listed. Please contact the shop.</p>
                    )}
                </div>

                {/* Reviews */}
                {currentUser ? (
                    <ReviewSection 
                        listingId={selectedShop.id} 
                        ownerId={selectedShop.ownerId} 
                        currentUser={currentUser} 
                    />
                ) : (
                    <Card className="p-8 text-center bg-gray-50 border-dashed">
                        <UserCircle className="h-10 w-10 text-gray-400 mx-auto mb-2" />
                        <h3 className="font-semibold">Login to see & write reviews</h3>
                        <Button variant="outline" className="mt-3" onClick={() => navigate('/login')}>Login Now</Button>
                    </Card>
                )}
            </div>

            {/* Right Sidebar (Sticky Contact) */}
            <div className="lg:col-span-1">
                <div className="bg-white rounded-xl shadow-lg p-6 lg:sticky lg:top-24 border border-gray-100 z-10 border-t-4 border-t-primary">
                    <div className="flex justify-between items-end mb-6 pb-6 border-b border-gray-100">
                        <div>
                            <p className="text-sm text-gray-500 font-medium">Rentals Start From</p>
                            <p className="text-3xl font-bold text-primary">₹{selectedShop.startPrice.toLocaleString()}</p>
                            <p className="text-xs text-gray-400">per day</p>
                        </div>
                    </div>

                    <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 mb-6">
                       <p className="font-semibold text-sm text-gray-900 mb-3">Shop Contact Details</p>
                       <div className="flex items-center gap-3 group cursor-pointer mb-3">
                           <div className="bg-white p-2 rounded-full shadow-xs">
                              <User className="h-4 w-4 text-blue-500" />
                           </div>
                           <p className="font-bold text-gray-900">{selectedShop.shopownerName}</p>
                       </div>
                       
                       {selectedShop.email && (
                          <div className="flex items-center gap-3">
                              <div className="bg-white p-2 rounded-full shadow-xs">
                                 <Mail className="h-4 w-4 text-primary"/>
                              </div>
                              <span className="text-sm text-gray-600 truncate">{selectedShop.email}</span>
                          </div>
                       )}
                    </div>

                    <div className="space-y-3 mb-6">
                        <Button 
                            className="w-full flex items-center justify-center gap-2 h-12 text-md shadow-lg shadow-blue-100 hover:scale-[1.02] transition-transform"
                            onClick={() => handleContact(selectedShop.contact, 'call')}
                        >
                            <Phone className="h-4 w-4" /> Call Shop
                        </Button>
                        <Button 
                            variant="outline"
                            className="w-full flex items-center justify-center gap-2 h-12 text-md border-green-200 text-green-700 hover:bg-green-50 hover:scale-[1.02] transition-transform"
                            onClick={() => handleContact(selectedShop.contact, 'whatsapp')}
                        >
                            <MessageCircle className="h-4 w-4" /> WhatsApp
                        </Button>
                    </div>

                    {/* Required Documents Section */}
                    <div className="border-t border-gray-100 pt-6">
                        <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2 text-sm">
                            <FileCheck className="h-4 w-4 text-primary" /> Required Documents
                        </h4>
                        <ul className="space-y-2">
                            {selectedShop.documents.map((doc, i) => (
                                <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                                    <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                                    <span>{doc}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="mt-4 bg-yellow-50 p-3 rounded-lg border border-yellow-100">
                        <div className="flex items-start gap-2 text-xs text-yellow-800">
                            <AlertCircle className="h-4 w-4 shrink-0" />
                            <p>Helmet is mandatory. Pillion helmet may be charged extra.</p>
                        </div>
                    </div>
                </div>
            </div>

          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // VIEW 2: LIST VIEW (Browsing Shops)
  // ==========================================
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <Button variant="ghost" onClick={() => navigate('/')} className="flex items-center gap-2 hover:bg-gray-100">
              <ArrowLeft className="h-4 w-4" /> Back Home
            </Button>
            <h1 className="text-xl font-bold hidden md:block text-gray-800">Bike & Scooter Rentals</h1>
          </div>
          
          <div className="flex flex-col md:flex-row gap-3">
            <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input 
                  placeholder="Search by shop name, location..." 
                  className="pl-9 bg-gray-50 border-gray-200 focus:bg-white transition-colors"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 no-scrollbar">
               <Select value={filters.location} onValueChange={(v) => setFilters({...filters, location: v})}>
                  <SelectTrigger className="w-[150px] bg-white">
                    <SelectValue placeholder="Location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Locations</SelectItem>
                    <SelectItem value="nainital">Nainital</SelectItem>
                    <SelectItem value="bhimtal">Bhimtal</SelectItem>
                    <SelectItem value="haldwani">Haldwani</SelectItem>
                  </SelectContent>
               </Select>

               <Select value={filters.type} onValueChange={(v) => setFilters({...filters, type: v})}>
                  <SelectTrigger className="w-[150px] bg-white">
                    <SelectValue placeholder="Vehicle Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="bike">Bike (Motorcycle)</SelectItem>
                    <SelectItem value="scooty">Scooty</SelectItem>
                  </SelectContent>
               </Select>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {filteredRentals.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-dashed">
            <Filter className="h-10 w-10 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 text-lg">No rental shops found.</p>
            <Button variant="link" onClick={() => { setSearchQuery(''); setFilters({ location: 'all', type: 'all' }); }}>
              Clear Search
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRentals.map((shop) => (
              <Card 
                key={shop.id} 
                className="overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer group flex flex-col h-full border border-gray-100 rounded-xl"
                onClick={() => navigate(`/rental-bikes/${shop.id}`)}
              >
                {/* Card Image Area */}
                <div className="relative h-56 overflow-hidden">
                  <img 
                    src={shop.photos[0]} 
                    alt={shop.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent opacity-80"></div>
                  
                  {/* Badge: Listing Type (Top Right) */}
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur px-2 py-1 rounded text-xs font-bold shadow-sm text-gray-800">
                      Bike Rental
                  </div>

                  <div className="absolute bottom-4 left-4 right-4 text-white">
                      <div className="flex justify-between items-end">
                          <h3 className="text-xl font-bold leading-tight drop-shadow-md mb-1 flex items-center gap-2">
                             {shop.name}
                             {/* Verified Icon Next to Name */}
                             {shop.verified && (
                                <ShieldCheck className="h-5 w-5 text-blue-400 fill-blue-500/20" />
                             )}
                          </h3>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-gray-200 font-medium">
                            <MapPin className="h-3 w-3" /> {shop.location}
                      </div>
                  </div>
                </div>

                {/* Card Content */}
                <CardContent className="p-5 flex flex-col grow">
                    {/* Quick Fleet Preview */}
                    <div className="mb-4">
                        <p className="text-xs font-bold text-gray-400 uppercase mb-2 tracking-wider">Quick Fleet View</p>
                        {shop.bikes.length > 0 ? (
                            <div className="space-y-2">
                                {shop.bikes.slice(0, 2).map((b, i) => (
                                    <div key={i} className="flex justify-between items-center text-sm border-b border-gray-100 pb-1 last:border-0">
                                        <span className="font-medium text-gray-700 truncate max-w-[150px]">{b.name}</span>
                                        <span className="font-bold text-primary">₹{b.price}<span className="text-[10px] text-gray-400 font-normal">/day</span></span>
                                    </div>
                                ))}
                                {shop.bikes.length > 2 && (
                                    <p className="text-xs text-blue-600 font-medium pt-1">+{shop.bikes.length - 2} more vehicles</p>
                                )}
                            </div>
                        ) : (
                            <p className="text-xs text-gray-400 italic">Inventory details available on request</p>
                        )}
                    </div>

                    <div className="mt-auto pt-3 border-t border-gray-100 flex justify-between items-center">
                        <div>
                            <p className="text-[10px] uppercase text-gray-400 font-bold">Starts From</p>
                            <p className="text-primary font-bold text-lg">
                            ₹{shop.startPrice}<span className="text-xs text-gray-500 font-normal">/day</span>
                            </p>
                        </div>
                        <Button size="sm" className="bg-primary hover:bg-primary/90 text-white shadow-md rounded-lg group-hover:translate-x-1 transition-transform">
                            View Details 
                        </Button>
                    </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}