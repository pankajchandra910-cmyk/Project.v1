import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  ArrowLeft, Home, MapPin, Wifi, Car, Coffee, Mountain, 
  Phone, MessageCircle, Loader2, ChevronLeft, ChevronRight, 
  CheckCircle2, ShieldCheck, UserCircle, Star, User, Send, Mail,
  Trees, CloudFog, Search, Lock, Sparkles, Filter, Compass
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
      <h3 className="text-xl font-bold mb-6">Guest Experiences</h3>

      <div className="bg-gray-50 p-4 rounded-lg mb-8 border border-gray-200">
        <h4 className="font-semibold mb-3">Share your stay experience</h4>
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
          placeholder="What did you love about this place?..." 
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
                <div className="bg-green-100 p-2 rounded-full">
                  <User className="h-4 w-4 text-green-700" />
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
            {loading ? <Loader2 className="animate-spin h-4 w-4 mr-2" /> : 'Load More'}
          </Button>
        )}
      </div>
    </div>
  );
};

// ==========================================
// 2. MAIN COMPONENT: HILL STAYS PAGE
// ==========================================
export default function HillStaysDetails() {
  const navigate = useNavigate();
  const { id } = useParams();

  // State
  const [hillStays, setHillStays] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStay, setSelectedStay] = useState(null); 
  const [currentUser, setCurrentUser] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Filters State
  const [filters, setFilters] = useState({
    location: 'all',
    price: 'all',
    search: ''
  });

  // --- Auth Listener ---
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user ? { uid: user.uid, displayName: user.displayName || "User" } : null);
    });
    return () => unsubscribe();
  }, []);

  // --- Data Fetching ---
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        if (id) {
          // A. DETAIL VIEW
          const docRef = doc(db, "listings", id);
          const docSnap = await getDoc(docRef);
          
          if (docSnap.exists()) {
            const data = docSnap.data();
            if (data.profession !== 'hill-stays') {
                toast.error("This listing is not a Hill Stay");
                navigate('/hill-stays');
                return;
            }
            setSelectedStay({ id: docSnap.id, ...data });
          } else {
            toast.error("Property not found");
            navigate('/hill-stays');
          }
        } else {
          // B. LIST VIEW
          const q = query(
            collection(db, "listings"), 
            where("profession", "==", "hill-stays"),
            where("status", "==", "Active")
          );
          
          const querySnapshot = await getDocs(q);
          const fetchedData = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          setHillStays(fetchedData);
          setSelectedStay(null); 
        }
      } catch (error) {
        console.error("Error fetching hill stays:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, navigate]); 

  // --- Helpers ---
  const getPrice = (stay) => {
    if (stay.listingDetails?.rooms?.length > 0) {
      const prices = stay.listingDetails.rooms.map(r => Number(r.price) || 0).filter(p => p > 0);
      if (prices.length > 0) return Math.min(...prices);
    }
    return Number(stay.price) || 0;
  };

  const getAmenities = (stay) => {
    if (stay.listingDetails?.hillStayAmenities?.length > 0) {
      return stay.listingDetails.hillStayAmenities;
    }
    return stay.listingDetails?.amenities || [];
  };

  const getUniqueFeatures = (stay) => {
    return stay.listingDetails?.uniqueFeatures || [];
  };

  const getActivities = (stay) => {
    return stay.listingDetails?.activities || [];
  };

  const getAmenityIcon = (amenity) => {
    const key = amenity.toLowerCase();
    if (key.includes('wifi')) return <Wifi className="h-4 w-4" />;
    if (key.includes('park')) return <Car className="h-4 w-4" />;
    if (key.includes('food') || key.includes('restaur')) return <Coffee className="h-4 w-4" />;
    if (key.includes('view') || key.includes('mountain')) return <Mountain className="h-4 w-4" />;
    if (key.includes('garden') || key.includes('forest')) return <Trees className="h-4 w-4" />;
    return <CheckCircle2 className="h-4 w-4 text-green-600" />;
  };

  const handleContact = (number, type) => {
    if (!number) {
        toast.error("Contact number not available");
        return;
    }
    // Clean string, remove non-digits
    let cleanNum = number.replace(/\D/g, ''); 
    // Add 91 if length is 10
    if (cleanNum.length === 10) cleanNum = '91' + cleanNum;
    
    if(type === 'whatsapp') {
        window.open(`https://wa.me/${cleanNum}`, '_blank');
    } else {
        window.open(`tel:+${cleanNum}`, '_self');
    }
  };

  const nextImage = (e) => {
    e?.stopPropagation();
    if (!selectedStay?.photos) return;
    setCurrentImageIndex((prev) => prev === selectedStay.photos.length - 1 ? 0 : prev + 1);
  };

  const prevImage = (e) => {
    e?.stopPropagation();
    if (!selectedStay?.photos) return;
    setCurrentImageIndex((prev) => prev === 0 ? selectedStay.photos.length - 1 : prev - 1);
  };

  // --- Filter Logic ---
  const filteredStays = hillStays.filter(stay => {
    const price = getPrice(stay);
    const matchLoc = filters.location === 'all' || stay.location === filters.location;
    const matchSearch = !filters.search || stay.name.toLowerCase().includes(filters.search.toLowerCase()) || stay.location.toLowerCase().includes(filters.search.toLowerCase());
    let matchPrice = true;
    if (filters.price === 'budget') matchPrice = price <= 4000;
    if (filters.price === 'mid') matchPrice = price > 4000 && price <= 8000;
    if (filters.price === 'luxury') matchPrice = price > 8000;
    return matchLoc && matchSearch && matchPrice;
  });

  const uniqueLocations = Array.from(new Set(hillStays.map(s => s.location))).sort();

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-gray-50">
        <Loader2 className="h-10 w-10 animate-spin text-green-600 mb-2" />
        <p className="text-gray-500 font-medium">Loading...</p>
      </div>
    );
  }

  // ==========================================
  // VIEW 1: DETAIL VIEW
  // ==========================================
  if (selectedStay) {
    const amenities = getAmenities(selectedStay);
    const features = getUniqueFeatures(selectedStay);
    const activities = getActivities(selectedStay);
    const startPrice = getPrice(selectedStay);
    const photos = selectedStay.photos?.length ? selectedStay.photos : ["https://placehold.co/1200x600?text=No+Image"];

    return (
      <div className="min-h-screen bg-gray-50 pb-12">
        {/* Sticky Header */}
        <div className="bg-white shadow-sm border-b sticky top-0 z-20">
          <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
            <Button variant="ghost" onClick={() => navigate(-1)} className="gap-2 hover:bg-green-50">
              <ArrowLeft className="h-4 w-4" /> Back 
            </Button>
            <Button variant="ghost" onClick={() => navigate('/')} className="gap-2">
              <Home className="h-4 w-4" /> Home
            </Button>
          </div>
        </div>

        {/* Hero Slider */}
        <div className="relative h-[45vh] md:h-[70vh] w-full bg-gray-900 group">
            {photos.map((photo, index) => (
              <div 
                key={index}
                className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${index === currentImageIndex ? 'opacity-100' : 'opacity-0'}`}
              >
                <img src={photo} alt={selectedStay.name} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent" />
              </div>
            ))}
            {photos.length > 1 && (
              <>
                <button onClick={prevImage} className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/30 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-20"><ChevronLeft className="h-8 w-8" /></button>
                <button onClick={nextImage} className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/30 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-20"><ChevronRight className="h-8 w-8" /></button>
                <div className="absolute bottom-32 left-1/2 -translate-x-1/2 flex gap-2 z-20">
                   {photos.map((_, idx) => (
                     <div key={idx} onClick={() => setCurrentImageIndex(idx)} className={`w-2 h-2 rounded-full cursor-pointer transition-all ${idx === currentImageIndex ? 'bg-white w-5' : 'bg-white/50'}`} />
                   ))}
                </div>
              </>
            )}

            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 pb-12 md:pb-16 text-white z-10">
              <div className="max-w-7xl mx-auto">
                <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-3xl md:text-5xl font-bold drop-shadow-lg">{selectedStay.name}</h1>
                    {/* Verified Icon - Detail View */}
                    {selectedStay.verified && (
                        <div title="Verified Property">
                             <ShieldCheck className="h-8 w-8 text-blue-400 fill-blue-500/20" />
                        </div>
                    )}
                </div>
                <div className="flex items-center gap-2 text-lg text-gray-200">
                    <MapPin className="h-5 w-5" /> {selectedStay.location}
                </div>
              </div>
            </div>
        </div>

        {/* Content Grid */}
        <div className="max-w-7xl mx-auto px-4 -mt-8 relative z-10">
            <div className="grid lg:grid-cols-3 gap-8">
                {/* LEFT COLUMN: Info */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="bg-white rounded-xl shadow-md p-6 md:p-8 border border-gray-100">
                        <div className="flex items-center gap-2 mb-4 text-green-700">
                            <Trees className="h-6 w-6" /><h2 className="text-2xl font-bold text-gray-900">About this Hill Stay</h2>
                        </div>
                        <p className="text-gray-600 leading-relaxed whitespace-pre-line text-lg mb-8">{selectedStay.description}</p>
                        
                        {/* --- UNIQUE FEATURES SECTION (Detail View) --- */}
                        {features.length > 0 && (
                            <div className="mb-8">
                                <h3 className="font-bold text-lg mb-4 text-gray-900 flex items-center gap-2">
                                    <Sparkles className="h-5 w-5 text-yellow-500" /> Unique Features
                                </h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {features.map((feature, idx) => (
                                        <div key={idx} className="flex items-center gap-3 p-3 rounded-lg bg-yellow-50/50 border border-yellow-100">
                                            <div className="bg-white p-1.5 rounded-full shadow-sm text-yellow-600">
                                                <Sparkles className="h-3.5 w-3.5" />
                                            </div>
                                            <span className="text-gray-800 font-medium text-sm">{feature}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* --- AMENITIES SECTION --- */}
                        <div className="pt-6 border-t border-gray-100">
                            <h3 className="font-semibold text-lg mb-4">Amenities</h3>
                            <div className="flex flex-wrap gap-3">
                                {amenities.map((amenity, idx) => (
                                    <Badge key={idx} variant="secondary" className="px-3 py-2 bg-green-50 text-green-800 border border-green-100">
                                        {getAmenityIcon(amenity)} {amenity}
                                    </Badge>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Accommodation */}
                    {selectedStay.listingDetails?.rooms?.length > 0 && (
                        <div className="bg-white rounded-xl shadow-md p-6 md:p-8 border border-gray-100">
                            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2"><CloudFog className="h-6 w-6 text-blue-600"/> Accommodation Options</h2>
                            <div className="space-y-4">
                                {selectedStay.listingDetails.rooms.map((room, idx) => (
                                    <div key={idx} className="border rounded-xl p-5 hover:border-green-300 transition-colors bg-gray-50/50 flex justify-between items-center flex-wrap gap-4">
                                        <div>
                                            <h4 className="font-bold text-lg">{room.type}</h4>
                                            {room.view && <Badge variant="outline" className="mt-1">{room.view} View</Badge>}
                                            {room.description && <p className="text-sm text-gray-500 mt-1">{room.description}</p>}
                                        </div>
                                        <div className="text-right">
                                            <p className="text-2xl font-bold text-green-700">₹{Number(room.price).toLocaleString()}</p>
                                            <p className="text-xs text-gray-500">per night</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* --- ACTIVITIES AVAILABLE SECTION --- */}
                    {activities.length > 0 && (
                        <div className="bg-white rounded-xl shadow-md p-6 md:p-8 border border-gray-100">
                             <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                                <Compass className="h-6 w-6 text-orange-600"/> Activities Available
                             </h2>
                             <div className="flex flex-wrap gap-3">
                                {activities.map((activity, idx) => (
                                   <div key={idx} className="flex items-center gap-2 px-4 py-3 bg-orange-50 text-orange-800 rounded-lg border border-orange-100 font-medium hover:bg-orange-100 transition-colors shadow-sm cursor-default">
                                      <CheckCircle2 className="h-4 w-4 text-orange-600 shrink-0"/> {activity}
                                   </div>
                                ))}
                             </div>
                        </div>
                    )}

                    {currentUser ? <ReviewSection listingId={selectedStay.id} ownerId={selectedStay.ownerId} currentUser={currentUser} /> : (
                        <Card className="p-8 text-center bg-gray-50 border-dashed shadow-none">
                            <UserCircle className="h-12 w-12 text-gray-300 mx-auto mb-2"/><h3 className="font-semibold">Log in to view reviews</h3><Button variant="outline" onClick={() => navigate('/login')} className="mt-3">Log In</Button>
                        </Card>
                    )}
                </div>

                {/* RIGHT COLUMN: Sticky Booking Card (Hotel Style) */}
                <div className="lg:col-span-1">
                    <Card className="p-6 sticky top-24 shadow-lg border-t-4 border-t-green-600 rounded-xl border-x border-b border-gray-100 bg-white">
                        <div className="flex justify-between items-end mb-6 pb-6 border-b border-gray-100">
                            <div>
                                <p className="text-sm text-gray-500 font-medium">Starting from</p>
                                <p className="text-3xl font-bold text-green-700">₹{startPrice.toLocaleString()}</p>
                            </div>
                            <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Available</Badge>
                        </div>
                        
                        <Button className="w-full mb-4 h-12 text-lg font-semibold shadow-md bg-green-700 hover:bg-green-800 text-white">
                            Book Now
                        </Button>
                        
                        <div className="bg-blue-50/50 p-4 rounded-lg border border-blue-100">
                            <p className="font-semibold text-sm text-gray-900 mb-3">Host Contact Details</p>
                            <div className="space-y-3">
                                {selectedStay.contactSnapshot?.phone ? (
                                    <>
                                        <Button 
                                            className="w-full flex items-center justify-center gap-2 h-12 text-md bg-green-700 hover:bg-green-800 text-white"
                                            onClick={() => handleContact(selectedStay.contactSnapshot.phone, 'call')}
                                        >
                                            <Phone className="h-4 w-4" /> Call Host
                                        </Button>
                                        <Button 
                                            variant="outline"
                                            className="w-full flex items-center justify-center gap-2 h-12 text-md border-green-600 text-green-700 hover:bg-green-50"
                                            onClick={() => handleContact(selectedStay.contactSnapshot.phone, 'whatsapp')}
                                        >
                                            <MessageCircle className="h-4 w-4" /> WhatsApp
                                        </Button>
                                    </>
                                ) : (
                                    <div className="text-center text-gray-500 italic py-2">Contact unavailable</div>
                                )}
                                
                                {selectedStay.contactSnapshot?.email && (
                                    <div className="flex items-center gap-3 pt-2 border-t border-blue-100">
                                        <div className="bg-white p-2 rounded-full shadow-xs">
                                            <Mail className="h-4 w-4 text-green-600"/>
                                        </div>
                                        <span className="text-sm text-gray-600 truncate max-w-[200px]">
                                            {selectedStay.contactSnapshot.email}
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
  // VIEW 2: LIST VIEW
  // ==========================================
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <Button variant="ghost" onClick={() => navigate('/')} className="gap-2"><ArrowLeft className="h-4 w-4" /> Back Home</Button>
            <h1 className="text-xl font-bold hidden md:block">Hill Stays & Cottages</h1>
          </div>
          <div className="flex flex-col md:flex-row gap-3">
            <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input placeholder="Search hill stays..." className="pl-9 bg-gray-50" value={filters.search} onChange={(e) => setFilters({...filters, search: e.target.value})}/>
            </div>
            <div className="flex gap-2">
               <Select value={filters.location} onValueChange={(v) => setFilters({...filters, location: v})}>
                  <SelectTrigger className="w-40 bg-white"><SelectValue placeholder="Location" /></SelectTrigger>
                  <SelectContent><SelectItem value="all">All Locations</SelectItem>{uniqueLocations.map(loc => <SelectItem key={loc} value={loc}>{loc}</SelectItem>)}</SelectContent>
               </Select>
               <Select value={filters.price} onValueChange={(v) => setFilters({...filters, price: v})}>
                  <SelectTrigger className="w-40 bg-white"><SelectValue placeholder="Price" /></SelectTrigger>
                  <SelectContent><SelectItem value="all">Any Price</SelectItem><SelectItem value="budget">Budget (&lt; ₹4k)</SelectItem><SelectItem value="mid">Mid (₹4k-8k)</SelectItem><SelectItem value="luxury">Luxury (&gt; ₹8k)</SelectItem></SelectContent>
               </Select>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {filteredStays.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-lg border border-dashed"><Mountain className="w-12 h-12 text-gray-300 mx-auto mb-4" /><p className="text-gray-500">No hill stays found matching your criteria.</p></div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredStays.map((stay) => {
                const features = getUniqueFeatures(stay);
                const amenities = getAmenities(stay);

                return (
                    <Card key={stay.id} className="overflow-hidden hover:shadow-xl transition-all cursor-pointer flex flex-col h-full rounded-xl" onClick={() => navigate(`/hill-stays/${stay.id}`)}>
                    
                    {/* Card Image Area */}
                    <div className="relative h-60 overflow-hidden">
                        <img src={stay.photos?.[0] || "https://placehold.co/600x400?text=Hill+Stay"} alt={stay.name} className="w-full h-full object-cover group-hover:scale-110 duration-700"/>
                        <div className="absolute inset-0 bg-linear-to-t from-black/70 via-transparent to-transparent opacity-60"></div>
                        
                        {/* Badge: Service Type */}
                        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur px-2 py-1 rounded text-xs font-bold shadow-sm text-gray-800">
                            Hill Stay
                        </div>

                        <div className="absolute bottom-4 left-4 right-4 text-white">
                            <div className="flex justify-between items-end">
                                <h3 className="text-xl font-bold leading-tight drop-shadow-md mb-1 flex items-center gap-2">
                                {stay.name}
                                {/* Verified Icon */}
                                {stay.verified && (
                                    <ShieldCheck className="h-5 w-5 text-blue-400 fill-blue-500/20" />
                                )}
                                </h3>
                            </div>
                            <div className="flex items-center gap-1 text-xs opacity-90">
                                <MapPin className="h-3 w-3" /> {stay.location}
                            </div>
                        </div>
                    </div>

                    <CardContent className="p-5 flex flex-col grow">
                        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{stay.description}</p>
                        
                        {/* --- LIST VIEW: UNIQUE FEATURES PREVIEW --- */}
                        {features.length > 0 && (
                            <div className="mb-3">
                                <p className="text-[10px] font-bold text-gray-500 uppercase mb-1.5 flex items-center gap-1">
                                    <Sparkles className="h-3 w-3 text-yellow-500" /> Unique Features:
                                </p>
                                <div className="flex flex-wrap gap-1">
                                    {features.slice(0, 2).map((f, i) => (
                                        <span key={i} className="text-xs bg-yellow-50 text-gray-700 px-1.5 py-0.5 rounded border border-yellow-100 font-medium">
                                            {f}
                                        </span>
                                    ))}
                                    {features.length > 2 && (
                                        <span className="text-xs text-gray-400 font-medium pl-1">
                                            +{features.length - 2} more
                                        </span>
                                    )}
                                </div>
                            </div>
                        )}

                        <div className="flex gap-2 mb-4 overflow-hidden mt-auto pt-2">
                            {amenities.slice(0, 3).map((am, i) => (
                                <span key={i} className="text-[10px] bg-gray-50 text-gray-500 px-2 py-1 rounded border border-gray-100 flex items-center gap-1">
                                    {getAmenityIcon(am)} {am}
                                </span>
                            ))}
                        </div>

                        <div className="mt-auto flex justify-between items-end border-t border-gray-100 pt-4">
                            <div>
                                <p className="text-[10px] text-gray-400 font-bold uppercase">Starts From</p>
                                <p className="text-xl font-bold text-green-700">₹{getPrice(stay).toLocaleString()}</p>
                            </div>
                            <Button size="sm" className="bg-green-700">View Details</Button>
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