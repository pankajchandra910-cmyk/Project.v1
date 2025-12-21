
import React, { useState, useContext, useEffect, useRef, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../component/Card";
import { Button } from "../component/button";
import { Input } from "../component/Input";
import { Label } from "../component/label";
import { Textarea } from "../component/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../component/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../component/tabs";
import { Badge } from "../component/badge";
import { Separator } from "../component/separator";
import { Plus, Upload, Edit, Trash2, X, Loader2, RefreshCw, Car, IndianRupee, MapPin, Award, Languages as LangIcon, Calendar, Activity, Wifi, BedDouble, Hotel, CheckCircle, ChevronDown, Bike, FileCheck, ShieldCheck, Zap, Gauge, Info, Fuel, Settings, Phone, User, Mountain, Clock, Users, XCircle, Utensils, Briefcase, Wrench, Hammer, Sparkles, Trees } from "lucide-react"; 
import { useNavigate } from "react-router-dom";
import { GlobalContext } from "../component/GlobalContext";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogFooter, DialogHeader } from '../component/dialog';
import { analytics, auth, db } from '../firebase'; 
import { logEvent } from "firebase/analytics"; 
import { signInWithPhoneNumber, PhoneAuthProvider, linkWithCredential } from 'firebase/auth';
import { doc, setDoc, addDoc, deleteDoc, collection, serverTimestamp } from "firebase/firestore";

// --- 0. CONSTANTS FOR SUGGESTIONS ---
const SUGGESTIONS = {
  locations: [
    "Nainital", "Bhimtal", "Sattal", "Naukuchiatal", "Mukteshwar", 
    "Ramgarh", "Pangot", "Almora", "Ranikhet", "Kausani", 
    "Jeolikote", "Ramnagar", "Jim Corbett", "Haldwani", "Dehradun", "Rishikesh",
    "Hartola", "Nathuakhan", "Sitla", "Jageshwar"
  ],
  amenities: [
    "Free WiFi", "Free Parking", "Restaurant", "Room Service", 
    "Swimming Pool", "Bonfire", "Pet Friendly", "Power Backup", 
    "Spa", "Gym", "Conference Hall", "Garden", "Travel Desk",
    "Private Kitchen", "Caretaker", "Heater"
  ],
  roomTypes: [
    "Standard Room", "Deluxe Room", "Super Deluxe", "Luxury Suite", 
    "Family Suite", "Lake View Room", "Cottage", "Tent", "Dormitory",
    "Mud House", "Tree House", "Glass House", "Entire Villa"
  ],
  views: [
    "No Special View", "Lake View", "Mountain View", "Valley View", 
    "Garden View", "Forest View", "City View", "Pool View", "Himalayas View", "Orchard View"
  ],
  roomFeatures: [
    "King Sized Bed", "Queen Sized Bed", "Twin Beds", "Air Conditioning", 
    "Heater/Blower", "Private Balcony", "Bathtub", "Jacuzzi", 
    "Electric Kettle", "Smart TV", "Mini Fridge", "Work Desk", "Fireplace"
  ],
  // HILL STAY SPECIFIC
  hillUniqueFeatures: [
    "Apple Orchard", "360 Degree View", "River Side", "Secluded Location", 
    "Organic Farm", "Colonial Architecture", "Bird Watcher Paradise", "Snow View Point"
  ],
  hillActivities: [
    "Guided Nature Walk", "Stargazing", "Bonfire Evening", "Village Tour", 
    "Farming Experience", "Picnic by River", "Yoga Session", "Fruit Picking"
  ],
  // GUIDE SUGGESTIONS
  guideLanguages: [
    "English", "Hindi", "Kumaoni", "Garhwali", "Punjabi", 
    "Bengali", "French", "German", "Spanish", "Russian"
  ],
  guideSpecializations: [
    "Bird Watching", "Nature Photography", "Heritage Walks", "High Altitude Trekking", 
    "Spiritual Tours", "Village Tours", "Camping", "Flora & Fauna", "Local History", "Food Walks"
  ],
  guideItineraryTitles: [
    "Arrival & Introduction", "Lake Tour", "Hidden Waterfall Hike", "Sunset Point Trek", 
    "Village Homestay Visit", "Temple Tour", "Bird Watching Session", "Market Visit"
  ],
  guideActivities: [
    "Boating", "Hiking", "Photography", "Meditation", "Local Dining", 
    "Shopping", "Bonfire", "Storytelling", "Museum Visit"
  ],
  guideExperience: ["1", "2", "3", "4", "5", "8", "10", "12", "15", "20+"],
  guideGroupSize: ["4", "6", "8", "10", "12", "15", "20", "25", "50"],
  guidePricing: ["1000", "1500", "2000", "2500", "3000", "4000", "5000"],
  
  // RENTAL BIKE SUGGESTIONS
  bikeModels: [
    "Royal Enfield Classic 350", "Royal Enfield Himalayan", "Royal Enfield Meteor 350", "Royal Enfield Hunter 350",
    "Honda Activa 6G", "Honda Dio", "TVS Jupiter", "TVS Ntorq",
    "Bajaj Avenger 220", "Bajaj Dominar 400", "KTM Duke 200", "KTM Adventure 390",
    "Hero Splendor Plus", "Hero Xpulse 200", "Yamaha MT-15", "Yamaha R15 V4"
  ],
  bikeTypes: [
    "Cruiser", "Scooter", "Sports", "Adventure", "Commuter", "Off-road", "Touring"
  ],
  bikePricing: ["500", "600", "700", "800", "1000", "1200", "1500", "1800", "2000", "2500"],
  bikeDocuments: [
    "Valid Driving License", "Aadhar Card", "Voter ID", "Passport", "Original ID Deposit", "Copy of Driving License"
  ],
  bikeServices: [
    "Helmet Included", "Pillion Helmet Extra", "24/7 Roadside Assistance", "Unlimited Kilometers", "Third Party Insurance", "Full Tank Fuel (Return Full)"
  ],
  mileagePolicies: [
    "Unlimited kms within city", "Unlimited within Uttarakhand", "200 km limit per day", "150 km limit per day"
  ],
  depositPolicies: [
    "No Deposit Required", "Original ID Card", "₹1,000 Security", "₹2,000 - ₹5,000", "Post Dated Cheque"
  ],
  fuelPolicies: [
    "Tank to Tank", "Return with same level", "Not Included", "Full Tank Provided"
  ],
  deliveryPolicies: [
    "Shop Pickup Only", "Free Delivery within 5km", "Airport Delivery Available", "Hotel Drop/Pickup (Paid)"
  ],

  // --- CAB & TAXI SUGGESTIONS ---
  cabVehicleTypes: [
    "Sedan", "SUV", "Hatchback", "Tempo Traveller", "Luxury", "Off-Road", "Minivan"
  ],
  cabServices: [
    "Local City Ride", "Outstation One-Way", "Outstation Round Trip", "Airport Transfer", "Railway Station Transfer", "Sightseeing Tour", "Wedding Car Rental"
  ],
  cabSpecializations: [
    "24/7 Service", "English Speaking Driver", "Pet Friendly", "Roof Carrier Available", "Clean & Sanitized", "Experienced Mountain Driver", "Luxury Interiors"
  ],

  // --- TOURS SUGGESTIONS ---
  tourDurations: ["3-4 Hours", "Full Day", "2 Days / 1 Night", "3 Days / 2 Nights", "5 Days / 4 Nights", "1 Week"],
  tourDifficulties: ["Easy", "Moderate", "Challenging", "Technical"],
  tourTypes: ["Day Trip", "Weekend Getaway", "Long Trek", "Camping Expedition", "Cultural Tour", "Religious Tour"],
  tourFitness: ["Easy Walk", "Moderate Fitness Required", "High Endurance Required", "Family Friendly", "Beginner Friendly"],
  tourSeasons: ["All Year Round", "March to June", "September to November", "Winter Only (Snow Trek)", "Monsoon Special"],
  
  tourItineraryTitles: [
    "Arrival & Check-in", "Trek to Summit", "Jungle Safari", "Riverside Camping", "Local Village Walk", 
    "Temple Visit & Sightseeing", "Departure after Breakfast", "Evening Bonfire"
  ],
  tourActivities: [
    "Trekking", "Camping", "Bonfire", "Photography", "Bird Watching", "River Crossing", "Star Gazing", "Meditation"
  ],
  tourMeals: [
    "Breakfast", "Lunch", "Dinner", "All Meals", "Packed Lunch", "Breakfast & Dinner", "Hi-Tea & Snacks"
  ],
  tourIncludes: [
    "Accommodation", "All Meals", "Certified Guide", "Entry Fees", "Transportation", "Camping Gear"
  ],
  tourExcludes: [
    "Personal Expenses", "Alcohol", "Tips", "Insurance", "Porter Charges"
  ],
  // --- GENERAL SERVICES SUGGESTIONS ---
  generalServiceTypes: [
    "Photographer", "Mechanic", "Electrician", "Plumber", "Carpenter", "Sketch Artist", 
    "Makeup Artist", "Tutor", "Event Planner", "Yoga Instructor", "Driver", "Pandit/Priest"
  ],
  generalAvailability: [
    "9 AM - 6 PM", "10 AM - 7 PM", "24/7 Emergency Service", "Weekends Only", "By Appointment Only", "Sunrise to Sunset"
  ],
  generalServices: [
    "Home Visit", "Studio Session", "Emergency Repair", "Consultation", "Installation", "Maintenance", "Custom Orders"
  ]
};

// --- 0.1 HELPER COMPONENT: ROBUST HYBRID INPUT ---
const HybridInput = ({ value, onChange, options, placeholder, className, name, onEnter }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [filteredOptions, setFilteredOptions] = useState(options || []);
  const wrapperRef = useRef(null);

  const getDisplayValue = () => {
    if (value === null || value === undefined) return "";
    if (typeof value === 'object') return ""; 
    return value.toString();
  };

  useEffect(() => {
    const valStr = getDisplayValue().toLowerCase();
    if (options && options.length > 0) {
      setFilteredOptions(options.filter(opt => opt.toLowerCase().includes(valStr)));
    } else {
      setFilteredOptions([]);
    }
  }, [value, options]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [wrapperRef]);

  const handleInputChange = (e) => {
    const newVal = e.target.value;
    setIsOpen(true);

    if (name) {
      onChange({ target: { name: name, value: newVal } });
    } else {
      onChange(newVal);
    }
  };

  const handleSelect = (option) => {
    if (name) {
       onChange({ target: { name: name, value: option }});
    } else {
       onChange(option);
    }
    setIsOpen(false);
  };

  const handleKeyDown = (e) => {
      if(e.key === 'Enter') { 
          e.preventDefault(); 
          setIsOpen(false);
          if(onEnter) onEnter(getDisplayValue()); 
      }
  };

  return (
    <div className={`relative ${className}`} ref={wrapperRef}>
      <div className="relative">
        <Input
          name={name}
          value={getDisplayValue()}
          onChange={handleInputChange}
          onClick={() => setIsOpen(true)}
          placeholder={placeholder}
          className="pr-8"
          onKeyDown={handleKeyDown}
          autoComplete="off"
        />
        <ChevronDown 
            className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 cursor-pointer" 
            onClick={() => setIsOpen(!isOpen)}
        />
      </div>
      
      {isOpen && filteredOptions.length > 0 && (
        <ul className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-48 overflow-y-auto">
          {filteredOptions.map((option, idx) => (
            <li
              key={idx}
              className="px-3 py-2 text-sm hover:bg-slate-100 cursor-pointer text-slate-700"
              onMouseDown={(e) => {
                e.preventDefault(); 
                handleSelect(option);
              }}
            >
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

// --- 1. INITIAL STATE STRUCTURE ---
const initialFormData = {
  id: null,
  name: "",
  location: "", 
  description: "",
  price: "", 
  photos: [], 
  verified: false, 
  listingDetails: {
    rooms: [], 
    hillStayAmenities: [],
    uniqueFeatures: [],
    activities: [],
    bikes: [], 
    policies: { mileage: "", securityDeposit: "", fuelPolicy: "", delivery: "" },
    services: [], 
    documents: [],
    vehicles: [], 
    cabData: {
      pricing: { local: "", outstation: "", airport: "" },
      availableVehicleTypes: [], 
      services: [], 
      areas: [], 
      specializations: [] 
    },
    tourData: {
      difficulty: "", 
      duration: "",
      type: "",
      maxGroupSize: "",
      fitnessLevel: "",
      bestTime: "",
      includes: [],
      excludes: [],
      itinerary: [] 
    },
    guideData: {
      experience: "",     
      maxGroupSize: "",   
      languages: [],      
      specializations: [],
      itinerary: []       
    },
    treks: [],
    generalServiceData: {
        serviceType: "",
        experience: "",
        availability: "",
        pricing: { visitCharge: "" },
        services: [],
        specializations: []
    }
  },
};

export default function OwnerDashboard() {
  const {
    profession: globalProfession, setProfession: setGlobalProfession,
    userName, setUserName, userPhone, setUserPhone, userEmail,
    updateUserProfileInFirestore, ownerId, businessAddress, setBusinessAddress,
    licenseNumber, setLicenseNumber, userPhoneVerified,
    readOwnerListingsRemote, writeOwnerListingsRemote,
  } = useContext(GlobalContext);

  const navigate = useNavigate();

  // --- 2. LOCAL STATE ---
  const [activeTab, setActiveTab] = useState("add-listing");
  const [syncStatus, setSyncStatus] = useState('idle');
  const [isSyncing, setIsSyncing] = useState(false);
  const [formData, setFormData] = useState(initialFormData);
  const [ownerListings, setOwnerListings] = useState([]);
  const [editingListingId, setEditingListingId] = useState(null);
  
  const [newInclude, setNewInclude] = useState("");
  const [newExclude, setNewExclude] = useState("");
  const [tourItineraryDay, setTourItineraryDay] = useState({ title: "", activities: "", meals: "" });
  
  const [newCabTag, setNewCabTag] = useState({ vehicle: "", service: "", spec: "" });
  const [newVehicleInv, setNewVehicleInv] = useState({ name: "", type: "", rate: "", driverName: "", driverPhone: "" });
  
  const [newGuideTag, setNewGuideTag] = useState({ lang: "", spec: "" });
  const [guideItineraryDay, setGuideItineraryDay] = useState({ title: "", activities: "" });

  const [newGenService, setNewGenService] = useState("");
  const [newGenSpec, setNewGenSpec] = useState("");

  const [newBikeService, setNewBikeService] = useState("");
  const [newBikeDocument, setNewBikeDocument] = useState("");

  const [newAmenity, setNewAmenity] = useState("");
  const [newUniqueFeature, setNewUniqueFeature] = useState(""); 
  const [newActivity, setNewActivity] = useState(""); 
  const [roomFeatureInputs, setRoomFeatureInputs] = useState({}); 

  const fileInputRef = useRef(null);
  const [showPhoneModal, setShowPhoneModal] = useState(false);
  const [phoneToVerify, setPhoneToVerify] = useState(userPhone || "");
  const [phoneOtp, setPhoneOtp] = useState("");
  const [phoneConfirmationResult, setPhoneConfirmationResult] = useState(null);
  const [phoneOtpSent, setPhoneOtpSent] = useState(false);
  const [phoneLoading, setPhoneLoading] = useState(false);

  // --- 3. DATA FETCHING ---
  const fetchListings = useCallback(async () => {
    if (ownerId) {
      const listings = await readOwnerListingsRemote(ownerId);
      setOwnerListings(listings || []);
    }
  }, [ownerId, readOwnerListingsRemote]);

  useEffect(() => {
    fetchListings();
  }, [fetchListings]);

  useEffect(() => {
    setPhoneToVerify(userPhone || "");
  }, [userPhone]);

  // --- 4. SYNC LOGIC ---
  const syncListings = useCallback(async () => {
    if (!ownerId || isSyncing) return;
    setIsSyncing(true);
    setSyncStatus('syncing');
    try {
      const success = await writeOwnerListingsRemote(ownerListings, ownerId);
      if (success) {
        if (analytics) {
          logEvent(analytics, 'sync_listings', {
            owner_id: ownerId,
            listing_count: ownerListings.length
          });
        }
        await fetchListings();
        setSyncStatus('synced');
        toast.success("Listings synced with the cloud!");
      } else {
        setSyncStatus('error');
        toast.error("Sync failed. Please try again.");
      }
    } catch (e) {
      setSyncStatus('error');
      toast.error("An error occurred during sync.");
    } finally {
      setIsSyncing(false);
    }
  }, [ownerId, ownerListings, writeOwnerListingsRemote, isSyncing, fetchListings]);

  // --- 5. FORM HANDLERS ---
  const handleFormChange = (eOrValue) => {
    if (typeof eOrValue === 'object' && eOrValue.target) {
        setFormData(p => ({ ...p, [eOrValue.target.name]: eOrValue.target.value }));
    } 
  };
  
  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files);
    if (formData.photos.length + files.length > 10) {
      return toast.error("Maximum 10 photos allowed per listing.");
    }
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (event) => setFormData(p => ({ ...p, photos: [...p.photos, event.target.result] }));
      reader.readAsDataURL(file);
    });
  };

  const removePhoto = (index) => setFormData(p => ({ ...p, photos: p.photos.filter((_, i) => i !== index) }));

  const updateNestedArray = (arr, id, field, val) => setFormData(p => ({
    ...p,
    listingDetails: {
      ...p.listingDetails,
      [arr]: p.listingDetails[arr].map(item => item.id === id ? { ...item, [field]: val } : item)
    }
  }));

  const addToArray = (arr, item) => setFormData(p => ({
    ...p,
    listingDetails: {
      ...p.listingDetails,
      [arr]: [...p.listingDetails[arr], item]
    }
  }));

  const deleteFromArray = (arr, id) => setFormData(p => ({
    ...p,
    listingDetails: {
      ...p.listingDetails,
      [arr]: p.listingDetails[arr].filter(item => item.id !== id)
    }
  }));

  // ==========================================
  // --- HELPER LOGIC ---
  // ==========================================
  
  // Bike Helpers
  const updateBikePolicies = (field, val) => {
    setFormData(p => ({
      ...p,
      listingDetails: {
        ...p.listingDetails,
        policies: { ...(p.listingDetails.policies || {}), [field]: val }
      }
    }));
  };

  const addBikeStringItem = (arrName, value, setter) => {
    if (!value || !value.trim()) return;
    setFormData(p => ({
      ...p,
      listingDetails: {
        ...p.listingDetails,
        [arrName]: [...(p.listingDetails[arrName] || []), value.trim()]
      }
    }));
    setter("");
  };

  const removeBikeStringItem = (arrName, index) => {
    setFormData(p => ({
      ...p,
      listingDetails: {
        ...p.listingDetails,
        [arrName]: (p.listingDetails[arrName] || []).filter((_, i) => i !== index)
      }
    }));
  };

  // CAB HELPERS
  const updateCabPricing = (field, value) => {
    setFormData(p => ({
      ...p,
      listingDetails: {
        ...p.listingDetails,
        cabData: {
          ...p.listingDetails.cabData,
          pricing: { ...p.listingDetails.cabData.pricing, [field]: value }
        }
      }
    }));
  };

  const addCabArrayItem = (arrayName, value, inputFieldKey) => {
    if (!value || !value.trim()) return;
    const cleanValue = value.trim();
    const currentArray = formData.listingDetails.cabData[arrayName] || [];
    if (currentArray.includes(cleanValue)) {
        toast.info(`${cleanValue} is already added.`);
        return;
    }
    setFormData(p => ({
      ...p,
      listingDetails: {
        ...p.listingDetails,
        cabData: {
          ...p.listingDetails.cabData,
          [arrayName]: [...currentArray, cleanValue]
        }
      }
    }));
    if (inputFieldKey) setNewCabTag(prev => ({ ...prev, [inputFieldKey]: "" }));
  };

  const removeCabArrayItem = (arrayName, index) => {
    setFormData(prev => ({
        ...prev,
        listingDetails: {
            ...prev.listingDetails,
            cabData: {
                ...prev.listingDetails.cabData,
                [arrayName]: prev.listingDetails.cabData[arrayName].filter((_, i) => i !== index)
            }
        }
    }));
  };

  const addVehicleToInventory = () => {
    if (!newVehicleInv.name || !newVehicleInv.rate) return toast.error("Model name and rate are required");
    
    addToArray('vehicles', { 
        id: Date.now(), 
        type: newVehicleInv.type || "Sedan", 
        name: newVehicleInv.name, 
        rate: newVehicleInv.rate,
        driverName: newVehicleInv.driverName,
        driverPhone: newVehicleInv.driverPhone 
    });
    setNewVehicleInv({ name: "", type: "", rate: "", driverName: "", driverPhone: "" });
  };

  // 1. General Property Amenities Helper
  const addHillStayAmenity = (val) => {
    let value = val !== undefined ? val : newAmenity;

    if (value && typeof value === 'object' && value.target) {
        value = value.target.value;
    }

    if (!value || typeof value !== 'string' || !value.trim()) return;
    
    const stringVal = value.trim();

    if (formData.listingDetails.hillStayAmenities.includes(stringVal)) {
        return toast.info("Amenity already added");
    }

    setFormData(p => ({
      ...p,
      listingDetails: {
        ...p.listingDetails,
        hillStayAmenities: [...(p.listingDetails.hillStayAmenities || []), stringVal]
      }
    }));
    setNewAmenity("");
  };

  const removeHillStayAmenity = (index) => {
    setFormData(p => ({
        ...p,
        listingDetails: {
            ...p.listingDetails,
            hillStayAmenities: p.listingDetails.hillStayAmenities.filter((_, i) => i !== index)
        }
    }));
  };

  // 2. Generic List Adder for HillStays
  const addStringItemToList = (listName, val, setter) => {
      let finalVal = val;
      if (val && typeof val === 'object' && val.target) {
        finalVal = val.target.value;
      }
      if(!finalVal || typeof finalVal !== 'string' || !finalVal.trim()) return;
      
      const cleanedVal = finalVal.trim();
      if((formData.listingDetails[listName] || []).includes(cleanedVal)) return;

      setFormData(p => ({
        ...p,
        listingDetails: {
            ...p.listingDetails,
            [listName]: [...(p.listingDetails[listName] || []), cleanedVal]
        }
      }));
      if(setter) setter("");
  };
  
  const removeStringItemFromList = (listName, index) => {
      setFormData(p => ({
        ...p,
        listingDetails: {
            ...p.listingDetails,
            [listName]: (p.listingDetails[listName] || []).filter((_, i) => i !== index)
        }
      }));
  };


  const addRoomFeature = (roomId, featureVal) => {
      const feature = featureVal || roomFeatureInputs[roomId];
      if (!feature || !feature.trim()) return;
      setFormData(prev => {
          const updatedRooms = prev.listingDetails.rooms.map(room => {
              if (room.id === roomId) {
                  const existingFeatures = room.features || [];
                  if(existingFeatures.includes(feature.trim())) return room;
                  return { ...room, features: [...existingFeatures, feature.trim()] };
              }
              return room;
          });
          return {
              ...prev,
              listingDetails: { ...prev.listingDetails, rooms: updatedRooms }
          };
      });
      setRoomFeatureInputs(prev => ({ ...prev, [roomId]: "" }));
  };

  const removeRoomFeature = (roomId, featureIdx) => {
      setFormData(prev => ({
          ...prev,
          listingDetails: {
              ...prev.listingDetails,
              rooms: prev.listingDetails.rooms.map(room => 
                  room.id === roomId 
                  ? { ...room, features: room.features.filter((_, i) => i !== featureIdx) }
                  : room
              )
          }
      }));
  };

  // GUIDE HELPERS
  const updateGuideField = (field, value) => {
    setFormData(p => ({
      ...p,
      listingDetails: {
        ...p.listingDetails,
        guideData: { ...p.listingDetails.guideData, [field]: value }
      }
    }));
  };

  const addGuideArrayItem = (arrayName, value, inputKey) => {
    if (!value || !value.trim()) return;
    const cleanValue = value.trim();
    const currentList = formData.listingDetails.guideData[arrayName] || [];

    if (currentList.includes(cleanValue)) {
        toast.info("Item already added.");
        return;
    }

    setFormData(p => ({
        ...p,
        listingDetails: {
            ...p.listingDetails,
            guideData: {
                ...p.listingDetails.guideData,
                [arrayName]: [...currentList, cleanValue]
            }
        }
    }));
    setNewGuideTag(prev => ({ ...prev, [inputKey]: "" }));
  };

  const removeGuideArrayItem = (arrayName, index) => {
    setFormData(p => ({
        ...p,
        listingDetails: {
            ...p.listingDetails,
            guideData: {
                ...p.listingDetails.guideData,
                [arrayName]: p.listingDetails.guideData[arrayName].filter((_, i) => i !== index)
            }
        }
    }));
  };

  const addGuideItineraryDay = () => {
    if(!guideItineraryDay.title) return toast.error("Day title is required");
    const dayData = {
      day: (formData.listingDetails.guideData.itinerary?.length || 0) + 1,
      title: guideItineraryDay.title,
      activities: guideItineraryDay.activities.split(',').map(s => s.trim()).filter(Boolean)
    };
    setFormData(p => ({
      ...p,
      listingDetails: {
        ...p.listingDetails,
        guideData: {
          ...p.listingDetails.guideData,
          itinerary: [...(p.listingDetails.guideData.itinerary || []), dayData]
        }
      }
    }));
    setGuideItineraryDay({ title: "", activities: "" });
  };

  const removeGuideItineraryDay = (index) => {
    setFormData(p => {
      const newItinerary = p.listingDetails.guideData.itinerary.filter((_, i) => i !== index);
      const reIndexed = newItinerary.map((item, i) => ({ ...item, day: i + 1 }));
      return {
        ...p,
        listingDetails: {
          ...p.listingDetails,
          guideData: { ...p.listingDetails.guideData, itinerary: reIndexed }
        }
      };
    });
  };

  // TOUR HELPERS
  const updateTourField = (field, value) => {
    setFormData(p => ({
      ...p,
      listingDetails: {
        ...p.listingDetails,
        tourData: { ...p.listingDetails.tourData, [field]: value }
      }
    }));
  };

  const addTourArrayItem = (field, value, setter) => {
    if(!value.trim()) return;
    setFormData(p => ({
      ...p,
      listingDetails: {
        ...p.listingDetails,
        tourData: { 
          ...p.listingDetails.tourData, 
          [field]: [...(p.listingDetails.tourData[field] || []), value.trim()] 
        }
      }
    }));
    setter("");
  };

  const removeTourArrayItem = (field, index) => {
    setFormData(p => ({
      ...p,
      listingDetails: {
        ...p.listingDetails,
        tourData: {
          ...p.listingDetails.tourData,
          [field]: p.listingDetails.tourData[field].filter((_, i) => i !== index)
        }
      }
    }));
  };

  const addTourItineraryDay = () => {
    if(!tourItineraryDay.title) return toast.error("Day title is required");
    const dayData = {
      day: (formData.listingDetails.tourData.itinerary?.length || 0) + 1,
      title: tourItineraryDay.title,
      activities: tourItineraryDay.activities.split(',').map(s => s.trim()).filter(Boolean),
      meals: tourItineraryDay.meals.split(',').map(s => s.trim()).filter(Boolean)
    };
    setFormData(p => ({
      ...p,
      listingDetails: {
        ...p.listingDetails,
        tourData: {
          ...p.listingDetails.tourData,
          itinerary: [...(p.listingDetails.tourData.itinerary || []), dayData]
        }
      }
    }));
    setTourItineraryDay({ title: "", activities: "", meals: "" });
  };

  const removeTourItineraryDay = (index) => {
    setFormData(p => {
      const newItinerary = p.listingDetails.tourData.itinerary.filter((_, i) => i !== index);
      const reIndexed = newItinerary.map((item, i) => ({ ...item, day: i + 1 }));
      return {
        ...p,
        listingDetails: {
          ...p.listingDetails,
          tourData: { ...p.listingDetails.tourData, itinerary: reIndexed }
        }
      };
    });
  };

  // GENERAL SERVICES HELPERS
  const updateGenServiceField = (field, value) => {
    setFormData(p => ({
        ...p,
        listingDetails: {
            ...p.listingDetails,
            generalServiceData: { ...p.listingDetails.generalServiceData, [field]: value }
        }
    }));
  };

  const addGenServiceArrayItem = (arrayName, value, setter) => {
    if (!value || !value.trim()) return;
    const cleanValue = value.trim();
    const currentList = formData.listingDetails.generalServiceData[arrayName] || [];

    if (currentList.includes(cleanValue)) {
        toast.info("Item already added.");
        return;
    }

    setFormData(p => ({
        ...p,
        listingDetails: {
            ...p.listingDetails,
            generalServiceData: {
                ...p.listingDetails.generalServiceData,
                [arrayName]: [...currentList, cleanValue]
            }
        }
    }));
    setter("");
  };

  const removeGenServiceArrayItem = (arrayName, index) => {
      setFormData(p => ({
          ...p,
          listingDetails: {
              ...p.listingDetails,
              generalServiceData: {
                  ...p.listingDetails.generalServiceData,
                  [arrayName]: p.listingDetails.generalServiceData[arrayName].filter((_, i) => i !== index)
              }
          }
      }));
  };


  // --- 6. CRUD OPERATIONS ---
  const handlePublishListing = async () => {
    // 1. Basic Validation
    if (!formData.name || !formData.location) return toast.error("Listing Name and Location are required.");
    if (!ownerId) return toast.error("Authentication error. Please re-login.");

    if (!userPhone) {
      toast.error("Contact Number is required. Please update your Profile.");
      setActiveTab("profile");
      return;
    }

    const listingData = {
      ...formData,
      profession: globalProfession,
      ownerId, 
      contactSnapshot: {
        phone: userPhone,
        email: userEmail,
        name: userName
      },
      status: "Active",
      bookings: 0,
      revenue: "₹0",
      verified: formData.verified || false, 
    };

    try {
      if (editingListingId) {
        const docRef = doc(db, "listings", editingListingId);
        await setDoc(docRef, { ...listingData, updatedAt: serverTimestamp() }, { merge: true });
        toast.success("Listing updated successfully!");
      } else {
        const listingsCollectionRef = collection(db, "listings");
        const newDocRef = await addDoc(listingsCollectionRef, { ...listingData, createdAt: serverTimestamp(), updatedAt: serverTimestamp() });
        await setDoc(newDocRef, { id: newDocRef.id }, { merge: true });
        toast.success("Listing published successfully!");
      }
      setFormData(initialFormData);
      setEditingListingId(null);
      await fetchListings();
      setActiveTab("my-listings");
    } catch (error) {
      console.error(error);
      toast.error("Failed to save listing to the database.");
    }
  };

  const handleEditListing = (listingId) => {
    const listing = ownerListings.find(l => l.id === listingId);
    if (listing) {
      setFormData({ 
        ...initialFormData, 
        ...listing, 
        listingDetails: {
          ...initialFormData.listingDetails,
          ...listing.listingDetails,
          tourData: { ...initialFormData.listingDetails.tourData, ...(listing.listingDetails?.tourData || {}) },
          cabData: { ...initialFormData.listingDetails.cabData, ...(listing.listingDetails?.cabData || {}) },
          guideData: { ...initialFormData.listingDetails.guideData, ...(listing.listingDetails?.guideData || {}) },
          generalServiceData: { ...initialFormData.listingDetails.generalServiceData, ...(listing.listingDetails?.generalServiceData || {}) },
          bikes: listing.listingDetails?.bikes || [],
          policies: listing.listingDetails?.policies || { mileage: "", securityDeposit: "", fuelPolicy: "", delivery: "" },
          services: listing.listingDetails?.services || [],
          documents: listing.listingDetails?.documents || [],
          vehicles: listing.listingDetails?.vehicles || [],
          hillStayAmenities: listing.listingDetails?.hillStayAmenities || [],
          uniqueFeatures: listing.listingDetails?.uniqueFeatures || [],
          activities: listing.listingDetails?.activities || [],
        }
      });
      setGlobalProfession(listing.profession); 
      setEditingListingId(listingId);
      setActiveTab("add-listing");
    }
  };

  const handleDeleteListing = async (listingId) => {
    if (!window.confirm("Are you sure you want to permanently delete this listing?")) return;
    const listingToDelete = ownerListings.find(l => l.id === listingId);
    try {
      await deleteDoc(doc(db, "listings", listingId));
      if (analytics && listingToDelete) {
        logEvent(analytics, 'delete_listing', { profession: listingToDelete.profession });
      }
      toast.success("Listing deleted successfully.");
      setOwnerListings(prev => prev.filter(l => l.id !== listingId));
    } catch (error) {
      toast.error("Failed to delete listing.");
    }
  };

  // --- 7. PROFILE LOGIC ---
  const handleUpdateProfile = async () => {
    const success = await updateUserProfileInFirestore({
      displayName: userName,
      phoneNumber: userPhone,
      profession: globalProfession,
      businessAddress,
      licenseNumber
    });
    if (success) toast.success('Profile updated!'); else toast.error('Update failed.');
  };

  const handleSendPhoneOTP = async () => {
    if (!phoneToVerify || phoneToVerify.length < 10) return toast.error('Enter valid phone (+91...)');
    setPhoneLoading(true);
    try {
      const confirmationResult = await signInWithPhoneNumber(auth, phoneToVerify);
      setPhoneConfirmationResult(confirmationResult);
      setPhoneOtpSent(true);
      toast.success(`OTP sent to ${phoneToVerify}`);
    } catch (e) {
      toast.error(`Failed to send OTP: ${e.message}`);
    } finally {
      setPhoneLoading(false);
    }
  };

  const handleConfirmPhoneOTP = async () => {
    if (!phoneConfirmationResult || !phoneOtp) return toast.error('Enter OTP.');
    setPhoneLoading(true);
    try {
      const phoneCred = PhoneAuthProvider.credential(phoneConfirmationResult.verificationId, phoneOtp);
      await linkWithCredential(auth.currentUser, phoneCred); 
      await updateUserProfileInFirestore({ phoneNumber: phoneToVerify, phoneVerified: true });
      setUserPhone(phoneToVerify); 
      toast.success('Phone verified!');
      setShowPhoneModal(false);
    } catch (e) {
      toast.error(`Failed to verify: ${e.message}`);
    } finally {
      setPhoneLoading(false);
    }
  };
  
  // Reusable Helper for Accommodation UI
  const renderAccommodationRooms = (title = "Rooms & Accommodation") => (
    <>
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-semibold flex items-center gap-2">
           <BedDouble className="w-5 h-5"/> {title}
        </h3>
        <Button onClick={() => addToArray('rooms', { id: Date.now(), type: "", price: "", features: [], view: "" })} size="sm">
          <Plus className="w-4 h-4 mr-2" />Add New Unit
        </Button>
      </div>

      {formData.listingDetails.rooms.length === 0 ? (
          <div className="text-center p-8 border-2 border-dashed border-gray-200 rounded-lg text-gray-500">
             Click "Add New Unit" to list your accommodation options.
          </div>
      ) : (
          <div className="space-y-6">
          {formData.listingDetails.rooms.map((room) => (
            <Card key={room.id} className="relative overflow-visible border-slate-200 shadow-sm hover:shadow-md transition-shadow z-10">
              <div className="absolute top-0 left-0 w-1 h-full bg-primary/70"></div>
              <CardHeader className="bg-gray-50/50 pb-2">
                   <div className="flex justify-between items-center">
                      <h4 className="font-bold text-gray-700 text-sm uppercase tracking-wide">Unit Configuration</h4>
                      <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600 hover:bg-red-50" onClick={() => deleteFromArray("rooms", room.id)}>
                          <Trash2 className="w-4 h-4 mr-2" />Remove
                      </Button>
                   </div>
              </CardHeader>
              <CardContent className="p-4 space-y-4">
                {/* Top Row: Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1">
                       <Label className="text-xs">Type / Name</Label>
                       <HybridInput 
                          placeholder="e.g. Deluxe Cottage"
                          options={SUGGESTIONS.roomTypes}
                          value={room.type}
                          onChange={(val) => updateNestedArray("rooms", room.id, "type", val)}
                       />
                  </div>
                  <div className="space-y-1">
                       <Label className="text-xs">Nightly Price</Label>
                       <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">₹</span>
                          <Input 
                              type="number" 
                              value={room.price} 
                              onChange={(e) => updateNestedArray("rooms", room.id, "price", e.target.value)} 
                              className="pl-7 border-gray-300"
                          />
                       </div>
                  </div>
                  <div className="space-y-1">
                      <Label className="text-xs">View Direction</Label>
                      <HybridInput 
                          placeholder="Select or type view"
                          options={SUGGESTIONS.views}
                          value={room.view}
                          onChange={(val) => updateNestedArray("rooms", room.id, "view", val)}
                       />
                  </div>
                </div>

                {/* Bottom Row: Room Features (Hybrid Input) */}
                <div className="bg-blue-50/50 p-3 rounded-md border border-blue-100">
                    <Label className="text-xs text-blue-700 font-bold mb-2 block">Specific Features (e.g. Balcony, Heater)</Label>
                    <div className="flex gap-2 mb-2">
                         <div className="grow">
                            <HybridInput
                              placeholder="Type or select feature..."
                              options={SUGGESTIONS.roomFeatures}
                              value={roomFeatureInputs[room.id] || ""}
                              onChange={(val) => setRoomFeatureInputs(prev => ({ ...prev, [room.id]: val }))}
                              onEnter={() => addRoomFeature(room.id)}
                            />
                         </div>
                         <Button size="sm" className="h-9 shrink-0" variant="outline" onClick={() => addRoomFeature(room.id)}>Add</Button>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 min-h-6">
                       {room.features?.map((f, i) => (
                          <span key={i} className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-white text-blue-700 border border-blue-200 shadow-sm">
                             {f}
                             <button type="button" className="ml-1 text-gray-400 hover:text-red-500 focus:outline-none" onClick={() => removeRoomFeature(room.id, i)}>
                               <X className="w-3 h-3" />
                             </button>
                          </span>
                       ))}
                    </div>
                </div>
              </CardContent>
            </Card>
          ))}
          </div>
      )}
    </>
  );

  // --- 8. RENDER PROFESSION SPECIFIC FORMS ---
  const renderProfessionForm = () => {
    switch (globalProfession) {
      
      // ==========================
      // HILL STAYS (NEW CASE)
      // ==========================
      case "hill-stays":
        return (
          <div className="space-y-6">
            {/* 1. Hill Stay Amenities */}
             <div className="bg-blue-50/50 p-4 rounded-md border border-blue-200">
               <h3 className="text-lg font-bold text-blue-900 mb-2 flex items-center gap-2">
                 <Hotel className="w-5 h-5"/> Homestay & Property Amenities
               </h3>
               <p className="text-xs text-gray-500 mb-3">Add common facilities available (e.g. Private Kitchen, WiFi, Heater).</p>
               <div className="flex gap-3">
                  <div className="grow">
                      <HybridInput
                        options={SUGGESTIONS.amenities}
                        value={newAmenity}
                        onChange={setNewAmenity}
                        onEnter={addHillStayAmenity}
                        placeholder="Type amenity or select..."
                      />
                  </div>
                  <Button onClick={() => addHillStayAmenity()} className="shrink-0"><Plus className="w-4 h-4 mr-2"/> Add</Button>
               </div>
               <div className="flex flex-wrap gap-2 mt-4">
                  {formData.listingDetails.hillStayAmenities?.length === 0 && <span className="text-sm text-gray-400 italic">No amenities added.</span>}
                  {formData.listingDetails.hillStayAmenities?.map((item, idx) => (
                    <Badge key={idx} className="bg-white border-blue-300 text-blue-900 hover:bg-blue-50 flex items-center gap-1 pl-3 py-1">
                       <CheckCircle className="w-3 h-3 text-blue-600"/> {item}
                       <button type="button" onClick={() => removeHillStayAmenity(idx)} className="ml-1 hover:text-red-600 focus:outline-none"><X className="w-3 h-3"/></button>
                    </Badge>
                  ))}
               </div>
            </div>

            {/* 2. Unique Features & Activities (Hill Stay Specifics) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Unique Features */}
                <div className="border p-4 rounded-md bg-white">
                  <Label className="text-amber-700 flex items-center gap-2 mb-2"><Sparkles className="h-4 w-4"/> Unique Features</Label>
                  <p className="text-[10px] text-gray-400 mb-2">e.g. Apple Orchard, 360° View</p>
                  <div className="flex gap-2">
                      <div className="grow">
                        <HybridInput 
                            options={SUGGESTIONS.hillUniqueFeatures}
                            value={newUniqueFeature}
                            onChange={setNewUniqueFeature}
                            placeholder="Type feature..."
                            onEnter={() => addStringItemToList('uniqueFeatures', newUniqueFeature, setNewUniqueFeature)}
                        />
                      </div>
                      <Button size="sm" onClick={() => addStringItemToList('uniqueFeatures', newUniqueFeature, setNewUniqueFeature)}><Plus className="w-4 h-4"/></Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-3">
                      {formData.listingDetails.uniqueFeatures?.map((item, idx) => (
                          <Badge key={idx} variant="outline" className="bg-amber-50 text-amber-800 border-amber-200">
                              {item} <button type="button" className="ml-1 hover:text-red-500 focus:outline-none" onClick={() => removeStringItemFromList('uniqueFeatures', idx)}><X className="w-3 h-3" /></button>
                          </Badge>
                      ))}
                  </div>
               </div>

               {/* Activities */}
               <div className="border p-4 rounded-md bg-white">
                  <Label className="text-green-700 flex items-center gap-2 mb-2"><Trees className="h-4 w-4"/> Nearby Activities</Label>
                   <p className="text-[10px] text-gray-400 mb-2">e.g. Bonfire, Nature Walk</p>
                  <div className="flex gap-2">
                      <div className="grow">
                        <HybridInput 
                            options={SUGGESTIONS.hillActivities}
                            value={newActivity}
                            onChange={setNewActivity}
                            placeholder="Type activity..."
                            onEnter={() => addStringItemToList('activities', newActivity, setNewActivity)}
                        />
                      </div>
                      <Button size="sm" onClick={() => addStringItemToList('activities', newActivity, setNewActivity)}><Plus className="w-4 h-4"/></Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-3">
                      {formData.listingDetails.activities?.map((item, idx) => (
                          <Badge key={idx} variant="outline" className="bg-green-50 text-green-800 border-green-200">
                              {item} <button type="button" className="ml-1 hover:text-red-500 focus:outline-none" onClick={() => removeStringItemFromList('activities', idx)}><X className="w-3 h-3" /></button>
                          </Badge>
                      ))}
                  </div>
               </div>
            </div>

            <Separator className="my-4"/>

            {/* 3. Rooms & Cottages */}
            {renderAccommodationRooms("Cottages, Rooms & Tents")}
          </div>
        );


      // ==========================
      // RESORT / HOTEL
      // ==========================
      case "resort-hotel":
        return (
          <div className="space-y-6">
             {/* General Hotel Amenities Section */}
            <div className="bg-slate-50 p-4 rounded-md border border-slate-200">
               <h3 className="text-lg font-bold text-slate-800 mb-2 flex items-center gap-2">
                 <Hotel className="w-5 h-5"/> Property Highlights & Amenities
               </h3>
               <p className="text-xs text-gray-500 mb-3">Add general features available at your property (e.g. WiFi, Parking, Pool).</p>
               
               <div className="flex gap-3">
                  <div className="grow">
                      <HybridInput
                        options={SUGGESTIONS.amenities}
                        value={newAmenity}
                        onChange={setNewAmenity}
                        onEnter={addHillStayAmenity}
                        placeholder="Type amenity or select (e.g. Free WiFi)..."
                      />
                  </div>
                  <Button onClick={() => addHillStayAmenity()} className="shrink-0"><Plus className="w-4 h-4 mr-2"/> Add</Button>
               </div>

               <div className="flex flex-wrap gap-2 mt-4">
                  {formData.listingDetails.hillStayAmenities?.length === 0 && (
                     <span className="text-sm text-gray-400 italic">No amenities added yet.</span>
                  )}
                  {formData.listingDetails.hillStayAmenities?.map((item, idx) => (
                    <Badge key={idx} className="bg-white border-slate-300 text-slate-700 hover:bg-slate-100 flex items-center gap-1 pl-3 py-1 text-sm shadow-sm">
                       {item.includes('Wifi') ? <Wifi className="w-3 h-3"/> : <CheckCircle className="w-3 h-3 text-green-500"/>}
                       {item}
                       <button type="button" onClick={() => removeHillStayAmenity(idx)} className="ml-1 p-0.5 hover:bg-red-100 hover:text-red-600 rounded-full transition-colors focus:outline-none">
                         <X className="w-3 h-3"/>
                       </button>
                    </Badge>
                  ))}
               </div>
            </div>

            <Separator className="my-4"/>

            {/* Room Management Section (Reused Helper) */}
            {renderAccommodationRooms("Rooms & Accommodation")}
          </div>
        );

      // ==========================
      // RENTAL BIKES 
      // ==========================
      case "rental-bikes":
        return (
          <div className="space-y-6">
            
            {/* 1. RENTAL POLICIES SECTION */}
            <div className="bg-blue-50 p-4 rounded-md border border-blue-200">
               <h3 className="text-lg font-bold text-blue-800 mb-4 flex items-center gap-2">
                 <Info className="h-5 w-5"/> Shop Policies & Rules
               </h3>
               
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Mileage */}
                  <div className="space-y-1">
                      <Label className="flex items-center gap-2"><Gauge className="h-4 w-4"/> Mileage Policy</Label>
                      <HybridInput
                          options={SUGGESTIONS.mileagePolicies}
                          value={formData.listingDetails.policies?.mileage}
                          onChange={(val) => updateBikePolicies("mileage", val)}
                          placeholder="e.g. Unlimited within city"
                      />
                  </div>
                  {/* Security Deposit */}
                  <div className="space-y-1">
                      <Label className="flex items-center gap-2"><ShieldCheck className="h-4 w-4"/> Security Deposit</Label>
                      <HybridInput
                          options={SUGGESTIONS.depositPolicies}
                          value={formData.listingDetails.policies?.securityDeposit}
                          onChange={(val) => updateBikePolicies("securityDeposit", val)}
                          placeholder="e.g. Original ID Required"
                      />
                  </div>
                  {/* Fuel Policy */}
                  <div className="space-y-1">
                      <Label className="flex items-center gap-2"><Fuel className="h-4 w-4"/> Fuel Policy</Label>
                      <HybridInput
                          options={SUGGESTIONS.fuelPolicies}
                          value={formData.listingDetails.policies?.fuelPolicy}
                          onChange={(val) => updateBikePolicies("fuelPolicy", val)}
                          placeholder="e.g. Return with same fuel"
                      />
                  </div>
                  {/* Delivery */}
                  <div className="space-y-1">
                      <Label className="flex items-center gap-2"><MapPin className="h-4 w-4"/> Delivery Policy</Label>
                      <HybridInput
                          options={SUGGESTIONS.deliveryPolicies}
                          value={formData.listingDetails.policies?.delivery}
                          onChange={(val) => updateBikePolicies("delivery", val)}
                          placeholder="e.g. Shop Pickup Only"
                      />
                  </div>
               </div>
            </div>

            {/* 2. SERVICES AND DOCUMENTS LISTS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               {/* Services */}
               <div className="border p-4 rounded-md bg-white">
                  <Label className="text-green-700 flex items-center gap-2 mb-2"><CheckCircle className="h-4 w-4"/> Services Included</Label>
                  <div className="flex gap-2">
                      <div className="grow">
                        <HybridInput 
                            options={SUGGESTIONS.bikeServices}
                            value={newBikeService}
                            onChange={setNewBikeService}
                            placeholder="e.g. Helmet"
                            onEnter={() => addBikeStringItem('services', newBikeService, setNewBikeService)}
                        />
                      </div>
                      <Button size="sm" onClick={() => addBikeStringItem('services', newBikeService, setNewBikeService)}><Plus className="w-4 h-4"/></Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-3">
                      {formData.listingDetails.services?.map((item, idx) => (
                          <Badge key={idx} variant="outline" className="bg-green-50 text-green-700 border-green-200">
                              {item}
                              <button type="button" className="ml-1 hover:text-red-500 focus:outline-none" onClick={() => removeBikeStringItem('services', idx)}><X className="w-3 h-3" /></button>
                          </Badge>
                      ))}
                  </div>
               </div>

               {/* Required Documents */}
               <div className="border p-4 rounded-md bg-white">
                  <Label className="text-red-700 flex items-center gap-2 mb-2"><FileCheck className="h-4 w-4"/> Required Documents</Label>
                  <div className="flex gap-2">
                      <div className="grow">
                        <HybridInput 
                            options={SUGGESTIONS.bikeDocuments}
                            value={newBikeDocument}
                            onChange={setNewBikeDocument}
                            placeholder="e.g. Valid License"
                            onEnter={() => addBikeStringItem('documents', newBikeDocument, setNewBikeDocument)}
                        />
                      </div>
                      <Button size="sm" onClick={() => addBikeStringItem('documents', newBikeDocument, setNewBikeDocument)}><Plus className="w-4 h-4"/></Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-3">
                      {formData.listingDetails.documents?.map((item, idx) => (
                          <Badge key={idx} variant="outline" className="bg-red-50 text-red-700 border-red-200">
                              {item}
                              <button type="button" className="ml-1 hover:text-red-500 focus:outline-none" onClick={() => removeBikeStringItem('documents', idx)}><X className="w-3 h-3" /></button>
                          </Badge>
                      ))}
                  </div>
               </div>
            </div>

            <Separator className="my-2"/>

            {/* 3. DETAILED FLEET INVENTORY */}
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Bike className="w-6 h-6"/> Available Fleet
              </h3>
              {/* Init with fuller object for all bike details */}
              <Button onClick={() => addToArray('bikes', { id: Date.now(), name: "", type: "", price: "", brand: "", engine: "", mileage: "", year: "" })} size="sm">
                <Plus className="w-4 h-4 mr-2" />Add Bike Model
              </Button>
            </div>

            {formData.listingDetails.bikes.length === 0 ? (
                <div className="text-center p-8 border-2 border-dashed border-gray-200 rounded-lg text-gray-500">
                   Click "Add Bike Model" to list your available scooters and bikes.
                </div>
            ) : (
             formData.listingDetails.bikes.map(bike => (
              <Card key={bike.id} className="relative overflow-visible z-10 shadow-sm border border-gray-200">
                <CardHeader className="bg-gray-50/80 pb-2 border-b">
                     <div className="flex justify-between items-center">
                        <h4 className="font-bold text-gray-700 text-sm flex items-center gap-2"><Bike className="w-4 h-4"/> Vehicle Details</h4>
                        <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600 hover:bg-red-50" onClick={() => deleteFromArray("bikes", bike.id)}>
                            <Trash2 className="w-4 h-4 mr-2" />Remove
                        </Button>
                     </div>
                </CardHeader>
                <CardContent className="p-4 space-y-4">
                  
                  {/* Row 1: Primary Info (Name, Type, Rent) */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-1">
                        <Label className="text-xs">Model Name *</Label>
                        <HybridInput 
                            placeholder="e.g. Royal Enfield Classic 350" 
                            options={SUGGESTIONS.bikeModels}
                            value={bike.name} 
                            onChange={val => updateNestedArray("bikes", bike.id, "name", val)} 
                        />
                    </div>
                    <div className="space-y-1">
                        <Label className="text-xs">Category/Type *</Label>
                        <HybridInput 
                            placeholder="e.g. Cruiser, Scooter" 
                            options={SUGGESTIONS.bikeTypes}
                            value={bike.type} 
                            onChange={val => updateNestedArray("bikes", bike.id, "type", val)} 
                        />
                    </div>
                    <div className="space-y-1">
                        <Label className="text-xs font-bold text-primary">Daily Rent (₹) *</Label>
                        <HybridInput 
                            placeholder="e.g. 1200"
                            options={SUGGESTIONS.bikePricing} 
                            value={bike.price} 
                            onChange={val => updateNestedArray("bikes", bike.id, "price", val)} 
                        />
                    </div>
                  </div>

                  {/* Row 2: Tech Specs (Brand, Engine, Mileage, Year) - Specific Request */}
                  <div className="bg-gray-50 p-3 rounded border border-gray-100 grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="space-y-1">
                          <Label className="text-[10px] uppercase text-gray-500 flex gap-1 items-center"><Zap className="w-3 h-3"/> Brand</Label>
                          <Input 
                             className="h-8 text-xs bg-white" 
                             placeholder="e.g. Royal Enfield" 
                             value={bike.brand} 
                             onChange={(e) => updateNestedArray("bikes", bike.id, "brand", e.target.value)} 
                          />
                      </div>
                      <div className="space-y-1">
                          <Label className="text-[10px] uppercase text-gray-500 flex gap-1 items-center"><Settings className="w-3 h-3"/> Engine (cc)</Label>
                          <Input 
                             className="h-8 text-xs bg-white" 
                             placeholder="e.g. 350cc" 
                             value={bike.engine} 
                             onChange={(e) => updateNestedArray("bikes", bike.id, "engine", e.target.value)} 
                          />
                      </div>
                      <div className="space-y-1">
                          <Label className="text-[10px] uppercase text-gray-500 flex gap-1 items-center"><Fuel className="w-3 h-3"/> Avg. Mileage</Label>
                          <Input 
                             className="h-8 text-xs bg-white" 
                             placeholder="e.g. 35 kmpl" 
                             value={bike.mileage} 
                             onChange={(e) => updateNestedArray("bikes", bike.id, "mileage", e.target.value)} 
                          />
                      </div>
                      <div className="space-y-1">
                          <Label className="text-[10px] uppercase text-gray-500 flex gap-1 items-center"><Calendar className="w-3 h-3"/> Model Year</Label>
                          <Input 
                             type="number"
                             className="h-8 text-xs bg-white" 
                             placeholder="e.g. 2023" 
                             value={bike.year} 
                             onChange={(e) => updateNestedArray("bikes", bike.id, "year", e.target.value)} 
                          />
                      </div>
                  </div>
                </CardContent>
              </Card>
            ))
            )}
          </div>
        );

      // ==========================
      // CABS & TAXIS
      // ==========================
      case "cabs-taxis":
        const { cabData } = formData.listingDetails;
        return (
          <div className="space-y-6">
            
            {/* 1. PRICING & RATES (Modified with Hybrid Inputs) */}
            <div className="bg-orange-50 p-4 rounded-md border border-orange-100">
              <h3 className="text-lg font-bold text-orange-800 mb-4 flex items-center gap-2">
                <IndianRupee className="h-5 w-5" /> Standard Pricing & Rates
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label className="text-xs font-semibold text-gray-600">Local Rate (per km) *</Label>
                  <HybridInput 
                      placeholder="e.g. 20" 
                      value={cabData.pricing?.local} 
                      onChange={(e) => updateCabPricing("local", e)} 
                      options={["15", "18", "20", "22", "25", "30", "On Request"]}
                  />
                </div>
                <div>
                  <Label className="text-xs font-semibold text-gray-600">Outstation Rate (per km) *</Label>
                  <HybridInput 
                      placeholder="e.g. 15" 
                      value={cabData.pricing?.outstation} 
                      onChange={(e) => updateCabPricing("outstation", e)}
                      options={["12", "14", "15", "18", "20", "On Request"]}
                  />
                </div>
                <div>
                  <Label className="text-xs font-semibold text-gray-600">Airport Drop (Fixed)</Label>
                  <HybridInput 
                      placeholder="e.g. 2500" 
                      value={cabData.pricing?.airport} 
                      onChange={(e) => updateCabPricing("airport", e)}
                      options={["1500", "2000", "2500", "3000", "3500", "4000", "On Request"]} 
                  />
                </div>
              </div>
            </div>

            {/* 2. FLEET INVENTORY (Cars & Drivers - Enhanced for Detail View) */}
            <div className="border rounded-md p-4 bg-white shadow-sm">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold flex items-center gap-2 text-slate-800"><Car className="h-5 w-5" /> Fleet & Drivers (Detailed Inventory)</h3>
                    <Badge variant="outline">{formData.listingDetails.vehicles.length} Vehicles</Badge>
                </div>
                
                <p className="text-xs text-gray-500 mb-3">Add specific cars and optionally the drivers assigned to them. These details appear on your specific cab detail page.</p>

                {/* Add New Vehicle Input Group */}
                <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 bg-gray-50 p-3 rounded mb-4 border border-gray-100 items-end">
                    <div className="sm:col-span-1">
                        <Label className="text-xs">Type</Label>
                        <HybridInput
                            className="h-9 bg-white"
                            placeholder="Category"
                            options={["Hatchback", "Sedan", "SUV", "Tempo Traveller", "Luxury"]}
                            value={newVehicleInv.type}
                            onChange={(val) => setNewVehicleInv({...newVehicleInv, type: val})}
                        />
                    </div>
                    <div className="sm:col-span-2">
                        <Label className="text-xs">Model Name *</Label>
                        <Input 
                            placeholder="e.g. Toyota Innova Crysta" 
                            className="h-9 bg-white"
                            value={newVehicleInv.name} 
                            onChange={e => setNewVehicleInv({...newVehicleInv, name: e.target.value})}
                        />
                    </div>
                    <div className="sm:col-span-1">
                        <Label className="text-xs">Rate (₹/km) *</Label>
                        <Input 
                            placeholder="e.g. 18" 
                            type="number"
                            className="h-9 bg-white"
                            value={newVehicleInv.rate} 
                            onChange={e => setNewVehicleInv({...newVehicleInv, rate: e.target.value})}
                        />
                    </div>
                    <div className="sm:col-span-1 flex items-end">
                         {/* Button aligned at bottom */}
                    </div>
                </div>
                
                {/* Additional Optional Driver Fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 px-3 mb-3">
                    <div>
                        <Label className="text-xs flex items-center gap-1"><User className="w-3 h-3"/> Driver Name (Optional)</Label>
                        <Input 
                            placeholder="e.g. Amit Kumar" 
                            className="h-9 bg-white"
                            value={newVehicleInv.driverName}
                            onChange={e => setNewVehicleInv({...newVehicleInv, driverName: e.target.value})}
                        />
                    </div>
                    <div>
                        <Label className="text-xs flex items-center gap-1"><Phone className="w-3 h-3"/> Driver Phone (Optional)</Label>
                        <Input 
                            placeholder="e.g. 9876543210" 
                            className="h-9 bg-white"
                            value={newVehicleInv.driverPhone}
                            onChange={e => setNewVehicleInv({...newVehicleInv, driverPhone: e.target.value})}
                        />
                    </div>
                </div>
                
                <div className="px-3 pb-3">
                    <Button onClick={addVehicleToInventory} size="sm" className="w-full sm:w-auto"><Plus className="w-4 h-4 mr-1" /> Add Vehicle to Fleet</Button>
                </div>

                {/* List of Added Inventory */}
                <div className="space-y-2 mt-4 border-t pt-3">
                    {formData.listingDetails.vehicles.length === 0 ? (
                        <p className="text-sm text-gray-400 text-center py-2 italic">No vehicles added yet.</p>
                    ) : (
                        formData.listingDetails.vehicles.map(vehicle => (
                            <div key={vehicle.id} className="flex justify-between items-center border p-3 rounded-lg hover:bg-slate-50 transition bg-white shadow-sm">
                                <div className="flex items-center gap-3">
                                    <div className="bg-orange-100 p-2 rounded-full text-orange-600"><Car className="w-4 h-4"/></div>
                                    <div>
                                        <p className="font-bold text-sm text-slate-800">{vehicle.name} <span className="text-slate-500 font-normal text-xs">({vehicle.type})</span></p>
                                        <div className="flex gap-3 text-xs text-gray-500 mt-0.5">
                                            <span>Rate: <strong>₹{vehicle.rate}/km</strong></span>
                                            {vehicle.driverName && <span className="flex items-center gap-1"><User className="w-3 h-3"/> {vehicle.driverName}</span>}
                                        </div>
                                    </div>
                                </div>
                                <Button variant="ghost" size="icon" className="text-red-500 hover:bg-red-50 hover:text-red-700" onClick={() => deleteFromArray("vehicles", vehicle.id)}>
                                    <Trash2 className="w-4 h-4"/>
                                </Button>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* 3. DETAILS & TAGS (Categories, Services, Specializations) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* General Categories (Tags) */}
                <div className="border p-3 rounded-md bg-white">
                  <Label className="flex items-center gap-2 mb-2"><Car className="h-4 w-4"/> Vehicle Categories Available</Label>
                  <div className="flex gap-2 mb-2">
                    <div className="grow">
                        <HybridInput 
                            options={SUGGESTIONS.cabVehicleTypes}
                            placeholder="Select or Type (e.g. Sedan)" 
                            value={newCabTag.vehicle} 
                            onChange={(v) => setNewCabTag({...newCabTag, vehicle: v})} 
                            onEnter={() => addCabArrayItem("availableVehicleTypes", newCabTag.vehicle, "vehicle")}
                        />
                    </div>
                    <Button size="sm" onClick={() => addCabArrayItem("availableVehicleTypes", newCabTag.vehicle, "vehicle")}>
                        <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2 min-h-[30px]">
                    {cabData.availableVehicleTypes?.map((item, i) => (
                      <Badge key={i} variant="secondary" className="pr-1 flex items-center gap-1">
                        {item} 
                        <button type="button" className="ml-1 hover:text-red-600 focus:outline-none" onClick={() => removeCabArrayItem("availableVehicleTypes", i)}><X className="w-3 h-3" /></button>
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Services Offered */}
                <div className="border p-3 rounded-md bg-white">
                  <Label className="flex items-center gap-2 mb-2"><Zap className="h-4 w-4 text-blue-600"/> Services Offered</Label>
                  <div className="flex gap-2 mb-2">
                    <div className="grow">
                        <HybridInput 
                            options={SUGGESTIONS.cabServices}
                            placeholder="Select or Type (e.g. Airport Transfer)" 
                            value={newCabTag.service} 
                            onChange={(v) => setNewCabTag({...newCabTag, service: v})} 
                            onEnter={() => addCabArrayItem("services", newCabTag.service, "service")}
                        />
                    </div>
                    <Button size="sm" onClick={() => addCabArrayItem("services", newCabTag.service, "service")}>
                        <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2 min-h-[30px]">
                    {cabData.services?.map((item, i) => (
                      <Badge key={i} variant="outline" className="pr-1 bg-blue-50 flex items-center gap-1 text-blue-700 border-blue-200">
                        {item} 
                        <button type="button" className="ml-1 hover:text-red-600 focus:outline-none" onClick={() => removeCabArrayItem("services", i)}><X className="w-3 h-3" /></button>
                      </Badge>
                    ))}
                  </div>
                </div>

                 {/* Specializations */}
                 <div className="border p-3 rounded-md bg-white md:col-span-2">
                  <Label className="flex items-center gap-2 mb-2"><Award className="h-4 w-4 text-amber-600"/> Specializations / Features</Label>
                  <div className="flex gap-2 mb-2">
                     <div className="grow">
                        <HybridInput 
                            options={SUGGESTIONS.cabSpecializations}
                            placeholder="e.g. 24/7 Service, English Speaking Driver" 
                            value={newCabTag.spec} 
                            onChange={(v) => setNewCabTag({...newCabTag, spec: v})} 
                            onEnter={() => addCabArrayItem("specializations", newCabTag.spec, "spec")}
                        />
                     </div>
                    <Button size="sm" onClick={() => addCabArrayItem("specializations", newCabTag.spec, "spec")}><Plus className="w-4 h-4" /></Button>
                  </div>
                  <div className="flex flex-wrap gap-2 min-h-[30px]">
                    {cabData.specializations?.map((item, i) => (
                      <Badge key={i} variant="outline" className="pr-1 bg-amber-50 flex items-center gap-1 text-amber-800 border-amber-200">
                        {item} 
                        <button type="button" className="ml-1 hover:text-red-600 focus:outline-none" onClick={() => removeCabArrayItem("specializations", i)}><X className="w-3 h-3" /></button>
                      </Badge>
                    ))}
                  </div>
                </div>
            </div>
          </div>
        );

        // ==========================
        // TOURS & TREKS (FULLY UPDATED)
        // ==========================
        case "tours-treks":
        const { tourData } = formData.listingDetails;
        return (
          <div className="space-y-6">
            <div className="bg-green-50 p-4 rounded-md border border-green-200">
               <h3 className="text-lg font-bold text-green-900 mb-4 flex items-center gap-2">
                 <Mountain className="w-5 h-5"/> Trek & Tour Configuration
               </h3>
               
               {/* CORE DETAILS ROW 1 */}
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="space-y-1">
                      <Label>Difficulty Level *</Label>
                      <HybridInput 
                          placeholder="e.g. Moderate" 
                          options={SUGGESTIONS.tourDifficulties}
                          value={tourData.difficulty} 
                          onChange={(val) => updateTourField("difficulty", val)} 
                      />
                  </div>
                  <div className="space-y-1">
                      <Label>Tour Type *</Label>
                      <HybridInput 
                          placeholder="e.g. Day Trip" 
                          options={SUGGESTIONS.tourTypes}
                          value={tourData.type} 
                          onChange={(val) => updateTourField("type", val)} 
                      />
                  </div>
               </div>
               
               {/* CORE DETAILS ROW 2 */}
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                   <div className="space-y-1">
                       <Label className="flex items-center gap-2"><Clock className="w-3 h-3"/> Duration</Label>
                       <HybridInput 
                           placeholder="e.g. 3 Days / 2 Nights" 
                           options={SUGGESTIONS.tourDurations}
                           value={tourData.duration} 
                           onChange={(val) => updateTourField("duration", val)} 
                       />
                   </div>
                   <div className="space-y-1">
                       <Label className="flex items-center gap-2"><Users className="w-3 h-3"/> Max Group Size</Label>
                       {/* Reusing HybridInput structure for consistency even for numeric types */}
                       <HybridInput 
                           placeholder="10"
                           options={SUGGESTIONS.guideGroupSize} 
                           value={tourData.maxGroupSize} 
                           onChange={(val) => updateTourField("maxGroupSize", val)} 
                       />
                   </div>
               </div>

                {/* ADDITIONAL INFO */}
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   <div className="space-y-1">
                       <Label className="flex items-center gap-2"><Activity className="w-3 h-3"/> Fitness Level Required</Label>
                       <HybridInput 
                           placeholder="e.g. Moderate Fitness Required" 
                           options={SUGGESTIONS.tourFitness}
                           value={tourData.fitnessLevel} 
                           onChange={(val) => updateTourField("fitnessLevel", val)} 
                       />
                   </div>
                   <div className="space-y-1">
                       <Label className="flex items-center gap-2"><Calendar className="w-3 h-3"/> Best Time to Visit</Label>
                       <HybridInput 
                           placeholder="e.g. March to June, Sep to Nov"
                           options={SUGGESTIONS.tourSeasons}
                           value={tourData.bestTime} 
                           onChange={(val) => updateTourField("bestTime", val)} 
                       />
                   </div>
               </div>
            </div>

            {/* LISTS: INCLUDES & EXCLUDES */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border p-4 rounded-md bg-white">
                  <Label className="text-green-700 flex items-center gap-2 mb-2"><CheckCircle className="h-4 w-4"/> Inclusions</Label>
                  <div className="flex gap-2 mb-2">
                    <div className="grow">
                      <HybridInput 
                        placeholder="e.g. Meals, Stay, Guide" 
                        options={SUGGESTIONS.tourIncludes}
                        value={newInclude}
                        onChange={setNewInclude}
                        onEnter={() => addTourArrayItem('includes', newInclude, setNewInclude)}
                      />
                    </div>
                    <Button size="sm" onClick={() => addTourArrayItem('includes', newInclude, setNewInclude)}><Plus className="w-4 h-4"/></Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                     {tourData.includes?.map((item, i) => (
                       <Badge key={i} variant="outline" className="border-green-300 bg-green-50 text-green-800 pr-1 flex items-center">
                          {item}
                          <button type="button" className="w-3 h-3 ml-1 cursor-pointer focus:outline-none" onClick={() => removeTourArrayItem('includes', i)}><X className="w-3 h-3" /></button>
                       </Badge>
                     ))}
                  </div>
                </div>

                <div className="border p-4 rounded-md bg-white">
                  <Label className="text-red-700 flex items-center gap-2 mb-2"><XCircle className="h-4 w-4"/> Exclusions</Label>
                  <div className="flex gap-2 mb-2">
                    <div className="grow">
                      <HybridInput 
                        placeholder="e.g. Personal Porter, Alcohol" 
                        options={SUGGESTIONS.tourExcludes}
                        value={newExclude}
                        onChange={setNewExclude}
                        onEnter={() => addTourArrayItem('excludes', newExclude, setNewExclude)}
                      />
                    </div>
                    <Button size="sm" onClick={() => addTourArrayItem('excludes', newExclude, setNewExclude)}><Plus className="w-4 h-4"/></Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                     {tourData.excludes?.map((item, i) => (
                       <Badge key={i} variant="outline" className="border-red-300 bg-red-50 text-red-800 pr-1 flex items-center">
                          {item}
                          <button type="button" className="w-3 h-3 ml-1 cursor-pointer focus:outline-none" onClick={() => removeTourArrayItem('excludes', i)}><X className="w-3 h-3" /></button>
                       </Badge>
                     ))}
                  </div>
                </div>
            </div>

            <Separator />

            {/* ITINERARY BUILDER (UPDATED TO USE HYBRID INPUTS) */}
            <div className="bg-slate-50 border border-slate-200 rounded-md p-4">
                <div className="flex justify-between items-center mb-4">
                   <h3 className="font-bold flex items-center gap-2 text-slate-800"><MapPin className="h-5 w-5"/> Itinerary Builder</h3>
                   <Badge>Day {(tourData.itinerary?.length || 0) + 1}</Badge>
                </div>

                <div className="grid grid-cols-1 gap-4 mb-4 bg-white p-4 rounded shadow-sm border border-slate-100">
                    <div>
                        <Label>Day Title *</Label>
                        <HybridInput 
                            placeholder="e.g. Arrival at Base Camp"
                            options={SUGGESTIONS.tourItineraryTitles}
                            value={tourItineraryDay.title}
                            onChange={(val) => setTourItineraryDay({...tourItineraryDay, title: val})}
                        />
                    </div>
                    <div>
                        <Label className="flex items-center gap-2"><Activity className="w-3 h-3"/> Activities (Comma separated)</Label>
                        <HybridInput 
                            placeholder="e.g. Acclimatization walk, Bonfire, Orientation"
                            options={SUGGESTIONS.tourActivities}
                            value={tourItineraryDay.activities}
                            onChange={(val) => setTourItineraryDay({...tourItineraryDay, activities: val})}
                        />
                    </div>
                    <div>
                        <Label className="flex items-center gap-2"><Utensils className="w-3 h-3"/> Meals (Comma separated)</Label>
                        <HybridInput 
                            placeholder="e.g. Breakfast, Packed Lunch, Dinner"
                            options={SUGGESTIONS.tourMeals}
                            value={tourItineraryDay.meals}
                            onChange={(val) => setTourItineraryDay({...tourItineraryDay, meals: val})}
                        />
                    </div>
                    <Button onClick={addTourItineraryDay} variant="secondary" className="w-full sm:w-auto"><Plus className="w-4 h-4 mr-2"/> Add Day Plan</Button>
                </div>

                {/* Display Added Itinerary */}
                <div className="space-y-2">
                    {tourData.itinerary?.length === 0 ? (
                        <p className="text-gray-400 italic text-sm text-center">No itinerary days added yet.</p>
                    ) : (
                        tourData.itinerary.map((day, idx) => (
                           <div key={idx} className="flex justify-between items-start bg-white p-3 rounded border border-gray-200 shadow-sm relative pl-10 overflow-hidden">
                              <div className="absolute left-0 top-0 bottom-0 w-8 bg-slate-200 flex items-center justify-center font-bold text-slate-600 text-xs">
                                  D{day.day}
                              </div>
                              <div className="grow px-2">
                                  <h4 className="font-bold text-sm text-slate-800">{day.title}</h4>
                                  <div className="text-xs text-gray-500 mt-1 space-y-0.5">
                                      {day.activities.length > 0 && <p><span className="font-semibold">Activities:</span> {day.activities.join(', ')}</p>}
                                      {day.meals.length > 0 && <p><span className="font-semibold text-orange-600">Meals:</span> {day.meals.join(', ')}</p>}
                                  </div>
                              </div>
                              <Button variant="ghost" size="icon" className="text-red-500 h-8 w-8 hover:bg-red-50" onClick={() => removeTourItineraryDay(idx)}>
                                  <Trash2 className="w-4 h-4" />
                              </Button>
                           </div>
                        ))
                    )}
                </div>
            </div>
            
            {/* Price Preview / Pricing Field for Tours is Standard */}
             <div className="bg-blue-50/50 p-4 rounded-md border border-blue-100">
               <Label className="text-blue-900 font-bold">Total Price Per Person (₹)</Label>
               <Input 
                  type="number" 
                  placeholder="e.g. 5000" 
                  className="bg-white mt-1 border-blue-200"
                  name="price"
                  value={formData.price}
                  onChange={handleFormChange}
               />
               <p className="text-xs text-blue-600 mt-1">This is the base price displayed on the card.</p>
             </div>
          </div>
        );

      case "local-guides":
          const { guideData } = formData.listingDetails;
          return (
              <div className="space-y-6">
                  <div className="bg-purple-50 p-4 rounded-md border border-purple-100">
                      <h3 className="text-lg font-bold text-purple-900 mb-4 flex items-center gap-2">
                          <Award className="w-5 h-5"/> Guide Details
                      </h3>
                      
                      {/* Basic Stats Row (ALL HYBRID AND REQUIRED) */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                          <div>
                              <Label className="text-purple-900">Daily Rate (Full Day) *</Label>
                              <div className="relative">
                                  {/* Using Hybrid for Price with suggestions */}
                                  <HybridInput
                                      options={SUGGESTIONS.guidePricing}
                                      value={formData.price}
                                      onChange={(val) => handleFormChange({target: {name: "price", value: val}})} 
                                      placeholder="e.g. 1500"
                                      className="w-full"
                                  />
                              </div>
                          </div>
                          <div>
                              <Label className="text-purple-900">Experience (Years) *</Label>
                              {/* Using Hybrid for Experience */}
                              <HybridInput 
                                  options={SUGGESTIONS.guideExperience}
                                  value={guideData.experience} 
                                  onChange={(val) => updateGuideField("experience", val)} 
                                  placeholder="e.g. 5" 
                              />
                          </div>
                          <div>
                              <Label className="text-purple-900">Max Group Size *</Label>
                              {/* Using Hybrid for Group Size */}
                              <HybridInput 
                                  options={SUGGESTIONS.guideGroupSize}
                                  value={guideData.maxGroupSize} 
                                  onChange={(val) => updateGuideField("maxGroupSize", val)} 
                                  placeholder="e.g. 10" 
                              />
                          </div>
                      </div>

                      {/* Languages - Hybrid Add Input */}
                      <div className="mb-4 bg-white p-3 rounded border">
                          <Label className="flex items-center gap-2 mb-2"><LangIcon className="w-4 h-4"/> Languages Spoken *</Label>
                          <div className="flex gap-2">
                              <div className="grow">
                                  <HybridInput 
                                      placeholder="Type or select Language (e.g. English, Kumaoni)" 
                                      options={SUGGESTIONS.guideLanguages}
                                      value={newGuideTag.lang} 
                                      onChange={(val) => setNewGuideTag({...newGuideTag, lang: val})} 
                                      onEnter={() => addGuideArrayItem("languages", newGuideTag.lang, "lang")}
                                  />
                              </div>
                              <Button size="sm" onClick={() => addGuideArrayItem("languages", newGuideTag.lang, "lang")}><Plus className="w-4 h-4"/></Button>
                          </div>
                          <div className="flex flex-wrap gap-2 mt-2">
                              {guideData.languages?.map((lang, idx) => (
                                  <Badge key={idx} variant="outline" className="bg-gray-50 flex items-center gap-1">
                                      {lang} 
                                      <button
                                          type="button"
                                          className="cursor-pointer hover:text-red-500 hover:bg-red-50 rounded-full p-0.5 focus:outline-none" 
                                          onClick={() => removeGuideArrayItem("languages", idx)} 
                                      >
                                        <X className="w-3 h-3" />
                                      </button>
                                  </Badge>
                              ))}
                          </div>
                      </div>

                      {/* Specializations - Hybrid Add Input */}
                      <div className="mb-4 bg-white p-3 rounded border">
                          <Label className="flex items-center gap-2 mb-2"><Award className="w-4 h-4"/> Specializations / Expertise *</Label>
                          <div className="flex gap-2">
                              <div className="grow">
                                  <HybridInput 
                                      placeholder="Type or select (e.g. Bird Watching)" 
                                      options={SUGGESTIONS.guideSpecializations}
                                      value={newGuideTag.spec} 
                                      onChange={(val) => setNewGuideTag({...newGuideTag, spec: val})} 
                                      onEnter={() => addGuideArrayItem("specializations", newGuideTag.spec, "spec")}
                                  />
                              </div>
                              <Button size="sm" onClick={() => addGuideArrayItem("specializations", newGuideTag.spec, "spec")}><Plus className="w-4 h-4"/></Button>
                          </div>
                          <div className="flex flex-wrap gap-2 mt-2">
                              {guideData.specializations?.map((feature, idx) => (
                                  <Badge key={idx} variant="secondary" className="bg-purple-100 text-purple-800 flex items-center gap-1">
                                      {feature} 
                                      <button 
                                          type="button"
                                          className="cursor-pointer hover:text-red-500 hover:bg-red-50 rounded-full p-0.5 focus:outline-none" 
                                          onClick={() => removeGuideArrayItem("specializations", idx)} 
                                      >
                                        <X className="w-3 h-3" />
                                      </button>
                                  </Badge>
                              ))}
                          </div>
                      </div>

                      {/* Sample Itinerary Builder for Guides (Hybrid Fields) */}
                      <div className="border p-4 rounded-md bg-white">
                          <div className="flex justify-between items-center mb-4">
                              <h3 className="font-semibold flex items-center gap-2">
                                  <Calendar className="w-4 h-4" /> Sample Itinerary Builder *
                              </h3>
                              <Badge variant="secondary">Day {(guideData.itinerary?.length || 0) + 1}</Badge>
                          </div>
                          <p className="text-xs text-gray-500 mb-3">Add sample days to show clients what a typical tour looks like.</p>
                          
                          <div className="space-y-3 bg-gray-50 p-4 rounded border">
                              <div>
                                  <Label>Day Title *</Label>
                                  <HybridInput 
                                      options={SUGGESTIONS.guideItineraryTitles}
                                      value={guideItineraryDay.title} 
                                      onChange={(val) => setGuideItineraryDay({...guideItineraryDay, title: val})} 
                                      placeholder="e.g. Full Day Lake Tour" 
                                  />
                              </div>
                              <div>
                                  <Label>Activities (comma separated) *</Label>
                                  <HybridInput 
                                      options={SUGGESTIONS.guideActivities}
                                      value={guideItineraryDay.activities} 
                                      onChange={(val) => setGuideItineraryDay({...guideItineraryDay, activities: val})} 
                                      placeholder="Boating, Lunch at Mall Road, Ropeway view" 
                                  />
                              </div>
                              <Button onClick={addGuideItineraryDay} className="w-full mt-2" variant="outline" size="sm">
                                  <Plus className="w-4 h-4 mr-2" />Add Sample Day
                              </Button>
                          </div>
                          
                          <div className="mt-4 space-y-2">
                              {guideData.itinerary?.map((day, idx) => (
                                  <div key={idx} className="flex justify-between items-center bg-white border p-3 rounded shadow-sm">
                                      <div>
                                          <span className="font-semibold block text-sm">Day {day.day}: {day.title}</span>
                                          <span className="text-xs text-gray-500 block">{day.activities.join(', ')}</span>
                                      </div>
                                      <Button variant="ghost" size="sm" className="text-red-500 hover:bg-red-50" onClick={() => removeGuideItineraryDay(idx)}>
                                          <Trash2 className="w-4 h-4"/>
                                      </Button>
                                  </div>
                              ))}
                          </div>
                      </div>
                  </div>
              </div>
          );
      
      // Default / Other - General Services
      case "other":
        const { generalServiceData } = formData.listingDetails;
        return (
          <div className="space-y-6">
             <div className="bg-slate-50 p-4 rounded-md border border-slate-200">
                <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <Wrench className="w-5 h-5"/> Service Details
                </h3>

                {/* Core Service Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="space-y-1">
                        <Label>Service Type *</Label>
                        <HybridInput 
                            placeholder="e.g. Photographer, Mechanic" 
                            options={SUGGESTIONS.generalServiceTypes}
                            value={generalServiceData.serviceType} 
                            onChange={(val) => updateGenServiceField("serviceType", val)} 
                        />
                    </div>
                    <div className="space-y-1">
                        <Label>Experience (Years) *</Label>
                        <HybridInput 
                            placeholder="e.g. 5 Years" 
                            options={SUGGESTIONS.guideExperience} 
                            value={generalServiceData.experience} 
                            onChange={(val) => updateGenServiceField("experience", val)} 
                        />
                    </div>
                </div>

                {/* Availability & Price */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                     <div className="space-y-1">
                         <Label className="flex items-center gap-2"><Clock className="w-3 h-3"/> Availability *</Label>
                         <HybridInput 
                             placeholder="e.g. 9 AM - 6 PM" 
                             options={SUGGESTIONS.generalAvailability}
                             value={generalServiceData.availability} 
                             onChange={(val) => updateGenServiceField("availability", val)} 
                         />
                     </div>
                     <div className="space-y-1">
                         <Label className="flex items-center gap-2"><IndianRupee className="w-3 h-3"/> Base Visit Charge *</Label>
                         <Input 
                             type="number" 
                             placeholder="e.g. 500" 
                             className="bg-white"
                             value={formData.price}
                             name="price"
                             onChange={handleFormChange}
                         />
                         <p className="text-[10px] text-gray-500 mt-1">Starting price or visit charge</p>
                     </div>
                </div>
             </div>

             {/* Lists: Services & Specializations */}
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 {/* Specific Services */}
                 <div className="border p-4 rounded-md bg-white">
                    <Label className="text-slate-700 flex items-center gap-2 mb-2"><Hammer className="h-4 w-4"/> Services Offered</Label>
                    <div className="flex gap-2 mb-2">
                        <div className="grow">
                            <HybridInput 
                                placeholder="e.g. Home Visit, Repairs" 
                                options={SUGGESTIONS.generalServices}
                                value={newGenService}
                                onChange={setNewGenService}
                                onEnter={() => addGenServiceArrayItem("services", newGenService, setNewGenService)}
                            />
                        </div>
                        <Button size="sm" onClick={() => addGenServiceArrayItem("services", newGenService, setNewGenService)}><Plus className="w-4 h-4"/></Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {generalServiceData.services?.map((item, i) => (
                            <Badge key={i} variant="outline" className="border-slate-300 bg-slate-50 text-slate-800 pr-1 flex items-center">
                                {item}
                                <button type="button" className="w-3 h-3 ml-1 cursor-pointer focus:outline-none" onClick={() => removeGenServiceArrayItem('services', i)}><X className="w-3 h-3" /></button>
                            </Badge>
                        ))}
                    </div>
                 </div>

                 {/* Specializations */}
                 <div className="border p-4 rounded-md bg-white">
                    <Label className="text-blue-700 flex items-center gap-2 mb-2"><Briefcase className="h-4 w-4"/> Specializations</Label>
                    <div className="flex gap-2 mb-2">
                        <div className="grow">
                            <HybridInput 
                                placeholder="e.g. Wedding Photography, Engine Specialist" 
                                value={newGenSpec}
                                onChange={setNewGenSpec}
                                onEnter={() => addGenServiceArrayItem("specializations", newGenSpec, setNewGenSpec)}
                            />
                        </div>
                        <Button size="sm" onClick={() => addGenServiceArrayItem("specializations", newGenSpec, setNewGenSpec)}><Plus className="w-4 h-4"/></Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {generalServiceData.specializations?.map((item, i) => (
                            <Badge key={i} variant="outline" className="border-blue-300 bg-blue-50 text-blue-800 pr-1 flex items-center">
                                {item}
                                <button type="button" className="w-3 h-3 ml-1 cursor-pointer focus:outline-none" onClick={() => removeGenServiceArrayItem('specializations', i)}><X className="w-3 h-3" /></button>
                            </Badge>
                        ))}
                    </div>
                 </div>
             </div>
          </div>
        );

      default:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Listing Details</h3>
            <div>
              <Label>Service Rate</Label>
              <div className="relative">
                 <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">₹</span>
                 <Input className="pl-7" type="number" placeholder="800" name="price" value={formData.price} onChange={handleFormChange} />
              </div>
            </div>
          </div>
        );
    }
  };

  // --- 9. PRICE PREVIEW LOGIC ---
  const getPreviewPrice = () => {
    if ((globalProfession === "resort-hotel" || globalProfession === "hill-stays") && formData.listingDetails.rooms.length > 0) return `₹${formData.listingDetails.rooms[0].price || "---"}/night`;
    if (globalProfession === "rental-bikes" && formData.listingDetails.bikes.length > 0) return `₹${formData.listingDetails.bikes[0].price || "---"}/day`;
    if (globalProfession === "cabs-taxis") {
        if (formData.listingDetails.cabData.pricing.local) return `₹${formData.listingDetails.cabData.pricing.local}/km`;
        return "N/A";
    }
    if (globalProfession === "local-guides" || globalProfession === "tours-treks" || globalProfession === "other") {
        return `₹${formData.price || "---"}`;
    }
    if (formData.price) return `₹${formData.price}`;
    return "N/A";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold">Owner Dashboard</h1>
            <p className="text-muted-foreground capitalize">Manage your {globalProfession?.replace('-', ' ')} listings</p>
          </div>
          <div className="flex items-center gap-3">
            <span className={`text-sm font-medium flex items-center gap-1 ${syncStatus === 'synced' ? 'text-green-600' : syncStatus === 'syncing' ? 'text-blue-600' : 'text-gray-500'}`}>
              {syncStatus === 'synced' ? 'Synced' : syncStatus === 'syncing' ? 'Syncing...' : 'Unsynced'}
            </span>
            <Button variant="outline" onClick={syncListings} disabled={isSyncing}>
              {isSyncing ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <RefreshCw className="w-4 h-4 mr-2" />}
              Sync with Cloud
            </Button>
            <Button onClick={() => navigate("/")}>Back to Site</Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="add-listing">{editingListingId ? "Edit Listing" : "Add Listing"}</TabsTrigger>
            <TabsTrigger value="my-listings">My Listings</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
          </TabsList>

          {/* Add Listing Tab Content */}
          <TabsContent value="add-listing" className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>{editingListingId ? "Edit Your Listing" : "Create New Listing"}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="listing-name">Name</Label>
                    <Input id="listing-name" name="name" value={formData.name} onChange={handleFormChange} />
                  </div>
                  <div>
                    {/* GLOBAL LOCATION FIELD - HYBRID (Fix applied here) */}
                    <Label htmlFor="listing-location">Location</Label>
                    <HybridInput
                      className="w-full"
                      name="location" 
                      placeholder="Type or select a city..."
                      value={formData.location}
                      options={SUGGESTIONS.locations}
                      onChange={handleFormChange} // Directly linked to form state logic
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="listing-description">Description</Label>
                  <Textarea id="listing-description" name="description" value={formData.description} onChange={handleFormChange} rows={4} />
                </div>
                <div>
                  <Label>Photos</Label>
                  <div className="border-2 border-dashed rounded-lg p-6 text-center relative mt-1">
                    <input type="file" multiple accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handlePhotoUpload} ref={fileInputRef} />
                    <Upload className="w-10 h-10 mx-auto mb-2 text-gray-400" />
                    <p>Drop files or <span className="text-primary font-medium">browse</span> (Max 10)</p>
                  </div>
                  {formData.photos.length > 0 && (
                    <div className="mt-4 grid grid-cols-3 md:grid-cols-5 gap-2">
                      {formData.photos.map((p, i) => (
                        <div key={i} className="relative aspect-square rounded-md overflow-hidden group">
                          <img src={p} alt={`Preview ${i + 1}`} className="w-full h-full object-cover" />
                          <Button variant="destructive" size="icon" className="absolute top-1 right-1 h-5 w-5 rounded-full opacity-0 group-hover:opacity-100" onClick={() => removePhoto(i)}>
                            <X className="w-3 h-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <Separator />
                {renderProfessionForm()} 
                <Separator />
                <div className="flex justify-end space-x-4">
                  <Button variant="outline" onClick={() => { setFormData(initialFormData); setEditingListingId(null); }}>Clear Form</Button>
                  <Button onClick={handlePublishListing}>{editingListingId ? "Update Listing" : "Publish Listing"}</Button>
                </div>
              </CardContent>
            </Card>

            <div className="lg:col-span-1">
              <Card>
                <CardHeader><CardTitle>Live Preview</CardTitle></CardHeader>
                <CardContent>
                  <div className="border rounded-lg p-4">
                    <div className="aspect-video bg-gray-200 rounded mb-4 flex items-center justify-center overflow-hidden">
                      {formData.photos[0] ? <img src={formData.photos[0]} alt="Listing Preview" className="w-full h-full object-cover" /> : <span className="text-gray-500 text-sm">Image</span>}
                    </div>
                    <h3 className="font-semibold text-lg">{formData.name || "Listing Name"}</h3>
                    <p className="text-muted-foreground text-sm h-12 overflow-hidden">{formData.description || "Description..."}</p>
                    <div className="mt-4 flex items-center justify-between">
                        <span className="text-xl font-bold text-primary">{getPreviewPrice()}</span>
                        {formData.verified && (
                             <Badge className="bg-green-100 text-green-800 border-green-200">Verified</Badge>
                        )}
                    </div>
                  </div>
                </CardContent>
            </Card>
            </div>
          </TabsContent>

          {/* My Listings Tab Content */}
          <TabsContent value="my-listings" className="mt-6 space-y-4">
            {ownerListings.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No listings found. Add your first one!</p>
            ) : (
            ownerListings.map(l => (
                <Card key={l.id}>
                <CardContent className="p-4 flex flex-col md:flex-row items-center gap-4">
                    <div className="shrink-0 w-full md:w-32 h-24 bg-gray-200 rounded-md overflow-hidden">
                    {l.photos?.[0] ? <img src={l.photos[0]} alt={l.name} className="w-full h-full object-cover" /> : <div className="flex items-center justify-center h-full text-xs text-gray-500">No Image</div>}
                    </div>
                    <div className="grow">
                    <h3 className="text-lg font-semibold">{l.name}</h3>
                    <p className="text-muted-foreground capitalize">{l.location}</p>
                   <div className="mt-2 flex items-center space-x-4 text-sm">
                      <Badge variant={l.status === 'Active' ? 'default' : 'secondary'}>{l.status}</Badge>
                      {l.profession && <Badge variant="outline">{l.profession.replace('-', ' ')}</Badge>}
                      {l.verified && <Badge variant="secondary" className="text-green-600 bg-green-50 border-green-200">Verified</Badge>}
                   </div>
                    </div>
                    <div className="flex space-x-2 shrink-0 self-start md:self-center">
                    <Button variant="outline" size="icon" onClick={() => handleEditListing(l.id)}><Edit className="w-4 h-4" /></Button>
                    <Button variant="destructive" size="icon" onClick={() => handleDeleteListing(l.id)}><Trash2 className="w-4 h-4" /></Button>
                    </div>
                </CardContent>
                </Card>
            ))
            )}
          </TabsContent>

          {/* Profile Tab Content */}
          <TabsContent value="profile" className="mt-6">
            <Card>
            <CardHeader><CardTitle>Business Profile</CardTitle></CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <Label htmlFor="business-name">Business Name</Label>
                    <Input id="business-name" value={userName} onChange={e => setUserName(e.target.value)} />
                </div>
                <div>
                    <Label htmlFor="contact-number">Contact Number (Required for Listings)</Label>
                    <div className="flex items-center gap-3">
                    <Input id="contact-number" value={userPhone} onChange={e => setUserPhone(e.target.value)} disabled={userPhoneVerified} />
                    {userPhoneVerified ? <Badge variant="secondary">Verified</Badge> : <Button size="sm" variant="outline" onClick={() => setShowPhoneModal(true)} disabled={!userPhone}>Verify</Button>}
                    </div>
                </div>
                <div>
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" value={userEmail || ""} disabled />
                </div>
                <div>
                    <Label htmlFor="profession-select">Profession</Label>
                    <Select value={globalProfession} onValueChange={setGlobalProfession}>
                    <SelectTrigger id="profession-select"><SelectValue placeholder="Select..." /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="hill-stays">Hill Stays</SelectItem>
                        <SelectItem value="resort-hotel">Resort & Hotel</SelectItem>
                        <SelectItem value="rental-bikes">Rental Bikes</SelectItem>
                        <SelectItem value="cabs-taxis">Cab & Taxi</SelectItem>
                        <SelectItem value="local-guides">Local Guide</SelectItem>
                        <SelectItem value="tours-treks">Tours & Treks</SelectItem>
                        <SelectItem value="other">Other (General Services)</SelectItem>
                    </SelectContent>
                    </Select>
                </div>
                </div>
                <div>
                <Label htmlFor="license-number">Business License Number</Label>
                <Input id="license-number" value={licenseNumber} onChange={e => setLicenseNumber(e.target.value)} placeholder="e.g., GSTIN, Trade License" />
                </div>
                <div>
                <Label htmlFor="business-address">Business Address</Label>
                <Textarea id="business-address" value={businessAddress} onChange={e => setBusinessAddress(e.target.value)} />
                </div>
                <Button onClick={handleUpdateProfile} className="w-full">Update Profile & Save Contact Info</Button>
            </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Phone Verification Dialog */}
      <Dialog open={showPhoneModal} onOpenChange={setShowPhoneModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Verify Phone Number</DialogTitle>
            <DialogDescription>{phoneOtpSent ? "Enter the 6-digit code we sent." : "We will send an OTP to this number."}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {!phoneOtpSent ? (
              <>
                <Label htmlFor="phone-verify">Phone Number</Label>
                <Input id="phone-verify" value={phoneToVerify} onChange={(e) => setPhoneToVerify(e.target.value)} placeholder="+911234567890" />
              </>
            ) : (
              <>
                <Label htmlFor="otp-verify">Enter OTP</Label>
                <Input id="otp-verify" value={phoneOtp} onChange={(e) => setPhoneOtp(e.target.value)} placeholder="123456" />
              </>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPhoneModal(false)} disabled={phoneLoading}>Cancel</Button>
            {!phoneOtpSent ? (
              <Button onClick={handleSendPhoneOTP} disabled={phoneLoading || !phoneToVerify}>{phoneLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Send OTP'}</Button>
            ) : (
              <Button onClick={handleConfirmPhoneOTP} disabled={phoneLoading || !phoneOtp}>{phoneLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Verify & Link'}</Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
