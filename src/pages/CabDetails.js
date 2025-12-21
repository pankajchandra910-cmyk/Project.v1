import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  ArrowLeft, Home, Car, Phone, MessageCircle, 
  MapPin, Star, Loader2, Filter, ShieldCheck, Search, 
  ChevronLeft, ChevronRight, CheckCircle2, User, UserCircle, Send,
  Briefcase, Plane, Map as MapIcon, Info, Users, Award, Zap, Tag,Mail
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
      <h3 className="text-xl font-bold mb-6">Traveller Reviews</h3>

      <div className="bg-gray-50 p-4 rounded-lg mb-8 border border-gray-200">
        <h4 className="font-semibold mb-3">Rate your ride</h4>
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
          placeholder="How was the driver? Cleanliness? Timing?..." 
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
            {loading ? <Loader2 className="animate-spin h-4 w-4 mr-2" /> : 'Load More Reviews'}
          </Button>
        )}
      </div>
    </div>
  );
};

// ==========================================
// 2. MAIN COMPONENT: CAB DETAILS
// ==========================================
export default function CabDetails() {
  const navigate = useNavigate();
  const { id } = useParams();
  
  // State
  const [vendors, setVendors] = useState([]);
  const [selectedCab, setSelectedCab] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  
  // Detail View State
 
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Filters State
  const [searchQuery, setSearchQuery] = useState(''); 
  const [filters, setFilters] = useState({
    serviceType: 'all',
    vehicleType: 'all'
  });

  // --- 1. Auth Listener ---
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user ? { uid: user.uid, displayName: user.displayName || "User" } : null);
    });
    return () => unsubscribe();
  }, []);

  // --- 2. Fetch Data ---
  useEffect(() => {
    const fetchCabs = async () => {
      try {
        setLoading(true);
        
        if (id) {
            // A. FETCH SINGLE VENDOR (Detail View)
            const docRef = doc(db, "listings", id);
            const docSnap = await getDoc(docRef);
            
            if (docSnap.exists()) {
                const data = docSnap.data();
                const cabData = data.listingDetails?.cabData || {};
                
                setSelectedCab({
                    id: docSnap.id,
                    name: data.name,
                    description: data.description || 'No description provided.',
                    location: data.location || 'Uttarakhand',
                    verified: data.verified || false,
                    status: data.status,
                    ownerId: data.ownerId,
                    vendername:data.contactSnapshot?.name||"",
                    contact: data.contactSnapshot?.phone || '',
                    whatsapp: data.contactSnapshot?.phone || '',
                    rating: data.rating || 0,
                    reviewCount: data.reviews || 0,
                    photos: data.photos?.length ? data.photos : ['https://via.placeholder.com/800x600?text=Cab+Service'],
                    
                    // Specifics
                    vehicles: cabData.availableVehicleTypes || [],
                    inventory: data.listingDetails?.vehicles || [], 
                    services: cabData.services || [],
                    specializations: cabData.specializations || [],
                    pricing: {
                        local: cabData.pricing?.local || 'On Request',
                        outstation: cabData.pricing?.outstation || 'On Request',
                        airport: cabData.pricing?.airport || 'On Request'
                    }
                });
            } else {
                toast.error("Vendor not found");
                navigate('/cab-details');
            }
        } else {
            // B. FETCH ALL VENDORS (List View)
            const q = query(
                collection(db, "listings"), 
                where("profession", "==", "cabs-taxis"),
                where("status", "==", "Active")
            );
            
            const querySnapshot = await getDocs(q);
            const fetchedData = querySnapshot.docs.map(doc => {
                const data = doc.data();
                const cabData = data.listingDetails?.cabData || {};
                return {
                    id: doc.id,
                    name: data.name,
                    description: data.description || '',
                    location: data.location,
                    contact: data.contactSnapshot?.phone || '', 
                    whatsapp: data.contactSnapshot?.phone || '', 
                    rating: data.rating || 0,
                    reviewCount: data.reviews || 0,
                    verified: data.verified || false,
                    photos: data.photos || ['https://via.placeholder.com/800x600?text=Cab+Service'],
                    vehicles: cabData.availableVehicleTypes || [], 
                    inventory: data.listingDetails?.vehicles || [], 
                    services: cabData.services || [],
                    specializations: cabData.specializations || [],
                    pricing: cabData.pricing || {}
                };
            });
            setVendors(fetchedData);
            setSelectedCab(null);
        }
      } catch (error) {
        console.error("Error fetching cabs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCabs();
  }, [id, navigate]);

  
  // --- Handlers ---
  const nextImage = (e) => {
    e?.stopPropagation();
    if (!selectedCab?.photos) return;
    setCurrentImageIndex((prev) => prev === selectedCab.photos.length - 1 ? 0 : prev + 1);
  };

  const prevImage = (e) => {
    e?.stopPropagation();
    if (!selectedCab?.photos) return;
    setCurrentImageIndex((prev) => prev === 0 ? selectedCab.photos.length - 1 : prev - 1);
  };

  // Helper to add +91
  const handleContact = (number, type) => {
    if (!number) return;
    let cleanNum = number.replace(/\D/g, ''); 
    if (cleanNum.length === 10) cleanNum = '91' + cleanNum;
    
    if(type === 'whatsapp') {
        window.open(`https://wa.me/${cleanNum}`, '_blank');
    } else {
        window.open(`tel:+${cleanNum}`);
    }
  };

  // --- Filter Logic ---
  const filteredVendors = vendors.filter(vendor => {
    if (filters.serviceType !== 'all') {
      if (!vendor.services.includes(filters.serviceType)) return false;
    }
    if (filters.vehicleType !== 'all') {
      const hasVehicle = vendor.vehicles.some(v => v.toLowerCase().includes(filters.vehicleType.toLowerCase()));
      if (!hasVehicle) return false;
    }
    if (searchQuery) {
        const lowerQ = searchQuery.toLowerCase();
        const matchesName = vendor.name.toLowerCase().includes(lowerQ);
        const matchesLoc = vendor.location?.toLowerCase().includes(lowerQ);
        return matchesName || matchesLoc;
    }
    return true;
  });

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-gray-50">
         <Loader2 className="h-10 w-10 animate-spin text-primary mb-2" />
         <span className="text-gray-500">Loading fleet...</span>
      </div>
    );
  }

  // ==========================================
  // VIEW 1: DETAIL VIEW (Consistent Colorful UI)
  // ==========================================
  if (selectedCab) {
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
        <div className="relative h-[40vh] md:h-[70vh] w-full bg-gray-900 group">
            {selectedCab.photos.map((photo, index) => (
                <div 
                    key={index} 
                    className={`absolute inset-0 transition-opacity duration-500 ease-in-out ${index === currentImageIndex ? 'opacity-100' : 'opacity-0'}`}
                >
                    <img src={photo} alt={selectedCab.name} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/20 to-transparent" />
                </div>
            ))}
            
            {/* Arrows */}
            {selectedCab.photos.length > 1 && (
                <>
                    <button onClick={prevImage} className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-3 rounded-full backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100 z-20">
                        <ChevronLeft className="h-6 w-6" />
                    </button>
                    <button onClick={nextImage} className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-3 rounded-full backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100 z-20">
                        <ChevronRight className="h-6 w-6" />
                    </button>
                    <div className="absolute bottom-32 left-1/2 -translate-x-1/2 flex gap-2 z-20">
                        {selectedCab.photos.map((_, idx) => (
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

            {/* Hero Content Overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-4 md:p-8 pb-8 md:pb-12 text-white z-10">
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-center gap-3">
                        <h1 className="text-3xl md:text-5xl font-extrabold mb-3 drop-shadow-xl leading-tight">{selectedCab.name}</h1>
                        {selectedCab.verified && (
                             <div title="Verified Vendor" className="mb-2">
                                <ShieldCheck className="h-8 w-8 text-blue-400 fill-blue-500/20" />
                             </div>
                        )}
                    </div>
                    
                    <div className="flex items-center gap-4 text-lg text-gray-200 font-medium drop-shadow-md">
                        <div className="flex items-center gap-1">
                             <MapPin className="h-5 w-5" />
                             {selectedCab.location}
                        </div>
                       
                    </div>
                </div>
            </div>
        </div>

        {/* Content Grid */}
        <div className="max-w-7xl mx-auto px-4 -mt-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Content */}
            <div className="lg:col-span-2 space-y-8">
                
                {/* About & Features Card */}
                <div className="bg-white rounded-xl shadow-md p-6 md:p-8 border border-gray-100">
                    <h2 className="text-2xl font-bold mb-4 text-gray-900">About the Vendor</h2>
                    <p className="text-gray-600 leading-relaxed text-lg whitespace-pre-line mb-8">
                        {selectedCab.description}
                    </p>
                    
                    {/* 1. SERVICES OFFERED (Colorful Pills) */}
                    {selectedCab.services && selectedCab.services.length > 0 && (
                        <div className="mb-8">
                             <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                                <Zap className="h-4 w-4" /> Services Offered
                             </h3>
                             <div className="flex flex-wrap gap-2">
                                {selectedCab.services.map((service, index) => (
                                    <Badge key={index} className="bg-blue-50 text-blue-700 hover:bg-blue-100 border-blue-100 px-3 py-1.5 text-sm font-medium shadow-sm">
                                        <CheckCircle2 className="h-3.5 w-3.5 mr-1.5" />
                                        {service}
                                    </Badge>
                                ))}
                             </div>
                        </div>
                    )}

                    {/* 2. SPECIALIZATIONS (Distinct Style) */}
                    {selectedCab.specializations && selectedCab.specializations.length > 0 && (
                        <div className="mb-8 p-5 bg-amber-50/50 rounded-xl border border-amber-100">
                             <h3 className="text-sm font-bold text-amber-800 uppercase tracking-wider mb-4 flex items-center gap-2">
                                <Award className="h-4 w-4" /> Specializations
                             </h3>
                             <div className="flex flex-wrap gap-2">
                                {selectedCab.specializations.map((spec, index) => (
                                    <Badge key={index} variant="outline" className="bg-white text-amber-700 border-amber-200 px-3 py-1 text-sm font-medium shadow-sm">
                                        {spec}
                                    </Badge>
                                ))}
                             </div>
                        </div>
                    )}

                    {/* 3. ESTIMATED RATES (Colorful Grid) */}
                    <div className="border-t pt-6 mb-6">
                        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Estimated Rates</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                             <div className="bg-green-50 border border-green-100 p-4 rounded-xl flex flex-col items-center justify-center text-center hover:shadow-sm transition-all">
                                <div className="bg-white p-2 rounded-full mb-2 shadow-sm"><MapIcon className="w-5 h-5 text-green-600"/></div>
                                <span className="text-sm font-medium text-gray-600 mb-1">Local</span>
                                <span className="text-xl font-bold text-green-700">₹{selectedCab.pricing.local || 'On Request'}</span>
                             </div>
                             
                             <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl flex flex-col items-center justify-center text-center hover:shadow-sm transition-all">
                                <div className="bg-white p-2 rounded-full mb-2 shadow-sm"><Car className="w-5 h-5 text-blue-600"/></div>
                                <span className="text-sm font-medium text-gray-600 mb-1">Outstation</span>
                                <span className="text-xl font-bold text-blue-700">₹{selectedCab.pricing.outstation || 'On Request'}</span>
                             </div>
                             
                             <div className="bg-purple-50 border border-purple-100 p-4 rounded-xl flex flex-col items-center justify-center text-center hover:shadow-sm transition-all">
                                <div className="bg-white p-2 rounded-full mb-2 shadow-sm"><Plane className="w-5 h-5 text-purple-600"/></div>
                                <span className="text-sm font-medium text-gray-600 mb-1">Airport</span>
                                <span className="text-xl font-bold text-purple-700">₹{selectedCab.pricing.airport || 'On Request'}</span>
                             </div>
                        </div>
                    </div>

                    {/* 4. VEHICLES */}
                    <div className="border-t pt-6">
                        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Available Vehicle Types</h3>
                        <div className="flex flex-wrap gap-2">
                            {selectedCab.vehicles.map((v, i) => (
                                <div key={i} className="flex items-center gap-2 bg-gray-50 border border-gray-200 px-3 py-2 rounded-lg text-sm font-medium text-gray-700">
                                    <Car className="h-4 w-4 text-gray-400" />
                                    {v}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Fleet Inventory Card */}
                {selectedCab.inventory.length > 0 && (
                    <div className="bg-white rounded-xl shadow-md p-6 md:p-8 border border-gray-100">
                        <h2 className="text-2xl font-bold mb-6">Our Fleet & Drivers</h2>
                        <div className="grid grid-cols-1 gap-4">
                            {selectedCab.inventory.map((car, i) => (
                                <div key={i} className="flex flex-col md:flex-row justify-between p-5 border border-gray-200 rounded-xl hover:shadow-md transition-shadow bg-white">
                                    <div className="flex items-start gap-4 mb-4 md:mb-0">
                                        <div className="bg-blue-50 p-3 rounded-full">
                                            <Car className="h-6 w-6 text-blue-600" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-gray-900 text-lg">{car.name}</h4>
                                            <p className="text-sm text-gray-500 mb-1">{car.type || 'Standard'}</p>
                                            <p className="text-primary font-bold">₹{car.rate}<span className="text-xs text-gray-400 font-normal"> / km</span></p>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-end gap-2 md:w-1/2">
                                         <div className="flex items-center gap-2 mb-2">
                                            <div className="text-right">
                                                <p className="text-xs text-gray-400 font-bold uppercase">Driver</p>
                                                <p className="text-sm font-semibold text-gray-800">{car.driverName || "Available"}</p>
                                            </div>
                                            <UserCircle className="h-8 w-8 text-gray-300" />
                                         </div>
                                         <div className="flex gap-2 w-full justify-end">
                                             <Button 
                                                size="sm" 
                                                className="bg-green-600 hover:bg-green-700 h-9"
                                                onClick={() => handleContact(car.driverPhone || selectedCab.contact, 'call')}
                                             >
                                                <Phone className="h-3 w-3 mr-1" /> Call
                                             </Button>
                                             <Button 
                                                size="sm" 
                                                variant="outline"
                                                className="border-green-200 text-green-700 hover:bg-green-50 h-9"
                                                onClick={() => handleContact(car.driverPhone || selectedCab.whatsapp, 'whatsapp')}
                                             >
                                                <MessageCircle className="h-3 w-3 mr-1" /> WhatsApp
                                             </Button>
                                         </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Reviews */}
                {currentUser ? (
                    <ReviewSection 
                        listingId={selectedCab.id} 
                        ownerId={selectedCab.ownerId} 
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

            {/* Right Sidebar (Strictly Vendor Details) */}
            <div className="lg:col-span-1">
                <div className="bg-white rounded-xl shadow-lg p-6 sticky top-24 border border-gray-100 z-10 border-t-4 border-t-primary">
                    <h3 className="text-xl font-bold mb-6 text-gray-900">Book with Vendor</h3>
                    
                    <div className="bg-gray-50 p-5 rounded-xl border border-gray-100 mb-6">
                       <p className="font-bold text-sm text-gray-900 mb-3 uppercase tracking-wider">Vendor Contact</p>
                       <div className="flex items-center gap-3">
                           <div className="bg-white p-2.5 rounded-full shadow-xs border border-gray-100">
                              <User className="h-5 w-5 text-gray-500" />
                           </div>
                           <div className="overflow-hidden">
                               <p className="text-lg font-bold text-gray-900 truncate tracking-tight">
                                   {selectedCab.vendername|| "Contact Info"}
                               </p>
                               <div className="flex items-center gap-1.5 mt-0.5">
                                   <span className="relative flex h-2 w-2">
                                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                      <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                                   </span>
                                   <p className="text-xs text-green-700 font-medium">Vendor Online</p>
                               </div>
                           </div>
                       </div>
                    </div>

                    <div className="space-y-4 mb-4">
                        <Button 
                            className="w-full flex items-center justify-center gap-2 h-14 text-lg shadow-lg shadow-blue-200 transition-all hover:-translate-y-0.5"
                            onClick={() => handleContact(selectedCab.contact, 'call')}
                            disabled={!selectedCab.contact}
                        >
                            <Phone className="h-5 w-5" /> Call Vendor
                        </Button>
                        <Button 
                            variant="outline"
                            className="w-full flex items-center justify-center gap-2 h-14 text-lg border-green-200 text-green-700 hover:bg-green-50 hover:border-green-300 shadow-sm"
                            onClick={() => handleContact(selectedCab.whatsapp, 'whatsapp')}
                            disabled={!selectedCab.whatsapp}
                        >
                            <MessageCircle className="h-5 w-5" /> WhatsApp Vendor
                        </Button>
                    </div>
                    
                    <div className="mt-4 flex items-start gap-2 text-xs text-gray-400 bg-blue-50/50 p-3 rounded-lg">
                        <Info className="h-4 w-4 shrink-0 text-blue-400" />
                        <p>Pay directly to the vendor after your trip completion.</p>
                    </div>
                </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // VIEW 2: LIST VIEW (Refined Colorful Cards)
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
            <h1 className="text-xl font-bold hidden md:block text-gray-800">Cabs & Taxis</h1>
          </div>
          
          <div className="flex flex-col md:flex-row gap-3">
            <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input 
                  placeholder="Search by cab name, location, or car model..." 
                  className="pl-9 bg-gray-50 border-gray-200 focus:bg-white transition-colors"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 no-scrollbar">
               <Select value={filters.serviceType} onValueChange={(v) => setFilters({...filters, serviceType: v})}>
                  <SelectTrigger className="w-[150px] bg-white">
                    <SelectValue placeholder="Service Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Services</SelectItem>
                    <SelectItem value="Local City Ride">Local Ride</SelectItem>
                    <SelectItem value="Outstation">Outstation</SelectItem>
                    <SelectItem value="Airport Transfer">Airport</SelectItem>
                  </SelectContent>
               </Select>

               <Select value={filters.vehicleType} onValueChange={(v) => setFilters({...filters, vehicleType: v})}>
                  <SelectTrigger className="w-[150px] bg-white">
                    <SelectValue placeholder="Vehicle Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Vehicles</SelectItem>
                    <SelectItem value="Hatchback">Hatchback</SelectItem>
                    <SelectItem value="Sedan">Sedan</SelectItem>
                    <SelectItem value="SUV">SUV</SelectItem>
                    <SelectItem value="Tempo Traveller">Tempo Traveller</SelectItem>
                  </SelectContent>
               </Select>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {filteredVendors.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-dashed">
            <Filter className="h-10 w-10 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 text-lg">No cab services found.</p>
            <Button variant="link" onClick={() => { setSearchQuery(''); setFilters({ serviceType: 'all', vehicleType: 'all' }); }}>
              Clear Search
            </Button>
          </div>
        ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVendors.map((vendor) => {
              // Safe calculations to avoid crashes and fix pricing display
              const localPrice = parseInt(vendor.pricing?.local || 0);
              const outstationPrice = parseInt(vendor.pricing?.outstation || 0);
              
              // Logic to display a "Starting At" price
              let displayPrice = 'On Request';
              let priceUnit = '';
              
              if (localPrice > 0) {
                displayPrice = localPrice;
                priceUnit = '/km';
              } else if (outstationPrice > 0) {
                displayPrice = outstationPrice;
                priceUnit = '/km';
              }

              return (
                <Card 
                    key={vendor.id} 
                    className="overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer group flex flex-col h-full border border-gray-100 rounded-xl"
                    onClick={() => navigate(`/cab-details/${vendor.id}`)}
                >
                {/* 1. Card Image Area */}
                <div className="relative h-56 overflow-hidden">
                    <img 
                        src={vendor.photos?.[0] || 'https://via.placeholder.com/800x600?text=Cab+Service'} 
                        alt={vendor.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent opacity-80"></div>
                    
                    <div className="absolute top-3 left-3 flex gap-2">
                        <Badge className="bg-white/95 text-gray-800 backdrop-blur-sm shadow-sm font-bold text-xs px-2 py-0.5 border border-white/50">
                            Cabs & Taxis
                        </Badge>
                    </div>

                    <div className="absolute bottom-4 left-4 right-4 text-white">
                        <div className="flex justify-between items-end">
                            <h3 className="text-xl font-bold leading-tight drop-shadow-md mb-1 line-clamp-1">{vendor.name}</h3>
                            {vendor.verified && <ShieldCheck className="h-5 w-5 text-blue-400 fill-blue-500/20 mb-1" />}
                        </div>
                        <div className="flex items-center gap-1 text-xs text-gray-200 font-medium">
                                <MapPin className="h-3 w-3" /> {vendor.location}
                        </div>
                    </div>
                </div>

                {/* 2. Card Content (Compact & Attractive) */}
                <CardContent className="p-4 flex flex-col h-45% grow">
                    {/* Description excerpt */}
                    <p className="text-gray-600 text-xs mb-3 line-clamp-2 leading-relaxed">
                        {vendor.description || "Professional cab service available for local, outstation, and airport transfers."}
                    </p>

                    {/* Services Pills (Compact) */}
                    <div className="mb-3 flex flex-wrap gap-1.5">
                        {vendor.services.slice(0, 3).map((s, idx) => (
                            <span key={idx} className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-blue-50 text-blue-700 border border-blue-100">
                                <Zap className="w-3 h-3 mr-1" /> {s}
                            </span>
                        ))}
                        {vendor.services.length > 3 && <span className="text-[10px] text-gray-400 self-center">+{vendor.services.length - 3}</span>}
                    </div>

                    {/* Pricing Grid (Compact & Colorful) */}
                    <div className="mb-3 grid grid-cols-3 gap-1.5 text-center">
                        <div className="bg-green-50 border border-green-100 p-1.5 rounded-lg flex flex-col items-center">
                            <MapIcon className="w-3 h-3 text-green-600 mb-0.5" />
                            <p className="text-[9px] text-green-600 font-bold uppercase">Local</p>
                            <p className="text-xs font-bold text-gray-800">₹{vendor.pricing?.local || 'NA'}</p>
                        </div>
                        <div className="bg-blue-50 border border-blue-100 p-1.5 rounded-lg flex flex-col items-center">
                            <Car className="w-3 h-3 text-blue-600 mb-0.5" />
                            <p className="text-[9px] text-blue-600 font-bold uppercase">Outstn.</p>
                            <p className="text-xs font-bold text-gray-800">₹{vendor.pricing?.outstation || 'NA'}</p>
                        </div>
                        <div className="bg-purple-50 border border-purple-100 p-1.5 rounded-lg flex flex-col items-center">
                            <Plane className="w-3 h-3 text-purple-600 mb-0.5" />
                            <p className="text-[9px] text-purple-600 font-bold uppercase">Airpt.</p>
                            <p className="text-xs font-bold text-gray-800">₹{vendor.pricing?.airport || 'NA'}</p>
                        </div>
                    </div>

                    {/* Vehicle Icons (Responsive) */}
                    <div className="flex flex-wrap gap-1.5 mb-0">
                        {vendor.vehicles.slice(0, 4).map((v, idx) => (
                            <div key={idx} className="flex items-center gap-1 bg-gray-50 border border-gray-200 px-2 py-1 rounded text-xs text-gray-700 font-medium">
                                <Car className="w-5 h-6 text-gray-500" /> {v}
                            </div>
                        ))}
                         {vendor.vehicles.length > 4 && <span className="text-[10px] text-gray-400 self-center">+{vendor.vehicles.length - 4}</span>}
                    </div>

                    {/* Footer: Price & Button */}
                    <div className="mt-2 border-t border-gray-100 pt-3 flex justify-between items-center">
                        <div>
                            <p className="text-[9px] uppercase text-gray-400 font-bold">Starts From</p>
                            <p className="text-primary font-bold text-base">
                                {typeof displayPrice === 'number' ? `₹${displayPrice}` : displayPrice}
                                <span className="text-[10px] text-gray-500 font-normal ml-0.5">{priceUnit}</span>
                            </p>
                        </div>
                        <Button size="sm" className="bg-primary hover:bg-primary/90 text-white shadow-md rounded-lg text-xs h-8 px-4">
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