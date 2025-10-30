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
import { auth, db } from '../firebase'; // Ensure 'db' is imported from your firebase config
import { signInWithPhoneNumber, PhoneAuthProvider, linkWithCredential } from 'firebase/auth';
import { doc, setDoc, addDoc, deleteDoc, collection, serverTimestamp } from "firebase/firestore"; // Import serverTimestamp

// Initial structure for new listings
const initialFormData = {
  // Use a temporary ID for new items, which will be replaced by Firestore's actual document ID
  id: null,
  name: "",
  location: "",
  description: "",
  price: "",
  photos: [], // Storing base64 strings directly. For production, consider Firebase Storage.
  listingDetails: {
    rooms: [],
    bikes: [],
    vehicles: [],
    guideFeatures: [], // This will store Expertise/Specialization for guides and general listings
    treks: [],
    hillStayAmenities: [], // Currently not used in renderProfessionForm, but kept for future use
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
  const [syncStatus, setSyncStatus] = useState('idle'); // States: idle, syncing, synced, error
  const [isSyncing, setIsSyncing] = useState(false);
  const [formData, setFormData] = useState(initialFormData);
  const [ownerListings, setOwnerListings] = useState([]);
  const [editingListingId, setEditingListingId] = useState(null);
  const [newGuideFeatureText, setNewGuideFeatureText] = useState(""); // For adding guide features
  const fileInputRef = useRef(null); // Ref for file input

  // --- Phone Verification State ---
  const [showPhoneModal, setShowPhoneModal] = useState(false);
  const [phoneToVerify, setPhoneToVerify] = useState(userPhone || "");
  const [phoneOtp, setPhoneOtp] = useState("");
  const [phoneConfirmationResult, setPhoneConfirmationResult] = useState(null);
  const [phoneOtpSent, setPhoneOtpSent] = useState(false);
  const [phoneLoading, setPhoneLoading] = useState(false);

  // --- Data Fetching & Sync ---

  // Fetches listings from Firestore
  const fetchListings = useCallback(async () => {
    if (ownerId) {
      const listings = await readOwnerListingsRemote(ownerId);
      setOwnerListings(listings || []);
    }
  }, [ownerId, readOwnerListingsRemote]);

  // Effect to load listings when the component mounts or ownerId changes
  useEffect(() => {
    fetchListings();
  }, [fetchListings]);

  // Effect to update phoneToVerify if userPhone changes
  useEffect(() => {
    setPhoneToVerify(userPhone || "");
  }, [userPhone]);

  // Function to sync local listings with the cloud (Firestore)
  const syncListings = useCallback(async () => {
    if (!ownerId || isSyncing) return;
    setIsSyncing(true);
    setSyncStatus('syncing');
    try {
      // Assuming writeOwnerListingsRemote handles batch updates or individual writes
      const success = await writeOwnerListingsRemote(ownerListings, ownerId);
      if (success) {
        // After a successful write, re-read from Firestore to ensure consistency
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
      // console.error("Sync error:", e);
    } finally {
      setIsSyncing(false);
    }
  }, [ownerId, ownerListings, writeOwnerListingsRemote, isSyncing, fetchListings]);

  // --- Form Handlers ---

  // Generic handler for text input changes
  const handleFormChange = (e) => setFormData(p => ({ ...p, [e.target.name]: e.target.value }));

  // Generic handler for Select component changes
  const handleSelectChange = (name, value) => setFormData(p => ({ ...p, [name]: value }));

  // Handles photo uploads, reads files as Data URLs
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

  // Removes a photo by index
  const removePhoto = (index) => setFormData(p => ({ ...p, photos: p.photos.filter((_, i) => i !== index) }));

  // Updates a field in a nested array (e.g., changing room type)
  const updateNestedArray = (arr, id, field, val) => setFormData(p => ({
    ...p,
    listingDetails: {
      ...p.listingDetails,
      [arr]: p.listingDetails[arr].map(item => item.id === id ? { ...item, [field]: val } : item)
    }
  }));

  // Adds a new item to a nested array (e.g., adding a new room)
  const addToArray = (arr, item) => setFormData(p => ({
    ...p,
    listingDetails: {
      ...p.listingDetails,
      [arr]: [...p.listingDetails[arr], item]
    }
  }));

  // Deletes an item from a nested array
  const deleteFromArray = (arr, id) => setFormData(p => ({
    ...p,
    listingDetails: {
      ...p.listingDetails,
      [arr]: p.listingDetails[arr].filter(item => item.id !== id)
    }
  }));

  // Toggles a value within a sub-array of an item in a nested array (e.g., room features)
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

  // Adds a new guide feature (Expertise/Specialization)
  const addGuideFeature = useCallback(() => {
    if (newGuideFeatureText.trim() && !formData.listingDetails.guideFeatures.includes(newGuideFeatureText.trim())) {
      setFormData(p => ({
        ...p,
        listingDetails: {
          ...p.listingDetails,
          guideFeatures: [...p.listingDetails.guideFeatures, newGuideFeatureText.trim()]
        }
      }));
      setNewGuideFeatureText(""); // Clear the input after adding
    }
  }, [newGuideFeatureText, formData.listingDetails.guideFeatures]);

  // Removes a guide feature (Expertise/Specialization)
  const removeGuideFeature = (feature) => setFormData(p => ({
    ...p,
    listingDetails: {
      ...p.listingDetails,
      guideFeatures: p.listingDetails.guideFeatures.filter(f => f !== feature)
    }
  }));

  // --- CRUD Operations with Firestore ---

  // Handles publishing or updating a listing to Firestore
  const handlePublishListing = async () => {
    if (!formData.name || !formData.location) {
      return toast.error("Listing Name and Location are required.");
    }
    if (!ownerId) {
      return toast.error("Authentication error. Please re-login.");
    }

    const listingData = {
      ...formData,
      profession: globalProfession,
      ownerId,
      status: "Active", // Default status for new listings
      bookings: 0, // Default for new listings
      revenue: "₹0", // Default for new listings
    };

    try {
      if (editingListingId) {
        // Update existing document
        const docRef = doc(db, "listings", editingListingId);
        await setDoc(docRef, { ...listingData, updatedAt: serverTimestamp() }, { merge: true });
        toast.success("Listing updated successfully!");
      } else {
        // Add new document
        const listingsCollectionRef = collection(db, "listings");
        const newDocRef = await addDoc(listingsCollectionRef, { ...listingData, createdAt: serverTimestamp(), updatedAt: serverTimestamp() });
        // After creation, update the document with its own ID for consistent data structure
        await setDoc(newDocRef, { id: newDocRef.id }, { merge: true });
        toast.success("Listing published successfully!");
      }

      // Reset form and refresh listings from Firestore to update UI
      setFormData(initialFormData);
      setEditingListingId(null);
      await fetchListings(); // Re-fetch all listings
      setActiveTab("my-listings"); // Navigate to my-listings tab
    } catch (error) {
      toast.error("Failed to save listing to the database.");
      // console.error("Firestore write error:", error);
    }
  };

  // Sets the form to edit an existing listing
  const handleEditListing = (listingId) => {
    const listing = ownerListings.find(l => l.id === listingId);
    if (listing) {
      // Ensure all initialFormData fields are present to prevent controlled component issues
      setFormData({ ...initialFormData, ...listing });
      setGlobalProfession(listing.profession); // Set global profession context
      setEditingListingId(listingId);
      setActiveTab("add-listing");
    }
  };

  // Deletes a listing from Firestore
  const handleDeleteListing = async (listingId) => {
    if (!window.confirm("Are you sure you want to permanently delete this listing? This action cannot be undone.")) {
      return;
    }
    try {
      await deleteDoc(doc(db, "listings", listingId));
      toast.success("Listing deleted successfully.");
      // Optimistically update local state by filtering out the deleted listing
      setOwnerListings(prev => prev.filter(l => l.id !== listingId));
    } catch (error) {
      toast.error("Failed to delete listing.");
      // console.error("Firestore delete error:", error);
    }
  };

  // --- Profile & Phone Verification ---

  // Updates user profile in Firestore
  const handleUpdateProfile = async () => {
    const success = await updateUserProfileInFirestore({
      displayName: userName,
      phoneNumber: userPhone,
      profession: globalProfession,
      businessAddress,
      licenseNumber
    });
    toast[success ? 'success' : 'error'](success ? 'Profile updated successfully!' : 'Profile update failed.');
  };

  // Initiates sending OTP to the provided phone number
  const handleSendPhoneOTP = async () => {
    // Add reCAPTCHA verifier here if not already handled globally
    if (!phoneToVerify || phoneToVerify.length < 10) {
      return toast.error('Please enter a valid phone number, including country code (e.g., +919876543210).');
    }
    setPhoneLoading(true);
    try {
      // Firebase signInWithPhoneNumber requires a reCAPTCHA verifier if not done implicitly
      // For this example, assuming reCAPTCHA is handled or test numbers are used.
      const confirmationResult = await signInWithPhoneNumber(auth, phoneToVerify);
      setPhoneConfirmationResult(confirmationResult);
      setPhoneOtpSent(true);
      toast.success(`OTP sent to ${phoneToVerify}`);
    } catch (e) {
      toast.error(`Failed to send OTP: ${e.message}`);
      // console.error("Send OTP error:", e);
    } finally {
      setPhoneLoading(false);
    }
  };

  // Confirms the OTP and links the phone number to the current user
  const handleConfirmPhoneOTP = async () => {
    if (!phoneConfirmationResult || !phoneOtp) {
      return toast.error('Please enter the OTP to verify.');
    }
    setPhoneLoading(true);
    try {
      const phoneCred = PhoneAuthProvider.credential(phoneConfirmationResult.verificationId, phoneOtp);
      await linkWithCredential(auth.currentUser, phoneCred); // Link to the currently logged-in user
      await updateUserProfileInFirestore({ phoneNumber: phoneToVerify, phoneVerified: true });
      setUserPhone(phoneToVerify); // Update local context
      toast.success('Phone number verified and linked!');
      setShowPhoneModal(false);
      // Reset phone verification states
      setPhoneOtp("");
      setPhoneConfirmationResult(null);
      setPhoneOtpSent(false);
    } catch (e) {
      toast.error(`Failed to verify OTP: ${e.message}`);
      // console.error("Verify OTP error:", e);
    } finally {
      setPhoneLoading(false);
    }
  };

  // --- Render Functions ---

  // Renders profession-specific form fields based on globalProfession
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
            {formData.listingDetails.rooms.length === 0 && <p className="text-muted-foreground">No rooms added yet.</p>}
            {formData.listingDetails.rooms.map((room) => (
              <Card key={room.id}>
                <CardContent className="p-4 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label>Room Type</Label>
                      <Input placeholder="e.g., Deluxe, Suite" value={room.type} onChange={(e) => updateNestedArray("rooms", room.id, "type", e.target.value)} />
                    </div>
                    <div>
                      <Label>Price per Night</Label>
                      <Input type="number" placeholder="Enter Price" value={room.price} onChange={(e) => updateNestedArray("rooms", room.id, "price", e.target.value)} />
                    </div>
                    <div>
                      <Label>View</Label>
                      <Select value={room.view} onValueChange={(v) => updateNestedArray("rooms", room.id, "view", v)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select view" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="lake">Lake View</SelectItem>
                          <SelectItem value="mountain">Mountain View</SelectItem>
                          <SelectItem value="garden">Garden View</SelectItem>
                          <SelectItem value="city">City View</SelectItem>
                          <SelectItem value="forest">Forest View</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div>
                    <Label>Features</Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {["TV", "WiFi", "AC", "Room Service", "Pool Access", "Balcony", "Mini Bar"].map(f => (
                        <Badge key={f} variant={room.features.includes(f) ? "default" : "outline"} className="cursor-pointer" onClick={() => toggleInArray('rooms', room.id, 'features', f)}>
                          {f}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="flex justify-end mt-4">
                    <Button variant="destructive" size="sm" onClick={() => deleteFromArray("rooms", room.id)}>
                      <Trash2 className="w-4 h-4 mr-2" />Delete Room
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        );
      case "rental-bikes":
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Bikes & Scooters</h3>
              <Button onClick={() => addToArray('bikes', { id: Date.now(), type: "", name: "", price: "" })} size="sm">
                <Plus className="w-4 h-4 mr-2" />Add Bike
              </Button>
            </div>
            {formData.listingDetails.bikes.length === 0 && <p className="text-muted-foreground">No bikes added yet.</p>}
            {formData.listingDetails.bikes.map(bike => (
              <Card key={bike.id}>
                <CardContent className="p-4 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label>Name / Model</Label>
                      <Input placeholder="e.g., Activa, Classic 350" value={bike.name} onChange={e => updateNestedArray("bikes", bike.id, "name", e.target.value)} />
                    </div>
                    <div>
                      <Label>Type</Label>
                      <Select value={bike.type} onValueChange={v => updateNestedArray("bikes", bike.id, "type", v)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="scooter">Scooter</SelectItem>
                          <SelectItem value="motorcycle">Motorcycle</SelectItem>
                          <SelectItem value="electric">Electric Bike</SelectItem>
                          <SelectItem value="bicycle">Bicycle</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Price per Day</Label>
                      <Input type="number" placeholder="Enter Price" value={bike.price} onChange={e => updateNestedArray("bikes", bike.id, "price", e.target.value)} />
                    </div>
                  </div>
                  <div className="flex justify-end mt-4">
                    <Button variant="destructive" size="sm" onClick={() => deleteFromArray("bikes", bike.id)}>
                      <Trash2 className="w-4 h-4 mr-2" />Delete Bike
                    </Button>
                  </div>
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
            {formData.listingDetails.vehicles.length === 0 && <p className="text-muted-foreground">No vehicles added yet.</p>}
            {formData.listingDetails.vehicles.map(vehicle => (
              <Card key={vehicle.id}>
                <CardContent className="p-4 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label>Name / Model</Label>
                      <Input placeholder="e.g., Maruti Dzire" value={vehicle.name} onChange={e => updateNestedArray("vehicles", vehicle.id, "name", e.target.value)} />
                    </div>
                    <div>
                      <Label>Type</Label>
                      <Select value={vehicle.type} onValueChange={v => updateNestedArray("vehicles", vehicle.id, "type", v)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="sedan">Sedan</SelectItem>
                          <SelectItem value="suv">SUV</SelectItem>
                          <SelectItem value="hatchback">Hatchback</SelectItem>
                          <SelectItem value="tempo">Tempo Traveller</SelectItem>
                          <SelectItem value="luxury">Luxury Car</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Rate</Label>
                      <Input placeholder="e.g., ₹20/km or ₹2000/day" value={vehicle.rate} onChange={e => updateNestedArray("vehicles", vehicle.id, "rate", e.target.value)} />
                    </div>
                  </div>
                  <div className="flex justify-end mt-4">
                    <Button variant="destructive" size="sm" onClick={() => deleteFromArray("vehicles", vehicle.id)}>
                      <Trash2 className="w-4 h-4 mr-2" />Delete Vehicle
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        );
      case "local-guides":
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Guide Details</h3>
            <div>
              <Label htmlFor="guide-rate">Service Rate (per day)</Label>
              <Input id="guide-rate" type="number" placeholder="800" name="price" value={formData.price} onChange={handleFormChange} />
            </div>
            <div>
              <Label>Expertise/Specialization</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.listingDetails.guideFeatures.map((f) => (
                  <Badge key={f} className="flex items-center gap-1" onClick={() => removeGuideFeature(f)}>
                    {f}<X className="w-3 h-3 cursor-pointer" />
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2 mt-2">
                <Input placeholder="e.g., Mountain Trekking, Bird Watching" value={newGuideFeatureText} onChange={e => setNewGuideFeatureText(e.target.value)} onKeyPress={e => e.key === 'Enter' && addGuideFeature()} />
                <Button onClick={addGuideFeature}>Add</Button>
              </div>
            </div>
          </div>
        );
      case "hill-stays":
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Hill Stay Details</h3>
            <div>
              <Label>Price per Night</Label>
              <Input type="number" placeholder="Enter Price" name="price" value={formData.price} onChange={handleFormChange} />
            </div>
            <div>
              <Label>Amenities</Label>
              <p className="text-muted-foreground text-sm">Add key amenities like 'Fireplace','private balcony', 'Kitchen' in the main description section above.</p>
              {/* Future: Could add a similar badge input for amenities as guide features */}
            </div>
          </div>
        );
      case "tours-treks":
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Tour & Trek Details</h3>
            <div>
              <Label>Price per Person</Label>
              <Input type="number" placeholder="Enter Price" name="price" value={formData.price} onChange={handleFormChange} />
            </div>
            <div>
              <Label>Difficulty</Label>
              {/* Ensure treks array is initialized if accessing first element */}
              <Select value={formData.listingDetails.treks[0]?.difficulty || ""} onValueChange={v => setFormData(p => ({
                ...p,
                listingDetails: {
                  ...p.listingDetails,
                  treks: [{ id: Date.now(), difficulty: v }] // Initialize or update the first trek object
                }
              }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select difficulty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="easy">Easy</SelectItem>
                  <SelectItem value="moderate">Moderate</SelectItem>
                  <SelectItem value="challenging">Challenging</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <p className="text-muted-foreground text-sm">Add duration, itinerary, and inclusions in the main description.</p>
          </div>
        );
      default: // Fallback for "other" or unset profession
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">General Listing Details</h3>
            <div>
              <Label>Service Rate (Optional)</Label>
              <Input type="number" placeholder="e.g., 800" name="price" value={formData.price} onChange={handleFormChange} />
            </div>
            <div>
              <Label>Expertise/Specialization (comma-separated)</Label>
              <Input
                placeholder="e.g., Hiking, Photography, Cuisine"
                value={formData.listingDetails.guideFeatures.join(", ")}
                onChange={(e) =>
                  setFormData((p) => ({
                    ...p,
                    listingDetails: {
                      ...p.listingDetails,
                      guideFeatures: e.target.value.split(",").map(f => f.trim()).filter(Boolean), // Split by comma, trim, filter empty
                    },
                  }))
                }
              />
            </div>
            <p className="text-sm text-muted-foreground mt-1">For more specific options, please select a profession in your profile.</p>
          </div>
        );
    }
  };

  // Determines the price string for the live preview
  const getPreviewPrice = () => {
    if (globalProfession === "resort-hotel" && formData.listingDetails.rooms.length > 0) {
      return `₹${formData.listingDetails.rooms[0].price || "---"}/night`;
    }
    if (globalProfession === "rental-bikes" && formData.listingDetails.bikes.length > 0) {
      return `₹${formData.listingDetails.bikes[0].price || "---"}/day`;
    }
    if (globalProfession === "cabs-taxis" && formData.listingDetails.vehicles.length > 0) {
      return `${formData.listingDetails.vehicles[0].rate || "---"}`;
    }
    if (formData.price) {
      // For guides, hill stays, treks, and general
      return `₹${formData.price}`;
    }
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
                        <SelectItem value="brahmasthali">Brahmasthali</SelectItem>
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
                {renderProfessionForm()} {/* Renders profession-specific fields */}
                <Separator />
                <div className="flex justify-end space-x-4">
                  <Button variant="outline" onClick={() => { setFormData(initialFormData); setEditingListingId(null); }}>Clear Form</Button>
                  <Button onClick={handlePublishListing}>{editingListingId ? "Update Listing" : "Publish Listing"}</Button>
                </div>
              </CardContent>
            </Card>

            {/* Live Preview Card */}
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
                        {/* You can add more details here if needed */}
                        <span className="text-gray-600">
                        {globalProfession === "local-guides" && l.listingDetails.guideFeatures?.length > 0 && (
                            `Expertise: ${l.listingDetails.guideFeatures.join(', ')}`
                        )}
                        {/* Add other profession-specific details if desired */}
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
                    <Label htmlFor="contact-number">Contact Number</Label>
                    <div className="flex items-center gap-3">
                    <Input id="contact-number" value={userPhone} onChange={e => setUserPhone(e.target.value)} disabled={userPhoneVerified} />
                    {userPhoneVerified ? <Badge variant="secondary">Verified</Badge> : <Button size="sm" variant="outline" onClick={() => setShowPhoneModal(true)} disabled={!userPhone}>Verify</Button>}
                    </div>
                </div>
                <div>
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" value={userEmail || ""} disabled /> {/* Email is usually from auth, not editable here */}
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
                <Label htmlFor="license-number">License Number</Label>
                <Input id="license-number" value={licenseNumber} onChange={e => setLicenseNumber(e.target.value)} />
                </div>
                <div>
                <Label htmlFor="business-address">Business Address</Label>
                <Textarea id="business-address" value={businessAddress} onChange={e => setBusinessAddress(e.target.value)} />
                </div>
                <Button onClick={handleUpdateProfile} className="w-full">Update Profile</Button>
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