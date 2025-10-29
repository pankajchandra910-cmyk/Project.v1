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
import { Plus, Upload, Eye, Edit, Trash2, X, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { GlobalContext } from "../component/GlobalContext";
import { toast } from "sonner";

// This initial state includes every possible array to prevent runtime errors.
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
    treks: [],
    hillStayAmenities: [],
  },
};

export default function OwnerDashboard() {
  const {
    profession: globalProfession,
    setProfession: setGlobalProfession,
    userName, setUserName,
    userPhone, setUserPhone,
    userEmail,
    updateUserProfileInFirestore,
    ownerId,
    businessAddress, setBusinessAddress,
    licenseNumber, setLicenseNumber,
    userPhoneVerified,
    readOwnerListingsRemote,
    writeOwnerListingsRemote,
  } = useContext(GlobalContext);

  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("add-listing");
  const [syncStatus, setSyncStatus] = useState('idle');
  const [isSyncing, setIsSyncing] = useState(false);
  const [formData, setFormData] = useState(initialFormData);
  const [ownerListings, setOwnerListings] = useState([]);
  const [editingListingId, setEditingListingId] = useState(null);
  const [newGuideFeatureText, setNewGuideFeatureText] = useState("");
  const fileInputRef = useRef(null);

  // --- DATA FETCHING & SYNCING ---

  useEffect(() => {
    if (ownerId) {
      readOwnerListingsRemote(ownerId)
        .then(listings => setOwnerListings(listings || []))
        .catch(() => toast.error("Failed to load listings."));
    }
  }, [ownerId, readOwnerListingsRemote]);

  const syncListings = useCallback(async () => {
    if (!ownerId || isSyncing) return;
    setIsSyncing(true);
    setSyncStatus('syncing');
    try {
      const success = await writeOwnerListingsRemote(ownerListings, ownerId);
      setSyncStatus(success ? 'synced' : 'error');
      toast[success ? 'success' : 'error'](success ? "Listings synced!" : "Sync failed.");
    } catch (e) {
      setSyncStatus('error');
      toast.error("An error occurred during sync.");
    } finally {
      setIsSyncing(false);
    }
  }, [ownerId, ownerListings, writeOwnerListingsRemote, isSyncing]);

  // --- FORM & ARRAY HANDLERS ---

  const handleFormChange = (e) => setFormData(p => ({ ...p, [e.target.name]: e.target.value }));
  const handleSelectChange = (name, value) => setFormData(p => ({ ...p, [name]: value }));

  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files);
    if (formData.photos.length + files.length > 10) return toast.error("Max 10 photos allowed.");
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (event) => setFormData(p => ({ ...p, photos: [...p.photos, event.target.result] }));
      reader.readAsDataURL(file);
    });
  };

  const removePhoto = (index) => setFormData(p => ({ ...p, photos: p.photos.filter((_, i) => i !== index) }));

  const updateNestedArray = (arr, id, field, val) => setFormData(p => ({ ...p, listingDetails: { ...p.listingDetails, [arr]: p.listingDetails[arr].map(i => i.id === id ? { ...i, [field]: val } : i) } }));
  const addToArray = (arr, item) => setFormData(p => ({ ...p, listingDetails: { ...p.listingDetails, [arr]: [...p.listingDetails[arr], item] } }));
  const deleteFromArray = (arr, id) => setFormData(p => ({ ...p, listingDetails: { ...p.listingDetails, [arr]: p.listingDetails[arr].filter(i => i.id !== id) } }));
  const toggleInArray = (arr, id, field, val) => setFormData(p => ({ ...p, listingDetails: { ...p.listingDetails, [arr]: p.listingDetails[arr].map(i => i.id === id ? { ...i, [field]: i[field].includes(val) ? i[field].filter(f => f !== val) : [...i[field], val] } : i) } }));

  const addGuideFeature = useCallback(() => {
    if (newGuideFeatureText.trim() && !formData.listingDetails.guideFeatures.includes(newGuideFeatureText.trim())) {
      setFormData(p => ({ ...p, listingDetails: { ...p.listingDetails, guideFeatures: [...p.listingDetails.guideFeatures, newGuideFeatureText.trim()] } }));
      setNewGuideFeatureText("");
    }
  }, [newGuideFeatureText, formData.listingDetails.guideFeatures]);

  const removeGuideFeature = (feature) => setFormData(p => ({ ...p, listingDetails: { ...p.listingDetails, guideFeatures: p.listingDetails.guideFeatures.filter(f => f !== feature) } }));

  // --- CORE LOGIC ---

  const handlePublishListing = async () => {
    if (!formData.name || !formData.location) return toast.error("Name and Location are required.");
    
    const listingData = { ...formData, profession: globalProfession };
    let updatedListings;

    if (editingListingId) {
      updatedListings = ownerListings.map(l => l.id === editingListingId ? { ...listingData, id: editingListingId } : l);
    } else {
      updatedListings = [...ownerListings, { ...listingData, id: Date.now().toString(), ownerId, status: "Active", bookings: 0, revenue: "₹0" }];
    }
    
    const success = await writeOwnerListingsRemote(updatedListings, ownerId);
    if (success) {
      setOwnerListings(updatedListings);
      toast.success(`Listing ${editingListingId ? 'updated' : 'published'}!`);
      setFormData(initialFormData);
      setEditingListingId(null);
      setActiveTab("my-listings");
    } else {
      toast.error("Failed to save listing.");
    }
  };

  const handleEditListing = (listingId) => {
    const listing = ownerListings.find(l => l.id === listingId);
    if (listing) {
      setFormData({ ...initialFormData, ...listing }); // Ensure all keys exist
      setGlobalProfession(listing.profession);
      setEditingListingId(listingId);
      setActiveTab("add-listing");
    }
  };

  const handleDeleteListing = async (listingId) => {
    if (!window.confirm("Are you sure?")) return;
    const newListings = ownerListings.filter(l => l.id !== listingId);
    const success = await writeOwnerListingsRemote(newListings, ownerId);
    if (success) {
      setOwnerListings(newListings);
      toast.success("Listing deleted.");
    } else {
      toast.error("Failed to delete listing.");
    }
  };

  const handleUpdateProfile = async () => {
    const success = await updateUserProfileInFirestore({ displayName: userName, phoneNumber: userPhone, profession: globalProfession, businessAddress, licenseNumber });
    toast[success ? 'success' : 'error'](success ? 'Profile updated!' : 'Update failed.');
  };

  // --- UI RENDER FUNCTIONS ---

  const renderProfessionForm = () => {
    // This function uses the exact structure and logic you provided.
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
                      <Input placeholder="e.g., Deluxe, Suite" value={room.type} onChange={(e) => updateNestedArray("rooms", room.id, "type", e.target.value)}/>
                    </div>
                    <div>
                      <Label>Price per Night</Label>
                      <Input type="number" placeholder="Enter Price" value={room.price} onChange={(e) => updateNestedArray("rooms", room.id, "price", e.target.value)}/>
                    </div>
                    <div>
                      <Label>View</Label>
                      <Select value={room.view} onValueChange={(v) => updateNestedArray("rooms", room.id, "view", v)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select view"/>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="lake">Lake View</SelectItem>
                          <SelectItem value="mountain">Mountain View</SelectItem>
                          <SelectItem value="garden">Garden View</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div>
                    <Label>Features</Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {["TV", "WiFi", "AC", "Room Service", "Balcony"].map(f => (
                        <Badge key={f} variant={room.features.includes(f) ? "default" : "outline"} className="cursor-pointer" onClick={() => toggleInArray('rooms', room.id, 'features', f)}>
                          {f}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="flex justify-end mt-4">
                    <Button variant="destructive" size="sm" onClick={() => deleteFromArray("rooms", room.id)}>
                      <Trash2 className="w-4 h-4 mr-2"/>Delete Room
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
                <Plus className="w-4 h-4 mr-2"/>Add Bike
              </Button>
            </div>
            {formData.listingDetails.bikes.length === 0 && <p className="text-muted-foreground">No bikes added yet.</p>}
            {formData.listingDetails.bikes.map(bike => (
              <Card key={bike.id}>
                <CardContent className="p-4 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label>Name / Model</Label>
                      <Input placeholder="e.g., Activa, Classic 350" value={bike.name} onChange={e => updateNestedArray("bikes", bike.id, "name", e.target.value)}/>
                    </div>
                    <div>
                      <Label>Type</Label>
                      <Select value={bike.type} onValueChange={v => updateNestedArray("bikes", bike.id, "type", v)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type"/>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="scooter">Scooter</SelectItem>
                          <SelectItem value="motorcycle">Motorcycle</SelectItem>
                          <SelectItem value="bicycle">Bicycle</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Price per Day</Label>
                      <Input type="number" placeholder="Enter Price" value={bike.price} onChange={e => updateNestedArray("bikes", bike.id, "price", e.target.value)}/>
                    </div>
                  </div>
                  <div className="flex justify-end mt-4">
                    <Button variant="destructive" size="sm" onClick={() => deleteFromArray("bikes", bike.id)}>
                      <Trash2 className="w-4 h-4 mr-2"/>Delete Bike
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
                <Plus className="w-4 h-4 mr-2"/>Add Vehicle
              </Button>
            </div>
            {formData.listingDetails.vehicles.length === 0 && <p className="text-muted-foreground">No vehicles added yet.</p>}
            {formData.listingDetails.vehicles.map(vehicle => (
              <Card key={vehicle.id}>
                <CardContent className="p-4 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label>Name / Model</Label>
                      <Input placeholder="e.g., Maruti Dzire" value={vehicle.name} onChange={e => updateNestedArray("vehicles", vehicle.id, "name", e.target.value)}/>
                    </div>
                    <div>
                      <Label>Type</Label>
                      <Select value={vehicle.type} onValueChange={v => updateNestedArray("vehicles", vehicle.id, "type", v)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type"/>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="sedan">Sedan</SelectItem>
                          <SelectItem value="suv">SUV</SelectItem>
                          <SelectItem value="hatchback">Hatchback</SelectItem>
                          <SelectItem value="tempo">Tempo</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Rate</Label>
                      <Input placeholder="e.g., ₹20/km or ₹2000/day" value={vehicle.rate} onChange={e => updateNestedArray("vehicles", vehicle.id, "rate", e.target.value)}/>
                    </div>
                  </div>
                  <div className="flex justify-end mt-4">
                    <Button variant="destructive" size="sm" onClick={() => deleteFromArray("vehicles", vehicle.id)}>
                      <Trash2 className="w-4 h-4 mr-2"/>Delete Vehicle
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
              <Input id="guide-rate" type="number" placeholder="800" name="price" value={formData.price} onChange={handleFormChange}/>
            </div>
            <div>
              <Label>Expertise/Specialization</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.listingDetails.guideFeatures.map(f => (
                  <Badge key={f} className="flex items-center gap-1">
                    {f}
                    <X className="w-3 h-3 cursor-pointer" onClick={() => removeGuideFeature(f)}/>
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2 mt-2">
                <Input placeholder="e.g., Mountain Trekking" value={newGuideFeatureText} onChange={e => setNewGuideFeatureText(e.target.value)} onKeyPress={e => e.key === 'Enter' && addGuideFeature()}/>
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
              <Input type="number" placeholder="Enter Price" name="price" value={formData.price} onChange={handleFormChange}/>
            </div>
            <div>
              <Label>Amenities</Label>
              <p className="text-muted-foreground text-sm">Add key amenities like 'Fireplace', 'Kitchen' in the main description section above.</p>
            </div>
          </div>
        );
      case "tours-treks":
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Tour & Trek Details</h3>
            <div>
              <Label>Price per Person</Label>
              <Input type="number" placeholder="Enter Price" name="price" value={formData.price} onChange={handleFormChange}/>
            </div>
            <div>
              <Label>Difficulty</Label>
              <Select value={formData.listingDetails.treks[0]?.difficulty || ""} onValueChange={v => setFormData(p => ({ ...p.listingDetails, treks: [{ id: Date.now(), difficulty: v }] }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select difficulty"/>
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
      default:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">General Listing</h3>
            <div>
              <Label>Service Rate (Optional)</Label>
              <Input type="number" placeholder="e.g., 800" name="price" value={formData.price} onChange={handleFormChange}/>
            </div>
            <div>
              <Label>Features (comma-separated)</Label>
              <Input placeholder="e.g., Hiking, Photography" value={formData.listingDetails.guideFeatures.join(", ")} onChange={e => setFormData(p => ({ ...p.listingDetails, guideFeatures: e.target.value.split(",").map(f => f.trim()).filter(Boolean) }))}/>
            </div>
            <p className="text-sm text-muted-foreground mt-1">For more specific options, please select a profession in your profile.</p>
          </div>
        );
    }
  };
  
  const getPreviewPrice = () => {
    // Logic to determine price for the preview card
    if (globalProfession === "resort-hotel" && formData.listingDetails.rooms[0]?.price) return `₹${formData.listingDetails.rooms[0].price}/night`;
    if (globalProfession === "rental-bikes" && formData.listingDetails.bikes[0]?.price) return `₹${formData.listingDetails.bikes[0].price}/day`;
    if (globalProfession === "cabs-taxis" && formData.listingDetails.vehicles[0]?.rate) return `${formData.listingDetails.vehicles[0].rate}`;
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
            <span className={`text-sm font-medium ${syncStatus === 'synced' ? 'text-green-600' : syncStatus === 'syncing' ? 'text-blue-600' : 'text-gray-500'}`}>{syncStatus}</span>
            <Button variant="outline" onClick={syncListings} disabled={isSyncing}>
              {isSyncing && <Loader2 className="w-4 h-4 animate-spin mr-2"/>}
              Sync Now
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
          <TabsContent value="add-listing" className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>{editingListingId ? "Edit Listing" : "Create New Listing"}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Name</Label>
                    <Input name="name" value={formData.name} onChange={handleFormChange}/>
                  </div>
                  <div>
                    <Label>Location</Label>
                    <Select value={formData.location} onValueChange={v => handleSelectChange("location", v)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select location"/>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="nainital">Nainital</SelectItem>
                        <SelectItem value="bhimtal">Bhimtal</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label>Description</Label>
                  <Textarea name="description" value={formData.description} onChange={handleFormChange} rows={4}/>
                </div>
                <div>
                  <Label>Photos</Label>
                  <div className="border-2 border-dashed rounded-lg p-6 text-center relative mt-1">
                    <input type="file" multiple accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handlePhotoUpload} ref={fileInputRef}/>
                    <Upload className="w-10 h-10 mx-auto mb-2 text-gray-400"/>
                    <p>Drop files or <span className="text-primary font-medium">browse</span> (Max 10)</p>
                  </div>
                  {formData.photos.length > 0 && (
                    <div className="mt-4 grid grid-cols-3 md:grid-cols-5 gap-2">
                      {formData.photos.map((p, i) => (
                        <div key={i} className="relative aspect-square rounded-md overflow-hidden group">
                          <img src={p} alt={`Preview ${i + 1}`} className="w-full h-full object-cover" />
                          <Button variant="destructive" size="icon" className="absolute top-1 right-1 h-5 w-5 rounded-full opacity-0 group-hover:opacity-100" onClick={() => removePhoto(i)}>
                            <X className="w-3 h-3"/>
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <Separator/>
                {renderProfessionForm()}
                <Separator/>
                <div className="flex justify-end space-x-4">
                  <Button variant="outline" onClick={() => setFormData(initialFormData)}>Clear Form</Button>
                  <Button onClick={handlePublishListing}>{editingListingId ? "Update Listing" : "Publish Listing"}</Button>
                </div>
              </CardContent>
            </Card>
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>Live Preview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="border rounded-lg p-4">
                    <div className="aspect-video bg-gray-200 rounded mb-4 flex items-center justify-center overflow-hidden">
                      {formData.photos[0] ? <img src={formData.photos[0]} alt="Preview" className="w-full h-full object-cover"/> : <span className="text-gray-500 text-sm">Image</span>}
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
          <TabsContent value="my-listings" className="mt-6 space-y-4">
            {ownerListings.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No listings yet. Add one!</p>
            ) : (
              ownerListings.map(l => (
                <Card key={l.id}>
                  <CardContent className="p-4 flex flex-col md:flex-row items-center gap-4">
                    <div className="shrink-0 w-full md:w-32 h-24 bg-gray-200 rounded-md overflow-hidden">
                      {l.photos?.[0] ? <img src={l.photos[0]} alt={l.name} className="w-full h-full object-cover"/> : <div className="flex items-center justify-center h-full text-xs text-gray-500">No Image</div>}
                    </div>
                    <div className="grow">
                      <h3 className="text-lg font-semibold">{l.name}</h3>
                      <p className="text-muted-foreground capitalize">{l.location}</p>
                      <div className="mt-2 flex items-center space-x-4 text-sm">
                        <Badge>{l.status}</Badge>
                        <span>Bookings: <strong>{l.bookings}</strong></span>
                      </div>
                    </div>
                    <div className="flex space-x-2 shrink-0 self-start md:self-center">
                      <Button variant="outline" size="icon" onClick={() => handleEditListing(l.id)}>
                        <Edit className="w-4 h-4"/>
                      </Button>
                      <Button variant="destructive" size="icon" onClick={() => handleDeleteListing(l.id)}>
                        <Trash2 className="w-4 h-4"/>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>
          <TabsContent value="profile" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Business Profile</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Business Name</Label>
                    <Input value={userName} onChange={e => setUserName(e.target.value)}/>
                  </div>
                  <div>
                    <Label>Contact Number</Label>
                    <div className="flex items-center gap-3">
                      <Input value={userPhone} onChange={e => setUserPhone(e.target.value)}/>
                      {userPhoneVerified ? <Badge variant="secondary">Verified</Badge> : <Button size="sm" variant="outline" onClick={() => navigate('/profile?verifyPhone=1')}>Verify</Button>}
                    </div>
                  </div>
                  <div>
                    <Label>Email</Label>
                    <Input value={userEmail || ""} disabled/>
                  </div>
                  <div>
                    <Label>Profession</Label>
                    <Select value={globalProfession} onValueChange={setGlobalProfession}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select..."/>
                      </SelectTrigger>
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
                  <Label>License Number</Label>
                  <Input value={licenseNumber} onChange={e => setLicenseNumber(e.target.value)}/>
                </div>
                <div>
                  <Label>Business Address</Label>
                  <Textarea value={businessAddress} onChange={e => setBusinessAddress(e.target.value)}/>
                </div>
                <Button onClick={handleUpdateProfile} className="w-full">Update Profile</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}