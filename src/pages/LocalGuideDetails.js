import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Home, MapPin, Star, MessageCircle, Phone, 
  Languages, Award, Search, Loader2, User, CheckCircle,
  ShieldCheck, ChevronLeft, ChevronRight, Clock, Users, Calendar
} from 'lucide-react';
import { collection, query, where, getDocs, doc, getDoc } from "firebase/firestore";
import { db } from '../firebase'; 
import { Card, CardContent } from '../component/Card';
import { Button } from '../component/button';
import { Badge } from '../component/badge';
import { Input } from '../component/Input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../component/select';

export default function LocalGuideDetails() {
  const navigate = useNavigate();

  // --- State Management ---
  const [guides, setGuides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedGuide, setSelectedGuide] = useState(null);
  const [hostPhoneNumber, setHostPhoneNumber] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // --- Filters ---
  const [filters, setFilters] = useState({
    location: 'all',
    search: '',
    specialization: 'all'
  });

  // --- 1. Fetch Guides from Firestore (CORRECTED MAPPING) ---
  useEffect(() => {
    const fetchGuides = async () => {
      try {
        setLoading(true);
        const q = query(
          collection(db, "listings"),
          where("profession", "==", "local-guides"),
          where("status", "==", "Active")
        );

        const querySnapshot = await getDocs(q);
        
        const fetchedGuides = querySnapshot.docs.map(doc => {
          const data = doc.data();
          
          // CRITICAL FIX: Access the specific guideData object from your dashboard structure
          const guideDetails = data.listingDetails?.guideData || {};

          return {
            id: doc.id,
            ...data,
            
            // Map fields correctly from guideData
            specializations: guideDetails.specializations || [],
            languages: guideDetails.languages || [],
            experience: guideDetails.experience || "0",
            maxGroupSize: guideDetails.maxGroupSize || 'Flexible',
            itinerary: guideDetails.itinerary || [],
            
            // Standard root fields
            price: Number(data.price) || 0,
            photos: data.photos && data.photos.length > 0 
              ? data.photos 
              : ['https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?fit=crop&w=1200&q=80'],
            reviews: data.reviews || 0,
            rating: data.rating || 5.0,
            verified: data.verified || false
          };
        });

        setGuides(fetchedGuides);
      } catch (error) {
        console.error("Error fetching guides:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGuides();
  }, []);

  // --- 2. Fetch Host Phone & Reset Slider ---
  useEffect(() => {
    setHostPhoneNumber(null);
    setCurrentImageIndex(0);

    const fetchHostDetails = async () => {
      if (selectedGuide && selectedGuide.ownerId) {
        try {
          const userDocRef = doc(db, "users", selectedGuide.ownerId);
          const userDocSnap = await getDoc(userDocRef);
          if (userDocSnap.exists()) {
            setHostPhoneNumber(userDocSnap.data().phoneNumber);
          }
        } catch (error) {
          console.error("Error fetching host details:", error);
        }
      }
    };

    if (selectedGuide) fetchHostDetails();
  }, [selectedGuide]);

  // --- Helpers ---
  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star key={i} className={`h-3.5 w-3.5 ${i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
    ));
  };

  const nextImage = (e) => {
    e?.stopPropagation();
    if (!selectedGuide?.photos) return;
    setCurrentImageIndex((prev) => 
      prev === selectedGuide.photos.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = (e) => {
    e?.stopPropagation();
    if (!selectedGuide?.photos) return;
    setCurrentImageIndex((prev) => 
      prev === 0 ? selectedGuide.photos.length - 1 : prev - 1
    );
  };

  // --- Filters Logic ---
  const filteredGuides = guides.filter(guide => {
    if (filters.search) {
      const s = filters.search.toLowerCase();
      if (!guide.name?.toLowerCase().includes(s) && !guide.location?.toLowerCase().includes(s)) return false;
    }
    if (filters.location !== 'all' && guide.location !== filters.location) return false;
    if (filters.specialization !== 'all' && !guide.specializations.some(spec => spec.toLowerCase().includes(filters.specialization.toLowerCase()))) return false;
    return true;
  });

  const allSpecializations = Array.from(new Set(guides.flatMap(g => g.specializations))).sort();

  // ==========================================
  // --- VIEW 1: SINGLE GUIDE DETAIL PAGE ---
  // ==========================================
  if (selectedGuide) {
    return (
      <div className="min-h-screen bg-gray-50 pb-12">
        {/* Sticky Header */}
        <div className="bg-white shadow-sm border-b sticky top-0 z-20">
          <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
            <Button variant="ghost" onClick={() => setSelectedGuide(null)} className="gap-2">
              <ArrowLeft className="h-4 w-4" /> Back to Guides
            </Button>
            <Button variant="ghost" onClick={() => navigate('/')} className="gap-2">
              <Home className="h-4 w-4" /> Home
            </Button>
          </div>
        </div>

        {/* HERO SLIDER GALLERY */}
        <div className="relative h-[50vh] md:h-[65vh] w-full bg-gray-900 group">
          {selectedGuide.photos.map((photo, index) => (
            <div 
              key={index}
              className={`absolute inset-0 transition-opacity duration-500 ease-in-out ${index === currentImageIndex ? 'opacity-100' : 'opacity-0'}`}
            >
              <img 
                src={photo} 
                alt={`${selectedGuide.name} photo ${index + 1}`} 
                className="w-full h-full object-cover opacity-90"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent" />
            </div>
          ))}

          {/* Slider Controls */}
          {selectedGuide.photos.length > 1 && (
            <>
              <button onClick={prevImage} className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-3 rounded-full backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100">
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button onClick={nextImage} className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-3 rounded-full backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100">
                <ChevronRight className="h-6 w-6" />
              </button>
              <div className="absolute bottom-32 left-1/2 -translate-x-1/2 flex gap-2 z-20">
                 {selectedGuide.photos.map((_, idx) => (
                   <div key={idx} onClick={() => setCurrentImageIndex(idx)} className={`w-2 h-2 rounded-full cursor-pointer transition-all ${idx === currentImageIndex ? 'bg-white w-6' : 'bg-white/50 hover:bg-white/80'}`} />
                 ))}
              </div>
            </>
          )}

          {/* Hero Content Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-4 md:p-8 pb-8 text-white z-10">
            <div className="max-w-7xl mx-auto">
              <div className="flex flex-wrap gap-2 mb-3">
                {selectedGuide.verified && (
                    <Badge className="bg-green-500 hover:bg-green-600 text-white border-none flex items-center gap-1 px-3 py-1 text-sm shadow-sm">
                        <ShieldCheck className="h-4 w-4" /> Verified Guide
                    </Badge>
                )}
                <Badge variant="outline" className="text-white border-white/40 bg-black/20 backdrop-blur-sm px-3 py-1">
                    {selectedGuide.experience} Years Experience
                </Badge>
              </div>

              <h1 className="text-3xl md:text-5xl font-extrabold mb-2 drop-shadow-xl">{selectedGuide.name}</h1>
              
              <div className="flex flex-col md:flex-row gap-4 md:items-center text-lg text-gray-200">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" /> {selectedGuide.location}
                  </div>
                  <div className="hidden md:block w-1.5 h-1.5 rounded-full bg-gray-400"></div>
                  <div className="flex items-center gap-2">
                     <div className="flex text-yellow-400">{renderStars(selectedGuide.rating)}</div>
                     <span>({selectedGuide.reviews} reviews)</span>
                  </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content Grid */}
        <div className="max-w-7xl mx-auto px-4 -mt-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left Column (Details) */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* About Card */}
              <div className="bg-white rounded-xl shadow-md p-6 md:p-8">
                <h2 className="text-2xl font-bold mb-4 text-gray-900 flex items-center gap-2">
                    <User className="h-6 w-6 text-primary"/> About
                </h2>
                <p className="text-gray-600 leading-relaxed whitespace-pre-line text-lg mb-8">
                  {selectedGuide.description}
                </p>

                {/* 4-Grid for Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-gray-100">
                    
                    {/* Languages */}
                    <div>
                        <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                            <Languages className="h-4 w-4 text-blue-500"/> Languages
                        </h3>
                        <div className="flex flex-wrap gap-2">
                            {selectedGuide.languages.length > 0 ? selectedGuide.languages.map((lang, i) => (
                                <Badge key={i} variant="outline" className="px-3 py-1">{lang}</Badge>
                            )) : <span className="text-gray-400 text-sm italic">English, Hindi</span>}
                        </div>
                    </div>

                    {/* Expertise */}
                    <div>
                        <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                            <Award className="h-4 w-4 text-purple-500"/> Expertise
                        </h3>
                        <div className="flex flex-wrap gap-2">
                            {selectedGuide.specializations.length > 0 ? selectedGuide.specializations.map((spec, i) => (
                                <Badge key={i} variant="secondary" className="px-3 py-1 bg-purple-50 text-purple-700">{spec}</Badge>
                            )) : <span className="text-gray-400 text-sm italic">General Guide</span>}
                        </div>
                    </div>

                    {/* Experience */}
                    <div>
                        <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                            <Clock className="h-4 w-4 text-orange-500"/> Experience
                        </h3>
                        <p className="text-gray-700 font-medium ml-1">
                            {selectedGuide.experience} Years Active
                        </p>
                    </div>

                    {/* Group Size */}
                    <div>
                         <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                            <Users className="h-4 w-4 text-green-500"/> Group Size
                        </h3>
                        <p className="text-gray-700 font-medium ml-1">
                            Max {selectedGuide.maxGroupSize} People
                        </p>
                    </div>
                </div>
              </div>

              {/* Itinerary Section */}
              <div className="bg-white rounded-xl shadow-md p-6 md:p-8">
                 <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-primary"/> Suggested Itineraries
                 </h2>
                 
                 {selectedGuide.itinerary && selectedGuide.itinerary.length > 0 ? (
                    <div className="space-y-6 border-l-2 border-gray-200 ml-2 pl-6">
                        {selectedGuide.itinerary.map((day, idx) => (
                            <div key={idx} className="relative group">
                                <div className="absolute -left-[33px] top-1 w-4 h-4 rounded-full bg-white border-4 border-primary group-hover:scale-110 transition-transform"></div>
                                <h3 className="font-bold text-lg text-gray-800 mb-2">Day {day.day}: {day.title}</h3>
                                {day.activities && day.activities.length > 0 && (
                                    <ul className="list-disc ml-4 space-y-1 text-gray-600">
                                        {day.activities.map((act, i) => <li key={i}>{act}</li>)}
                                    </ul>
                                )}
                            </div>
                        ))}
                    </div>
                 ) : (
                    <div className="text-gray-500 bg-gray-50 p-4 rounded-lg border border-dashed border-gray-200">
                        <p className="mb-2 font-medium text-gray-700">Customizable Tours Available</p>
                        <p className="text-sm">
                            This guide specializes in <strong>{selectedGuide.specializations.join(', ') || "local tours"}</strong>. 
                            Contact them directly to plan a custom itinerary suited to your group size and interests.
                        </p>
                    </div>
                 )}
              </div>

              {/* Trust Section */}
              <div className="bg-white rounded-xl shadow-md p-6 md:p-8">
                 <h2 className="text-xl font-bold mb-4">Why hire {selectedGuide.name}?</h2>
                 <ul className="space-y-3">
                    <li className="flex gap-3 items-start text-gray-700">
                        <CheckCircle className="h-5 w-5 text-green-500 shrink-0 mt-0.5"/>
                        <span>Deep local knowledge of {selectedGuide.location} hidden gems.</span>
                    </li>
                    <li className="flex gap-3 items-start text-gray-700">
                        <CheckCircle className="h-5 w-5 text-green-500 shrink-0 mt-0.5"/>
                        <span>Personalized itinerary planning based on your interests.</span>
                    </li>
                    <li className="flex gap-3 items-start text-gray-700">
                        <CheckCircle className="h-5 w-5 text-green-500 shrink-0 mt-0.5"/>
                        <span>Safety and comfort guaranteed during tours/treks.</span>
                    </li>
                 </ul>
              </div>
            </div>

            {/* Right Column (Sticky Booking Box) */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-lg p-6 sticky top-24 border border-gray-100">
                <div className="mb-6 pb-6 border-b border-gray-100">
                  <span className="text-sm text-gray-500 font-medium">Daily Rate</span>
                  <div className="flex items-baseline gap-1 mt-1">
                     <span className="text-3xl font-bold text-primary">₹{selectedGuide.price.toLocaleString()}</span>
                     <span className="text-sm text-gray-500">/ day</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 rounded-lg space-y-3">
                    <div className="flex items-center gap-3">
                        <Clock className="h-5 w-5 text-gray-400"/>
                        <div>
                            <p className="text-xs text-gray-500">Availability</p>
                            <p className="font-medium text-gray-900">Flexible Schedule</p>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-3 pt-2 border-t border-gray-200">
                       <Phone className="h-5 w-5 text-gray-400"/>
                       <span className="font-medium">
                         {hostPhoneNumber ? hostPhoneNumber : "Contact hidden"}
                       </span>
                    </div>
                  </div>

                  {hostPhoneNumber ? (
                    <>
                        <Button className="w-full py-6 text-lg" onClick={() => window.location.href = `tel:${hostPhoneNumber}`}>
                            <Phone className="mr-2 h-5 w-5" /> Call Now
                        </Button>
                        <Button 
                            variant="outline" 
                            className="w-full py-6 text-lg text-green-600 border-green-200 hover:bg-green-50"
                            onClick={() => window.open(`https://wa.me/${hostPhoneNumber.replace('+', '')}`, '_blank')}
                        >
                            <MessageCircle className="mr-2 h-5 w-5" /> WhatsApp
                        </Button>
                    </>
                  ) : (
                    <Button disabled className="w-full bg-gray-300">Contact details unavailable</Button>
                  )}
                  
                  <p className="text-xs text-center text-gray-400 mt-2">
                    Direct booking with guide. No platform fees.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // --- VIEW 2: LISTING GRID (MAIN PAGE) ---
  // ==========================================
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sticky Header */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <Button variant="ghost" onClick={() => navigate('/')} className="flex items-center gap-2 hover:bg-gray-100">
                <ArrowLeft className="h-4 w-4" /> Back Home
              </Button>
            </div>
            <h1 className="text-xl font-bold hidden md:block text-gray-800">Local Guides</h1>
          </div>
          
          {/* Filter Bar */}
          <div className="flex flex-col md:flex-row gap-3">
            <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input 
                  placeholder="Search guides by name or location..." 
                  className="pl-9 bg-gray-50 border-gray-200"
                  value={filters.search}
                  onChange={(e) => setFilters({...filters, search: e.target.value})}
                />
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
               <Select value={filters.location} onValueChange={(v) => setFilters({...filters, location: v})}>
                  <SelectTrigger className="w-[140px] bg-white"><SelectValue placeholder="Location" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Locations</SelectItem>
                    <SelectItem value="Nainital">Nainital</SelectItem>
                    <SelectItem value="Bhimtal">Bhimtal</SelectItem>
                    <SelectItem value="Mukteshwar">Mukteshwar</SelectItem>
                    <SelectItem value="Almora">Almora</SelectItem>
                    <SelectItem value="Ranikhet">Ranikhet</SelectItem>
                  </SelectContent>
               </Select>
               <Select value={filters.specialization} onValueChange={(v) => setFilters({...filters, specialization: v})}>
                  <SelectTrigger className="w-[150px] bg-white"><SelectValue placeholder="Specialization" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Skills</SelectItem>
                    {allSpecializations.map((spec, i) => <SelectItem key={i} value={spec}>{spec}</SelectItem>)}
                  </SelectContent>
               </Select>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {loading ? (
           <div className="flex justify-center items-center h-64 text-gray-400">
             <Loader2 className="h-10 w-10 animate-spin text-primary mb-3" />
           </div>
        ) : filteredGuides.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGuides.map((guide) => (
              <Card 
                key={guide.id} 
                className="hover:shadow-lg transition-shadow cursor-pointer group"
                onClick={() => setSelectedGuide(guide)}
              >
                <CardContent className="p-6">
                    {/* Centered Profile Image with Badge */}
                    <div className="text-center mb-4 mt-2">
                        <div className="relative w-32 h-32 mx-auto mb-3">
                            <img
                                src={guide.photos[0]}
                                alt={guide.name}
                                className="w-full h-full object-cover rounded-full border-4 border-white shadow-md"
                            />
                            {guide.verified && (
                                <div className="absolute bottom-1 right-1 bg-green-500 rounded-full p-1.5 border-2 border-white shadow-sm flex items-center justify-center">
                                    <ShieldCheck className="h-4 w-4 text-white" />
                                </div>
                            )}
                        </div>
                        
                        <h3 className="text-xl font-bold mb-1">{guide.name}</h3>
                        
                        <div className="flex items-center justify-center gap-1 text-sm text-gray-500 mb-2">
                            <MapPin className="h-3.5 w-3.5" />
                            <span>{guide.location}</span>
                        </div>
                        
                        <div className="flex items-center justify-center gap-1 mb-2">
                            {renderStars(guide.rating)}
                            <span className="text-sm text-gray-600 ml-1">
                            ({guide.reviews} reviews)
                            </span>
                        </div>
                    </div>

                    {/* Guide Info Rows */}
                    <div className="space-y-3 mb-4 border-t border-b border-gray-50 py-4">
                        <div className="flex items-center gap-3 text-sm">
                            <User className="h-4 w-4 text-gray-400" />
                            <span>{guide.experience} years experience</span>
                        </div>
                        
                        <div className="flex items-start gap-3 text-sm">
                            <Languages className="h-4 w-4 text-gray-400 mt-0.5" />
                            <span className="line-clamp-1">{guide.languages.join(', ')}</span>
                        </div>
                    </div>

                    {/* Specialization Tags */}
                    <div className="mb-4">
                        <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2 block">Specializations</span>
                        <div className="flex flex-wrap gap-1.5">
                            {guide.specializations.slice(0, 3).map((spec, index) => (
                                <Badge key={index} variant="secondary" className="text-xs font-normal">
                                    {spec}
                                </Badge>
                            ))}
                            {guide.specializations.length > 3 && (
                                <Badge variant="outline" className="text-xs">
                                    +{guide.specializations.length - 3}
                                </Badge>
                            )}
                            {guide.specializations.length === 0 && (
                                <span className="text-xs text-gray-400 italic">General</span>
                            )}
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-2">
                        <div>
                            <span className="text-lg font-bold text-primary">₹{guide.price.toLocaleString()}</span>
                            <span className="text-xs text-gray-500"> / day</span>
                        </div>
                        <Button size="sm" onClick={(e) => { e.stopPropagation(); setSelectedGuide(guide); }}>
                            View Profile
                        </Button>
                    </div>
                </CardContent>
              </Card>
            ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-dashed border-gray-300">
              <User className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900">No guides found</h3>
              <p className="text-gray-500 mb-4">Try adjusting your filters.</p>
              <Button variant="link" onClick={() => setFilters({location: 'all', specialization: 'all', search: ''})}>Clear Filters</Button>
            </div>
          )}
      </div>
    </div>
  );
}