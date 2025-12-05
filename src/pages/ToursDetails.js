import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Home, MapPin, Clock, Users, Mountain, 
  Phone, Calendar, CheckCircle, XCircle, ChevronLeft, ChevronRight, 
  Loader2, Filter, Search 
} from 'lucide-react';
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from '../firebase'; 
import { Card, CardContent } from '../component/Card';
import { Button } from '../component/button';
import { Badge } from '../component/badge';
import { Input } from '../component/Input'; 
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../component/select';

export default function ToursDetails() { 
  const navigate = useNavigate();
  
  // State
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTour, setSelectedTour] = useState(null);
  
  // Slider State
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Filters including Search
  const [filters, setFilters] = useState({
    difficulty: 'all',
    duration: 'all',
    search: '' 
  });

  // Fetch Tours from Firestore
  useEffect(() => {
    const fetchTours = async () => {
      try {
        setLoading(true);
        const q = query(
          collection(db, "listings"), 
          where("profession", "==", "tours-treks"),
          where("status", "==", "Active")
        );
        const querySnapshot = await getDocs(q);
        
        const fetchedTours = querySnapshot.docs.map(doc => {
          const data = doc.data();
          const tourData = data.listingDetails?.tourData || {};
          
          return {
            id: doc.id,
            name: data.name,
            location: data.location || 'Kumaon Region',
            difficulty: tourData.difficulty || 'Moderate',
            duration: tourData.duration || 'N/A',
            type: tourData.type || 'day',
            description: data.description,
            // Fallback to placeholder if no photos
            photos: data.photos && data.photos.length > 0 ? data.photos : ['https://via.placeholder.com/1080?text=Adventure'],
            price: Number(data.price) || 0,
            maxGroupSize: tourData.maxGroupSize || 0,
            includes: tourData.includes || [],
            excludes: tourData.excludes || [],
            itinerary: tourData.itinerary || [],
            contact: data.contactSnapshot?.phone || 'Contact Support',
            fitnessLevel: tourData.fitnessLevel || 'Moderate fitness required'
          };
        });

        setTours(fetchedTours);
      } catch (error) {
        console.error("Error fetching tours:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTours();
  }, []);

  // Reset slider when opening a new tour
  useEffect(() => {
    if (selectedTour) {
      setCurrentImageIndex(0);
    }
  }, [selectedTour]);

  // --- Helper Functions ---
  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-800 border-green-200';
      case 'Moderate': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Challenging': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const nextImage = (e) => {
    e?.stopPropagation();
    if (!selectedTour?.photos) return;
    setCurrentImageIndex((prev) => 
      prev === selectedTour.photos.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = (e) => {
    e?.stopPropagation();
    if (!selectedTour?.photos) return;
    setCurrentImageIndex((prev) => 
      prev === 0 ? selectedTour.photos.length - 1 : prev - 1
    );
  };

  // Filter Logic
  const filteredTours = tours.filter(tour => {
    // 1. Filter by Difficulty
    if (filters.difficulty !== 'all' && tour.difficulty !== filters.difficulty) return false;
    // 2. Filter by Duration/Type
    if (filters.duration !== 'all' && tour.type !== filters.duration) return false;
    // 3. Filter by Search Name
    if (filters.search && !tour.name.toLowerCase().includes(filters.search.toLowerCase())) return false;
    
    return true;
  });

  // --- DETAIL VIEW ---
  if (selectedTour) {
    return (
      <div className="min-h-screen bg-gray-50 pb-12">
        {/* Sticky Header */}
        <div className="bg-white shadow-sm border-b sticky top-0 z-20">
          <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
            <div className="flex items-center gap-2">
                <Button variant="ghost" onClick={() => setSelectedTour(null)} className="gap-2">
                <ArrowLeft className="h-4 w-4" /> Back to Tours
                </Button>
            </div>
            {/* Home Button */}
            <Button variant="ghost" onClick={() => navigate('/')} className="gap-2 text-gray-600 hover:text-primary">
              <Home className="h-4 w-4" /> Home
            </Button>
          </div>
        </div>

        {/* Hero Image Slider Section */}
        <div className="relative h-[50vh] md:h-[70vh] w-full bg-gray-900 group">
          {selectedTour.photos.map((photo, index) => (
            <div 
              key={index}
              className={`absolute inset-0 transition-opacity duration-500 ease-in-out ${index === currentImageIndex ? 'opacity-100' : 'opacity-0'}`}
            >
              <img 
                src={photo} 
                alt={`${selectedTour.name} view ${index + 1}`} 
                className="w-full h-full object-cover"
              />
              
              <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/20 to-transparent" />
            </div>
          ))}

          {/* Navigation Arrows */}
          {selectedTour.photos.length > 1 && (
            <>
              <button 
                onClick={prevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-3 rounded-full backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button 
                onClick={nextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-3 rounded-full backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
              
              {/* Dots */}
              <div className="absolute bottom-32 left-1/2 -translate-x-1/2 flex gap-2 z-20">
                 {selectedTour.photos.map((_, idx) => (
                   <div 
                     key={idx}
                     onClick={() => setCurrentImageIndex(idx)}
                     className={`w-2 h-2 rounded-full cursor-pointer transition-all shadow-sm ${idx === currentImageIndex ? 'bg-white w-6' : 'bg-white/50 hover:bg-white/80'}`}
                   />
                 ))}
              </div>
            </>
          )}

          {/* Hero Content: Title & Badges */}
          <div className="absolute bottom-0 left-0 right-0 p-4 md:p-8 pb-8 md:pb-12 text-white z-10">
            <div className="max-w-7xl mx-auto">
              <div className="flex flex-wrap gap-2 mb-3">
                <Badge className={`${getDifficultyColor(selectedTour.difficulty)} border-none`}>
                    {selectedTour.difficulty}
                </Badge>
                <Badge variant="outline" className="text-white border-white/40 bg-black/20 backdrop-blur-sm">
                    {selectedTour.type.toUpperCase()}
                </Badge>
              </div>

              <h1 className="text-3xl md:text-5xl font-extrabold mb-3 drop-shadow-xl leading-tight tracking-tight">
                {selectedTour.name}
              </h1>
              
              <div className="flex items-center gap-2 text-lg text-gray-200 font-medium drop-shadow-md">
                  <MapPin className="h-5 w-5" />
                  {selectedTour.location}
              </div>
            </div>
          </div>
        </div>

        {/* Details Grid */}
        <div className="max-w-7xl mx-auto px-4 -mt-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Content */}
            <div className="lg:col-span-2 space-y-8">
              
              {/* About Section */}
              <div className="bg-white rounded-xl shadow-md p-6 md:p-8 border border-gray-100">
                <h2 className="text-2xl font-bold mb-4 text-gray-900">Overview</h2>
                <p className="text-gray-600 leading-relaxed text-lg">
                  {selectedTour.description}
                </p>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-8 pt-6 border-t border-gray-100">
                  <div className="flex flex-col gap-1">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Duration</span>
                    <span className="font-semibold text-gray-800 flex items-center gap-2"><Clock className="w-4 h-4 text-blue-500"/> {selectedTour.duration}</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Group Size</span>
                    <span className="font-semibold text-gray-800 flex items-center gap-2"><Users className="w-4 h-4 text-green-500"/> Max {selectedTour.maxGroupSize}</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Fitness</span>
                    <span className="font-semibold text-gray-800 flex items-center gap-2"><Mountain className="w-4 h-4 text-orange-500"/> {selectedTour.fitnessLevel}</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider"> Best Time</span>
                    <span className="font-semibold text-gray-800 flex items-center gap-2"><Calendar className="w-4 h-4 text-purple-500"/> All Year</span>
                  </div>
                </div>
              </div>

              {/* Itinerary UI */}
              <div className="bg-white rounded-xl shadow-md p-6 md:p-8 border border-gray-100">
                <h2 className="text-2xl font-bold mb-8 text-gray-900 flex items-center gap-2">
                    <MapPin className="text-primary h-6 w-6" /> Itinerary
                </h2>
                
                <div className="relative border-l-2 border-gray-200 ml-3 md:ml-6 space-y-10 pb-2">
                  {selectedTour.itinerary.length > 0 ? (
                    selectedTour.itinerary.map((day, index) => (
                      <div key={index} className="relative pl-8 md:pl-12 group">
                        {/* Timeline Dot */}
                        <div className="absolute -left-[9px] top-0 w-5 h-5 rounded-full bg-white border-4 border-primary group-hover:scale-125 transition-transform duration-300 shadow-sm"></div>
                        
                        {/* Day Header */}
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-3">
                           <span className="inline-block bg-primary/10 text-primary font-bold text-xs px-2 py-1 rounded uppercase tracking-wide w-fit">
                             Day {day.day}
                           </span>
                           <h3 className="text-lg font-bold text-gray-900 group-hover:text-primary transition-colors">
                             {day.title}
                           </h3>
                        </div>

                        {/* Card for Day Content */}
                        <div className="bg-gray-50 rounded-lg p-5 border border-gray-100 hover:shadow-md transition-shadow">
                           {/* Activities List */}
                           <div className="mb-4">
                             <h4 className="text-xs font-bold text-gray-400 uppercase mb-2">Activities</h4>
                             <ul className="grid grid-cols-1 gap-2">
                               {day.activities.map((act, i) => (
                                 <li key={i} className="flex items-start gap-2 text-gray-700 text-sm">
                                   <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-gray-400 shrink-0"></div>
                                   {act}
                                 </li>
                               ))}
                             </ul>
                           </div>
                           
                           {/* Meals Section */}
                           {day.meals && day.meals.length > 0 && (
                             <div className="flex items-center gap-2 pt-3 border-t border-gray-200">
                                <span className="text-sm font-semibold text-gray-500"> 🍽️ Meals :</span>
                                <div className="flex gap-2">
                                   {day.meals.map((m, i) => (
                                     <span key={i} className="text-xs bg-white border border-gray-200 px-2 py-0.5 rounded text-gray-600 font-medium">
                                       {m}
                                     </span>
                                   ))}
                                </div>
                             </div>
                           )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="pl-8 text-gray-500 italic">
                        Detailed day-wise itinerary will be updated soon. Please contact host for details.
                    </div>
                  )}
                </div>
              </div>

              {/* Inclusions / Exclusions */}
              <div className="grid md:grid-cols-2 gap-6">
                 <div className="bg-green-50/50 rounded-xl border border-green-100 p-6">
                    <h3 className="font-bold text-lg mb-4 text-green-800 flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 fill-green-600 text-white"/> What's Included
                    </h3>
                    <ul className="space-y-3">
                      {selectedTour.includes.length > 0 ? (
                        selectedTour.includes.map((item, idx) => (
                          <li key={idx} className="flex items-start gap-3 text-sm text-gray-700">
                            <span className="mt-1.5 w-1.5 h-1.5 bg-green-500 rounded-full shrink-0"></span>
                            {item}
                          </li>
                        ))
                      ) : <span className="text-gray-400 italic text-sm">No specific inclusions listed.</span>}
                    </ul>
                 </div>
                 
                 <div className="bg-red-50/50 rounded-xl border border-red-100 p-6">
                    <h3 className="font-bold text-lg mb-4 text-red-800 flex items-center gap-2">
                      <XCircle className="w-5 h-5 fill-red-500 text-white"/> What's Excluded
                    </h3>
                    <ul className="space-y-3">
                      {selectedTour.excludes.length > 0 ? (
                        selectedTour.excludes.map((item, idx) => (
                          <li key={idx} className="flex items-start gap-3 text-sm text-gray-700">
                            <span className="mt-1.5 w-1.5 h-1.5 bg-red-400 rounded-full shrink-0"></span>
                            {item}
                          </li>
                        ))
                      ) : <span className="text-gray-400 italic text-sm">No specific exclusions listed.</span>}
                    </ul>
                 </div>
              </div>
            </div>

            {/* Right Sidebar (Booking Box) */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-lg p-6 sticky top-24 border border-gray-100 z-10">
                <div className="mb-6 pb-6 border-b border-gray-100">
                  <span className="text-sm text-gray-500 font-medium"> Price</span>
                  <div className="flex items-baseline gap-1 mt-1">
                     <span className="text-3xl font-bold text-primary">₹{selectedTour.price.toLocaleString()}</span>
                     <span className="text-sm text-gray-500">/ person</span>
                  </div>
                  <div className="text-right">
                    <div className="font-medium text-gray-900">{selectedTour.duration}</div>
                    <div className="text-xs text-green-600">Available Now</div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 rounded-lg space-y-3">
                    <div className="flex items-center gap-3">
                      <Mountain className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-xs text-gray-500">Difficulty</p>
                        <p className="font-medium text-gray-900">{selectedTour.difficulty}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <Users className="h-5 w-5 text-gray-400" />
                      <div>
                         <p className="text-xs text-gray-500">Group Size</p>
                         <p className="font-medium text-gray-900">Up to {selectedTour.maxGroupSize} people</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 pt-2 border-t border-gray-200">
                      <Phone className="h-5 w-5 text-gray-400" />
                      <span className="font-medium">{selectedTour.contact}</span>
                    </div>
                  </div>

                  <Button className="w-full py-6 text-lg shadow-blue-200 shadow-lg" onClick={() => window.alert('Booking feature coming next update!')}>
                    Book Adventure
                  </Button>
                  
                  <div className="text-center">
                    <p className="text-xs text-gray-400 mt-2">
                      Free cancellation up to 48 hours before departure
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- MAIN LIST VIEW ---
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sticky List Header */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <Button variant="ghost" onClick={() => navigate('/')} className="flex items-center gap-2 hover:bg-gray-100">
                <ArrowLeft className="h-4 w-4" /> Back Home
              </Button>
            </div>
            <h1 className="text-xl font-bold hidden md:block text-gray-800">Tours & Treks</h1>
          </div>
          
          <div className="flex flex-col md:flex-row gap-3">
            {/* Search Input */}
            <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input 
                  placeholder="Search treks, tours, or locations..." 
                  className="pl-9 bg-gray-50 border-gray-200 focus:bg-white transition-colors"
                  value={filters.search}
                  onChange={(e) => setFilters({...filters, search: e.target.value})}
                />
            </div>

            {/* Filters */}
            <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 no-scrollbar">
               <Select value={filters.difficulty} onValueChange={(v) => setFilters({...filters, difficulty: v})}>
                  <SelectTrigger className="w-[150px] bg-white">
                    <SelectValue placeholder="Difficulty" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Levels</SelectItem>
                    <SelectItem value="Easy">Easy</SelectItem>
                    <SelectItem value="Moderate">Moderate</SelectItem>
                    <SelectItem value="Challenging">Challenging</SelectItem>
                  </SelectContent>
               </Select>

               <Select value={filters.duration} onValueChange={(v) => setFilters({...filters, duration: v})}>
                  <SelectTrigger className="w-[150px] bg-white">
                    <SelectValue placeholder="Duration" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Any Duration</SelectItem>
                    <SelectItem value="day">Day Trip</SelectItem>
                    <SelectItem value="weekend">Weekend (2-3 Days)</SelectItem>
                    <SelectItem value="extended">Long Trek (4+ Days)</SelectItem>
                  </SelectContent>
               </Select>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {loading ? (
           <div className="flex flex-col justify-center items-center h-64 text-gray-400">
             <Loader2 className="h-10 w-10 animate-spin text-primary mb-3" />
             <span>Loading adventures...</span>
           </div>
        ) : filteredTours.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTours.map((tour) => (
              <Card 
                key={tour.id} 
                className="overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer group flex flex-col h-full border border-gray-100"
                onClick={() => setSelectedTour(tour)}
              >
                {/* Card Image */}
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={tour.photos[0]}
                    alt={tour.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  
                  <div className="absolute inset-0 bg-linear-to-t from-black/70 via-transparent to-transparent opacity-80"></div>
                  
                  {/* Floating Badges */}
                  <div className="absolute top-3 left-3 flex gap-2">
                     <Badge className="bg-white/95 text-gray-800 backdrop-blur-sm shadow-sm font-bold text-xs px-2 py-0.5 border border-white/50">
                        {tour.type.toUpperCase()}
                     </Badge>
                  </div>

                  <div className="absolute bottom-4 left-4 right-4 text-white">
                      <h3 className="text-xl font-bold leading-tight drop-shadow-md mb-1">{tour.name}</h3>
                      <div className="flex items-center gap-1 text-xs text-gray-200 font-medium">
                            <MapPin className="h-3 w-3" /> {tour.location}
                      </div>
                  </div>
                </div>
                
                {/* Card Body */}
                <CardContent className="p-5 flex flex-col grow">
                  <p className="text-gray-600 text-sm mb-5 line-clamp-2 leading-relaxed">{tour.description}</p>

                  <div className="grid grid-cols-3 gap-3 mb-5">
                    <div className="flex flex-col items-center p-2 bg-gray-50 rounded-lg border border-gray-100">
                        <Clock className="h-4 w-4 text-blue-500 mb-1" />
                        <span className="text-xs font-semibold text-gray-700">{tour.duration}</span>
                    </div>
                    <div className="flex flex-col items-center p-2 bg-gray-50 rounded-lg border border-gray-100">
                        <Users className="h-4 w-4 text-green-500 mb-1" />
                        <span className="text-xs font-semibold text-gray-700">Max {tour.maxGroupSize}</span>
                    </div>
                    <div className="flex flex-col items-center p-2 bg-gray-50 rounded-lg border border-gray-100">
                        <Mountain className="h-4 w-4 text-orange-500 mb-1" />
                        <span className="text-xs font-semibold text-gray-700">{tour.difficulty}</span>
                    </div>
                  </div>

                  <div className="mt-auto flex justify-between items-end border-t border-gray-100 pt-4">
                    <div>
                      <p className="text-xs text-gray-400 font-medium mb-0.5">Price per person</p>
                      <p className="text-xl font-bold text-primary">₹{tour.price.toLocaleString()}</p>
                    </div>
                    <Button size="sm" className="bg-primary text-white shadow-md group-hover:bg-primary/90 transition-colors">
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-dashed border-gray-300">
              <Mountain className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900">No tours found</h3>
              <p className="text-gray-500">Try adjusting your filters or check back later.</p>
              {/* FIXED: Button now clears the search field as well */}
              <Button 
                variant="link" 
                onClick={() => setFilters({difficulty: 'all', duration: 'all', search: ''})} 
                className="mt-2"
              >
                Clear Filters
              </Button>
            </div>
          )}
      </div>
    </div>
  );
}