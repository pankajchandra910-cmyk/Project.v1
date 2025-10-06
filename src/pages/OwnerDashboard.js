import React, { useState, useContext, useEffect } from "react"; // Import React and useContext
import { Card, CardContent, CardHeader, CardTitle } from "../component/Card";
import { Button } from "../component/button";
import { Input } from "../component/input";
import { Label } from "../component/label";
import { Textarea } from "../component/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../component/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../component/tabs";
import { Badge } from "../component/badge";
import { Separator } from "../component/separator";
import { Plus, Upload, Eye, Edit, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { GlobalContext } from "../component/GlobalContext"; // Import GlobalContext

export default function OwnerDashboard() { // Removed profession prop
  const { profession: globalProfession, onBack, setProfession: setGlobalProfession, userType, setUserType } = useContext(GlobalContext); // Access profession, onBack, setProfession, userType, setUserType from GlobalContext
  const [activeTab, setActiveTab] = useState("add-listing");
  const navigate = useNavigate();

  // Determine the profession to use for rendering the form
  const currentProfession = globalProfession;

  const [formData, setFormData] = useState({
    name: "",
    location: "",
    description: "",
    photos: [],
    price: "",
    features: []
  });

  const [rooms, setRooms] = useState([
    { type: "Deluxe", price: "3000", features: ["TV", "Lake View", "WiFi"] }
  ]);

  const [bikes, setBikes] = useState([
    { type: "Scooter", range: "100km", price: "500" }
  ]);

  const [vehicles, setVehicles] = useState([
    { type: "Sedan", price: "20/km" }
  ]);

  const mockListings = [
    {
      id: "1",
      name: "Mountain View Resort",
      location: "Bhimtal",
      status: "Active",
      bookings: 15,
      revenue: "₹45,000"
    },
    {
      id: "2",
      name: "Lake Side Bikes",
      location: "Nainital",
      status: "Active",
      bookings: 28,
      revenue: "₹14,000"
    }
  ];

  useEffect(() => {
    // If the userType is "owner" but profession is still "Travel Enthusiast"
    // you might want to automatically set a default profession or prompt the user.
    // For now, we'll just log it.
    if (userType === "owner" && globalProfession === "Travel Enthusiast") {
      console.warn("Owner's profession is still 'Travel Enthusiast'. Consider setting a default or prompting.");
      // Example: setGlobalProfession("resort-hotel"); // You could set a default here
    }
  }, [userType, globalProfession, setGlobalProfession]);

  const handleSubmit = () => {
    alert("Listing Added Successfully!");
    setFormData({
      name: "",
      location: "",
      description: "",
      photos: [],
      price: "",
      features: []
    });
  };

  const addRoom = () => {
    setRooms([...rooms, { type: "", price: "", features: [] }]);
  };

  const addBike = () => {
    setBikes([...bikes, { type: "", range: "", price: "" }]);
  };

  const addVehicle = () => {
    setVehicles([...vehicles, { type: "", price: "" }]);
  };

  const handleBackToSite = () => {
    navigate("/");
    if (onBack) {
      onBack();
    }
  };

  const renderProfessionForm = () => {
    switch (currentProfession) {
      case "resort-hotel":
        return (
          <div className="space-y-6">
            {/* Rooms Section */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Rooms</h3>
                <Button onClick={addRoom} size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Room
                </Button>
              </div>
              <div className="space-y-4">
                {rooms.map((room, index) => (
                  <Card key={index}>
                    <CardContent className="p-4 space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <Label>Room Type</Label>
                          <Input
                            placeholder="e.g., Deluxe, Suite"
                            value={room.type}
                            onChange={(e) => {
                              const newRooms = [...rooms];
                              newRooms[index].type = e.target.value;
                              setRooms(newRooms);
                            }}
                          />
                        </div>
                        <div>
                          <Label>Price per Night</Label>
                          <Input
                            placeholder="₹3000"
                            value={room.price}
                            onChange={(e) => {
                              const newRooms = [...rooms];
                              newRooms[index].price = e.target.value;
                              setRooms(newRooms);
                            }}
                          />
                        </div>
                        <div>
                          <Label>View Point</Label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Select view" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="lake">Lake View</SelectItem>
                              <SelectItem value="mountain">Mountain View</SelectItem>
                              <SelectItem value="garden">Garden View</SelectItem>
                              <SelectItem value="city">City View</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div>
                        <Label>Features</Label>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {["TV", "WiFi", "AC", "Pool Access", "Room Service", "Balcony"].map((feature) => (
                            <Badge
                              key={feature}
                              variant={room.features.includes(feature) ? "default" : "outline"}
                              className="cursor-pointer"
                              onClick={() => {
                                const newRooms = [...rooms];
                                if (newRooms[index].features.includes(feature)) {
                                  newRooms[index].features = newRooms[index].features.filter(f => f !== feature);
                                } else {
                                  newRooms[index].features.push(feature);
                                }
                                setRooms(newRooms);
                              }}
                            >
                              {feature}
                            </Badge>
                          ))}
                        </div>
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
                {bikes.map((bike, index) => (
                  <Card key={index}>
                    <CardContent className="p-4 space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <Label>Bike Type</Label>
                          <Select>
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
                          <Label>Range</Label>
                          <Input
                            placeholder="100km"
                            value={bike.range}
                            onChange={(e) => {
                              const newBikes = [...bikes];
                              newBikes[index].range = e.target.value;
                              setBikes(newBikes);
                            }}
                          />
                        </div>
                        <div>
                          <Label>Price per Day</Label>
                          <Input
                            placeholder="₹500"
                            value={bike.price}
                            onChange={(e) => {
                              const newBikes = [...bikes];
                              newBikes[index].price = e.target.value;
                              setBikes(newBikes);
                            }}
                          />
                        </div>
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
                {vehicles.map((vehicle, index) => (
                  <Card key={index}>
                    <CardContent className="p-4 space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label>Vehicle Type</Label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="sedan">Sedan</SelectItem>
                              <SelectItem value="suv">SUV</SelectItem>
                              <SelectItem value="hatchback">Hatchback</SelectItem>
                              <SelectItem value="tempo">Tempo Traveller</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label>Rate</Label>
                          <Input
                            placeholder="₹20/km or ₹2000/day"
                            value={vehicle.price}
                            onChange={(e) => {
                              const newVehicles = [...vehicles];
                              newVehicles[index].price = e.target.value;
                              setVehicles(newVehicles);
                            }}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        );
      case "local-guides": // Added case for local guides
        return (
          <div className="space-y-4">
            <div>
              <Label>Service Rate</Label>
              <Input
                placeholder="₹800/day"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              />
            </div>
            <div>
              <Label>Expertise/Specialization</Label>
              <Input
                placeholder="Mountain Trekking, Local History"
                value={formData.features.join(", ")}
                onChange={(e) => setFormData({ ...formData, features: e.target.value.split(", ").map(f => f.trim()) })}
              />
            </div>
          </div>
        );

      // Add other cases for different professions if needed
      // case "hill-stays":
      //   return (
      //     // ... specific fields for hill stays
      //   );
      // case "tours-treks":
      //   return (
      //     // ... specific fields for tours & treks
      //   );

      default:
        // This 'default' case will now handle any profession not explicitly defined above,
        // including "Travel Enthusiast" if an owner is misconfigured or has a generic profession.
        return (
          <div className="space-y-4">
            <div>
              <Label>Service Rate</Label>
              <Input
                placeholder="₹800/day"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              />
            </div>
            <div>
              <Label>Expertise/Specialization</Label>
              <Input
                placeholder="Hiking, Photography, Cuisine"
                value={formData.features.join(", ")}
                onChange={(e) => setFormData({ ...formData, features: e.target.value.split(", ").map(f => f.trim()) })}
              />
            </div>
            <p className="text-sm text-muted-foreground">
              Please ensure your profession is correctly set in your profile for a more specific listing form.
            </p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Owner Dashboard</h1>
            <p className="text-muted-foreground">Manage your {currentProfession.replace('-', ' ')} listings</p>
          </div>
          <Button variant="outline" onClick={handleBackToSite}>
            Back to Site
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="add-listing">Add Listing</TabsTrigger>
            <TabsTrigger value="my-listings">My Listings</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
          </TabsList>

          <TabsContent value="add-listing" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Create New Listing</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* General Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Business/Service Name</Label>
                    <Input
                      placeholder="Mountain View Resort"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label>Location</Label>
                    <Select onValueChange={(value) => setFormData({ ...formData, location: value })}>
                      <SelectTrigger>
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
                  <Label>Description</Label>
                  <Textarea
                    placeholder="Describe your service or property..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={4}
                  />
                </div>

                <div>
                  <Label>Photos</Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                    <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                    <p className="text-gray-500">Upload up to 10 photos of your listing</p>
                    <Button variant="outline" className="mt-4" >
                      Choose Files
                    </Button>
                  </div>
                </div>

                <Separator />

                {/* Profession-specific fields */}
                {renderProfessionForm()}

                <div className="flex justify-end space-x-4">
                  <Button variant="outline">Save Draft</Button>
                  <Button onClick={handleSubmit} className="bg-primary">
                    Publish Listing
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Preview Section */}
            <Card>
              <CardHeader>
                <CardTitle>Preview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="border rounded-lg p-4 bg-white">
                  <div className="aspect-video bg-gray-200 rounded mb-4 flex items-center justify-center">
                    <span className="text-gray-500">Preview Image</span>
                  </div>
                  <h3 className="font-semibold text-lg">{formData.name || "Your Listing Name"}</h3>
                  <p className="text-muted-foreground">{formData.description || "Your description will appear here..."}</p>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-2xl font-bold text-primary">
                      {formData.price ? `₹${formData.price}` : "₹0"}
                    </span>
                    <Button size="sm">View Details</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="my-listings" className="space-y-6">
            <div className="grid gap-6">
              {mockListings.map((listing) => (
                <Card key={listing.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-semibold">{listing.name}</h3>
                        <p className="text-muted-foreground">{listing.location}</p>
                        <div className="mt-2 flex items-center space-x-4">
                          <Badge variant="outline" className="text-green-600">
                            {listing.status}
                          </Badge>
                          <span className="text-sm">
                            {listing.bookings} bookings this month
                          </span>
                          <span className="text-sm font-semibold">
                            Revenue: {listing.revenue}
                          </span>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm" onClick={() => navigate(`/listings/${listing.id}`)}>
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => navigate(`/listings/${listing.id}/edit`)}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm" className="text-red-600">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Business Profile</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Business Name</Label>
                    <Input placeholder="Your Business Name" />
                  </div>
                  <div>
                    <Label>Contact Number</Label>
                    <Input placeholder="+91 9876543210" />
                  </div>
                  <div>
                    <Label>Email</Label>
                    <Input placeholder="business@email.com" />
                  </div>
                  <div>
                    <Label>Profession</Label> {/* Added Profession field */}
                    <Select onValueChange={(value) => setGlobalProfession(value)} value={globalProfession}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your profession" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="resort-hotel">Resort & Hotel Owner</SelectItem>
                        <SelectItem value="rental-bikes">Rental Bikes Owner</SelectItem>
                        <SelectItem value="cabs-taxis">Cab & Taxi Service</SelectItem>
                        <SelectItem value="local-guides">Local Guide</SelectItem>
                        {/* Add other professions as needed based on your categories */}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>License Number</Label>
                    <Input placeholder="Tourism License (if applicable)" />
                  </div>
                </div>
                <div>
                  <Label>Business Address</Label>
                  <Textarea placeholder="Full business address" />
                </div>
                <Button className="bg-primary">Update Profile</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}