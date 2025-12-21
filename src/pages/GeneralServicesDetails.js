import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  ArrowLeft, Home, MapPin, Phone, MessageCircle, 
  Briefcase, Clock, ShieldCheck, Search, Filter, 
  Loader2, Star, User, UserCircle, Send, ChevronLeft, 
  ChevronRight, Wrench, Hammer, Tag, Info, Check, Mail
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
      <h3 className="text-xl font-bold mb-6">Customer Feedback</h3>

      <div className="bg-gray-50 p-4 rounded-lg mb-8 border border-gray-200">
        <h4 className="font-semibold mb-3">Rate this service</h4>
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
          placeholder="Work quality? Punctuality? Share details..." 
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
// 2. MAIN COMPONENT: GENERAL SERVICES PAGE
// ==========================================
export default function GeneralServicesPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  
  // State
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  
  // UI State
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Filters State
  const [searchQuery, setSearchQuery] = useState(''); 
  const [filters, setFilters] = useState({
    location: 'all',
    category: 'all'
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
    const fetchServices = async () => {
      try {
        setLoading(true);
        
        if (id) {
            // A. FETCH SINGLE SERVICE (Detail View)
            const docRef = doc(db, "listings", id);
            const docSnap = await getDoc(docRef);
            
            if (docSnap.exists()) {
                const data = docSnap.data();
                const serviceDetails = data.listingDetails || {};
                const generalData = serviceDetails.generalServiceData || {};

                setSelectedService({
                    id: docSnap.id,
                    name: data.name,
                    description: data.description || 'Professional service provider.',
                    location: data.location || 'Uttarakhand',
                    verified: data.verified || false,
                    status: data.status,
                    ownerId: data.ownerId,
                    OwnerName:data.contactSnapshot?.name ||'',
                    contact: data.contactSnapshot?.phone || '',
                    email: data.contactSnapshot?.email || '',
                    rating: data.rating || 0,
                    reviews: data.reviews || 0,
                    photos: data.photos?.length ? data.photos : ['https://images.unsplash.com/photo-1581578731117-104f2a869a30?auto=format&fit=crop&q=80&w=1200'],
                    
                    // Specific Data Extraction
                    serviceType: generalData.serviceType || 'Service',
                    experience: generalData.experience || 'Not Specified',
                    basePrice: data.price || generalData.pricing?.visitCharge || 500,
                    specializations: generalData.specializations || [], 
                    serviceList: generalData.services || [], 
                    availability: generalData.availability || '9 AM - 6 PM',
                });
            } else {
                toast.error("Service not found");
                navigate('/general-services');
            }
        } else {
            // B. FETCH ALL SERVICES (List View)
            const q = query(
                collection(db, "listings"), 
                where("profession", "==", "other"), 
                where("status", "==", "Active")
            );
            
            const querySnapshot = await getDocs(q);
            const fetchedData = querySnapshot.docs.map(doc => {
                const data = doc.data();
                const generalData = data.listingDetails?.generalServiceData || {};
                
                return {
                    id: doc.id,
                    name: data.name,
                    description: data.description,
                    location: data.location,
                    contact: data.contactSnapshot?.phone,
                    rating: data.rating || 0,
                    verified: data.verified || false,
                    photos: data.photos || ['https://images.unsplash.com/photo-1581578731117-104f2a869a30?auto=format&fit=crop&q=80&w=1200'],
                    
                    serviceType: generalData.serviceType || 'Service',
                    basePrice: data.price || 500,
                    experience: generalData.experience,
                    serviceList: generalData.services || [], 
                };
            });
            setServices(fetchedData);
            setSelectedService(null);
        }
      } catch (error) {
        console.error("Error fetching services:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, [id, navigate]);

  // --- Handlers ---
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
    if (!selectedService?.photos) return;
    setCurrentImageIndex((prev) => prev === selectedService.photos.length - 1 ? 0 : prev + 1);
  };

  const prevImage = (e) => {
    e?.stopPropagation();
    if (!selectedService?.photos) return;
    setCurrentImageIndex((prev) => prev === 0 ? selectedService.photos.length - 1 : prev - 1);
  };

  // --- Filter Logic ---
  const filteredServices = services.filter(item => {
    if (filters.location !== 'all' && item.location.toLowerCase() !== filters.location.toLowerCase()) return false;
    
    if (filters.category !== 'all') {
        if (!item.serviceType.toLowerCase().includes(filters.category.toLowerCase())) return false;
    }

    if (searchQuery) {
        const lowerQ = searchQuery.toLowerCase();
        return item.name.toLowerCase().includes(lowerQ) || 
               item.location.toLowerCase().includes(lowerQ) ||
               item.serviceType.toLowerCase().includes(lowerQ);
    }
    return true;
  });

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-gray-50">
         <Loader2 className="h-10 w-10 animate-spin text-primary mb-2" />
         <span className="text-gray-500">Finding professionals...</span>
      </div>
    );
  }

  // ==========================================
  // VIEW 1: DETAIL VIEW (Single Service)
  // ==========================================
  if (selectedService) {
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
            {selectedService.photos.map((photo, index) => (
                <div 
                    key={index} 
                    className={`absolute inset-0 transition-opacity duration-500 ease-in-out ${index === currentImageIndex ? 'opacity-100' : 'opacity-0'}`}
                >
                    <img src={photo} alt={selectedService.name} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/20 to-transparent" />
                </div>
            ))}
            
            {/* Arrows */}
            {selectedService.photos.length > 1 && (
                <>
                    <button onClick={prevImage} className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-3 rounded-full backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100 z-20">
                        <ChevronLeft className="h-6 w-6" />
                    </button>
                    <button onClick={nextImage} className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-3 rounded-full backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100 z-20">
                        <ChevronRight className="h-6 w-6" />
                    </button>
                    
                    {/* Dots */}
                    <div className="absolute bottom-32 left-1/2 -translate-x-1/2 flex gap-2 z-20">
                        {selectedService.photos.map((_, idx) => (
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
                        <h1 className="text-3xl md:text-5xl font-extrabold mb-2 drop-shadow-xl">{selectedService.name}</h1>
                        {/* Verified Icon (Detail View - Next to Name) */}
                        {selectedService.verified && (
                             <div title="Verified Professional" className="mb-2">
                                <ShieldCheck className="h-8 w-8 text-blue-400 fill-blue-500/20" />
                             </div>
                        )}
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-4 text-sm md:text-lg text-gray-200 font-medium">
                        <div className="flex items-center gap-1">
                             <MapPin className="h-5 w-5" />
                             {selectedService.location}
                        </div>
                        
                    </div>
                </div>
            </div>
        </div>

        {/* Main Content Grid */}
        <div className="max-w-7xl mx-auto px-4 -mt-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left Column (Info & Services) */}
            <div className="lg:col-span-2 space-y-8">
                
                {/* About & Specs */}
                <div className="bg-white rounded-xl shadow-md p-6 md:p-8 border border-gray-100">
                    <h2 className="text-2xl font-bold mb-4 text-gray-900">About the Professional</h2>
                    <p className="text-gray-600 leading-relaxed text-lg whitespace-pre-line mb-8">
                        {selectedService.description}
                    </p>
                    
                    {/* Specifications Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                        <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 flex flex-col justify-center">
                            <span className="text-xs text-blue-600 font-bold uppercase block mb-1">Experience</span>
                            <span className="text-gray-900 font-bold text-lg flex items-center gap-2">
                                <Briefcase className="h-5 w-5 text-blue-500"/> {selectedService.experience} Years
                            </span>
                        </div>
                        <div className="bg-green-50 p-4 rounded-xl border border-green-100 flex flex-col justify-center">
                            <span className="text-xs text-green-600 font-bold uppercase block mb-1">Availability</span>
                            <span className="text-gray-900 font-bold text-lg flex items-center gap-2">
                                <Clock className="h-5 w-5 text-green-500"/> {selectedService.availability}
                            </span>
                        </div>
                        <div className="bg-purple-50 p-4 rounded-xl border border-purple-100 flex flex-col justify-center">
                            <span className="text-xs text-purple-600 font-bold uppercase block mb-1">Base Visit</span>
                            <span className="text-gray-900 font-bold text-lg flex items-center gap-2">
                                <Tag className="h-5 w-5 text-purple-500"/> ₹{selectedService.basePrice}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Services Offered */}
                <div className="bg-white rounded-xl shadow-md p-6 md:p-8 border border-gray-100">
                    <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                        <Wrench className="h-6 w-6 text-primary" /> Services Offered
                    </h2>
                    
                    {selectedService.serviceList && selectedService.serviceList.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {selectedService.serviceList.map((item, index) => (
                                <div key={index} className="flex items-center gap-3 p-4 rounded-xl border border-gray-100 bg-gray-50 hover:shadow-sm transition-shadow">
                                    <div className="bg-white p-2 rounded-full shadow-xs text-green-600 border border-green-100">
                                        <Check className="h-5 w-5" />
                                    </div>
                                    <span className="text-gray-800 font-semibold">{item}</span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-gray-500 italic text-center py-6 bg-gray-50 rounded-lg">
                             <Hammer className="h-8 w-8 mx-auto mb-2 opacity-50"/>
                             No specific services listed. Please contact for details.
                        </div>
                    )}
                </div>

                {/* Reviews */}
                {currentUser ? (
                    <ReviewSection 
                        listingId={selectedService.id} 
                        ownerId={selectedService.ownerId} 
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
                            <p className="text-sm text-gray-500 font-medium">Service Starts From</p>
                            <p className="text-3xl font-bold text-primary">₹{selectedService.basePrice}</p>
                            <p className="text-xs text-gray-400">visit charge</p>
                        </div>
                    </div>

                    <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 mb-6">
                       <p className="font-semibold text-sm text-gray-900 mb-3">Professional Info</p>
                       <div className="flex items-center gap-3 group cursor-pointer mb-3">
                           <div className="bg-white p-2 rounded-full shadow-xs">
                              <User className="h-4 w-4 text-blue-500" />
                           </div>
                           <div>
                               <p className="font-bold text-gray-900">{selectedService.OwnerName}</p>
                               <p className="text-xs text-gray-500">{selectedService.serviceType}</p>
                           </div>
                       </div>
                       
                       {selectedService.email && (
                          <div className="flex items-center gap-3">
                              <div className="bg-white p-2 rounded-full shadow-xs">
                                 <Mail className="h-4 w-4 text-primary"/>
                              </div>
                              <span className="text-sm text-gray-600 truncate">{selectedService.email}</span>
                          </div>
                       )}
                    </div>

                    <div className="space-y-3 mb-6">
                        <Button 
                            className="w-full flex items-center justify-center gap-2 h-12 text-md shadow-lg shadow-blue-100 hover:scale-[1.02] transition-transform"
                            onClick={() => handleContact(selectedService.contact, 'call')}
                        >
                            <Phone className="h-4 w-4" /> Call Now
                        </Button>
                        <Button 
                            variant="outline"
                            className="w-full flex items-center justify-center gap-2 h-12 text-md border-green-200 text-green-700 hover:bg-green-50 hover:scale-[1.02] transition-transform"
                            onClick={() => handleContact(selectedService.contact, 'whatsapp')}
                        >
                            <MessageCircle className="h-4 w-4" /> WhatsApp
                        </Button>
                    </div>

                    <div className="mt-4 bg-yellow-50 p-3 rounded-lg border border-yellow-100">
                        <div className="flex items-start gap-2 text-xs text-yellow-800">
                            <Info className="h-4 w-4 shrink-0 mt-0.5" />
                            <p>Prices are indicative. Final cost depends on the scope of work determined during the visit.</p>
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
  // VIEW 2: LIST VIEW (Browsing Services)
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
            <h1 className="text-xl font-bold hidden md:block text-gray-800">Local Services</h1>
          </div>
          
          <div className="flex flex-col md:flex-row gap-3">
            <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input 
                  placeholder="Photographer,Mechanic,Sketch artist..." 
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

               <Select value={filters.category} onValueChange={(v) => setFilters({...filters, category: v})}>
                  <SelectTrigger className="w-[150px] bg-white">
                    <SelectValue placeholder="Service Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Services</SelectItem>
                    <SelectItem value="photographe">Photographer</SelectItem>
                    <SelectItem value="mechanic">Mechanic</SelectItem>
                    <SelectItem value="sketch artist">Sketch artist</SelectItem>
                    
                  </SelectContent>
               </Select>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {filteredServices.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-dashed">
            <Filter className="h-10 w-10 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 text-lg">No service providers found.</p>
            <Button variant="link" onClick={() => { setSearchQuery(''); setFilters({ location: 'all', category: 'all' }); }}>
              Clear Search
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredServices.map((service) => (
              <Card 
                key={service.id} 
                className="overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer group flex flex-col h-full border border-gray-100 rounded-xl"
                onClick={() => navigate(`/general-services/${service.id}`)}
              >
                {/* Card Image Area */}
                <div className="relative h-56 overflow-hidden">
                  <img 
                    src={service.photos[0]} 
                    alt={service.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent opacity-80"></div>
                  
                  {/* Badge: Service Type */}
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur px-2 py-1 rounded text-xs font-bold shadow-sm text-gray-800 border border-white">
                      {service.serviceType}
                  </div>

                  <div className="absolute bottom-4 left-4 right-4 text-white">
                      <div className="flex justify-between items-end">
                          <h3 className="text-xl font-bold leading-tight drop-shadow-md mb-1 flex items-center gap-2">
                             {service.name}
                             {/* Verified Icon (NEXT TO NAME) */}
                             {service.verified && (
                                <ShieldCheck className="h-5 w-5 text-blue-400 fill-blue-500/20" />
                             )}
                          </h3>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-gray-200 font-medium">
                            <MapPin className="h-3 w-3" /> {service.location}
                      </div>
                  </div>
                </div>

                {/* Card Content */}
                <CardContent className="p-5 flex flex-col grow">
                    {/* Experience Badge Integrated in content */}
                    <div className="mb-4 flex items-center gap-2">
                        <Badge variant="secondary" className="bg-blue-50 text-blue-700 border-blue-100 flex items-center gap-1 text-xs font-semibold px-2 py-1">
                             <Briefcase className="h-3 w-3" /> {service.experience} Years Exp.
                        </Badge>
                    </div>

                    {/* Quick Service Scope */}
                    <div className="mb-4">
                        <p className="text-xs font-bold text-gray-400 uppercase mb-2 tracking-wider">Quick Service Scope</p>
                        {service.serviceList && service.serviceList.length > 0 ? (
                            <div className="space-y-1">
                                {service.serviceList.slice(0, 3).map((item, i) => (
                                    <div key={i} className="flex items-center gap-2 text-sm text-gray-700">
                                        <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                                        <span className="truncate">{item}</span>
                                    </div>
                                ))}
                                {service.serviceList.length > 3 && (
                                    <p className="text-xs text-blue-600 font-medium pt-1 pl-3.5">+{service.serviceList.length - 3} more services</p>
                                )}
                            </div>
                        ) : (
                            <p className="text-xs text-gray-400 italic">Services available on request</p>
                        )}
                    </div>

                    <div className="mt-auto pt-3 border-t border-gray-100 flex justify-between items-center">
                        <div>
                            <p className="text-[10px] uppercase text-gray-400 font-bold">Starts From</p>
                            <p className="text-primary font-bold text-lg">
                            ₹{service.basePrice}<span className="text-xs text-gray-500 font-normal">/visit</span>
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
