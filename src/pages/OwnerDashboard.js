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
import { Plus, Upload, Eye, Edit, Trash2, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { GlobalContext } from "../component/GlobalContext";

export default function OwnerDashboard() {
  const {
    profession: globalProfession,
    setProfession: setGlobalProfession,
    userType,
    userName, setUserName,
    userEmail, setUserEmail,
    userPhone, setUserPhone,
    readOwnerListings,
    writeOwnerListings,
    ownerId,
    businessAddress, setBusinessAddress,
    licenseNumber, setLicenseNumber,
    loginPlatform, setLoginPlatform,
    language, setLanguage,
  } = useContext(GlobalContext);

  const [activeTab, setActiveTab] = useState("add-listing");
  const navigate = useNavigate();

  const currentProfession = globalProfession;

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

  const [formData, setFormData] = useState(initialFormData);
  const [ownerListings, setOwnerListings] = useState([]);
  const [editingListingId, setEditingListingId] = useState(null);

  // State for local-guides new feature input, hoisted to top level
  const [newGuideFeatureText, setNewGuideFeatureText] = useState("");

  const fileInputRef = useRef(null);

  useEffect(() => {
    if (ownerId) {
      setOwnerListings(readOwnerListings(ownerId));
    }
  }, [ownerId, readOwnerListings]);

  useEffect(() => {
    if (!editingListingId) {
      let initialDetails = {
        rooms: [],
        bikes: [],
        vehicles: [],
        guideFeatures: [],
        treks: [],
        hillStayAmenities: [],
      };

      switch (currentProfession) {
        case "resort-hotel":
          initialDetails.rooms = [{ id: Date.now(), type: "", price: "", features: [], view: "" }];
          break;
        case "rental-bikes":
          initialDetails.bikes = [{ id: Date.now(), type: "", range: "", price: "" }];
          break;
        case "cabs-taxis":
          initialDetails.vehicles = [{ id: Date.now(), type: "", price: "" }];
          break;
        default:
          break;
      }

      setFormData(prev => ({
        ...initialFormData,
        profession: currentProfession,
        listingDetails: initialDetails
      }));
      setNewGuideFeatureText(""); // Also reset this specific state
    }
  }, [currentProfession, editingListingId]);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files);
    if (formData.photos.length + files.length > 10) {
      alert("You can upload a maximum of 10 photos.");
      return;
    }
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        setFormData((prev) => ({
          ...prev,
          photos: [...prev.photos, event.target.result],
        }));
      };
      reader.readAsDataURL(file);
    });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removePhoto = (index) => {
    setFormData((prev) => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index),
    }));
  };

  const updateNestedArray = (arrayName, id, field, value) => {
    setFormData((prev) => ({
      ...prev,
      listingDetails: {
        ...prev.listingDetails,
        [arrayName]: prev.listingDetails[arrayName].map((item) =>
          item.id === id ? { ...item, [field]: value } : item
        ),
      },
    }));
  };

  const addRoom = () => {
    setFormData((prev) => ({
      ...prev,
      listingDetails: {
        ...prev.listingDetails,
        rooms: [...prev.listingDetails.rooms, { id: Date.now(), type: "", price: "", features: [], view: "" }],
      },
    }));
  };

  const deleteRoom = (id) => {
    setFormData((prev) => ({
      ...prev,
      listingDetails: {
        ...prev.listingDetails,
        rooms: prev.listingDetails.rooms.filter((room) => room.id !== id),
      },
    }));
  };

  const toggleRoomFeature = (roomId, feature) => {
    setFormData((prev) => ({
      ...prev,
      listingDetails: {
        ...prev.listingDetails,
        rooms: prev.listingDetails.rooms.map((room) =>
          room.id === roomId
            ? {
              ...room,
              features: room.features.includes(feature)
                ? room.features.filter((f) => f !== feature)
                : [...room.features, feature],
            }
            : room
        ),
      },
    }));
  };

  const addBike = () => {
    setFormData((prev) => ({
      ...prev,
      listingDetails: {
        ...prev.listingDetails,
        bikes: [...prev.listingDetails.bikes, { id: Date.now(), type: "", range: "", price: "" }],
      },
    }));
  };

  const deleteBike = (id) => {
    setFormData((prev) => ({
      ...prev,
      listingDetails: {
        ...prev.listingDetails,
        bikes: prev.listingDetails.bikes.filter((bike) => bike.id !== id),
      },
    }));
  };

  const addVehicle = () => {
    setFormData((prev) => ({
      ...prev,
      listingDetails: {
        ...prev.listingDetails,
        vehicles: [...prev.listingDetails.vehicles, { id: Date.now(), type: "", price: "" }],
      },
    }));
  };

  const deleteVehicle = (id) => {
    setFormData((prev) => ({
      ...prev,
      listingDetails: {
        ...prev.listingDetails,
        vehicles: prev.listingDetails.vehicles.filter((vehicle) => vehicle.id !== id),
      },
    }));
  };

  const addGuideFeature = useCallback(() => {
    if (newGuideFeatureText && !formData.listingDetails.guideFeatures.includes(newGuideFeatureText)) {
      setFormData((prev) => ({
        ...prev,
        listingDetails: {
          ...prev.listingDetails,
          guideFeatures: [...prev.listingDetails.guideFeatures, newGuideFeatureText],
        },
      }));
      setNewGuideFeatureText(""); // Clear input after adding
    }
  }, [newGuideFeatureText, formData.listingDetails.guideFeatures]);

  const removeGuideFeature = (featureToRemove) => {
    setFormData((prev) => ({
      ...prev,
      listingDetails: {
        ...prev.listingDetails,
        guideFeatures: prev.listingDetails.guideFeatures.filter((f) => f !== featureToRemove),
      },
    }));
  };

  const handlePublishListing = () => {
    if (!ownerId) {
      alert("Owner ID not set. Please ensure you are logged in and your profile is complete.");
      return;
    }

    if (!formData.name || !formData.location || !formData.description) {
      alert("Please fill in Name, Location, and Description.");
      return;
    }

    let updatedListings;
    if (editingListingId) {
      updatedListings = ownerListings.map(listing =>
        listing.id === editingListingId
          ? { ...formData, id: editingListingId, ownerId: ownerId, profession: currentProfession, status: "Active", bookings: listing.bookings, revenue: listing.revenue }
          : listing
      );
    } else {
      const newListing = {
        id: Date.now().toString(),
        ownerId: ownerId,
        profession: currentProfession,
        status: "Active",
        bookings: 0,
        revenue: "₹0",
        ...formData,
      };
      updatedListings = [...ownerListings, newListing];
    }

    if (writeOwnerListings(updatedListings, ownerId)) {
      setOwnerListings(updatedListings);
      alert(editingListingId ? "Listing Updated Successfully!" : "Listing Published Successfully!");
      setFormData(initialFormData);
      setEditingListingId(null);
      setActiveTab("my-listings");
      setNewGuideFeatureText(""); // Reset this too
    } else {
      alert("Failed to save listing. Please try again.");
    }
  };

  const handleBackToSite = () => {
    navigate("/");
  };

  const handleEditListing = (listingId) => {
    const listingToEdit = ownerListings.find(l => l.id === listingId);
    if (listingToEdit) {
      setFormData({
        id: listingToEdit.id,
        name: listingToEdit.name,
        location: listingToEdit.location,
        description: listingToEdit.description,
        price: listingToEdit.price || "",
        photos: listingToEdit.photos || [],
        listingDetails: {
          rooms: listingToEdit.listingDetails?.rooms || [],
          bikes: listingToEdit.listingDetails?.bikes || [],
          vehicles: listingToEdit.listingDetails?.vehicles || [],
          guideFeatures: listingToEdit.listingDetails?.guideFeatures || [],
          treks: listingToEdit.listingDetails?.treks || [],
          hillStayAmenities: listingToEdit.listingDetails?.hillStayAmenities || [],
        },
      });
      setGlobalProfession(listingToEdit.profession);
      setEditingListingId(listingId);
      setActiveTab("add-listing");
      // If editing a local-guide, pre-populate newGuideFeatureText if needed (or keep it clear)
      setNewGuideFeatureText("");
    }
  };

  const handleDeleteListing = (listingId) => {
    if (window.confirm("Are you sure you want to delete this listing? This action cannot be undone.")) {
      const updatedListings = ownerListings.filter((listing) => listing.id !== listingId);
      if (writeOwnerListings(updatedListings, ownerId)) {
        setOwnerListings(updatedListings);
        alert("Listing deleted successfully!");
      } else {
        alert("Failed to delete listing.");
      }
    }
  };

  const handleUpdateProfile = () => {
    setUserName(userName);
    setUserEmail(userEmail);
    setUserPhone(userPhone);
    setGlobalProfession(globalProfession);

    alert("Profile updated successfully!");
  };

  const renderProfessionForm = () => {
    switch (currentProfession) {
      case "resort-hotel":
        return (
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Rooms</h3>
                <Button onClick={addRoom} size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Room
                </Button>
              </div>
              <div className="space-y-4">
                {formData.listingDetails.rooms.length === 0 && <p className="text-muted-foreground">No rooms added yet.</p>}
                {formData.listingDetails.rooms.map((room) => (
                  <Card key={room.id} className="p-0">
                    <CardContent className="p-4 space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <Label htmlFor={`room-type-${room.id}`}>Room Type</Label>
                          <Input
                            id={`room-type-${room.id}`}
                            placeholder="e.g., Deluxe, Suite"
                            value={room.type}
                            onChange={(e) => updateNestedArray("rooms", room.id, "type", e.target.value)}
                          />
                        </div>
                        <div>
                          <Label htmlFor={`room-price-${room.id}`}>Price per Night</Label>
                          <Input
                            id={`room-price-${room.id}`}
                            type="number"
                            placeholder="Enter Price"
                            value={room.price}
                            onChange={(e) => updateNestedArray("rooms", room.id, "price", e.target.value)}
                          />
                        </div>
                        <div>
                          <Label htmlFor={`room-view-${room.id}`}>View Point</Label>
                          <Select
                            value={room.view}
                            onValueChange={(value) => updateNestedArray("rooms", room.id, "view", value)}
                          >
                            <SelectTrigger id={`room-view-${room.id}`}>
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
                          {["TV", "WiFi", "AC", "Pool Access", "Room Service", "Balcony", "Mini Bar"].map((feature) => (
                            <Badge
                              key={feature}
                              variant={room.features.includes(feature) ? "default" : "outline"}
                              className="cursor-pointer"
                              onClick={() => toggleRoomFeature(room.id, feature)}
                            >
                              {feature}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div className="flex justify-end mt-4">
                        <Button variant="destructive" size="sm" onClick={() => deleteRoom(room.id)}>
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete Room
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        );

      case "rental-bikes":
        return (
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Bikes & Scooters</h3>
                <Button onClick={addBike} size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Bike
                </Button>
              </div>
              <div className="space-y-4">
                {formData.listingDetails.bikes.length === 0 && <p className="text-muted-foreground">No bikes added yet.</p>}
                {formData.listingDetails.bikes.map((bike) => (
                  <Card key={bike.id} className="p-0">
                    <CardContent className="p-4 space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <Label htmlFor={`bike-type-${bike.id}`}>Bike Type</Label>
                          <Select
                            value={bike.type}
                            onValueChange={(value) => updateNestedArray("bikes", bike.id, "type", value)}
                          >
                            <SelectTrigger id={`bike-type-${bike.id}`}>
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
                          <Label htmlFor={`bike-range-${bike.id}`}>Range (e.g., km or hours)</Label>
                          <Input
                            id={`bike-range-${bike.id}`}
                            placeholder="100km or 4 hours"
                            value={bike.range}
                            onChange={(e) => updateNestedArray("bikes", bike.id, "range", e.target.value)}
                          />
                        </div>
                        <div>
                          <Label htmlFor={`bike-price-${bike.id}`}>Price per Day</Label>
                          <Input
                            id={`bike-price-${bike.id}`}
                            type="number"
                            placeholder="Enter Price"
                            value={bike.price}
                            onChange={(e) => updateNestedArray("bikes", bike.id, "price", e.target.value)}
                          />
                        </div>
                      </div>
                      <div className="flex justify-end mt-4">
                        <Button variant="destructive" size="sm" onClick={() => deleteBike(bike.id)}>
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete Bike
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        );

      case "cabs-taxis":
        return (
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Vehicles</h3>
                <Button onClick={addVehicle} size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Vehicle
                </Button>
              </div>
              <div className="space-y-4">
                {formData.listingDetails.vehicles.length === 0 && <p className="text-muted-foreground">No vehicles added yet.</p>}
                {formData.listingDetails.vehicles.map((vehicle) => (
                  <Card key={vehicle.id} className="p-0">
                    <CardContent className="p-4 space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor={`vehicle-type-${vehicle.id}`}>Vehicle Type</Label>
                          <Select
                            value={vehicle.type}
                            onValueChange={(value) => updateNestedArray("vehicles", vehicle.id, "type", value)}
                          >
                            <SelectTrigger id={`vehicle-type-${vehicle.id}`}>
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
                          <Label htmlFor={`vehicle-price-${vehicle.id}`}>Rate (e.g., per km or per day)</Label>
                          <Input
                            id={`vehicle-price-${vehicle.id}`}
                            placeholder="₹20/km or ₹2000/day"
                            value={vehicle.price}
                            onChange={(e) => updateNestedArray("vehicles", vehicle.id, "price", e.target.value)}
                          />
                        </div>
                      </div>
                      <div className="flex justify-end mt-4">
                        <Button variant="destructive" size="sm" onClick={() => deleteVehicle(vehicle.id)}>
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete Vehicle
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        );

      case "local-guides":
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="guide-rate">Service Rate (e.g., per day)</Label>
              <Input
                id="guide-rate"
                type="number"
                placeholder="800"
                name="price"
                value={formData.price}
                onChange={handleFormChange}
              />
            </div>
            <div>
              <Label>Expertise/Specialization</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.listingDetails.guideFeatures.length === 0 && (
                  <p className="text-muted-foreground text-sm">No specializations added yet.</p>
                )}
                {formData.listingDetails.guideFeatures.map((feature) => (
                  <Badge
                    key={feature}
                    variant="default"
                    className="cursor-pointer flex items-center gap-1"
                    onClick={() => removeGuideFeature(feature)}
                  >
                    {feature} <X className="w-3 h-3" />
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2 mt-2">
                <Input
                  placeholder="e.g., Mountain Trekking, Local History"
                  value={newGuideFeatureText}
                  onChange={(e) => setNewGuideFeatureText(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && newGuideFeatureText.trim()) {
                      addGuideFeature();
                      e.preventDefault();
                    }
                  }}
                />
                <Button onClick={addGuideFeature} type="button">
                  Add
                </Button>
              </div>
              <p className="text-sm text-muted-foreground mt-1">Press Enter or click Add to add a feature.</p>
            </div>
          </div>
        );

      case "hill-stays":
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="hill-stay-price">Price per Night</Label>
              <Input
                id="hill-stay-price"
                type="number"
                placeholder="Enter Price"
                name="price"
                value={formData.price}
                onChange={handleFormChange}
              />
            </div>
            <Label>Amenities</Label>
            <p className="text-muted-foreground text-sm">Add amenities like fireplace, private balcony, etc.</p>
          </div>
        );

      case "tours-treks":
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="trek-price">Price per Person</Label>
              <Input
                id="trek-price"
                type="number"
                placeholder="Enter Price"
                name="price"
                value={formData.price}
                onChange={handleFormChange}
              />
            </div>
            <Label htmlFor="trek-difficulty">Difficulty</Label>
            <Select
              value={formData.listingDetails.treks?.[0]?.difficulty || ""}
              onValueChange={(value) => {
                // Ensure treks array exists and has at least one item before updating
                const currentTreks = formData.listingDetails.treks;
                if (currentTreks.length === 0) {
                  setFormData(prev => ({
                    ...prev,
                    listingDetails: {
                      ...prev.listingDetails,
                      treks: [{ id: Date.now(), difficulty: value }],
                    },
                  }));
                } else {
                  updateNestedArray("treks", currentTreks[0].id, "difficulty", value);
                }
              }}
            >
              <SelectTrigger id="trek-difficulty">
                <SelectValue placeholder="Select difficulty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="easy">Easy</SelectItem>
                <SelectItem value="moderate">Moderate</SelectItem>
                <SelectItem value="challenging">Challenging</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-muted-foreground text-sm">Add duration, itinerary, etc., here.</p>
          </div>
        );

      default:
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="default-service-rate">Service Rate (Optional)</Label>
              <Input
                id="default-service-rate"
                type="number"
                placeholder="e.g., 800"
                name="price"
                value={formData.price}
                onChange={handleFormChange}
              />
            </div>
            <div>
              <Label htmlFor="default-expertise">Expertise/Specialization (Optional)</Label>
              <Input
                id="default-expertise"
                placeholder="Hiking, Photography, Cuisine (comma separated)"
                name="features"
                value={formData.listingDetails.guideFeatures.join(", ")}
                onChange={(e) => {
                  setFormData((prev) => ({
                    ...prev,
                    listingDetails: {
                      ...prev.listingDetails,
                      guideFeatures: e.target.value.split(",").map(f => f.trim()).filter(Boolean),
                    },
                  }));
                }}
              />
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Please ensure your profession is correctly set in your profile for a more specific listing form.
            </p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold">Owner Dashboard</h1>
            <p className="text-muted-foreground">Manage your {currentProfession.replace('-', ' ')} listings</p>
          </div>
          <Button variant="outline" onClick={handleBackToSite}>
            Back to Site
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 ">
            <TabsTrigger value="add-listing">{editingListingId ? "Edit Listing" : "Add Listing"}</TabsTrigger>
            <TabsTrigger value="my-listings">My Listings</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
          </TabsList>

          <TabsContent value="add-listing" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>{editingListingId ? "Edit Listing" : "Create New Listing"}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="business-name">Business/Service Name</Label>
                    <Input
                      id="business-name"
                      name="name"
                      placeholder="Mountain View Resort"
                      value={formData.name}
                      onChange={handleFormChange}
                    />
                  </div>
                  <div>
                    <Label htmlFor="location-select">Location</Label>
                    <Select
                      value={formData.location}
                      onValueChange={(value) => handleSelectChange("location", value)}
                    >
                      <SelectTrigger id="location-select">
                        <SelectValue placeholder="Select location" />
                      </SelectTrigger>
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
                  <Label htmlFor="description-textarea">Description</Label>
                  <Textarea
                    id="description-textarea"
                    name="description"
                    placeholder="Describe your service or property..."
                    value={formData.description}
                    onChange={handleFormChange}
                    rows={4}
                  />
                </div>

                <div>
                  <Label>Photos</Label>
                  <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-8 text-center relative">
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      className="absolute inset-0 opacity-0 cursor-pointer"
                      onChange={handlePhotoUpload}
                      ref={fileInputRef}
                    />
                    <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                    <p className="text-gray-500 dark:text-gray-400">Drag & drop or <span className="text-primary font-medium">choose files</span></p>
                    <p className="text-sm text-gray-400 dark:text-gray-500">Upload up to 10 photos of your listing</p>
                  </div>
                  {formData.photos.length > 0 && (
                    <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                      {formData.photos.map((photo, index) => (
                        <div key={index} className="relative aspect-video rounded-md overflow-hidden group">
                          <img src={photo} alt={`Upload preview ${index + 1}`} className="w-full h-full object-cover" />
                          <Button
                            variant="destructive"
                            size="icon"
                            className="absolute top-1 right-1 h-6 w-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => removePhoto(index)}
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <Separator />

                {renderProfessionForm()}

                <div className="flex justify-end space-x-4">
                  <Button variant="outline" type="button">Save Draft</Button>
                  <Button onClick={handlePublishListing} className="bg-primary hover:bg-primary/90" type="button">
                    {editingListingId ? "Update Listing" : "Publish Listing"}
                  </Button>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Preview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="border rounded-lg p-4 bg-white dark:bg-gray-800">
                  <div className="aspect-video bg-gray-200 dark:bg-gray-700 rounded mb-4 flex items-center justify-center overflow-hidden">
                    {formData.photos.length > 0 ? (
                      <img src={formData.photos[0]} alt="Listing Preview" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-gray-500 dark:text-gray-400">Preview Image</span>
                    )}
                  </div>
                  <h3 className="font-semibold text-lg">{formData.name || "Your Listing Name"}</h3>
                  <p className="text-muted-foreground text-sm">{formData.description || "Your description will appear here..."}</p>
                  <div className="mt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                    <span className="text-2xl font-bold text-primary dark:text-blue-400">
                      {
                        currentProfession === "resort-hotel" && formData.listingDetails.rooms.length > 0 && formData.listingDetails.rooms[0].price
                          ? `₹${formData.listingDetails.rooms[0].price}`
                          : currentProfession === "rental-bikes" && formData.listingDetails.bikes.length > 0 && formData.listingDetails.bikes[0].price
                            ?`₹${formData.listingDetails.bikes[0].price}`
                            : currentProfession === "cabs-taxis" && formData.listingDetails.vehicles.length > 0 && formData.listingDetails.vehicles[0].price
                              ? `₹${formData.listingDetails.vehicles[0].price}`
                              : currentProfession === "local-guides" && formData.price
                                ? `₹${formData.price}/day` // Specific for guides
                                : currentProfession === "hill-stays" && formData.price
                                  ? `₹${formData.price}/night` // Specific for hill stays
                                  : currentProfession === "tours-treks" && formData.price
                                    ? `₹${formData.price}/person` // Specific for tours/treks
                                    : formData.price
                                      ? `₹${formData.price}`
                                      : "₹0"
                      }
                    </span>
                    <Button size="sm" type="button">View Details</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="my-listings" className="space-y-6 mt-6">
            <h2 className="text-2xl font-semibold mb-4">My Published Listings</h2>
            <div className="grid gap-6">
              {ownerListings.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">You haven't added any listings yet. Go to "Add Listing" to create one!</p>
              ) : (
                ownerListings.map((listing) => (
                  <Card key={listing.id}>
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                        <div className="flex-shrink-0 w-full md:w-32 h-24 bg-gray-200 dark:bg-gray-700 rounded-md overflow-hidden">
                          {listing.photos && listing.photos.length > 0 ? (
                            <img src={listing.photos[0]} alt={listing.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="flex items-center justify-center w-full h-full text-gray-400 dark:text-gray-500 text-xs">No Image</div>
                          )}
                        </div>
                        <div className="flex-grow">
                          <h3 className="text-lg font-semibold">{listing.name}</h3>
                          <p className="text-muted-foreground">{listing.location}</p>
                          <div className="mt-2 flex items-center space-x-4 text-sm flex-wrap gap-y-2">
                            <Badge variant="outline" className={`text-green-600 dark:text-green-400 border-green-600 dark:border-green-400`}>
                              {listing.status}
                            </Badge>
                            <span className="text-gray-600 dark:text-gray-300">
                              Bookings: {listing.bookings}
                            </span>
                            <span className="font-semibold text-gray-700 dark:text-gray-200">
                              Revenue: {listing.revenue}
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">Profession: {listing.profession.replace('-', ' ')}</p>
                        </div>
                        <div className="flex space-x-2 flex-shrink-0 mt-4 md:mt-0">
                          <Button variant="outline" size="sm" onClick={() => navigate(`/listings/${listing.id}`)} type="button">
                            <Eye className="w-4 h-4" />
                            <span className="sr-only">View</span>
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => handleEditListing(listing.id)} type="button">
                            <Edit className="w-4 h-4" />
                            <span className="sr-only">Edit</span>
                          </Button>
                          <Button variant="destructive" size="sm" onClick={() => handleDeleteListing(listing.id)} type="button">
                            <Trash2 className="w-4 h-4" />
                            <span className="sr-only">Delete</span>
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="profile" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Business Profile</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="profile-business-name">Business Name</Label>
                    <Input
                      id="profile-business-name"
                      placeholder="Your Business Name"
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="profile-contact-number">Contact Number</Label>
                    <Input
                      id="profile-contact-number"
                      placeholder="+91 xxxxxxxxxx"
                      value={userPhone}
                      onChange={(e) => setUserPhone(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="profile-email">Email</Label>
                    <Input
                      id="profile-email"
                      placeholder="business@email.com"
                      value={userEmail}
                      onChange={(e) => setUserEmail(e.target.value)}
                      readOnly
                      className="bg-gray-100 dark:bg-gray-700 cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <Label htmlFor="profile-profession">Profession</Label>
                    <Select onValueChange={(value) => setGlobalProfession(value)} value={globalProfession}>
                      <SelectTrigger id="profile-profession">
                        <SelectValue placeholder="Select your profession" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="resort-hotel">Resort & Hotel Owner</SelectItem>
                        <SelectItem value="rental-bikes">Rental Bikes Owner</SelectItem>
                        <SelectItem value="cabs-taxis">Cab & Taxi Service</SelectItem>
                        <SelectItem value="local-guides">Local Guide</SelectItem>
                        <SelectItem value="hill-stays">Hill Stays Owner</SelectItem>
                        <SelectItem value="tours-treks">Tours & Treks Operator</SelectItem>
                        <SelectItem value="travel-enthusiast">Other (Default)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="profile-license-number">License Number</Label>
                    <Input
                      id="profile-license-number"
                      placeholder="Tourism License (if applicable)"
                      value={licenseNumber}
                      onChange={(e) => setLicenseNumber(e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="profile-business-address">Business Address</Label>
                  <Textarea
                    id="profile-business-address"
                    placeholder="Full business address"
                    value={businessAddress}
                    onChange={(e) => setBusinessAddress(e.target.value)}
                  />
                </div>
                {loginPlatform && (
                  <div>
                    <Label htmlFor="profile-login-platform">Login Platform</Label>
                    <Input id="profile-login-platform" value={loginPlatform} readOnly className="bg-gray-100 dark:bg-gray-700 cursor-not-allowed" />
                  </div>
                )}


                <Button className="bg-primary hover:bg-primary/90" onClick={handleUpdateProfile} type="button">
                  Update Profile
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}