
Himalayan Trek Planner
Code assistant
User
import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import {
ArrowLeft,
Star,
MapPin,
Navigation,
Clock,
Mountain,
ChevronLeft,
ChevronRight,
AlertTriangle,
Users,
Calendar,
Backpack,
Route,
TreePine,
Thermometer,
Shield,
Camera,
Sunrise
} from "lucide-react";
interface TrekDetailsPageProps {
trekId: string;
onBack: () => void;
onBookNow: (id: string) => void;
onHireGuide: () => void;
}
export function TrekDetailsPage({ trekId, onBack, onBookNow, onHireGuide }: TrekDetailsPageProps) {
const [currentImageIndex, setCurrentImageIndex] = useState(0);
// Mock trek data - in real app this would come from API based on trekId
const trekData = {
id: trekId,
name: "Naina Peak Trek",
location: "Nainital, Uttarakhand",
rating: 4.8,
reviewCount: 167,
price: "₹1,500",
priceNote: "per person (with guide)",
difficulty: "Moderate",
distance: "6km loop",
duration: "4-5 hours",
altitude: "2,615m",
bestTime: "March to June, September to November",
images: [
"https://images.unsplash.com/photo-1464822759844-d150ad6d1f6f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cmVra2luZyUyMHRyYWlsJTIwZm9yZXN0fGVufDF8fHx8MTczNzAzODQwMHww&ixlib=rb-4.1.0&q=80&w=1080",
"https://images.unsplash.com/photo-1519904981063-b0cf448d479e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoaW1hbGF5YSUyMG1vdW50YWluJTIwdmlld3xlbnwxfHx8fDE3MzcwMzg0MDB8MA&ixlib=rb-4.1.0&q=80&w=1080",
"https://images.unsplash.com/photo-1506905925346-21bda4d32df4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwzfHxtb3VudGFpbiUyMHZpZXdwb2ludCUyMHN1bnJpc2V8ZW58MXx8fHwxNzM3MDM4NDAwfDA&ixlib=rb-4.1.0&q=80&w=1080",
"https://images.unsplash.com/photo-1551632811-561732d1e306?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cmVra2luZyUyMGdyb3VwJTIwbW91bnRhaW58ZW58MXx8fHwxNzM3MDM4NDAwfDA&ixlib=rb-4.1.0&q=80&w=1080"
],
description: "Experience the highest peak around Nainital with the Naina Peak Trek, also known as China Peak. This moderate trek offers spectacular 360-degree views of snow-capped Himalayan ranges, pristine valleys, and Nainital town. Perfect for adventure enthusiasts seeking breathtaking vistas and a memorable trekking experience.",
highlights: [
"360-degree Himalayan views from summit",
"Highest viewpoint around Nainital (2,615m)",
"Trek through dense oak and pine forests",
"Wildlife spotting opportunities",
"Sunrise and sunset views",
"Photography paradise"
],
itinerary: [
{
time: "6:00 AM",
activity: "Meet at Mallital, Nainital",
description: "Group assembly and brief introduction"
},
{
time: "6:30 AM",
activity: "Start trek to Snow View Point",
description: "Begin trek through ropeway route"
},
{
time: "8:00 AM",
activity: "Reach Snow View Point",
description: "First checkpoint with refreshments"
},
{
time: "9:30 AM",
activity: "Trek to Naina Peak summit",
description: "Steep climb through forest trail"
},
{
time: "11:00 AM",
activity: "Reach Naina Peak",
description: "Summit celebration and photography"
},
{
time: "12:30 PM",
activity: "Lunch at summit",
description: "Packed lunch with scenic views"
},
{
time: "2:00 PM",
activity: "Descent begins",
description: "Careful descent through alternate route"
},
{
time: "4:30 PM",
activity: "Return to Nainital",
description: "Trek completion and group photos"
}
],
included: [
"Professional trek guide",
"Trek permits and entry fees",
"Packed lunch and refreshments",
"First aid kit and safety equipment",
"Photography assistance",
"Certificate of completion"
],
notIncluded: [
"Personal trekking gear",
"Transportation to/from Nainital",
"Personal expenses",
"Travel insurance",
"Additional meals"
],
whatToBring: [
{ category: "Footwear", items: ["Good trekking shoes", "Extra socks"] },
{ category: "Clothing", items: ["Comfortable trekking pants", "Warm jacket", "Sun hat", "Gloves"] },
{ category: "Essentials", items: ["Water bottle (2L)", "Sunscreen", "Sunglasses", "Personal medicines"] },
{ category: "Optional", items: ["Camera", "Power bank", "Trekking poles", "Small backpack"] }
],
safetyGuidelines: [
"Follow guide instructions at all times",
"Stay with the group - don't venture alone",
"Inform guide about any medical conditions",
"Carry adequate water and stay hydrated",
"Wear appropriate trekking gear",
"Weather conditions can change quickly - be prepared"
],
availableDates: [
{ date: "Dec 20, 2024", available: true, price: "₹1,500" },
{ date: "Dec 22, 2024", available: true, price: "₹1,500" },
{ date: "Dec 25, 2024", available: false, price: "₹1,800" },
{ date: "Dec 27, 2024", available: true, price: "₹1,500" },
{ date: "Dec 29, 2024", available: true, price: "₹1,500" }
],
guide: {
name: "Ramesh Bisht",
experience: "8 years",
rating: 4.9,
languages: ["Hindi", "English"],
specialization: "Mountain Trekking",
contact: "+91 9876543210"
}
};
const nextImage = () => {
setCurrentImageIndex((prev) => (prev + 1) % trekData.images.length);
};
const prevImage = () => {
setCurrentImageIndex((prev) => (prev - 1 + trekData.images.length) % trekData.images.length);
};
return (
<div className="min-h-screen bg-gray-50">
{/* Header */}
<div className="bg-white shadow-sm px-4 py-3 md:px-6">
<Button variant="ghost" onClick={onBack} className="mb-0">
<ArrowLeft className="w-4 h-4 mr-2" />
Back to Treks
</Button>
</div>
code
Code
<div className="container mx-auto px-4 py-6 max-w-6xl">
    {/* Image Carousel */}
    <div className="relative mb-6">
      <div className="relative h-64 md:h-96 rounded-lg overflow-hidden">
        <img 
          src={trekData.images[currentImageIndex]} 
          alt={`${trekData.name} - Image ${currentImageIndex + 1}`}
          className="w-full h-full object-cover"
        />
        <Button
          variant="secondary"
          size="sm"
          onClick={prevImage}
          className="absolute left-4 top-1/2 -translate-y-1/2 opacity-80 hover:opacity-100"
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>
        <Button
          variant="secondary"
          size="sm"
          onClick={nextImage}
          className="absolute right-4 top-1/2 -translate-y-1/2 opacity-80 hover:opacity-100"
        >
          <ChevronRight className="w-4 h-4" />
        </Button>
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
          {trekData.images.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full cursor-pointer transition-colors ${
                index === currentImageIndex ? 'bg-white' : 'bg-white/50'
              }`}
              onClick={() => setCurrentImageIndex(index)}
            />
          ))}
        </div>
      </div>
    </div>
code
Code
<div className="grid lg:grid-cols-3 gap-8">
  {/* Main Content */}
  <div className="lg:col-span-2 space-y-6">
    {/* Trek Info */}
    <div className="bg-white rounded-lg p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold mb-2">{trekData.name}</h1>
          <div className="flex items-center space-x-2 text-muted-foreground mb-2">
            <MapPin className="w-4 h-4" />
            <span>{trekData.location}</span>
          </div>
          <div className="flex items-center space-x-4 flex-wrap gap-2">
            <div className="flex items-center space-x-1">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="font-medium">{trekData.rating}</span>
              <span className="text-muted-foreground">({trekData.reviewCount} reviews)</span>
            </div>
            <Badge 
              className={`${
                trekData.difficulty === 'Easy' ? 'bg-green-100 text-green-800' :
                trekData.difficulty === 'Moderate' ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}
            >
              {trekData.difficulty}
            </Badge>
            <Badge variant="outline">{trekData.distance}</Badge>
          </div>
        </div>
        <div className="mt-4 md:mt-0 text-right">
          <div className="text-2xl font-bold text-primary">{trekData.price}</div>
          <div className="text-sm text-muted-foreground">{trekData.priceNote}</div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center space-x-2">
          <Clock className="w-4 h-4 text-primary" />
          <div>
            <div className="text-sm font-medium">Duration</div>
            <div className="text-xs text-muted-foreground">{trekData.duration}</div>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Route className="w-4 h-4 text-primary" />
          <div>
            <div className="text-sm font-medium">Distance</div>
            <div className="text-xs text-muted-foreground">{trekData.distance}</div>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Mountain className="w-4 h-4 text-primary" />
          <div>
            <div className="text-sm font-medium">Altitude</div>
            <div className="text-xs text-muted-foreground">{trekData.altitude}</div>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Thermometer className="w-4 h-4 text-primary" />
          <div>
            <div className="text-sm font-medium">Best Time</div>
            <div className="text-xs text-muted-foreground">Mar-Jun, Sep-Nov</div>
          </div>
        </div>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="itinerary">Itinerary</TabsTrigger>
          <TabsTrigger value="preparation">Preparation</TabsTrigger>
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6 mt-6">
          <div>
            <h3 className="font-semibold mb-3">About This Trek</h3>
            <p className="text-muted-foreground leading-relaxed">{trekData.description}</p>
          </div>

          <div>
            <h3 className="font-semibold mb-3">Trek Highlights</h3>
            <div className="grid md:grid-cols-2 gap-2">
              {trekData.highlights.map((highlight, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0" />
                  <span className="text-sm">{highlight}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-3 flex items-center">
                <Shield className="w-4 h-4 mr-2 text-green-600" />
                What's Included
              </h3>
              <ul className="space-y-1 text-sm text-muted-foreground">
                {trekData.included.map((item, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-green-600 mr-2">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-3 flex items-center">
                <AlertTriangle className="w-4 h-4 mr-2 text-red-600" />
                Not Included
              </h3>
              <ul className="space-y-1 text-sm text-muted-foreground">
                {trekData.notIncluded.map((item, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-red-600 mr-2">✗</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold mb-2 flex items-center">
              <Users className="w-4 h-4 mr-2 text-blue-600" />
              Your Guide: {trekData.guide.name}
            </h4>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">Experience:</span>
                <span className="ml-2">{trekData.guide.experience}</span>
              </div>
              <div>
                <span className="font-medium">Rating:</span>
                <div className="inline-flex items-center ml-2">
                  <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                  <span className="ml-1">{trekData.guide.rating}</span>
                </div>
              </div>
              <div>
                <span className="font-medium">Languages:</span>
                <span className="ml-2">{trekData.guide.languages.join(", ")}</span>
              </div>
              <div>
                <span className="font-medium">Specialization:</span>
                <span className="ml-2">{trekData.guide.specialization}</span>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="itinerary" className="space-y-4 mt-6">
          <h3 className="font-semibold">Detailed Itinerary</h3>
          <div className="space-y-4">
            {trekData.itinerary.map((item, index) => (
              <div key={index} className="flex items-start space-x-4 p-4 border rounded-lg">
                <div className="flex-shrink-0 w-16 text-center">
                  <div className="text-sm font-medium text-primary">{item.time}</div>
                </div>
                <div className="flex-1">
                  <h4 className="font-medium">{item.activity}</h4>
                  <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="preparation" className="space-y-6 mt-6">
          <div>
            <h3 className="font-semibold mb-3">What to Bring</h3>
            <div className="grid md:grid-cols-2 gap-6">
              {trekData.whatToBring.map((category, index) => (
                <div key={index} className="space-y-2">
                  <h4 className="font-medium text-primary">{category.category}</h4>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    {category.items.map((item, idx) => (
                      <li key={idx} className="flex items-start">
                        <span className="text-primary mr-2">•</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
            <h4 className="font-semibold mb-3 flex items-center text-red-700">
              <AlertTriangle className="w-4 h-4 mr-2" />
              Safety Guidelines
            </h4>
            <ul className="space-y-2 text-sm text-red-700">
              {trekData.safetyGuidelines.map((guideline, index) => (
                <li key={index} className="flex items-start">
                  <span className="mr-2">•</span>
                  {guideline}
                </li>
              ))}
            </ul>
          </div>
        </TabsContent>

        <TabsContent value="reviews" className="mt-6">
          <div className="space-y-4">
            <div className="border-b pb-4">
              <div className="flex items-center space-x-2 mb-2">
                <div className="flex">
                  {[1,2,3,4,5].map(i => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <span className="font-medium">Vikash Sharma</span>
                <span className="text-sm text-muted-foreground">1 week ago</span>
              </div>
              <p className="text-muted-foreground">
                "Incredible trek with Ramesh as our guide! The views from Naina Peak were absolutely stunning. 
                Well-organized trip with good safety measures. Highly recommended for adventure lovers!"
              </p>
            </div>
            <div className="border-b pb-4">
              <div className="flex items-center space-x-2 mb-2">
                <div className="flex">
                  {[1,2,3,4,5].map(i => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <span className="font-medium">Sneha Patel</span>
                <span className="text-sm text-muted-foreground">2 weeks ago</span>
              </div>
              <p className="text-muted-foreground">
                "Perfect trek for beginners to moderate level. Great guide, beautiful forest trail, 
                and the summit views are worth every step. The packed lunch was delicious too!"
              </p>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  </div>

  {/* Booking Sidebar */}
  <div className="lg:col-span-1">
    <div className="sticky top-4 space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Book This Trek</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium">Select Date</label>
            <div className="space-y-2 mt-2">
              {trekData.availableDates.slice(0, 3).map((dateOption, index) => (
                <div key={index} className={`p-2 border rounded cursor-pointer ${!dateOption.available ? 'opacity-50' : 'hover:bg-gray-50'}`}>
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="text-sm font-medium">{dateOption.date}</div>
                      <div className="text-xs text-muted-foreground">
                        {dateOption.available ? 'Available' : 'Full'}
                      </div>
                    </div>
                    <div className="text-sm font-semibold text-primary">
                      {dateOption.price}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium">Number of Trekkers</label>
            <div className="flex items-center mt-1 p-2 border rounded-md">
              <Users className="w-4 h-4 mr-2 text-muted-foreground" />
              <span className="text-sm">1 person</span>
            </div>
          </div>

          <div className="border-t pt-4">
            <div className="flex justify-between mb-2">
              <span>Trek cost</span>
              <span>{trekData.price}</span>
            </div>
            <div className="flex justify-between mb-2 text-sm text-muted-foreground">
              <span>Permits & gear</span>
              <span>Included</span>
            </div>
            <div className="flex justify-between font-semibold text-lg border-t pt-2">
              <span>Total</span>
              <span>{trekData.price}</span>
            </div>
          </div>

          <Button 
            className="w-full bg-primary hover:bg-primary/90" 
            size="lg"
            onClick={() => onBookNow(trekData.id)}
          >
            Book This Trek
          </Button>

          <Button 
            variant="outline" 
            className="w-full"
            onClick={onHireGuide}
          >
            <Users className="w-4 h-4 mr-2" />
            Contact Guide
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Need Help?</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div className="flex items-center space-x-2">
            <span className="text-muted-foreground">Guide:</span>
            <span>{trekData.guide.contact}</span>
          </div>
          <p className="text-muted-foreground">
            Have questions about difficulty level, gear requirements, or weather conditions? 
            Our experienced guides are here to help!
          </p>
        </CardContent>
      </Card>
    </div>
  </div>
</div>
  </div>
</div>
);
}
that is my trekpage make it dynamic and also responsive dynamicly hande for all case
when my location and place detais page and globel contex is import React, { createContext, useState, useEffect, useCallback } from "react";
import { useIsMobile } from "../hooks/use-mobile";
import { Bed, MapPin, Mountain, Car, Users, HomeIcon, Bike } from 'lucide-react';
import { locationsData, featuredPlaces } from "../assets/dummy"; // Ensure locationsData is imported
export const GlobalContext = createContext();
// Mock User Data (Dynamic part) - This will be the initial state
const mockUserData = {
// Common user info
userName: "Priya Sharma",
userEmail: "priya.sharma@example.com",
userPhone: "+91 xxxxxxxxxx",
loginPlatform: "Gmail",
userType: "", // Default user type for testing - changed from " " to "user" or "owner"
profession: "resort-hotel", // Default profession for owner dashboard testing
isLoggedIn: false, // Default to logged in for testing, change to false for production
userRole: "", // Default role for testing, can be 'user', 'owner', or null/undefined
// ... rest of your mock user data
// Owner-specific profile data (if you want to manage globally)
businessAddress: "123 Mountain View, Nainital, Uttarakhand",
licenseNumber: "UTH987654321",
visitedPlaces: [
{ id: 'vp1', name: 'Nainital Lake', status: 'visited' },
{ id: 'vp2', name: 'Tiffin Top', status: 'visited' },
{ id: 'vp3', name: 'Snow View Point', status: 'visited' },
{ id: 'vp4', name: 'Bhimtal Lake', status: 'unvisited' },
{ id: 'vp5', name: 'Naina Peak', status: 'unvisited' },
],
recentBookings: [
{ id: 'b1', title: 'Mountain View Resort', dates: 'Dec 25-27, 2024', status: 'Confirmed' },
{ id: 'b2', title: 'Naina Peak Trek', dates: 'Jan 15, 2025', status: 'Upcoming' },
{ id: 'b3', title: 'Cab to Bhimtal', dates: 'Jan 10, 2025', status: 'Upcoming' },
],
savedPlaces: [
{
id: 's1',
title: 'Eco Cave Gardens',
location: 'Nainital',
rating: 4.2,
type: 'place',
image: "https://nainitaltourism.org.in/images/places-to-visit/headers/naina-devi-temple-nainital-tourism-entry-fee-timings-holidays-reviews-header.jpg"
},
{
id: 's2',
title: 'Jim Corbett National Park',
location: 'Ramnagar',
rating: 4.7,
type: 'place',
image: "https://images.unsplash.com/photo-1717050788940-189e308415fb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3VudGFpbiUyMHRyZWtraW5nJTIwaGltYWxheWFzfGVufDF8fHx8MTc1NzYxNjk4OHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
},
{
id: 's3',
title: 'The Naini Retreat',
location: 'Nainital',
rating: 4.5,
type: 'hotel',
image: "https://images.unsplash.com/photo-1670555383991-ae6ad4bb39df?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHxoaWxsJTIwcmVzb3J0JTIwbW91bnRhaW4lMjB2aWV3fGVuMXx8fHwxNzU3NjE2OTg5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
},
],
userViewpoints: [
{ id: 'uvp1', name: 'Camel’s Back Road', description: 'Scenic road with lake views', distance: '2 km', rating: 4.5 },
{ id: 'uvp2', name: 'Lover’s Point', description: 'Romantic spot with panoramic views', distance: '4 km', rating: 4.1 },
{ id: "uvp3", name: "Tiffin Top (Dorothy's Seat)", description: "Panoramic views, 4km trek from Nainital", distance: "4km", rating: 4.7 },
{ id: "uvp4", name: "Snow View Point", description: "Cable car access, Himalayan vistas", distance: "2.5km", rating: 4.6 },
{ id: "uvp5", name: "Naina Peak (China Peak)", description: "Highest point, trekking spot", distance: "6km", rating: 4.9 },
{ id: "uvp6", name: "Himalaya Darshan Point", description: "Snow-capped peaks view", distance: "3km", rating: 4.5 },
{ id: "uvp7", name: "Land's End", description: "Cliff-edge views", distance: "5km", rating: 4.4 },
{ id: "uvp8", name: "Mukteshwar", description: "Temple and orchards", distance: "50km", rating: 4.8 },
{ id: "uvp9", name: "Sariyatal", distance: "10km", rating: 4.2, description: "Lake viewpoint" },
{ id: "uvp10", name: "Khurpatal", distance: "12km", rating: 4.1, description: "Hidden lake spot" },
{ id: "uvp11", name: "Kilbury", distance: "15km", rating: 4.6, description: "Bird watching views" }
],
userRoutes: [
{ id: 'ur1', name: 'Trekking to Tiffin Top', difficulty: 'Easy', distance: '3 km', rating: 4.4 },
{ id: 'ur2', name: 'Boating in Naini Lake', difficulty: 'Easy', distance: '2 km', rating: 4.8 },
{ id: "ur3", name: "Naina Peak Trek", difficulty: "Moderate", distance: "6km loop", rating: 4.8 },
{ id: "ur4", name: "Tiffin Top Hike", difficulty: "Easy", distance: "4km to viewpoint", rating: 4.7 },
{ id: "ur5", name: "Snow View Trek", difficulty: "Easy", distance: "2km uphill", rating: 4.5 },
{ id: "ur6", name: "Guano Hills Trail", difficulty: "Moderate", distance: "10km birding adventure", rating: 4.4 },
{ id: "ur7", name: "Pangot Trek", difficulty: "Easy", distance: "15km nature walk", rating: 4.3 },
{ id: "ur8", name: "Kunjkharak Trek", difficulty: "Hard", distance: "20km wildlife path", rating: 4.6 },
{ id: "ur9", name: "Hartola Shiv Mandir Hike", difficulty: "Easy", distance: "8km spiritual trail", rating: 4.2 },
{ id: "ur10", name: "Sattal Waterfall Trail", difficulty: "Moderate", distance: "25km waterfall route", rating: 4.5 },
{ id: "ur11", name: "Lands End Trail", difficulty: "Easy", distance: "5km scenic end-point", rating: 4.1 },
{ id: "ur12", name: "Kilbury Trek", difficulty: "Moderate", distance: "15km forest adventure", rating: 4.4 }
],
};
const categoriesData = [
{ icon: Bed, title: "Hotels & Resorts", description: "Comfortable stays" },
{ icon: MapPin, title: "Places to Visit", description: "Top attractions" },
{ icon: Mountain, title: "Tours & Treks", description: "Adventure trails" },
{ icon: Car, title: "Cabs & Taxis", description: "Local transport" },
{ icon: Users, title: "Local Guides", description: "Expert guidance" },
{ icon: HomeIcon, title: "Hill Stays", description: "Mountain resorts" },
{ icon: Bike, title: "Rental Bikes", description: "Scooters & bikes" },
];
const STORAGE_OWNER_PREFIX = "owner_listings_v2:";
const GlobalProvider = ({ children }) => {
// View and auth
const [isLoggedIn, setIsLoggedIn] = useState(mockUserData.isLoggedIn); // Initialized from mockUserData
const [userRole, setUserRole] = useState(mockUserData.userRole); // New state for user role
const [userType, setUserType] = useState(mockUserData.userType);
// User info - Now initialized from mockUserData
const [profession, setProfession] = useState(mockUserData.profession);
const [language, setLanguage] = useState("en");
const [userName, setUserName] = useState(mockUserData.userName);
const [userEmail, setUserEmail] = useState(mockUserData.userEmail);
const [userPhone, setUserPhone] = useState(mockUserData.userPhone);
const [loginPlatform, setLoginPlatform] = useState(mockUserData.loginPlatform);
// Owner-specific extended profile details (if managed globally)
const [businessAddress, setBusinessAddress] = useState(mockUserData.businessAddress);
const [licenseNumber, setLicenseNumber] = useState(mockUserData.licenseNumber);
// Owner-specific id
const [ownerId, setOwnerId] = useState(null);
// Optional "back" callback
const [onBack, setOnBack] = useState(null);
// Dynamic user data
const [userVisitedPlaces, setUserVisitedPlaces] = useState(mockUserData.visitedPlaces);
const [userRecentBookings, setUserRecentBookings] = useState(mockUserData.recentBookings);
const [userSavedPlaces, setUserSavedPlaces] = useState(mockUserData.savedPlaces);
const [userViewpoints, setUserViewpoints] = useState(mockUserData.userViewpoints);
const [userRoutes, setUserRoutes] = useState(mockUserData.userRoutes);
const [categories, setCategories] = useState(categoriesData);
// New state for currently selected location ID for details page
const [selectedLocationId, setSelectedLocationId] = useState(null);
const [locationDetails, setLocationDetails] = useState(null);
// Search and selection
const [searchQuery, setSearchQuery] = useState("");
const [selectedCategory, setSelectedCategory] = useState("");
const [focusArea, setFocusArea] = useState("");
const [selectedItemId, setSelectedItemId] = useState("");
const [selectedDetailType, setSelectedDetailType] = useState(" ");
// UI state
const [showAIChat, setShowAIChat] = useState(false);
const [showMobileMenu, setShowMobileMenu] = useState(false);
const isMobile = useIsMobile();
// Helper: derive owner storage key
const getOwnerKey = (id) => {
const keyId = id || ownerId || userEmail || userName || "unknown_owner";
return ${STORAGE_OWNER_PREFIX}${String(keyId).replace(/[^a-z0-9]/gi, "_").toLowerCase()};
};
// Helpers to read/write owner-scoped listings (frontend localStorage)
const readOwnerListings = (id) => {
try {
const raw = localStorage.getItem(getOwnerKey(id));
return raw ? JSON.parse(raw) : [];
} catch (e) {
console.error("Failed to parse owner listings from localStorage:", e);
return [];
}
};
const writeOwnerListings = (listings, id) => {
try {
localStorage.setItem(getOwnerKey(id), JSON.stringify(listings));
return true;
} catch (e) {
console.error("Failed to write owner listings to localStorage:", e);
return false;
}
};
// Effect to infer and set ownerId when userType changes or user info is available
useEffect(() => {
if (userType === "owner" && !ownerId) {
const inferred = userEmail
? owner_${userEmail.replace(/[^a-z0-9]/gi, "_")}
: userName
? owner_${userName.replace(/\s+/g, "_")}
: owner_default_${Date.now()};
setOwnerId(inferred.toLowerCase());
} else if (userType !== "owner" && ownerId) {
setOwnerId(null);
}
}, [userType, ownerId, userEmail, userName]);
const logout1 = useCallback(() => { // Renamed from logout1 to logout for consistency
// Clear authentication state
setIsLoggedIn(false);
setUserRole(null);
setUserType('');
// Clear user/owner profile information
setUserName('');
setUserEmail('');
setUserPhone('');
setLoginPlatform('');
setLanguage("en"); // Reset to default language
setProfession('');
code
Code
// Clear owner-specific profile data
setBusinessAddress('');
setLicenseNumber('');
setOwnerId(null); // Clear ownerId
// Clear dynamic user data
setUserVisitedPlaces([]);
setUserRecentBookings([]);
setUserSavedPlaces([]);
setUserViewpoints([]);
setUserRoutes([]);
// Clear search and UI state
setSearchQuery('');
setSelectedCategory('');
setFocusArea('');
setSelectedItemId('');
setSelectedDetailType('');
setShowAIChat(false);
setShowMobileMenu(false);
setSelectedLocationId(null); // Clear selected location ID on logout
setLocationDetails(null)
// Remove authentication tokens or other sensitive data from localStorage
localStorage.removeItem('authToken'); // Example
localStorage.removeItem('userPreferences'); // Example
console.log("User logged out successfully!");
}, []);
// Bundle all state into context
const contextValue = {
// auth & user
isLoggedIn, setIsLoggedIn,
userType, setUserType,
userRole, setUserRole, // Added userRole to context
profession, setProfession,
language, setLanguage,
logout1, // Added logout function to context
code
Code
// Owner-specific extended profile details
businessAddress, setBusinessAddress,
licenseNumber, setLicenseNumber,
// user info
userName, setUserName,
userEmail, setUserEmail,
userPhone, setUserPhone,
loginPlatform, setLoginPlatform,
// owner support
ownerId, setOwnerId,
onBack, setOnBack,
getOwnerKey,
readOwnerListings,
writeOwnerListings,
// dynamic profile data
userVisitedPlaces, setUserVisitedPlaces,
userRecentBookings, setUserRecentBookings,
userSavedPlaces, setUserSavedPlaces,
userViewpoints, setUserViewpoints,
userRoutes, setUserRoutes,
categories, setCategories,
// New: Selected Location ID for dynamic details pages
selectedLocationId, setSelectedLocationId,
// search & UI
searchQuery, setSearchQuery,
selectedCategory, setSelectedCategory,
focusArea, setFocusArea,
selectedItemId, setSelectedItemId,
selectedDetailType, setSelectedDetailType,
showAIChat, setShowAIChat,
showMobileMenu, setShowMobileMenu,
isMobile,
locationDetails, setLocationDetails
};
return (
<GlobalContext.Provider value={contextValue}>
{children}
</GlobalContext.Provider>
);
};
export default GlobalProvider;
import React, { useState, useCallback, useContext, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { GlobalContext } from "../component/GlobalContext"; // Import GlobalContext
import { placeDetailsData } from "../assets/dummy"; // Import the dummy data
import { Button } from "../component/button";
import { Card, CardContent, CardHeader, CardTitle } from "../component/Card";
import { Badge } from "../component/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../component/tabs";
import { FAQSection } from "../component/FAQSection";
import {
ArrowLeft,
Star,
MapPin,
Navigation,
Clock,
Camera,
Mountain,
ChevronLeft,
ChevronRight,
Sunrise,
TreePine,
Info,
Car,
Plane,
Train,
Bike,
Users,
Home,
Bed,
Wifi,
Fish,
Bird,
Activity,
Book,
} from "lucide-react";
const iconMap = {
Car: Car,
Plane: Plane,
Train: Train,
Bike: Bike,
Mountain: Mountain,
Sunrise: Sunrise,
Camera: Camera,
TreePine: TreePine,
Info: Info,
Clock: Clock,
Users: Users,
Home: Home,
Bed: Bed,
Wifi: Wifi,
Fish: Fish,
Bird: Bird,
Activity: Activity,
Book: Book,
};
export default function PlaceDetailsPage() {
const navigate = useNavigate();
const { placeId } = useParams();
const { setSelectedItemId, setSelectedDetailType ,setFocusArea} = useContext(GlobalContext);
const [currentImageIndex, setCurrentImageIndex] = useState(0);
const [placeData, setPlaceData] = useState(null);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);
useEffect(() => {
setLoading(true);
setError(null);
if (placeId) {
const data = placeDetailsData[placeId];
if (data) {
setPlaceData(data);
setLoading(false);
setCurrentImageIndex(0);
} else {
setError("Place not found.");
setLoading(false);
setPlaceData(null);
}
} else {
setError("No place ID provided.");
setLoading(false);
setPlaceData(null);
}
}, [placeId]);
const handleBack = useCallback(() => {
navigate(-1);
}, [navigate]);
const handleGetDirections = useCallback((lat, lng, name) => {
const focusId = placeId.toLowerCase().replace(/\s/g, '-');
setFocusArea(focusId);
navigate(/map-view/
{lat}&destLng=
{encodeURIComponent(name)});
}, [navigate, setFocusArea, placeId]);
const handleViewDetails = useCallback((id, type) => {
setSelectedItemId(id);
setSelectedDetailType(type);
const routeMap = {
hotel: /hotel-details/
{id},
place: /place-details/
{id},
bike: /bike-details/
{id},
guide: /guide-details/
{id},
viewpoint: /place-details/
{id},
adventure: /place-details/
{id},
temple: /place-details/
{id},
};
const path = routeMap[type.toLowerCase()] || "/";
navigate(path);
}, [navigate, setSelectedItemId, setSelectedDetailType]);
const nextImage = useCallback(() => {
if (placeData && placeData.images && placeData.images.length > 0) {
setCurrentImageIndex((prev) => (prev + 1) % placeData.images.length);
}
}, [placeData]);
const prevImage = useCallback(() => {
if (placeData && placeData.images && placeData.images.length > 0) {
setCurrentImageIndex((prev) => (prev - 1 + placeData.images.length) % placeData.images.length);
}
}, [placeData]);
if (loading) {
return (
<div className="flex justify-center items-center min-h-screen">
Loading place details...
</div>
);
}
if (error) {
return (
<div className="flex justify-center items-center min-h-screen text-red-600">
Error: {error}
<Button variant="link" onClick={handleBack}>Go Back</Button>
</div>
);
}
if (!placeData) {
return (
<div className="flex justify-center items-center min-h-screen text-gray-600">
No place data available.
<Button variant="link" onClick={handleBack}>Go Back</Button>
</div>
);
}
const whatToExpectItems = placeData.whatToExpect
? placeData.whatToExpect.map(item => ({
...item,
icon: iconMap[item.icon] || Info
}))
: [];
const isHotelPage = placeData.id.includes("hotel") || placeData.id.includes("resort");
return (
<div
className="min-h-screen"
style={{
backgroundImage: linear-gradient(rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.1)), url('${placeData.images[0]}'),
backgroundPosition: 'center',
backgroundSize: 'cover',
backgroundRepeat: 'no-repeat',
backgroundAttachment: 'fixed',
backgroundColor: '#f9fafb'
}}
>
<div className="bg-white/95 backdrop-blur-sm shadow-sm px-4 py-3 md:px-6 sticky top-0 z-10">
<Button variant="ghost" onClick={handleBack} className="mb-0">
<ArrowLeft className="w-4 h-4 mr-2" />
Back to Places
</Button>
</div>
code
Code
<div className="container mx-auto px-4 py-6 max-w-6xl">
    <div className="relative mb-6">
      <div className="relative h-64 md:h-96 rounded-lg overflow-hidden shadow-lg">
        <img
          src={placeData.images[currentImageIndex]}
          alt={`${placeData.name} - Image ${currentImageIndex + 1}`}
          className="w-full h-full object-cover"
        />
        {placeData.images.length > 1 && (
          <>
            <Button
              variant="secondary"
              size="sm"
              onClick={prevImage}
              className="absolute left-4 top-1/2 -translate-y-1/2 opacity-80 hover:opacity-100"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={nextImage}
              className="absolute right-4 top-1/2 -translate-y-1/2 opacity-80 hover:opacity-100"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
              {placeData.images.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full cursor-pointer transition-colors ${
                    index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                  }`}
                  onClick={() => setCurrentImageIndex(index)}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
code
Code
<div className="grid lg:grid-cols-3 gap-8">
  <div className="lg:col-span-2 space-y-6">
    <div className="bg-white/95 backdrop-blur-sm rounded-lg p-6 shadow-sm">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold mb-2">{placeData.name}</h1>
          <div className="flex items-center space-x-2 text-muted-foreground mb-2">
            <MapPin className="w-4 h-4" />
            <span>{placeData.location}</span>
          </div>
          <div className="flex items-center space-x-4 flex-wrap gap-2">
            <div className="flex items-center space-x-1">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="font-medium">{placeData.rating}</span>
              <span className="text-muted-foreground">({placeData.reviewCount} reviews)</span>
            </div>
            {!isHotelPage && placeData.entryFee && (
               <Badge className="bg-green-100 text-green-800">{placeData.entryFee}</Badge>
            )}
            {placeData.difficulty && (
              <Badge variant="outline">{placeData.difficulty}</Badge>
            )}
            {isHotelPage && placeData.price && (
               <Badge className="bg-primary text-primary-foreground">Starting from {placeData.price}</Badge>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
        {!isHotelPage ? (
          <>
            {placeData.duration && (
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-primary" />
                <div>
                  <div className="text-sm font-medium">Duration</div>
                  <div className="text-xs text-muted-foreground">{placeData.duration}</div>
                </div>
              </div>
            )}
            {placeData.bestTime && (
              <div className="flex items-center space-x-2">
                <Sunrise className="w-4 h-4 text-primary" />
                <div>
                  <div className="text-sm font-medium">Best Time</div>
                  <div className="text-xs text-muted-foreground">{placeData.bestTime}</div>
                </div>
              </div>
            )}
            {placeData.difficulty && (
              <div className="flex items-center space-x-2">
                <Mountain className="w-4 h-4 text-primary" />
                <div>
                  <div className="text-sm font-medium">Difficulty</div>
                  <div className="text-xs text-muted-foreground">{placeData.difficulty}</div>
                </div>
              </div>
            )}
          </>
        ) : (
          <>
            <div className="flex items-center space-x-2">
              <Star className="w-4 h-4 text-primary" />
              <div>
                <div className="text-sm font-medium">Rating</div>
                <div className="text-xs text-muted-foreground">{placeData.rating} ({placeData.reviewCount} reviews)</div>
              </div>
            </div>
            {placeData.checkInTime && (
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-primary" />
                <div>
                  <div className="text-sm font-medium">Check-in</div>
                  <div className="text-xs text-muted-foreground">{placeData.checkInTime}</div>
                </div>
              </div>
            )}
            {placeData.checkOutTime && (
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-primary" />
                <div>
                  <div className="text-sm font-medium">Check-out</div>
                  <div className="text-xs text-muted-foreground">{placeData.checkOutTime}</div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="photos">Photos</TabsTrigger>
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
          <TabsTrigger value="nearby">Nearby</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6 mt-6">
          <div>
            <h3 className="font-semibold mb-3">About {placeData.name}</h3>
            <p className="text-muted-foreground leading-relaxed">{placeData.description}</p>
          </div>

          {placeData.highlights && placeData.highlights.length > 0 && (
            <div>
              <h3 className="font-semibold mb-3">Highlights</h3>
              <div className="grid md:grid-cols-2 gap-2">
                {placeData.highlights.map((highlight, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0" />
                    <span className="text-sm">{highlight}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {whatToExpectItems && whatToExpectItems.length > 0 && (
            <div>
              <h3 className="font-semibold mb-3">What to Expect</h3>
              <div className="grid md:grid-cols-2 gap-4">
                {whatToExpectItems.map((item, index) => {
                   const IconComponent = item.icon;
                  return (
                  <div key={index} className="flex items-start space-x-3 p-3 border rounded-lg">
                    <IconComponent className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium text-sm">{item.title}</h4>
                      <p className="text-xs text-muted-foreground mt-1">{item.desc}</p>
                    </div>
                  </div>
                )})}
              </div>
            </div>
          )}

          {placeData.accessibility && (
            <div>
              <h3 className="font-semibold mb-3">Accessibility & Info</h3>
              <div className="space-y-3 p-4 bg-blue-50 rounded-lg">
                <div className="grid md:grid-cols-2 gap-4">
                  {placeData.accessibility.difficulty && (
                    <div>
                      <span className="text-sm font-medium">Difficulty:</span>
                      <span className="text-sm ml-2">{placeData.accessibility.difficulty}</span>
                    </div>
                  )}
                  {placeData.accessibility.duration && (
                    <div>
                      <span className="text-sm font-medium">Duration:</span>
                      <span className="text-sm ml-2">{placeData.accessibility.duration}</span>
                    </div>
                  )}
                  {placeData.accessibility.distance && (
                    <div>
                      <span className="text-sm font-medium">Distance:</span>
                      <span className="text-sm ml-2">{placeData.accessibility.distance}</span>
                    </div>
                  )}
                  {placeData.accessibility.transport && (
                    <div>
                      <span className="text-sm font-medium">Transport:</span>
                      <span className="text-sm ml-2">{placeData.accessibility.transport}</span>
                    </div>
                  )}
                </div>
                {placeData.accessibility.facilities && placeData.accessibility.facilities.length > 0 && (
                  <div>
                    <span className="text-sm font-medium">Facilities:</span>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {placeData.accessibility.facilities.map((facility, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">{facility}</Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {placeData.tips && placeData.tips.length > 0 && (
            <div>
              <h3 className="font-semibold mb-3">
                <Info className="w-4 h-4 inline mr-2" />
                Visitor Tips
              </h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                {placeData.tips.map((tip, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-primary mr-2">•</span>
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </TabsContent>

        <TabsContent value="photos" className="mt-6">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {placeData.images.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`${placeData.name} - Photo ${index + 1}`}
                className="w-full h-32 md:h-40 object-cover rounded-lg cursor-pointer hover:opacity-80 transition-opacity shadow-sm"
                onClick={() => setCurrentImageIndex(index)}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="reviews" className="mt-6">
          <div className="space-y-4">
            {placeData.reviews && placeData.reviews.length > 0 ? (
                placeData.reviews.map((review, index) => (
                    <div key={index} className="border-b pb-4 last:border-b-0">
                        <div className="flex items-center space-x-2 mb-2">
                            <div className="flex">
                                {Array(5).fill(0).map((_, i) => (
                                    <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                                ))}
                            </div>
                            <span className="font-medium">{review.author}</span>
                            <span className="text-sm text-muted-foreground">{review.date}</span>
                        </div>
                        <p className="text-muted-foreground leading-relaxed">{review.comment}</p>
                    </div>
                ))
            ) : (
                <p className="text-muted-foreground">No reviews available yet.</p>
            )}
          </div>
        </TabsContent>

        <TabsContent value="nearby" className="mt-6">
          <div className="space-y-6">
            {placeData.nearbyAttractions && placeData.nearbyAttractions.length > 0 && (
              <div>
                <h3 className="font-semibold mb-3">Nearby Attractions</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {placeData.nearbyAttractions.map((attraction, index) => (
                    <div
                        key={index}
                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors shadow-sm"
                        onClick={() => handleViewDetails(attraction.id, attraction.type)}
                    >
                      <div>
                        <h4 className="font-medium">{attraction.name}</h4>
                        <p className="text-sm text-muted-foreground">{attraction.type}</p>
                        <div className="flex items-center space-x-1 mt-1">
                          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                          <span className="text-xs">{attraction.rating}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium">{attraction.distance}</div>
                        <Button variant="outline" size="sm" className="mt-1" onClick={(e) => { e.stopPropagation(); handleViewDetails(attraction.id, attraction.type); }}>
                          <Navigation className="w-3 h-3 mr-1" />
                          View
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {placeData.nearbyHotels && placeData.nearbyHotels.length > 0 && (
              <div>
                <h3 className="font-semibold mb-3">Nearby Hotels</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {placeData.nearbyHotels.map((hotel, index) => (
                    <div
                        key={index}
                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors shadow-sm"
                        onClick={() => handleViewDetails(hotel.id, "hotel")}
                    >
                      <div>
                        <h4 className="font-medium">{hotel.name}</h4>
                        <div className="flex items-center space-x-1 mt-1">
                          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                          <span className="text-xs">{hotel.rating}</span>
                        </div>
                        <p className="text-sm text-primary font-medium">{hotel.price}/night</p>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium">{hotel.distance}</div>
                        <Button variant="outline" size="sm" className="mt-1" onClick={(e) => { e.stopPropagation(); handleViewDetails(hotel.id, "hotel"); }}>
                          View Hotel
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  </div>

  <div className="lg:col-span-1">
    <div className="sticky top-20 space-y-4">
      <Card className="bg-white/95 backdrop-blur-sm shadow-sm">
        <CardHeader>
          <CardTitle>{isHotelPage ? "Book Your Stay" : "Visit This Place"}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {isHotelPage ? (
            <Button
              className="w-full bg-primary hover:bg-primary/90"
              size="lg"
              onClick={() => console.log(`Booking ${placeData.name}`)}
            >
              <Home className="w-4 h-4 mr-2" />
              Book Now
            </Button>
          ) : (
            <Button
              className="w-full bg-primary hover:bg-primary/90"
              size="lg"
              // Ensure lat and lng are passed for directions
              onClick={() => handleGetDirections(placeData.lat, placeData.lng, placeData.name)}
            >
              <Navigation className="w-4 h-4 mr-2" />
              Get Directions
            </Button>
          )}

          <div className="space-y-3 text-sm">
            <div className="p-3 bg-gray-50 rounded-lg">
              <h4 className="font-medium mb-2">Quick Info</h4>
              <div className="space-y-1">
                {!isHotelPage && placeData.entryFee && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Entry Fee:</span>
                    <span className="font-medium text-green-600">{placeData.entryFee}</span>
                  </div>
                )}
                {!isHotelPage && placeData.duration && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Duration:</span>
                    <span>{placeData.duration}</span>
                  </div>
                )}
                {placeData.bestTime && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Best Time:</span>
                    <span>{placeData.bestTime}</span>
                  </div>
                )}
                {isHotelPage && placeData.price && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Starting Price:</span>
                    <span className="font-medium">{placeData.price}/night</span>
                  </div>
                )}
                {isHotelPage && placeData.checkInTime && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Check-in:</span>
                    <span>{placeData.checkInTime}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {!isHotelPage && (
        <Card className="bg-white/95 backdrop-blur-sm shadow-sm">
          <CardHeader>
            <CardTitle className="text-base">Need a Guide?</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-3">
              Get a local guide for the best experience and safety.
            </p>
            <Button variant="outline" className="w-full" size="sm" onClick={() => handleViewDetails("local-guides", "guide")}>
              Find Local Guides
            </Button>
          </CardContent>
        </Card>
      )}

      {placeData.faqs && placeData.faqs.length > 0 && (
        <FAQSection faqs={placeData.faqs} className="bg-white/95 backdrop-blur-sm shadow-sm" />
      )}
    </div>
  </div>
</div>
  </div>
</div>
);
}
import React, { useState, useContext, useCallback, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { GlobalContext } from "../component/GlobalContext";
import { Button } from "../component/button";
import { Card, CardContent, CardHeader, CardTitle } from "../component/Card";
import { Badge } from "../component/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../component/tabs";
import { FAQSection } from "../component/FAQSection";
import { locationsData } from "../assets/dummy"; // Assuming this path is correct
import {
ArrowLeft,
Star,
MapPin,
Navigation,
Clock,
Camera,
Mountain,
ChevronLeft,
ChevronRight,
Sunrise,
TreePine,
Car,
Train,
Bus,
Phone,
Waves,
Binoculars,
Home,
Users,
Thermometer,
Info,
ShoppingCart,
Utensils,
Footprints
} from "lucide-react";
const iconMap = {
Car: Car,
Train: Train,
Bus: Bus,
Mountain: Mountain,
Home: Home,
Users: Users,
Thermometer: Thermometer,
Sunrise: Sunrise,
Camera: Camera,
TreePine: TreePine,
Clock: Clock,
Waves: Waves,
Binoculars: Binoculars,
Info: Info,
ShoppingCart: ShoppingCart,
Utensils: Utensils,
Walking: Footprints,
};
export default function LocationDetailsPage() {
const navigate = useNavigate();
const { locationId } = useParams();
const { setSelectedItemId, setSelectedDetailType, setFocusArea, locationDetails, setLocationDetails } = useContext(GlobalContext);
const [currentImageIndex, setCurrentImageIndex] = useState(0);
const [showAllViewpoints, setShowAllViewpoints] = useState(false);
const [showAllHotels, setShowAllHotels] = useState(false);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);
useEffect(() => {
setLoading(true);
setError(null);
if (locationId) {
const data = Array.isArray(locationsData[locationId]) ? locationsData[locationId][0] : locationsData[locationId];
if (data) {
setLocationDetails(data);
setLoading(false);
setCurrentImageIndex(0);
} else {
setError("Location not found.");
setLoading(false);
setLocationDetails(null);
}
} else {
setError("No location ID provided.");
setLoading(false);
setLocationDetails(null);
}
}, [locationId, setLocationDetails]);
const nextImage = useCallback(() => {
if (locationDetails && locationDetails.gallery && locationDetails.gallery.length > 0) {
setCurrentImageIndex((prev) => (prev + 1) % locationDetails.gallery.length);
}
}, [locationDetails]);
const prevImage = useCallback(() => {
if (locationDetails && locationDetails.gallery && locationDetails.gallery.length > 0) {
setCurrentImageIndex((prev) => (prev - 1 + locationDetails.gallery.length) % locationDetails.gallery.length);
}
}, [locationDetails]);
const handleBack = useCallback(() => {
navigate(-1);
}, [navigate]);
const handleGetDirections = useCallback((lat, lng, name) => {
const currentFocusId = locationDetails?.id || "nainital-area";
setFocusArea(currentFocusId);
navigate(/map-view/${currentFocusId}?destLat=${lat}&destLng=${lng}&destName=${encodeURIComponent(name)});
}, [navigate, setFocusArea, locationDetails]);
const handleViewDetails = useCallback((id, type) => {
setSelectedItemId(id);
setSelectedDetailType(type);
const routeMap = {
hotel: /hotel-details/${id},
popular:/popular-details/${id},
place: /place-details/${id},
trek: /trek-details/${id},
bike: /bike-details/${id},
cab: /cab-details/${id},
guide: /guide-details/${id},
resort: /hotel-details/${id},
viewpoint: /place-details/${id},
lake: /place-details/${id},
adventure: /place-details/${id},
wildlife: /place-details/${id},
temple: /place-details/${id},
"nature trail": /place-details/${id},
"wildlife sanctuary": /place-details/${id},
"temple/ashram": /place-details/${id},
};
const path = routeMap[type.toLowerCase()] || "/";
navigate(path);
}, [navigate, setSelectedItemId, setSelectedDetailType]);
const handleBookHotel = useCallback((hotelId) => {
navigate(/book-hotel/${hotelId});
}, [navigate]);
if (loading) {
return (
<div className="flex justify-center items-center min-h-screen">
Loading...
</div>
);
}
if (error) {
return (
<div className="flex justify-center items-center min-h-screen text-red-600">
Error: {error}
<Button variant="link" onClick={handleBack}>Go Back</Button>
</div>
);
}
if (!locationDetails) {
return (
<div className="flex justify-center items-center min-h-screen text-gray-600">
No location data available.
<Button variant="link" onClick={handleBack}>Go Back</Button>
</div>
);
}
const displayImage = locationDetails.gallery[currentImageIndex];
const mainBackgroundImage = locationDetails.gallery[0];
const whatToExpectItems = locationDetails.whatToExpect && locationDetails.whatToExpect.length > 0
? locationDetails.whatToExpect.map(item => ({
...item,
icon: iconMap[item.icon] || Info
}))
: [];
const otherActivitiesItems = locationDetails.otherActivities && locationDetails.otherActivities.length > 0
? locationDetails.otherActivities.map(activity => ({
...activity,
icon: iconMap[activity.icon] || Info
}))
: [];
return (
<div
className="min-h-screen"
style={{
backgroundImage: linear-gradient(rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.1)), url('${mainBackgroundImage}'),
backgroundPosition: 'center',
backgroundSize: 'cover',
backgroundRepeat: 'no-repeat',
backgroundAttachment: 'fixed',
backgroundColor: '#f9fafb'
}}
>
<div className="bg-white/95 backdrop-blur-sm shadow-sm px-4 py-3 md:px-6 sticky top-0 z-10">
<Button variant="ghost" onClick={handleBack} className="mb-0">
<ArrowLeft className="w-4 h-4 mr-2" />
Back to Explore
</Button>
</div>
code
Code
<div className="container mx-auto px-4 py-6 max-w-6xl">
    <div className="relative mb-6">
      <div className="relative h-64 md:h-96 rounded-lg overflow-hidden">
        <img
          src={displayImage}
          alt={`${locationDetails.name} - Image ${currentImageIndex + 1}`}
          className="w-full h-full object-cover"
        />
        {locationDetails.gallery && locationDetails.gallery.length > 1 && (
          <>
            <Button
              variant="secondary"
              size="sm"
              onClick={prevImage}
              className="absolute left-4 top-1/2 -translate-y-1/2 opacity-80 hover:opacity-100"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={nextImage}
              className="absolute right-4 top-1/2 -translate-y-1/2 opacity-80 hover:opacity-100"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
              {locationDetails.gallery.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full cursor-pointer transition-colors ${
                    index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                  }`}
                  onClick={() => setCurrentImageIndex(index)}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
code
Code
<div className="grid lg:grid-cols-3 gap-8">
  <div className="lg:col-span-2 space-y-6">
    <div className="bg-white/95 backdrop-blur-sm rounded-lg p-6 shadow-sm">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold mb-2">{locationDetails.name.split(' - ')[0]}</h1>
          <div className="flex items-center space-x-2 text-muted-foreground mb-2">
            <MapPin className="w-4 h-4" />
            <span>{locationDetails.location}</span>
          </div>
          <div className="flex items-center space-x-4 flex-wrap gap-2">
            <div className="flex items-center space-x-1">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="font-medium">{locationDetails.rating}</span>
              <span className="text-muted-foreground">({locationDetails.reviewCount ? locationDetails.reviewCount.toLocaleString() : 0} reviews)</span>
            </div>
            {locationDetails.elevation && (
              <Badge className="bg-green-100 text-green-800">{locationDetails.elevation}</Badge>
            )}
            {locationDetails.bestTime && (
              <Badge variant="outline">{locationDetails.bestTime}</Badge>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6 p-4 bg-blue-50/80 rounded-lg">
        <div className="flex items-center space-x-2">
          <Thermometer className="w-4 h-4 text-primary" />
          <div>
            <div className="text-sm font-medium">Best Weather</div>
            <div className="text-xs text-muted-foreground">{locationDetails.bestTime || "N/A"}</div>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Mountain className="w-4 h-4 text-primary" />
          <div>
            <div className="text-sm font-medium">Elevation</div>
            <div className="text-xs text-muted-foreground">{locationDetails.elevation || "N/A"}</div>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Users className="w-4 h-4 text-primary" />
          <div>
            <div className="text-sm font-medium">Annual Visitors</div>
            <div className="text-xs text-muted-foreground">{locationDetails.annualVisitors ? locationDetails.annualVisitors.toLocaleString() : "N/A"}</div>
          </div>
        </div>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="routes">Routes</TabsTrigger>
          <TabsTrigger value="attractions">Attractions</TabsTrigger>
          <TabsTrigger value="hotels">Hotels</TabsTrigger>
          <TabsTrigger value="activities">Activities</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6 mt-6">
          <div>
            <h3 className="font-semibold mb-3">About {locationDetails.name.split(' - ')[0]}</h3>
            <p className="text-muted-foreground leading-relaxed">{locationDetails.description}</p>
          </div>

          {locationDetails.highlights && locationDetails.highlights.length > 0 && (
            <div>
              <h3 className="font-semibold mb-3">Highlights</h3>
              <div className="grid md:grid-cols-2 gap-2">
                {locationDetails.highlights.map((highlight, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0" />
                    <span className="text-sm">{highlight}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {whatToExpectItems && whatToExpectItems.length > 0 && (
            <div>
              <h3 className="font-semibold mb-3">What to Expect</h3>
              <div className="grid md:grid-cols-2 gap-4">
                {whatToExpectItems.map((item, index) => {
                  const IconComponent = item.icon;
                  return (
                    <div key={index} className="flex items-start space-x-3 p-3 border rounded-lg">
                      <IconComponent className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                      <div>
                        <h4 className="font-medium text-sm">{item.title}</h4>
                        <p className="text-xs text-muted-foreground mt-1">{item.desc}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {locationDetails.localFood && locationDetails.localFood.length > 0 && (
            <div>
              <h3 className="font-semibold mb-3">Local Food Specialties</h3>
              <div className="flex flex-wrap gap-2">
                {locationDetails.localFood.map((food, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {food}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {locationDetails.tips && locationDetails.tips.length > 0 && (
            <div>
              <h3 className="font-semibold mb-3">
                <Info className="w-4 h-4 inline mr-2" />
                Visitor Tips
              </h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                {locationDetails.tips.map((tip, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-primary mr-2">•</span>
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </TabsContent>

        <TabsContent value="routes" className="space-y-6 mt-6">
          <div>
            <h3 className="font-semibold mb-4">How to Reach {locationDetails.name.split(' - ')[0]}</h3>
            <div className="space-y-4">
              {locationDetails.routes && locationDetails.routes.length > 0 ? (
                locationDetails.routes.map((route, index) => {
                  const IconComponent = iconMap[route.icon] || Car;
                  return (
                    <div key={index} className="border rounded-lg p-4 hover:bg-gray-50/50">
                      <div className="flex items-start space-x-3">
                        <IconComponent className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                        <div className="flex-1">
                          <h4 className="font-medium text-sm mb-1">{route.mode}</h4>
                          <div className="grid md:grid-cols-2 gap-2 text-xs text-muted-foreground mb-2">
                            <span>Distance: {route.distance}</span>
                            <span>Duration: {route.duration}</span>
                          </div>
                          <p className="text-xs text-muted-foreground mb-2">{route.route}</p>
                          <p className="text-xs">{route.details}</p>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="text-muted-foreground">No route information available for this location.</p>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="attractions" className="space-y-6 mt-6">
          <div>
            <h3 className="font-semibold mb-4">Popular Attractions ({locationDetails.popularSpots ? locationDetails.popularSpots.length : 0}+ Spots)</h3>
            <div className="grid gap-4">
              {locationDetails.popularSpots && locationDetails.popularSpots.length > 0 ? (
                locationDetails.popularSpots.slice(0, showAllViewpoints ? locationDetails.popularSpots.length : 6).map((spot, index) => (
                  <div key={index} className="border rounded-lg p-4 hover:bg-gray-50/50 cursor-pointer" onClick={() => handleViewDetails(spot.id, spot.type)}>
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h4 className="font-medium text-sm">{spot.name}</h4>
                          <Badge variant="outline" className="text-xs">{spot.type}</Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mb-2">{spot.description}</p>
                        <div className="flex items-center space-x-4 text-xs">
                          <div className="flex items-center space-x-1">
                            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                            <span>{spot.rating}</span>
                          </div>
                          <span className="text-muted-foreground">{spot.visitors} annual visitors</span>
                        </div>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {spot.activities && spot.activities.map((activity, idx) => (
                            <Badge key={idx} variant="secondary" className="text-xs py-0 px-2">
                              {activity}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <Button variant="outline" size="sm" onClick={(e) => { e.stopPropagation(); handleViewDetails(spot.id, spot.type); }}>
                        <Navigation className="w-3 h-3 mr-1" />
                        Visit
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground">No popular attractions listed for this location.</p>
              )}
            </div>
            {!showAllViewpoints && locationDetails.popularSpots && locationDetails.popularSpots.length > 6 && (
              <Button
                variant="outline"
                onClick={() => setShowAllViewpoints(true)}
                className="w-full mt-4"
              >
                See More Attractions ({locationDetails.popularSpots.length - 6} more)
              </Button>
            )}
          </div>
        </TabsContent>

        <TabsContent value="hotels" className="space-y-6 mt-6">
          <div>
            <h3 className="font-semibold mb-4">Recommended Hotels</h3>
            <div className="grid gap-4">
              {locationDetails.hotels && locationDetails.hotels.length > 0 ? (
                locationDetails.hotels.slice(0, showAllHotels ? locationDetails.hotels.length : 3).map((hotel, index) => (
                  <div key={index} className="border rounded-lg p-4 hover:bg-gray-50/50">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h4 className="font-medium text-sm">{hotel.name}</h4>
                          <div className="flex items-center space-x-1">
                            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                            <span className="text-xs">{hotel.rating}</span>
                          </div>
                        </div>
                        <p className="text-xs text-muted-foreground mb-2">{hotel.description}</p>
                        <div className="flex items-center space-x-4 text-xs mb-2">
                          <span className="text-muted-foreground">{hotel.distance}</span>
                          <span className="text-primary font-medium">{hotel.price}/night</span>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {hotel.features && hotel.features.map((feature, idx) => (
                            <Badge key={idx} variant="secondary" className="text-xs py-0 px-2">
                              {feature}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleBookHotel(hotel.id)}
                      >
                        <Home className="w-3 h-3 mr-1" />
                        Book
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground">No recommended hotels listed for this location.</p>
              )}
            </div>
            {!showAllHotels && locationDetails.hotels && locationDetails.hotels.length > 3 && (
              <Button
                variant="outline"
                onClick={() => setShowAllHotels(true)}
                className="w-full mt-4"
              >
                See More Hotels ({locationDetails.hotels.length - 3} more)
              </Button>
            )}
          </div>
        </TabsContent>

        <TabsContent value="activities" className="space-y-6 mt-6">
          {locationDetails.boatingPoints && locationDetails.boatingPoints.length > 0 ? (
            <div>
              <h3 className="font-semibold mb-4">Boating Points & Activities</h3>
              <div className="space-y-4">
                {locationDetails.boatingPoints.map((point, index) => (
                  <div key={index} className="border rounded-lg p-4 bg-blue-50/50 shadow-sm">
                    <h4 className="font-medium text-sm mb-2">{point.name}</h4>
                    <p className="text-xs text-muted-foreground mb-3">{point.description}</p>
                    <div className="grid md:grid-cols-2 gap-4 text-xs">
                      <div>
                        <span className="font-medium">Location:</span> {point.location}
                      </div>
                      <div>
                        <span className="font-medium">Timings:</span> {point.timings}
                      </div>
                    </div>
                    <div className="mt-3">
                      <span className="font-medium text-xs">Rates:</span>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {Object.entries(point.rates || {}).map(([type, rate]) => (
                          <Badge key={type} variant="outline" className="text-xs">
                            {type}: {rate}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="mt-2">
                      <span className="font-medium text-xs">Views:</span>
                      <span className="text-xs text-muted-foreground ml-1">
                        {point.views ? point.views.join(", ") : "N/A"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-muted-foreground">No specific boating activities listed for this location.</p>
          )}

          {otherActivitiesItems && otherActivitiesItems.length > 0 && (
            <div className="mt-6">
              <h3 className="font-semibold mb-4">Other Adventures & Activities</h3>
              <div className="grid md:grid-cols-2 gap-4">
                {otherActivitiesItems.map((activity, index) => {
                  const IconComponent = activity.icon;
                  return (
                    <div key={index} className="border rounded-lg p-4 hover:bg-gray-50/50 shadow-sm">
                      <div className="flex items-start space-x-3">
                        <IconComponent className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                        <div>
                          <h4 className="font-medium text-sm mb-1">{activity.name}</h4>
                          <p className="text-xs text-muted-foreground mb-2">{activity.description}</p>
                          {activity.price && <p className="text-xs font-medium">Price: {activity.price}</p>}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  </div>

  <div className="lg:col-span-1">
    <div className="sticky top-20 space-y-4">
      <Card className="bg-white/95 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Plan Your Visit</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            className="w-full bg-primary hover:bg-primary/90"
            size="lg"
            onClick={() => handleGetDirections(locationDetails.lat, locationDetails.lng, locationDetails.name)}
          >
            <Navigation className="w-4 h-4 mr-2" />
            Get Directions
          </Button>

          <div className="space-y-3 text-sm">
            <div className="p-3 bg-green-50/80 rounded-lg">
              <h4 className="font-medium mb-2">Quick Info</h4>
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">From Delhi:</span>
                  <span className="font-medium">
                    {locationDetails.routes && locationDetails.routes.find(r => r.mode.includes("Delhi"))?.distance || "N/A"} /
                    {locationDetails.routes && locationDetails.routes.find(r => r.mode.includes("Delhi"))?.duration || "N/A"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Best Season:</span>
                  <span>{locationDetails.bestTime || "N/A"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Annual Visitors:</span>
                  <span className="text-green-600">{locationDetails.annualVisitors ? locationDetails.annualVisitors.toLocaleString() : "N/A"}</span>
                </div>
              </div>
            </div>
          </div>

          <Button variant="outline" className="w-full" onClick={() => handleViewDetails("local-guides", "guide")}>
            <Users className="w-4 h-4 mr-2" />
            Find Local Guides
          </Button>
        </CardContent>
      </Card>

      {locationDetails.faqs && locationDetails.faqs.length > 0 && (
        <FAQSection faqs={locationDetails.faqs} className="bg-white/95 backdrop-blur-sm" />
      )}
    </div>
  </div>
</div>
  </div>
</div>
);
}
so give the trek page in js simer like place and location
export const hotelDetailsData = {
  "bhimtal-lake": { // Ensure this ID matches the format used in routes and context
    id: "bhimtal-lake",
    name: "Mountain View Resort Bhimtal",
    location: "2km from Bhimtal Lake, Uttarakhand",
    rating: 4.5,
    reviewCount: 128,
    price: "4500", // Base price, individual room types have their own prices
    priceNote: "per night",
    checkInTime: "2:00 PM",
    checkOutTime: "11:00 AM",
    images: [
      "https://images.unsplash.com/photo-1670555383991-ae6ad4bb39df?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHxoaWxsJTIwcmVzb3J0JTIwbW91bnRhaW4lMjB2aWV3fGVuMXx8fHwxNzU3NjE2OTg5fDB&ixlib=rb-4.1.0&q=80&w=1080",
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxob3RlbCUyMHJvb20lMjBsdXh1cnl8ZW58MXx8fHwxNzM3MDM4NDAwfDB&ixlib=rb-4.1.0&q=80&w=1080",
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHhob3RlbCUyMHBvb2wlMjByZXNvcnR8ZW58MXx8fHwxNzM3MDM4NDAwfDB&ixlib=rb-4.1.0&q=80&w=1080",
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHxyZXN0YXVyYW50JTIwaW50ZXJpb3J8ZW58MXx8fHwxNzM3MDM4NDAwfDB&ixlib=rb-4.1.0&q=80&w=1080"
    ],
    description: "Luxury resort with spectacular lake views, modern amenities, and spa facilities. Perfect for families and couples seeking a peaceful mountain retreat with easy access to Bhimtal's attractions.",
    amenities: [
      { icon: "Wifi", name: "Free WiFi" },
      { icon: "Car", name: "Free Parking" },
      { icon: "Waves", name: "Swimming Pool" },
      { icon: "Coffee", name: "Spa & Wellness" },
      { icon: "Utensils", name: "Multi-cuisine Restaurant" },
      { icon: "Shield", name: "24/7 Security" }
    ],
    roomTypes: [
      {
        name: "Standard Room",
        price: "2500", // Updated to number-like string for easier parsing
        features: ["Lake View", "AC", "TV", "WiFi"],
        available: true
      },
      {
        name: "Deluxe Room",
        price: "3500",
        features: ["Lake View", "Balcony", "AC", "TV", "WiFi", "Mini Bar"],
        available: true
      },
      {
        name: "Suite",
        price: "5500",
        features: ["Panoramic View", "Separate Living Area", "Jacuzzi", "All Premium Amenities"],
        available: false
      }
    ],
    nearbyAttractions: [
      { id: "bhimtal-lake", name: "Bhimtal Lake", distance: "2km", type: "lake", rating: 4.6 },
      { id: "naukuchiatal", name: "Naukuchiatal", distance: "8km", type: "lake", rating: 4.5 },
      { id: "tiffin-top-trek", name: "Tiffin Top Trek", distance: "12km", type: "viewpoint", rating: 4.7 },
      { id: "naina-peak-trek", name: "Naina Peak Trek", distance: "15km", type: "trek", rating: 4.8 }
    ],
    contact: {
      phone: "+91 9876543210",
      email: "info@mountainviewresort.com"
    },
    policies: [
      "Check-in: 2:00 PM | Check-out: 11:00 AM",
      "Cancellation: Free cancellation up to 24 hours before arrival",
      "Children: Children under 12 stay free with existing bedding",
      "Pets: Pet-friendly rooms available on request"
    ],
    reviews: [
        {
            author: "Rajesh Kumar",
            rating: 5,
            date: "2 days ago",
            comment: "Amazing stay with beautiful lake views! The staff was very helpful and the food was excellent. Perfect location for exploring Bhimtal and nearby attractions."
        },
        {
            author: "Priya Sharma",
            rating: 4,
            date: "1 week ago",
            comment: "Great mountain resort experience. Room was clean and comfortable. The spa facilities were relaxing after a day of trekking."
        }
    ],
    faqs: [
      {
        question: "Is there a swimming pool?",
        answer: "Yes, the resort has a spacious outdoor swimming pool accessible to all guests."
      },
      {
        question: "Do rooms have lake views?",
        answer: "Many of our rooms offer spectacular lake views. Please specify your preference when booking."
      },
      {
        question: "Is parking available?",
        answer: "Yes, we provide ample free parking for all our guests."
      },
      {
        question: "Are pets allowed?",
        answer: "We have designated pet-friendly rooms available upon request. Additional charges may apply."
      }
    ]
  },
for this data the type trek export const hotelDetailsData = {
  "bhimtal-lake": { // Ensure this ID matches the format used in routes and context
    id: "bhimtal-lake",
    name: "Mountain View Resort Bhimtal",
    location: "2km from Bhimtal Lake, Uttarakhand",
    rating: 4.5,
    reviewCount: 128,
    price: "4500", // Base price, individual room types have their own prices
    priceNote: "per night",
    checkInTime: "2:00 PM",
    checkOutTime: "11:00 AM",
    images: [
      "https://images.unsplash.com/photo-1670555383991-ae6ad4bb39df?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHxoaWxsJTIwcmVzb3J0JTIwbW91bnRhaW4lMjB2aWV3fGVuMXx8fHwxNzU3NjE2OTg5fDB&ixlib=rb-4.1.0&q=80&w=1080",
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxob3RlbCUyMHJvb20lMjBsdXh1cnl8ZW58MXx8fHwxNzM3MDM4NDAwfDB&ixlib=rb-4.1.0&q=80&w=1080",
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHhob3RlbCUyMHBvb2wlMjByZXNvcnR8ZW58MXx8fHwxNzM3MDM4NDAwfDB&ixlib=rb-4.1.0&q=80&w=1080",
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHxyZXN0YXVyYW50JTIwaW50ZXJpb3J8ZW58MXx8fHwxNzM3MDM4NDAwfDB&ixlib=rb-4.1.0&q=80&w=1080"
    ],
    description: "Luxury resort with spectacular lake views, modern amenities, and spa facilities. Perfect for families and couples seeking a peaceful mountain retreat with easy access to Bhimtal's attractions.",
    amenities: [
      { icon: "Wifi", name: "Free WiFi" },
      { icon: "Car", name: "Free Parking" },
      { icon: "Waves", name: "Swimming Pool" },
      { icon: "Coffee", name: "Spa & Wellness" },
      { icon: "Utensils", name: "Multi-cuisine Restaurant" },
      { icon: "Shield", name: "24/7 Security" }
    ],
    roomTypes: [
      {
        name: "Standard Room",
        price: "2500", // Updated to number-like string for easier parsing
        features: ["Lake View", "AC", "TV", "WiFi"],
        available: true
      },
      {
        name: "Deluxe Room",
        price: "3500",
        features: ["Lake View", "Balcony", "AC", "TV", "WiFi", "Mini Bar"],
        available: true
      },
      {
        name: "Suite",
        price: "5500",
        features: ["Panoramic View", "Separate Living Area", "Jacuzzi", "All Premium Amenities"],
        available: false
      }
    ],
    nearbyAttractions: [
      { id: "bhimtal-lake", name: "Bhimtal Lake", distance: "2km", type: "lake", rating: 4.6 },
      { id: "naukuchiatal", name: "Naukuchiatal", distance: "8km", type: "lake", rating: 4.5 },
      { id: "tiffin-top-trek", name: "Tiffin Top Trek", distance: "12km", type: "viewpoint", rating: 4.7 },
      { id: "naina-peak-trek", name: "Naina Peak Trek", distance: "15km", type: "trek", rating: 4.8 }
    ],
    contact: {
      phone: "+91 9876543210",
      email: "info@mountainviewresort.com"
    },
    policies: [
      "Check-in: 2:00 PM | Check-out: 11:00 AM",
      "Cancellation: Free cancellation up to 24 hours before arrival",
      "Children: Children under 12 stay free with existing bedding",
      "Pets: Pet-friendly rooms available on request"
    ],
    reviews: [
        {
            author: "Rajesh Kumar",
            rating: 5,
            date: "2 days ago",
            comment: "Amazing stay with beautiful lake views! The staff was very helpful and the food was excellent. Perfect location for exploring Bhimtal and nearby attractions."
        },
        {
            author: "Priya Sharma",
            rating: 4,
            date: "1 week ago",
            comment: "Great mountain resort experience. Room was clean and comfortable. The spa facilities were relaxing after a day of trekking."
        }
    ],
    faqs: [
      {
        question: "Is there a swimming pool?",
        answer: "Yes, the resort has a spacious outdoor swimming pool accessible to all guests."
      },
      {
        question: "Do rooms have lake views?",
        answer: "Many of our rooms offer spectacular lake views. Please specify your preference when booking."
      },
      {
        question: "Is parking available?",
        answer: "Yes, we provide ample free parking for all our guests."
      },
      {
        question: "Are pets allowed?",
        answer: "We have designated pet-friendly rooms available upon request. Additional charges may apply."
      }
    ]
  },
handle for the trek page dynmiacly and navigate like place detalis page and papular page import React, { useState, useCallback, useEffect, useContext, useRef } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { GlobalContext } from "../component/GlobalContext";
import { hotelDetailsData } from "../assets/dummy";

import { Button } from "../component/button";
import { Card, CardContent, CardHeader, CardTitle } from "../component/Card";
import { Input } from "../component/Input"; // Import Input for date selection
import { Badge } from "../component/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../component/tabs";
import { FAQSection } from "../component/FAQSection";
import { ImageWithFallback } from "../component/ImageWithFallback";
// ADD THESE IMPORTS:
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../component/select";


import {
  ArrowLeft,
  Star,
  MapPin,
  Wifi,
  Car,
  Waves,
  Coffee,
  Utensils,
  Calendar,
  Users,
  ChevronLeft,
  ChevronRight,
  Navigation,
  Phone,
  Mail,
  Shield,
  Info
} from "lucide-react";

const iconMap = {
  Wifi: Wifi,
  Car: Car,
  Waves: Waves,
  Coffee: Coffee,
  Utensils: Utensils,
  Shield: Shield,
  Calendar: Calendar,
  Users: Users,
  Phone: Phone,
  Mail: Mail,
  Star: Star,
  MapPin: MapPin,
  Navigation: Navigation,
  Info: Info,
};

export default function PopularDetailsPage() {
  const navigate = useNavigate();
  const { popularId } = useParams();
  const location = useLocation();
  const { setFocusArea, setSelectedItemId, setSelectedDetailType } = useContext(GlobalContext);

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [popularItemData, setPopularItemData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [checkInDate, setCheckInDate] = useState("");
  const [checkOutDate, setCheckOutDate] = useState("");
  const [guests, setGuests] = useState("2");
  const [selectedRoomType, setSelectedRoomType] = useState("");

  const bookingCardRef = useRef(null);
  const [faqStickyTop, setFaqStickyTop] = useState(450);

  useEffect(() => {
    setLoading(true);
    setError(null);
    if (popularId) {
      const data = hotelDetailsData[popularId];
      if (data) {
        setPopularItemData(data);
        setLoading(false);
        setCurrentImageIndex(0); // Reset image index for new item

        // Parse query parameters for pre-filled booking data
        const params = new URLSearchParams(location.search);
        setCheckInDate(params.get("checkIn") || "");
        setCheckOutDate(params.get("checkOut") || "");
        setGuests(params.get("guests") || "2");
        setSelectedRoomType(params.get("roomType") || (data.roomTypes.length > 0 ? data.roomTypes[0].name : ""));

      } else {
        setError("Popular item not found.");
        setLoading(false);
        setPopularItemData(null);
      }
    } else {
      setError("No popular ID provided.");
      setLoading(false);
      setPopularItemData(null);
    }
  }, [popularId, location.search]); // Re-run effect when popularId or location.search changes

  // Effect to calculate the sticky top for FAQ section
  useEffect(() => {
    const calculateFaqStickyTop = () => {
      if (bookingCardRef.current) {
        const bookingCardHeight = bookingCardRef.current.offsetHeight;
        const bookingCardTopOffset = 80; // This corresponds to 'top-20' in Tailwind CSS
        const gapBetweenElements = 16; // This corresponds to 'gap-4' in Tailwind CSS
        setFaqStickyTop(bookingCardTopOffset + bookingCardHeight + gapBetweenElements);
      }
    };

    calculateFaqStickyTop(); // Calculate on initial render

    // Recalculate if window resizes (heights might change)
    window.addEventListener('resize', calculateFaqStickyTop); // Changed to calculateFaqStickyTop
    // Recalculate if popularItemData changes (content might change height)
    // Small delay to ensure content is rendered before calculating height
    const timer = setTimeout(calculateFaqStickyTop, 100);


    return () => {
      window.removeEventListener('resize', calculateFaqStickyTop);
      clearTimeout(timer);
    };
  }, [popularItemData, checkInDate, checkOutDate, guests, selectedRoomType]); // Recalculate when popularItemData or booking inputs change

  const handleBack = useCallback(() => {
    navigate(-1); // Go back to the previous page in history
  }, [navigate]);

  const handleBookNow = useCallback((id) => {
    // Navigate to the booking page with the item ID and current booking data
    const queryParams = new URLSearchParams();
    if (checkInDate) queryParams.append("checkIn", checkInDate);
    if (checkOutDate) queryParams.append("checkOut", checkOutDate);
    if (guests) queryParams.append("guests", guests);
    if (selectedRoomType) queryParams.append("roomType", selectedRoomType);

    navigate(`/book-item/${id}?${queryParams.toString()}`);
  }, [navigate, checkInDate, checkOutDate, guests, selectedRoomType]);

  const handleViewMap = useCallback((locationName) => {
    const focusId = popularId.toLowerCase().replace(/\s/g, '-');
    setFocusArea(focusId); // Set focus area in global context for the map
    navigate(`/map-view/${focusId}?destName=${encodeURIComponent(locationName)}`);
  }, [navigate, setFocusArea, popularId]);

  const handleViewNearbyDetails = useCallback((id, type) => {
    setSelectedItemId(id);
    setSelectedDetailType(type);
    const routeMap = {
      hotel: `/hotel-details/${id}`,
      popular: `/popular-details/${id}`,
      place: `/place-details/${id}`,
      trek: `/trek-details/${id}`,
      lake: `/place-details/${id}`,
      viewpoint: `/place-details/${id}`,
      // Add other types as needed
    };
    const path = routeMap[type.toLowerCase()] || "/";
    navigate(path);
  }, [navigate, setSelectedItemId, setSelectedDetailType]);

  const nextImage = useCallback(() => {
    if (popularItemData && popularItemData.images && popularItemData.images.length > 0) {
      setCurrentImageIndex((prev) => (prev + 1) % popularItemData.images.length);
    }
  }, [popularItemData]);

  const prevImage = useCallback(() => {
    if (popularItemData && popularItemData.images && popularItemData.images.length > 0) {
      setCurrentImageIndex((prev) => (prev - 1 + popularItemData.images.length) % popularItemData.images.length);
    }
  }, [popularItemData]);

  const calculateNumberOfNights = () => {
    if (!checkInDate || !checkOutDate) return 0;
    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);
    const timeDiff = checkOut.getTime() - checkIn.getTime();
    const dayDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
    return dayDiff > 0 ? dayDiff : 0;
  };

  const calculateTotalPreview = () => {
    if (!popularItemData || !selectedRoomType) return 0;
    const room = popularItemData.roomTypes.find(rt => rt.name === selectedRoomType);
    if (!room) return 0;

    const roomPrice = parseFloat(room.price); // Parse directly as it's just a number string now
    const nights = calculateNumberOfNights();
    const basePrice = roomPrice * nights;
    const taxesAndFees = 500; // Mock taxes and fees
    return basePrice + taxesAndFees;
  };

  const today = new Date().toISOString().split('T')[0];
  const minCheckoutDate = checkInDate || today;

  const isBookNowDisabled = !checkInDate || !checkOutDate || calculateNumberOfNights() <= 0 || !selectedRoomType;

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        Loading popular item details...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-gray-50 text-red-600">
        <p>Error: {error}</p>
        <Button variant="link" onClick={handleBack}>Go Back</Button>
      </div>
    );
  }

  if (!popularItemData) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-gray-50 text-gray-600">
        <p>No popular item data available.</p>
        <Button variant="link" onClick={handleBack}>Go Back</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm px-4 py-3 md:px-6 sticky top-0 z-10">
        <Button variant="ghost" onClick={handleBack} className="mb-0">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Results
        </Button>
      </div>

      <div className="container mx-auto px-4 py-6 max-w-6xl">
        {/* Image Carousel */}
        <div className="relative mb-6">
          <div className="relative h-64 md:h-96 rounded-lg overflow-hidden shadow-lg">
            <ImageWithFallback
              src={popularItemData.images[currentImageIndex]}
              alt={`${popularItemData.name} - Image ${currentImageIndex + 1}`}
              className="w-full h-full object-cover"
            />
            {popularItemData.images.length > 1 && (
              <>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 opacity-80 hover:opacity-100"
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 opacity-80 hover:opacity-100"
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
                  {popularItemData.images.map((_, index) => (
                    <div
                      key={index}
                      className={`w-2 h-2 rounded-full cursor-pointer transition-colors ${
                        index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                      }`}
                      onClick={() => setCurrentImageIndex(index)}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Popular Item Info */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold mb-2">{popularItemData.name}</h1>
                  <div className="flex items-center space-x-2 text-muted-foreground mb-2">
                    <MapPin className="w-4 h-4" />
                    <span>{popularItemData.location}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium">{popularItemData.rating}</span>
                    </div>
                    <span className="text-muted-foreground">({popularItemData.reviewCount} reviews)</span>
                    <Badge className="bg-green-100 text-green-800">Available Today</Badge>
                  </div>
                </div>
                <div className="mt-4 md:mt-0 text-right">
                  <div className="text-2xl font-bold text-primary">₹{popularItemData.price}</div>
                  <div className="text-sm text-muted-foreground">{popularItemData.priceNote || "/night"}</div>
                </div>
              </div>

              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="photos">Photos</TabsTrigger>
                  <TabsTrigger value="reviews">Reviews</TabsTrigger>
                  <TabsTrigger value="nearby">Nearby</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-6 mt-6">
                  <div>
                    <h3 className="font-semibold mb-3">About This Property</h3>
                    <p className="text-muted-foreground leading-relaxed">{popularItemData.description}</p>
                  </div>

                  {popularItemData.amenities && popularItemData.amenities.length > 0 && (
                    <div>
                      <h3 className="font-semibold mb-3">Amenities</h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {popularItemData.amenities.map((amenity, index) => {
                          const IconComponent = iconMap[amenity.icon] || Info; // Use mapped icon or fallback
                          return (
                            <div key={index} className="flex items-center space-x-2">
                              <IconComponent className="w-4 h-4 text-primary" />
                              <span className="text-sm">{amenity.name}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {popularItemData.roomTypes && popularItemData.roomTypes.length > 0 && (
                    <div>
                      <h3 className="font-semibold mb-3">Room Types</h3>
                      <div className="space-y-3">
                        {popularItemData.roomTypes.map((room, index) => (
                          <div key={index} className={`p-4 border rounded-lg ${!room.available ? 'opacity-60 bg-gray-50' : ''}`}>
                            <div className="flex justify-between items-start mb-2">
                              <h4 className="font-medium">{room.name}</h4>
                              <div className="text-right">
                                <div className="font-semibold text-primary">₹{room.price}/night</div>
                                {!room.available && <Badge variant="secondary">Sold Out</Badge>}
                              </div>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {room.features.map((feature, idx) => (
                                <Badge key={idx} variant="outline" className="text-xs">{feature}</Badge>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {popularItemData.policies && popularItemData.policies.length > 0 && (
                    <div>
                      <h3 className="font-semibold mb-3">Policies</h3>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        {popularItemData.policies.map((policy, index) => (
                          <li key={index}>• {policy}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="photos" className="mt-6">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {popularItemData.images.map((image, index) => (
                      <img
                        key={index}
                        src={image}
                        alt={`${popularItemData.name} - Photo ${index + 1}`}
                        className="w-full h-32 md:h-40 object-cover rounded-lg cursor-pointer hover:opacity-80 transition-opacity shadow-sm"
                        onClick={() => setCurrentImageIndex(index)}
                      />
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="reviews" className="mt-6">
                  <div className="space-y-4">
                    {popularItemData.reviews && popularItemData.reviews.length > 0 ? (
                        popularItemData.reviews.map((review, index) => (
                            <div key={index} className="border-b pb-4 last:border-b-0">
                                <div className="flex items-center space-x-2 mb-2">
                                    <div className="flex">
                                        {Array(5).fill(0).map((_, i) => (
                                            <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                                        ))}
                                    </div>
                                    <span className="font-medium">{review.author}</span>
                                    <span className="text-sm text-muted-foreground">{review.date}</span>
                                </div>
                                <p className="text-muted-foreground leading-relaxed">{review.comment}</p>
                            </div>
                        ))
                    ) : (
                        <p className="text-muted-foreground">No reviews available yet.</p>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="nearby" className="mt-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    {popularItemData.nearbyAttractions && popularItemData.nearbyAttractions.length > 0 ? (
                      popularItemData.nearbyAttractions.map((place, index) => (
                        <div key={index} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors shadow-sm">
                          <div>
                            <h4 className="font-medium">{place.name}</h4>
                            <p className="text-sm text-muted-foreground">{place.type}</p>
                            <div className="flex items-center space-x-1 mt-1">
                              <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                              <span className="text-xs">{place.rating}</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-medium">{place.distance}</div>
                            <Button
                              variant="outline"
                              size="sm"
                              className="mt-1"
                              onClick={(e) => { e.stopPropagation(); handleViewNearbyDetails(place.id, place.type); }}
                            >
                              <Navigation className="w-3 h-3 mr-1" />
                              View
                            </Button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-muted-foreground">No nearby attractions listed.</p>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>

          {/* Booking Sidebar and FAQs */}
          <div className="lg:col-span-1 flex flex-col gap-4"> {/* Added flex-col and gap for spacing */}
            <Card ref={bookingCardRef} className="sticky top-20 shadow-sm"> {/* Book Your Stay card, sticks at 80px from top */}
              <CardHeader>
                <CardTitle>Book Your Stay</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div>
                    <label htmlFor="popular-checkin" className="text-sm font-medium">Check-in Date</label>
                    <Input
                      id="popular-checkin"
                      type="date"
                      value={checkInDate}
                      onChange={(e) => setCheckInDate(e.target.value)}
                      min={today}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <label htmlFor="popular-checkout" className="text-sm font-medium">Check-out Date</label>
                    <Input
                      id="popular-checkout"
                      type="date"
                      value={checkOutDate}
                      onChange={(e) => setCheckOutDate(e.target.value)}
                      min={minCheckoutDate}
                      disabled={!checkInDate}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <label htmlFor="popular-guests" className="text-sm font-medium">Guests</label>
                    <Select value={guests} onValueChange={setGuests}>
                      <SelectTrigger id="popular-guests" className="mt-1">
                        <SelectValue placeholder="Select guests" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 Guest</SelectItem>
                        <SelectItem value="2">2 Guests</SelectItem>
                        <SelectItem value="3">3 Guests</SelectItem>
                        <SelectItem value="4">4 Guests</SelectItem>
                        <SelectItem value="5">5+ Guests</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  {popularItemData.roomTypes && popularItemData.roomTypes.length > 0 && (
                    <div>
                      <label htmlFor="popular-room-type" className="text-sm font-medium">Room Type</label>
                      <Select
                        value={selectedRoomType}
                        onValueChange={setSelectedRoomType}
                        disabled={popularItemData.roomTypes.filter(room => room.available).length === 0}
                      >
                        <SelectTrigger id="popular-room-type" className="mt-1">
                          <SelectValue placeholder="Select a room type" />
                        </SelectTrigger>
                        <SelectContent>
                          {popularItemData.roomTypes.map((room) => (
                            <SelectItem key={room.name} value={room.name} disabled={!room.available}>
                              {room.name} (₹{room.price}/night) {!room.available && "(Sold Out)"}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between mb-2">
                    <span>Room rate {selectedRoomType && popularItemData.roomTypes.find(rt => rt.name === selectedRoomType) ? `(₹${popularItemData.roomTypes.find(rt => rt.name === selectedRoomType).price}/night)` : ''} × {calculateNumberOfNights()} nights</span>
                    <span>₹{popularItemData.roomTypes.find(rt => rt.name === selectedRoomType) ? (parseFloat(popularItemData.roomTypes.find(rt => rt.name === selectedRoomType).price) * calculateNumberOfNights()).toFixed(2) : '0.00'}</span>
                  </div>
                  <div className="flex justify-between mb-2 text-sm text-muted-foreground">
                    <span>Taxes & fees</span>
                    <span>₹500.00</span>
                  </div>
                  <div className="flex justify-between font-semibold text-lg border-t pt-2">
                    <span>Total</span>
                    <span>₹{calculateTotalPreview().toFixed(2)}</span>
                  </div>
                </div>

                <Button
                  className="w-full bg-primary hover:bg-primary/90"
                  size="lg"
                  onClick={() => handleBookNow(popularItemData.id)}
                  disabled={isBookNowDisabled}
                >
                  Book Now
                </Button>

                <div className="text-center space-y-2 text-sm text-muted-foreground">
                  {popularItemData.contact?.phone && (
                    <div className="flex items-center justify-center space-x-2">
                      <Phone className="w-4 h-4" />
                      <span>{popularItemData.contact.phone}</span>
                    </div>
                  )}
                  {popularItemData.contact?.email && (
                    <div className="flex items-center justify-center space-x-2">
                      <Mail className="w-4 h-4" />
                      <span>{popularItemData.contact.email}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {popularItemData.faqs && popularItemData.faqs.length > 0 && (
              <FAQSection
                faqs={popularItemData.faqs}
                className={`bg-white shadow-sm sticky`}
                style={{ top: faqStickyTop }}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}  for map page and booking page and othe page same like other page dynmicalyy 