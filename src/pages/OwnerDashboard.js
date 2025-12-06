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
import { Plus, Upload, Edit, Trash2, X, Loader2, RefreshCw, Car, IndianRupee, MapPin } from "lucide-react"; 
import { useNavigate } from "react-router-dom";
import { GlobalContext } from "../component/GlobalContext";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogFooter, DialogHeader } from '../component/dialog';
import { analytics, auth, db } from '../firebase'; 
import { logEvent } from "firebase/analytics"; 
import { signInWithPhoneNumber, PhoneAuthProvider, linkWithCredential } from 'firebase/auth';
import { doc, setDoc, addDoc, deleteDoc, collection, serverTimestamp } from "firebase/firestore";

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
    bikes: [], 
    vehicles: [], 
    guideFeatures: [], // Used for Local Guide / General Specializations
    hillStayAmenities: [], 
    
    // Tour Specific Data
    tourData: {
      difficulty: "Moderate",
      duration: "",
      type: "day",
      maxGroupSize: "",
      fitnessLevel: "",
      includes: [],
      excludes: [],
      itinerary: [] 
    },

    // Cab Vendor Specific Data
    cabData: {
      pricing: {
        local: "", 
        outstation: "", 
        airport: "" 
      },
      availableVehicleTypes: [], 
      services: [], 
      areas: [], 
      specializations: [] 
    },
    
    treks: [], 
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
  
  // Helpers for Guides / General
  const [newGuideFeatureText, setNewGuideFeatureText] = useState("");
  
  // Helpers for Tours
  const [newInclude, setNewInclude] = useState("");
  const [newExclude, setNewExclude] = useState("");
  const [itineraryDay, setItineraryDay] = useState({ title: "", activities: "", meals: "" });

  // Helpers for Cabs
  const [newCabTag, setNewCabTag] = useState({ vehicle: "", service: "", area: "", spec: "" });
  const [newVehicleInv, setNewVehicleInv] = useState({ name: "", rate: "" });

  const fileInputRef = useRef(null);

  // Phone Verification State
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
  const handleFormChange = (e) => setFormData(p => ({ ...p, [e.target.name]: e.target.value }));
  const handleSelectChange = (name, value) => setFormData(p => ({ ...p, [name]: value }));

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

  // Helper: Update object inside an array
  const updateNestedArray = (arr, id, field, val) => setFormData(p => ({
    ...p,
    listingDetails: {
      ...p.listingDetails,
      [arr]: p.listingDetails[arr].map(item => item.id === id ? { ...item, [field]: val } : item)
    }
  }));

  // Helper: Add object to an array
  const addToArray = (arr, item) => setFormData(p => ({
    ...p,
    listingDetails: {
      ...p.listingDetails,
      [arr]: [...p.listingDetails[arr], item]
    }
  }));

  // Helper: Remove object from array
  const deleteFromArray = (arr, id) => setFormData(p => ({
    ...p,
    listingDetails: {
      ...p.listingDetails,
      [arr]: p.listingDetails[arr].filter(item => item.id !== id)
    }
  }));

  // --- GUIDE / GENERAL SPECIALIZATION HELPERS (FIXED) ---
  const addGuideFeature = () => {
    if (!newGuideFeatureText || !newGuideFeatureText.trim()) return;
    
    const feature = newGuideFeatureText.trim();
    if (formData.listingDetails.guideFeatures.includes(feature)) {
        toast.info("Feature already added");
        return;
    }

    setFormData(prev => ({
        ...prev,
        listingDetails: {
            ...prev.listingDetails,
            guideFeatures: [...prev.listingDetails.guideFeatures, feature]
        }
    }));
    setNewGuideFeatureText("");
  };

  const removeGuideFeature = (index) => {
    setFormData(prev => ({
        ...prev,
        listingDetails: {
            ...prev.listingDetails,
            guideFeatures: prev.listingDetails.guideFeatures.filter((_, i) => i !== index)
        }
    }));
  };

  // --- CAB SPECIFIC HELPERS (FIXED) ---
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
    
    if (inputFieldKey) {
        setNewCabTag(prev => ({ ...prev, [inputFieldKey]: "" }));
    }
  };

  // FIXED REMOVE FUNCTION FOR CAB ITEMS
  const removeCabArrayItem = (arrayName, index) => {
    setFormData(prev => {
        const currentList = prev.listingDetails.cabData[arrayName];
        const updatedList = currentList.filter((_, i) => i !== index);
        
        return {
            ...prev,
            listingDetails: {
                ...prev.listingDetails,
                cabData: {
                    ...prev.listingDetails.cabData,
                    [arrayName]: updatedList
                }
            }
        };
    });
  };

  const addVehicleToInventory = () => {
    if (!newVehicleInv.name || !newVehicleInv.rate) return toast.error("Vehicle name and rate are required");
    addToArray('vehicles', { 
        id: Date.now(), 
        type: "car", 
        name: newVehicleInv.name, 
        rate: newVehicleInv.rate 
    });
    setNewVehicleInv({ name: "", rate: "" });
  };

  // --- TOUR SPECIFIC HELPERS ---
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

  const addItineraryDay = () => {
    if(!itineraryDay.title) return toast.error("Day title is required");
    const dayData = {
      day: (formData.listingDetails.tourData.itinerary?.length || 0) + 1,
      title: itineraryDay.title,
      activities: itineraryDay.activities.split(',').map(s => s.trim()).filter(Boolean),
      meals: itineraryDay.meals.split(',').map(s => s.trim()).filter(Boolean)
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
    setItineraryDay({ title: "", activities: "", meals: "" });
  };

  const removeItineraryDay = (index) => {
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

  // --- 6. CRUD OPERATIONS ---
  const handlePublishListing = async () => {
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
          tourData: {
            ...initialFormData.listingDetails.tourData,
            ...(listing.listingDetails?.tourData || {})
          },
          cabData: {
            ...initialFormData.listingDetails.cabData,
            ...(listing.listingDetails?.cabData || {})
          },
          guideFeatures: listing.listingDetails?.guideFeatures || []
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

  // --- 8. RENDER PROFESSION SPECIFIC FORMS ---
  const renderProfessionForm = () => {
    switch (globalProfession) {
      case "resort-hotel":
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Rooms</h3>
              <Button onClick={() => addToArray('rooms', { id: Date.now(), type: "", price: "", features: [], view: "" })} size="sm">
                <Plus className="w-4 h-4 mr-2" />Add Room
              </Button>
            </div>
            {formData.listingDetails.rooms.map((room) => (
              <Card key={room.id}>
                <CardContent className="p-4 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Input placeholder="Room Type" value={room.type} onChange={(e) => updateNestedArray("rooms", room.id, "type", e.target.value)} />
                    <Input type="number" placeholder="Price" value={room.price} onChange={(e) => updateNestedArray("rooms", room.id, "price", e.target.value)} />
                    <Select value={room.view} onValueChange={(v) => updateNestedArray("rooms", room.id, "view", v)}>
                        <SelectTrigger><SelectValue placeholder="View" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="lake">Lake View</SelectItem>
                          <SelectItem value="mountain">Mountain View</SelectItem>
                          <SelectItem value="garden">Garden View</SelectItem>
                          <SelectItem value="city">City View</SelectItem>
                          <SelectItem value="forest">Forest View</SelectItem>
                        </SelectContent>
                    </Select>
                  </div>
                  <Button variant="destructive" size="sm" onClick={() => deleteFromArray("rooms", room.id)}>
                      <Trash2 className="w-4 h-4 mr-2" />Delete Room
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        );

      case "rental-bikes":
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Bikes</h3>
              <Button onClick={() => addToArray('bikes', { id: Date.now(), type: "", name: "", price: "" })} size="sm">
                <Plus className="w-4 h-4 mr-2" />Add Bike
              </Button>
            </div>
            {formData.listingDetails.bikes.map(bike => (
              <Card key={bike.id}>
                <CardContent className="p-4 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Input placeholder="Name/Model" value={bike.name} onChange={e => updateNestedArray("bikes", bike.id, "name", e.target.value)} />
                    <Input type="number" placeholder="Price/Day" value={bike.price} onChange={e => updateNestedArray("bikes", bike.id, "price", e.target.value)} />
                  </div>
                  <Button variant="destructive" size="sm" onClick={() => deleteFromArray("bikes", bike.id)}>Delete</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        );

      case "cabs-taxis":
        const { cabData } = formData.listingDetails;
        return (
          <div className="space-y-6">
            
            {/* Pricing Section */}
            <div className="bg-orange-50 p-4 rounded-md border border-orange-100">
              <h3 className="text-lg font-bold text-orange-800 mb-4 flex items-center gap-2">
                <IndianRupee className="h-5 w-5" /> Standard Pricing & Rates
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label className="text-xs font-semibold text-gray-600">Local Rate (per km)</Label>
                  <div className="relative">
                     <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">₹</span>
                     <Input className="pl-7" placeholder="15/km" value={cabData.pricing?.local} onChange={(e) => updateCabPricing("local", e.target.value)} />
                  </div>
                </div>
                <div>
                  <Label className="text-xs font-semibold text-gray-600">Outstation Rate (per km)</Label>
                  <div className="relative">
                     <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">₹</span>
                     <Input className="pl-7" placeholder="12/km" value={cabData.pricing?.outstation} onChange={(e) => updateCabPricing("outstation", e.target.value)} />
                  </div>
                </div>
                <div>
                  <Label className="text-xs font-semibold text-gray-600">Airport Drop (Fixed)</Label>
                  <div className="relative">
                     <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">₹</span>
                     <Input className="pl-7" placeholder="2500" value={cabData.pricing?.airport} onChange={(e) => updateCabPricing("airport", e.target.value)} />
                  </div>
                </div>
              </div>
            </div>

            {/* Vehicle Inventory */}
            <div className="border rounded-md p-4 bg-white">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold flex items-center gap-2"><Car className="h-5 w-5" /> Vehicle Inventory</h3>
                    <Badge variant="outline">{formData.listingDetails.vehicles.length} Vehicles</Badge>
                </div>
                
                {/* Add New Vehicle Input */}
                <div className="flex flex-col md:flex-row gap-3 bg-gray-50 p-3 rounded mb-4">
                    <Input 
                        placeholder="Vehicle Name (e.g. Swift Dzire, Innova)" 
                        value={newVehicleInv.name} 
                        onChange={e => setNewVehicleInv({...newVehicleInv, name: e.target.value})}
                        className="grow"
                    />
                    <div className="relative w-full md:w-1/3">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">₹</span>
                        <Input 
                            placeholder="Rate (e.g. 14/km)" 
                            value={newVehicleInv.rate} 
                            onChange={e => setNewVehicleInv({...newVehicleInv, rate: e.target.value})}
                            className="pl-7"
                        />
                    </div>
                    <Button onClick={addVehicleToInventory} size="sm"><Plus className="w-4 h-4 mr-1" /> Add</Button>
                </div>

                {/* List of Vehicles */}
                <div className="space-y-2">
                    {formData.listingDetails.vehicles.length === 0 ? (
                        <p className="text-sm text-gray-400 text-center py-2">No vehicles added yet. Add your fleet above.</p>
                    ) : (
                        formData.listingDetails.vehicles.map(vehicle => (
                            <div key={vehicle.id} className="flex justify-between items-center border p-3 rounded hover:bg-gray-50 transition">
                                <div className="flex items-center gap-3">
                                    <div className="bg-blue-100 p-2 rounded-full"><Car className="w-4 h-4 text-blue-600"/></div>
                                    <div>
                                        <p className="font-semibold text-sm">{vehicle.name}</p>
                                        <p className="text-xs text-gray-500">Rate: ₹{vehicle.rate}</p>
                                    </div>
                                </div>
                                <Button variant="ghost" size="sm" className="text-red-500 hover:bg-red-50" onClick={() => deleteFromArray("vehicles", vehicle.id)}>
                                    <Trash2 className="w-4 h-4"/>
                                </Button>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Details & Tags */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Vehicle Categories */}
                <div className="border p-3 rounded bg-white">
                  <Label>Vehicle Categories</Label>
                  <div className="flex gap-2 mt-2">
                    <Input 
                        placeholder="Type category (e.g. Minivan)" 
                        value={newCabTag.vehicle} 
                        onChange={(e) => setNewCabTag({...newCabTag, vehicle: e.target.value})} 
                    />
                    <Button size="sm" onClick={() => addCabArrayItem("availableVehicleTypes", newCabTag.vehicle, "vehicle")}>
                        <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="mt-2">
                      <Select onValueChange={(val) => addCabArrayItem("availableVehicleTypes", val, null)}>
                        <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="Quick Add Common Types" /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Hatchback">Hatchback</SelectItem>
                            <SelectItem value="Sedan">Sedan</SelectItem>
                            <SelectItem value="SUV">SUV</SelectItem>
                            <SelectItem value="Tempo Traveller">Tempo Traveller</SelectItem>
                            <SelectItem value="Luxury">Luxury</SelectItem>
                        </SelectContent>
                    </Select>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {cabData.availableVehicleTypes?.map((item, i) => (
                      <Badge key={i} variant="secondary" className="pr-1 flex items-center gap-1">
                        {item} 
                        <span 
                            className="cursor-pointer hover:text-red-500 p-0.5 rounded-full hover:bg-red-50"
                            onClick={(e) => {
                                e.stopPropagation();
                                removeCabArrayItem("availableVehicleTypes", i);
                            }}
                        >
                            <X className="w-3 h-3" />
                        </span>
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Services Offered */}
                <div className="border p-3 rounded bg-white">
                  <Label>Services Offered</Label>
                  <div className="flex gap-2 mt-2">
                    <Input 
                        placeholder="Type service (e.g. Wedding)" 
                        value={newCabTag.service} 
                        onChange={(e) => setNewCabTag({...newCabTag, service: e.target.value})} 
                    />
                    <Button size="sm" onClick={() => addCabArrayItem("services", newCabTag.service, "service")}>
                        <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="mt-2">
                     <Select onValueChange={(val) => addCabArrayItem("services", val, null)}>
                        <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="Quick Add Common Services" /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Local City Ride">Local City Ride</SelectItem>
                            <SelectItem value="Outstation">Outstation</SelectItem>
                            <SelectItem value="Airport Transfer">Airport Transfer</SelectItem>
                            <SelectItem value="Group Tours">Group Tours</SelectItem>
                            <SelectItem value="Railway Transfer">Railway Transfer</SelectItem>
                        </SelectContent>
                    </Select>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {cabData.services?.map((item, i) => (
                      <Badge key={i} variant="outline" className="pr-1 bg-blue-50 flex items-center gap-1">
                        {item} 
                        <span 
                            className="cursor-pointer hover:text-red-500 p-0.5 rounded-full hover:bg-red-50"
                            onClick={(e) => {
                                e.stopPropagation();
                                removeCabArrayItem("services", i);
                            }}
                        >
                            <X className="w-3 h-3" />
                        </span>
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Areas */}
                <div className="border p-3 rounded bg-white">
                  <Label>Operating Areas</Label>
                  <div className="flex gap-2 mt-2">
                     <Input 
                      placeholder="e.g. Nainital, Bhimtal" 
                      value={newCabTag.area} 
                      onChange={e => setNewCabTag({...newCabTag, area: e.target.value})} 
                    />
                    <Button size="sm" onClick={() => addCabArrayItem("areas", newCabTag.area, "area")}><Plus className="w-4 h-4" /></Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {cabData.areas?.map((item, i) => (
                      <Badge key={i} variant="outline" className="pr-1 flex items-center gap-1">
                        {item} 
                        <span 
                            className="cursor-pointer hover:text-red-500 p-0.5 rounded-full hover:bg-red-50"
                            onClick={(e) => {
                                e.stopPropagation();
                                removeCabArrayItem("areas", i);
                            }}
                        >
                            <X className="w-3 h-3" />
                        </span>
                      </Badge>
                    ))}
                  </div>
                </div>

                 {/* Specializations */}
                 <div className="border p-3 rounded bg-white">
                  <Label>Specializations</Label>
                  <div className="flex gap-2 mt-2">
                     <Input 
                      placeholder="e.g. 24/7 Service, Luxury" 
                      value={newCabTag.spec} 
                      onChange={e => setNewCabTag({...newCabTag, spec: e.target.value})} 
                    />
                    <Button size="sm" onClick={() => addCabArrayItem("specializations", newCabTag.spec, "spec")}><Plus className="w-4 h-4" /></Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {cabData.specializations?.map((item, i) => (
                      <Badge key={i} variant="outline" className="pr-1 bg-green-50 flex items-center gap-1">
                        {item} 
                        <span 
                            className="cursor-pointer hover:text-red-500 p-0.5 rounded-full hover:bg-red-50"
                            onClick={(e) => {
                                e.stopPropagation();
                                removeCabArrayItem("specializations", i);
                            }}
                        >
                            <X className="w-3 h-3" />
                        </span>
                      </Badge>
                    ))}
                  </div>
                </div>
            </div>
          </div>
        );

      case "tours-treks":
        const { tourData } = formData.listingDetails;
        return (
          <div className="space-y-6">
            <div className="bg-blue-50 p-4 rounded-md border border-blue-100">
                <h3 className="text-lg font-bold text-blue-800 mb-4">Tour Specifics</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                        <Label>Tour Type</Label>
                        <Select value={tourData.type} onValueChange={v => updateTourField("type", v)}>
                            <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="day">Day Tour</SelectItem>
                                <SelectItem value="weekend">Weekend (2-3 Days)</SelectItem>
                                <SelectItem value="extended">Extended (4+ Days)</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div>
                        <Label>Difficulty</Label>
                        <Select value={tourData.difficulty} onValueChange={v => updateTourField("difficulty", v)}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Easy">Easy</SelectItem>
                                <SelectItem value="Moderate">Moderate</SelectItem>
                                <SelectItem value="Challenging">Challenging</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div>
                        <Label>Total Duration</Label>
                        <Input value={tourData.duration} onChange={e => updateTourField("duration", e.target.value)} placeholder="e.g. 4 Hours / 2 Days" />
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                        <Label>Price Per Person</Label>
                        <div className="relative">
                           <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">₹</span>
                           <Input className="pl-7" type="number" value={formData.price} onChange={handleFormChange} name="price" placeholder="1500" />
                        </div>
                    </div>
                    <div>
                        <Label>Max Group Size</Label>
                        <Input type="number" value={tourData.maxGroupSize} onChange={e => updateTourField("maxGroupSize", e.target.value)} placeholder="15" />
                    </div>
                </div>
                <div className="mb-4">
                    <Label>Fitness Level Required</Label>
                    <Input value={tourData.fitnessLevel} onChange={e => updateTourField("fitnessLevel", e.target.value)} placeholder="e.g. Good physical fitness required" />
                </div>
            </div>

            {/* Includes & Excludes */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border p-4 rounded-md">
                    <Label className="text-green-600">What's Included</Label>
                    <div className="flex gap-2 mt-2">
                        <Input value={newInclude} onChange={e => setNewInclude(e.target.value)} placeholder="e.g. Lunch" />
                        <Button size="sm" onClick={() => addTourArrayItem("includes", newInclude, setNewInclude)}><Plus className="w-4 h-4" /></Button>
                    </div>
                    <ul className="mt-2 space-y-1">
                        {tourData.includes?.map((item, i) => (
                            <li key={i} className="flex justify-between bg-green-50 px-2 py-1 rounded text-sm">
                                {item} <X className="w-4 h-4 cursor-pointer text-red-500" onClick={() => removeTourArrayItem("includes", i)} />
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="border p-4 rounded-md">
                    <Label className="text-red-600">What's Excluded</Label>
                    <div className="flex gap-2 mt-2">
                        <Input value={newExclude} onChange={e => setNewExclude(e.target.value)} placeholder="e.g. Transport" />
                        <Button size="sm" onClick={() => addTourArrayItem("excludes", newExclude, setNewExclude)}><Plus className="w-4 h-4" /></Button>
                    </div>
                    <ul className="mt-2 space-y-1">
                        {tourData.excludes?.map((item, i) => (
                            <li key={i} className="flex justify-between bg-red-50 px-2 py-1 rounded text-sm">
                                {item} <X className="w-4 h-4 cursor-pointer text-red-500" onClick={() => removeTourArrayItem("excludes", i)} />
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* Itinerary Builder */}
            <div className="border p-4 rounded-md">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-semibold">Itinerary Builder</h3>
                    <Badge variant="secondary">Day {tourData.itinerary?.length + 1}</Badge>
                </div>
                <div className="space-y-3 bg-gray-50 p-4 rounded">
                    <div>
                        <Label>Day Title</Label>
                        <Input value={itineraryDay.title} onChange={e => setItineraryDay({...itineraryDay, title: e.target.value})} placeholder="e.g. Arrival at Camp" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <Label>Activities (comma separated)</Label>
                            <Input value={itineraryDay.activities} onChange={e => setItineraryDay({...itineraryDay, activities: e.target.value})} placeholder="Trek to lake, Bonfire" />
                        </div>
                        <div>
                            <Label>Meals (comma separated)</Label>
                            <Input value={itineraryDay.meals} onChange={e => setItineraryDay({...itineraryDay, meals: e.target.value})} placeholder="Breakfast, Dinner" />
                        </div>
                    </div>
                    <Button onClick={addItineraryDay} className="w-full mt-2" variant="outline"><Plus className="w-4 h-4 mr-2" />Add Day to Itinerary</Button>
                </div>
                <div className="mt-4 space-y-4">
                    {tourData.itinerary?.map((day, idx) => (
                        <div key={idx} className="relative border-l-4 border-blue-500 pl-4 py-2 bg-white shadow-sm rounded-r-md">
                            <h4 className="font-bold">Day {day.day}: {day.title}</h4>
                            <p className="text-sm text-gray-600">Activities: {day.activities.join(', ')}</p>
                            <Button size="icon" variant="ghost" className="absolute top-2 right-2 text-red-500 hover:bg-red-50" onClick={() => removeItineraryDay(idx)}>
                                <Trash2 className="w-4 h-4" />
                            </Button>
                        </div>
                    ))}
                </div>
            </div>
          </div>
        );
      
      // Default: Includes Local Guides & General
      default:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">General Listing Details</h3>
            <div>
              <Label>Service Rate</Label>
              <div className="relative">
                 <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">₹</span>
                 <Input className="pl-7" type="number" placeholder="800" name="price" value={formData.price} onChange={handleFormChange} />
              </div>
            </div>
            
            {/* UPDATED SPECIALIZATION (TAGS) FOR GUIDES/GENERAL */}
            <div>
              <Label>Specialization / Features</Label>
              <div className="flex gap-2 mt-2">
                 <Input
                   placeholder="e.g. Hiking, Photography, History"
                   value={newGuideFeatureText}
                   onChange={(e) => setNewGuideFeatureText(e.target.value)}
                   onKeyDown={(e) => {
                     if(e.key === 'Enter') {
                       e.preventDefault();
                       addGuideFeature();
                     }
                   }}
                 />
                 <Button onClick={addGuideFeature}><Plus className="w-4 h-4"/></Button>
              </div>
              
              <div className="flex flex-wrap gap-2 mt-3">
                 {formData.listingDetails.guideFeatures.map((feature, idx) => (
                     <Badge key={idx} variant="secondary" className="flex items-center gap-1">
                        {feature}
                        <span 
                          className="cursor-pointer hover:text-red-500 p-0.5"
                          onClick={() => removeGuideFeature(idx)}
                        >
                           <X className="w-3 h-3"/>
                        </span>
                     </Badge>
                 ))}
              </div>
            </div>
          </div>
        );
    }
  };

  // --- 9. PRICE PREVIEW LOGIC ---
  const getPreviewPrice = () => {
    if (globalProfession === "resort-hotel" && formData.listingDetails.rooms.length > 0) return `₹${formData.listingDetails.rooms[0].price || "---"}/night`;
    if (globalProfession === "rental-bikes" && formData.listingDetails.bikes.length > 0) return `₹${formData.listingDetails.bikes[0].price || "---"}/day`;
    if (globalProfession === "cabs-taxis") {
        if (formData.listingDetails.cabData.pricing.local) return `₹${formData.listingDetails.cabData.pricing.local}/km`;
        return "N/A";
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
            <p className="text-muted-foreground capitalize">Manage your {globalProfession.replace('-', ' ')} listings</p>
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
                    <Label htmlFor="listing-location">Location</Label>
                    <Select value={formData.location} onValueChange={v => handleSelectChange("location", v)}>
                      <SelectTrigger id="listing-location"><SelectValue placeholder="Select location" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Nainital">Nainital</SelectItem>
                        <SelectItem value="Bhimtal">Bhimtal</SelectItem>
                        <SelectItem value="Sattal">Sattal</SelectItem>
                        <SelectItem value="Naukuchiatal">Naukuchiatal</SelectItem>
                        <SelectItem value="Mukteshwar">Mukteshwar</SelectItem>
                        <SelectItem value="Ramgarh">Ramgarh</SelectItem>
                        <SelectItem value="Pangot">Pangot</SelectItem>
                        <SelectItem value="Almora">Almora</SelectItem>
                        <SelectItem value="Ranikhet">Ranikhet</SelectItem>
                        <SelectItem value="Kausani">Kausani</SelectItem>
                      </SelectContent>
                    </Select>
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
                    <p>Drop files or <span className="text-primary font-medium">browse</span> (Max 5 )</p>
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
                        <Badge>{l.status}</Badge>
                        {l.verified && <Badge variant="secondary" className="text-green-600 bg-green-50 border-green-200">Verified</Badge>}
                        <span className="text-gray-600">
                        {globalProfession === "local-guides" && l.listingDetails.guideFeatures?.length > 0 && (
                            `Expertise: ${l.listingDetails.guideFeatures.join(', ')}`
                        )}
                        </span>
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
                        <SelectItem value="resort-hotel">Resort & Hotel</SelectItem>
                        <SelectItem value="rental-bikes">Rental Bikes</SelectItem>
                        <SelectItem value="cabs-taxis">Cab & Taxi</SelectItem>
                        <SelectItem value="local-guides">Local Guide</SelectItem>
                        <SelectItem value="hill-stays">Hill Stays</SelectItem>
                        <SelectItem value="tours-treks">Tours & Treks</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
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