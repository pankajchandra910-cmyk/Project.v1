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
import { Plus, Upload, Edit, Trash2, X, Loader2, RefreshCw } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { GlobalContext } from "../component/GlobalContext";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogFooter, DialogHeader } from '../component/dialog';
import { analytics, auth, db } from '../firebase'; 
import { logEvent } from "firebase/analytics"; 
import { signInWithPhoneNumber, PhoneAuthProvider, linkWithCredential } from 'firebase/auth';
import { doc, setDoc, addDoc, deleteDoc, collection, serverTimestamp } from "firebase/firestore";

// Initial structure for new listings (Updated with Tour Data)
const initialFormData = {
  id: null,
  name: "",
  location: "",
  description: "",
  price: "",
  photos: [], 
  listingDetails: {
    rooms: [],
    bikes: [],
    vehicles: [],
    guideFeatures: [],
    hillStayAmenities: [],
    // Expanded Tour Data Structure
    tourData: {
      difficulty: "Moderate",
      duration: "",
      type: "day", // day, weekend, extended
      maxGroupSize: "",
      fitnessLevel: "",
      includes: [],
      excludes: [],
      itinerary: [] 
    },
    // Keep legacy treks array if needed for backward compatibility, 
    // but we will use tourData for the new page
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

  const [activeTab, setActiveTab] = useState("add-listing");
  const [syncStatus, setSyncStatus] = useState('idle');
  const [isSyncing, setIsSyncing] = useState(false);
  const [formData, setFormData] = useState(initialFormData);
  const [ownerListings, setOwnerListings] = useState([]);
  const [editingListingId, setEditingListingId] = useState(null);
  const [newGuideFeatureText, setNewGuideFeatureText] = useState("");
  
  // --- New Helper States for Tours ---
  const [newInclude, setNewInclude] = useState("");
  const [newExclude, setNewExclude] = useState("");
  const [itineraryDay, setItineraryDay] = useState({ title: "", activities: "", meals: "" });

  const fileInputRef = useRef(null);

  // --- Phone Verification State ---
  const [showPhoneModal, setShowPhoneModal] = useState(false);
  const [phoneToVerify, setPhoneToVerify] = useState(userPhone || "");
  const [phoneOtp, setPhoneOtp] = useState("");
  const [phoneConfirmationResult, setPhoneConfirmationResult] = useState(null);
  const [phoneOtpSent, setPhoneOtpSent] = useState(false);
  const [phoneLoading, setPhoneLoading] = useState(false);

  // --- Data Fetching ---
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

  // --- Sync Listings ---
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

  // --- Form Handlers ---
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

  const toggleInArray = (arr, id, field, val) => setFormData(p => ({
    ...p,
    listingDetails: {
      ...p.listingDetails,
      [arr]: p.listingDetails[arr].map(item =>
        item.id === id
          ? { ...item, [field]: item[field].includes(val) ? item[field].filter(f => f !== val) : [...item[field], val] }
          : item
      )
    }
  }));

  const addGuideFeature = useCallback(() => {
    if (newGuideFeatureText.trim() && !formData.listingDetails.guideFeatures.includes(newGuideFeatureText.trim())) {
      setFormData(p => ({
        ...p,
        listingDetails: {
          ...p.listingDetails,
          guideFeatures: [...p.listingDetails.guideFeatures, newGuideFeatureText.trim()]
        }
      }));
      setNewGuideFeatureText(""); 
    }
  }, [newGuideFeatureText, formData.listingDetails.guideFeatures]);

  const removeGuideFeature = (feature) => setFormData(p => ({
    ...p,
    listingDetails: {
      ...p.listingDetails,
      guideFeatures: p.listingDetails.guideFeatures.filter(f => f !== feature)
    }
  }));

  // --- Specific Tour Helpers ---
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
      // Re-index days automatically
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

  // --- CRUD Operations ---
  const handlePublishListing = async () => {
    // 1. Basic Validation
    if (!formData.name || !formData.location) return toast.error("Listing Name and Location are required.");
    if (!ownerId) return toast.error("Authentication error. Please re-login.");

    // 2. Profile Completeness Validation
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
      verified: false, 
    };

    try {
      if (editingListingId) {
        // Update Logic
        const docRef = doc(db, "listings", editingListingId);
        await setDoc(docRef, { ...listingData, updatedAt: serverTimestamp() }, { merge: true });
        toast.success("Listing updated successfully!");
      } else {
        // Create Logic
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
      // Merge strictly to ensure tourData exists even if editing an old listing
      setFormData({ 
        ...initialFormData, 
        ...listing, 
        listingDetails: {
          ...initialFormData.listingDetails,
          ...listing.listingDetails,
          tourData: {
            ...initialFormData.listingDetails.tourData,
            ...(listing.listingDetails?.tourData || {})
          }
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
        logEvent(analytics, 'delete_listing', {
          profession: listingToDelete.profession,
          listing_name: listingToDelete.name
        });
      }
      toast.success("Listing deleted successfully.");
      setOwnerListings(prev => prev.filter(l => l.id !== listingId));
    } catch (error) {
      toast.error("Failed to delete listing.");
    }
  };

  // --- Profile & Phone Verification ---
  const handleUpdateProfile = async () => {
    const success = await updateUserProfileInFirestore({
      displayName: userName,
      phoneNumber: userPhone,
      profession: globalProfession,
      businessAddress,
      licenseNumber
    });

    if (success) {
      toast.success('Profile updated successfully!');
    } else {
      toast.error('Profile update failed.');
    }
  };

  const handleSendPhoneOTP = async () => {
    if (!phoneToVerify || phoneToVerify.length < 10) {
      return toast.error('Please enter a valid phone number (+91...)');
    }
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

  // --- Render Functions ---
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
                          <SelectItem value="lake">Lake</SelectItem>
                          <SelectItem value="mountain">Mountain</SelectItem>
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
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Vehicles</h3>
              <Button onClick={() => addToArray('vehicles', { id: Date.now(), type: "", name: "", rate: "" })} size="sm">
                <Plus className="w-4 h-4 mr-2" />Add Vehicle
              </Button>
            </div>
            {formData.listingDetails.vehicles.map(vehicle => (
              <Card key={vehicle.id}>
                <CardContent className="p-4 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Input placeholder="Model" value={vehicle.name} onChange={e => updateNestedArray("vehicles", vehicle.id, "name", e.target.value)} />
                    <Input placeholder="Rate" value={vehicle.rate} onChange={e => updateNestedArray("vehicles", vehicle.id, "rate", e.target.value)} />
                  </div>
                  <Button variant="destructive" size="sm" onClick={() => deleteFromArray("vehicles", vehicle.id)}>Delete</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        );
      case "tours-treks":
        const { tourData } = formData.listingDetails;
        return (
          <div className="space-y-6">
            <div className="bg-blue-50 p-4 rounded-md border border-blue-100">
                <h3 className="text-lg font-bold text-blue-800 mb-4">Tour Specifics</h3>
                
                {/* Basic Tour Info */}
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
                        <Label>Price Per Person (₹)</Label>
                        <Input type="number" value={formData.price} onChange={handleFormChange} name="price" placeholder="1500" />
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
                            <p className="text-xs text-gray-500">Meals: {day.meals.join(', ')}</p>
                            <Button size="icon" variant="ghost" className="absolute top-2 right-2 text-red-500 hover:bg-red-50" onClick={() => removeItineraryDay(idx)}>
                                <Trash2 className="w-4 h-4" />
                            </Button>
                        </div>
                    ))}
                </div>
            </div>
          </div>
        );
      default:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">General Listing Details</h3>
            <div>
              <Label>Service Rate</Label>
              <Input type="number" placeholder="800" name="price" value={formData.price} onChange={handleFormChange} />
            </div>
            <div>
              <Label>Specialization (comma-separated)</Label>
              <Input
                placeholder="Hiking, Photography"
                value={formData.listingDetails.guideFeatures.join(", ")}
                onChange={(e) => setFormData((p) => ({...p, listingDetails: {...p.listingDetails, guideFeatures: e.target.value.split(",").map(f => f.trim()).filter(Boolean)}}))}
              />
            </div>
          </div>
        );
    }
  };

  const getPreviewPrice = () => {
    if (globalProfession === "resort-hotel" && formData.listingDetails.rooms.length > 0) return `₹${formData.listingDetails.rooms[0].price || "---"}/night`;
    if (globalProfession === "rental-bikes" && formData.listingDetails.bikes.length > 0) return `₹${formData.listingDetails.bikes[0].price || "---"}/day`;
    if (globalProfession === "cabs-taxis" && formData.listingDetails.vehicles.length > 0) return `${formData.listingDetails.vehicles[0].rate || "---"}`;
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
                        <SelectItem value="nainital">Nainital</SelectItem>
                        <SelectItem value="bhimtal">Bhimtal</SelectItem>
                        <SelectItem value="sukhatal">Sukhatal</SelectItem>
                        <SelectItem value="naukuchiatal">Naukuchiatal</SelectItem>
                        <SelectItem value="mukteshwar">Mukteshwar</SelectItem>
                        <SelectItem value="pangot">Pangot</SelectItem>
                        <SelectItem value="almora">Almora</SelectItem>
                        <SelectItem value="kausani">Kausani</SelectItem>
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
                        <Button size="sm" disabled>View Details</Button>
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