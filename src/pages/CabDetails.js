import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Home, Car, Phone, MessageCircle, 
  MapPin, Star, Loader2, Filter, ShieldCheck, Search, Info 
} from 'lucide-react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase'; 
import { Card, CardContent } from '../component/Card';
import { Button } from '../component/button';
import { Badge } from '../component/badge';
import { Input } from '../component/Input'; 
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../component/select';

export default function CabDetails() {
  const navigate = useNavigate();
  
  // State
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filters State
  const [searchQuery, setSearchQuery] = useState(''); 
  const [filters, setFilters] = useState({
    serviceType: 'all',
    vehicleType: 'all'
  });

  // Fetch Data from Firebase
  useEffect(() => {
    const fetchCabs = async () => {
      try {
        setLoading(true);
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
            description: data.description || '', // Added Description
            contact: data.contactSnapshot?.phone || '', 
            whatsapp: data.contactSnapshot?.phone || '', 
            rating: data.rating || 4.5,
            
            // Arrays
            vehicles: cabData.availableVehicleTypes || [], // General Categories (Sedan, SUV)
            inventory: data.listingDetails?.vehicles || [], // Specific Inventory Items
            services: cabData.services || [],
            areas: cabData.areas || [data.location],
            specializations: cabData.specializations || [], // Added Specializations
            
            pricing: {
              local: cabData.pricing?.local || 'On Request',
              outstation: cabData.pricing?.outstation || 'On Request',
              airport: cabData.pricing?.airport || 'On Request'
            },
            verified: data.verified || false
          };
        });

        setVendors(fetchedData);
      } catch (error) {
        console.error("Error fetching cab vendors:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCabs();
  }, []);

  // Filter Options
  const serviceTypes = [
    { value: 'Local City Ride', label: 'Local City Ride' },
    { value: 'Outstation', label: 'Outstation' },
    { value: 'Airport Transfer', label: 'Airport Transfer' },
    { value: 'Group Tours', label: 'Group Tours' }
  ];

  const vehicleTypes = [
    { value: 'Hatchback', label: 'Hatchback' },
    { value: 'Sedan', label: 'Sedan' },
    { value: 'SUV', label: 'SUV' },
    { value: 'Tempo Traveller', label: 'Tempo Traveller' }
  ];

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star key={i} className={`h-4 w-4 ${i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
    ));
  };

  // Filter Logic
  const filteredVendors = vendors.filter(vendor => {
    if (filters.serviceType !== 'all') {
      if (!vendor.services.includes(filters.serviceType)) return false;
    }
    
    if (filters.vehicleType !== 'all') {
      const hasVehicle = vendor.vehicles.some(v => 
        v.toLowerCase().includes(filters.vehicleType.toLowerCase())
      );
      if (!hasVehicle) return false;
    }

    if (searchQuery) {
        const lowerQ = searchQuery.toLowerCase();
        const matchesName = vendor.name.toLowerCase().includes(lowerQ);
        const matchesArea = vendor.areas.some(a => a.toLowerCase().includes(lowerQ));
        const matchesInventory = vendor.inventory.some(inv => inv.name.toLowerCase().includes(lowerQ));
        
        if (!matchesName && !matchesArea && !matchesInventory) return false;
    }
    
    return true;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <Button variant="ghost" onClick={() => navigate(-1)} className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" /> Back Home
              </Button>
            </div>
            <h1 className="text-xl font-bold hidden md:block">Cabs & Taxis</h1>
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

            <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
               <Select value={filters.serviceType} onValueChange={(v) => setFilters({...filters, serviceType: v})}>
                  <SelectTrigger className="w-40 bg-white">
                    <SelectValue placeholder="Service Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Services</SelectItem>
                    {serviceTypes.map(type => (<SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>))}
                  </SelectContent>
               </Select>

               <Select value={filters.vehicleType} onValueChange={(v) => setFilters({...filters, vehicleType: v})}>
                  <SelectTrigger className="w-40 bg-white">
                    <SelectValue placeholder="Vehicle Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Vehicles</SelectItem>
                    {vehicleTypes.map(type => (<SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>))}
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
             <span className="ml-2 text-gray-500">Loading vendors...</span>
          </div>
        ) : filteredVendors.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-dashed">
            <Filter className="h-10 w-10 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 text-lg">No cab services found matching criteria.</p>
            <Button variant="link" onClick={() => { setSearchQuery(''); setFilters({ serviceType: 'all', vehicleType: 'all' }); }}>
              Clear Search
            </Button>
          </div>
        ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredVendors.map((vendor) => (
            <Card key={vendor.id} className="hover:shadow-lg transition-shadow border-gray-100 group flex flex-col h-full">
              <CardContent className="p-6 flex flex-col h-full">
                
                {/* Header */}
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-xl font-bold mb-1 text-gray-800">{vendor.name}</h3>
                    <div className="flex items-center gap-2 mb-2">
                      {renderStars(vendor.rating)}
                      <span className="text-sm text-gray-600">({vendor.rating})</span>
                    </div>
                    {vendor.verified && (
                        <Badge className="bg-green-100 text-green-800 hover:bg-green-200 border-none text-xs flex items-center gap-1 w-fit">
                          <ShieldCheck className="h-3 w-3" /> Verified
                        </Badge>
                    )}
                  </div>
                  <div className="bg-blue-50 p-2 rounded-full group-hover:bg-blue-100 transition-colors">
                     <Car className="h-6 w-6 text-blue-600" />
                  </div>
                </div>

                {/* Description */}
                {vendor.description && (
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2 border-b pb-3 border-gray-100">
                        {vendor.description}
                    </p>
                )}

                {/* Details Body */}
                <div className="space-y-4 mb-6 grow">
                  
                  {/* Vehicle Categories */}
                  <div>
                    <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Vehicle Categories</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {vendor.vehicles.length > 0 ? vendor.vehicles.map((v, i) => (
                        <Badge key={i} variant="secondary" className="text-xs font-normal">
                          {v}
                        </Badge>
                      )) : <span className="text-xs text-gray-400">Not specified</span>}
                    </div>
                  </div>

                  {/* Specific Inventory (if available) */}
                  {vendor.inventory.length > 0 && (
                      <div>
                        <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Featured Fleet</span>
                        <div className="grid grid-cols-2 gap-2 mt-1">
                             {vendor.inventory.slice(0, 4).map((car, idx) => (
                                 <div key={idx} className="flex justify-between text-xs bg-gray-50 p-1.5 rounded border border-gray-100">
                                     <span className="font-medium text-gray-700">{car.name}</span>
                                     <span className="text-gray-500">₹{car.rate}/km</span>
                                 </div>
                             ))}
                        </div>
                      </div>
                  )}

                  {/* Services & Specialization */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Services</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {vendor.services.slice(0, 3).map((s, i) => (
                            <Badge key={i} variant="outline" className="text-[10px] bg-blue-50/50">
                              {s}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      {vendor.specializations.length > 0 && (
                          <div>
                            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Specialization</span>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {vendor.specializations.slice(0, 3).map((s, i) => (
                                <Badge key={i} variant="outline" className="text-[10px] bg-green-50/50 text-green-700 border-green-200">
                                  {s}
                                </Badge>
                              ))}
                            </div>
                          </div>
                      )}
                  </div>

                  {/* Pricing Box */}
                  <div className="bg-gray-50 p-3 rounded-lg border border-gray-100 mt-2">
                    <span className="text-xs font-bold text-gray-500 uppercase">Estimated Rates</span>
                    <div className="grid grid-cols-3 gap-2 mt-2 text-xs">
                      <div className="text-center p-1 bg-white rounded shadow-xs">
                        <span className="text-gray-500 block text-[10px]">Local</span>
                        <div className="font-semibold text-gray-800">₹{vendor.pricing.local}/km</div>
                      </div>
                      <div className="text-center p-1 bg-white rounded shadow-xs">
                        <span className="text-gray-500 block text-[10px]">Outstation</span>
                        <div className="font-semibold text-gray-800">₹{vendor.pricing.outstation}/km</div>
                      </div>
                      <div className="text-center p-1 bg-white rounded shadow-xs">
                        <span className="text-gray-500 block text-[10px]">Airport</span>
                        <div className="font-semibold text-gray-800">₹{vendor.pricing.airport}</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer / Contact */}
                <div className="mt-auto">
                    {/* Show Mobile Number */}
                    {vendor.contact && (
                        <div className="mb-2 flex items-center justify-center gap-2 text-sm font-medium text-gray-700 bg-gray-50 py-1 rounded">
                            <Phone className="h-3 w-3" />
                            <span>{vendor.contact}</span>
                        </div>
                    )}
                    
                    <div className="flex gap-3">
                    <Button 
                        className="flex-1 flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
                        onClick={() => window.open(`tel:${vendor.contact}`)}
                        disabled={!vendor.contact}
                    >
                        <Phone className="h-4 w-4" />
                        Call Now
                    </Button>
                    <Button 
                        variant="outline" 
                        className="flex-1 flex items-center gap-2 text-green-600 border-green-200 hover:bg-green-50"
                        onClick={() => {
                            const num = vendor.whatsapp.replace(/\D/g, ''); 
                            window.open(`https://wa.me/${num}`);
                        }}
                        disabled={!vendor.whatsapp}
                    >
                        <MessageCircle className="h-4 w-4" />
                        WhatsApp
                    </Button>
                    </div>
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