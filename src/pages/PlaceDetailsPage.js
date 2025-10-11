import React, { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
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
} from "lucide-react";

export default function PlaceDetailsPage({ placeId, onBack, onGetDirections, onViewDetails }) {
      const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Mock place data - in real app this would come from API based on placeId
  // This data structure should match what you expect from locationsData if you reuse this component
  const placeData = {
    id: placeId,
    name: "Tiffin Top (Dorothy's Seat)",
    location: "4km from Nainital, Uttarakhand",
    rating: 4.7,
    reviewCount: 234,
    entryFee: "Free",
    bestTime: "Sunrise & Sunset",
    duration: "2-3 hours",
    difficulty: "Easy",
    images: [
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3VudGFpbiUyMHZpZXdwb2ludCUyMHN1bnJpc2V8ZW58MXx8fHwxNzM3MDM4NDAwfDA&ixlib=rb-4.1.0&q=80&w=1080",
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwyfHxtb3VudGFpbiUyMHZpZXdwb2ludCUyMHN1bnNldHxlbnwxfHx8fDE3MzcwMzg0MDB8MA&ixlib=rb-4.1.0&q=80&w=1080",
      "https://images.unsplash.com/photo-1464822759844-d150ad6d1f6f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHx0cmVra2luZyUyMHRyYWlsJTIwZm9yZXM0fGVufDF8fHx8MTczNzAzODQwMHww&ixlib=rb-4.1.0&q=80&w=1080",
      "https://images.unsplash.com/photo-1519904981063-b0cf448d479e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHtoaW1hbGF5YSUyMG1vdW50YWluJTIwdmlld3xlbnwxfHx8fDE3MzcwMzg0MDB8MA&ixlib=rb-4.1.0&q=80&w=1080"
    ],
    description: "Named after Dorothy Kellet, an English woman who died here in a aircraft crash, Tiffin Top offers breathtaking panoramic views of the snow-capped Himalayas. This popular viewpoint is accessible via a scenic 4km trek through pine forests and is perfect for nature photography and peaceful contemplation.",
    highlights: [
      "Panoramic Himalayan views",
      "Sunrise and sunset viewpoint",
      "4km scenic trek through pine forests",
      "Photography opportunities",
      "Historical significance",
      "Peaceful environment for meditation"
    ],
    whatToExpect: [
      { icon: Mountain, title: "Stunning Views", desc: "360-degree views of Himalayan peaks" },
      { icon: Camera, title: "Photography", desc: "Perfect for landscape and nature photography" },
      { icon: TreePine, title: "Pine Forest Trek", desc: "Walk through beautiful pine and oak forests" },
      { icon: Sunrise, title: "Best Timing", desc: "Early morning and evening for best light" }
    ],
    accessibility: {
      difficulty: "Easy to Moderate",
      duration: "2-3 hours round trip",
      distance: "4km from Nainital",
      transport: "By foot (trekking only)",
      facilities: ["Basic seating areas", "Photography spots", "Trail markers"]
    },
    nearbyAttractions: [
      { name: "Snow View Point", distance: "2km", type: "Viewpoint", rating: 4.6, id: "snow-view-point" },
      { name: "Naina Lake", distance: "4km", type: "Lake", rating: 4.5, id: "naina-lake" },
      { name: "Lover's Point", distance: "3km", type: "Viewpoint", rating: 4.3, id: "lovers-point" },
      { name: "Himalaya Darshan Point", distance: "2.5km", type: "Viewpoint", rating: 4.5, id: "himalaya-darshan-point" }
    ],
    nearbyHotels: [
      { name: "Himalaya Hotel", distance: "3km", rating: 4.4, price: "₹2,500", id: "himalaya-hotel" },
      { name: "The Pavilion", distance: "4km", rating: 4.6, price: "₹4,000", id: "the-pavilion" },
      { name: "Shervani Hilltop", distance: "3.5km", rating: 4.2, price: "₹3,200", id: "shervani-hilltop" }
    ],
    tips: [
      "Start early morning for sunrise views and to avoid crowds",
      "Carry water and snacks for the trek",
      "Wear comfortable trekking shoes with good grip",
      "Check weather conditions before visiting",
      "Carry warm clothes for early morning/evening visits",
      "Respect the environment - don't litter"
    ]
  };

  // FAQ data for Tiffin Top
  const faqs = [
    {
      question: "How to reach Tiffin Top from Nainital?",
      answer: "4km trek through pine forests starting from Ayarpatta Hills. The trek takes 2-3 hours and is suitable for beginners."
    },
    {
      question: "What's the best time to visit Tiffin Top?",
      answer: "Early morning (5-7 AM) for sunrise views or evening (5-7 PM) for sunset. Avoid monsoon season (July-August)."
    },
    {
      question: "Is the trek difficult for beginners?",
      answer: "No, it's an easy to moderate trek. Well-marked trails through beautiful pine forests. Wear comfortable trekking shoes."
    },
    {
      question: "What to carry for the trek?",
      answer: "Water bottle, snacks, warm clothes for early morning/evening, camera, and comfortable trekking shoes with good grip."
    },
    {
      question: "Are there any facilities at Tiffin Top?",
      answer: "Basic seating areas and photography spots available. No food stalls, so carry your own refreshments."
    }
  ];

    const handleBack = useCallback(() => {
      navigate(-1); // Go back to the previous page in history
    }, [navigate]);
  
  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % placeData.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + placeData.images.length) % placeData.images.length);
  };

  return (
    <div
      className="min-h-screen"
      style={{
        background: `linear-gradient(rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.1)), url('${placeData.images[0]}') center/cover fixed`,
        backgroundColor: '#f9fafb'
      }}
    >
      {/* Header */}
      <div className="bg-white/95 backdrop-blur-sm shadow-sm px-4 py-3 md:px-6 sticky top-0 z-10">
        <Button variant="ghost" onClick={handleBack} className="mb-0">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Places
        </Button>
      </div>

      <div className="container mx-auto px-4 py-6 max-w-6xl">
        {/* Image Carousel */}
        <div className="relative mb-6">
          <div className="relative h-64 md:h-96 rounded-lg overflow-hidden">
            <img
              src={placeData.images[currentImageIndex]}
              alt={`${placeData.name} - Image ${currentImageIndex + 1}`}
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
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Place Info */}
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
                    <Badge className="bg-green-100 text-green-800">{placeData.entryFee}</Badge>
                    <Badge variant="outline">{placeData.difficulty}</Badge>
                  </div>
                </div>
              </div>

              {/* Quick Info */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-primary" />
                  <div>
                    <div className="text-sm font-medium">Duration</div>
                    <div className="text-xs text-muted-foreground">{placeData.duration}</div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Sunrise className="w-4 h-4 text-primary" />
                  <div>
                    <div className="text-sm font-medium">Best Time</div>
                    <div className="text-xs text-muted-foreground">{placeData.bestTime}</div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Mountain className="w-4 h-4 text-primary" />
                  <div>
                    <div className="text-sm font-medium">Difficulty</div>
                    <div className="text-xs text-muted-foreground">{placeData.difficulty}</div>
                  </div>
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
                    <h3 className="font-semibold mb-3">About This Place</h3>
                    <p className="text-muted-foreground leading-relaxed">{placeData.description}</p>
                  </div>

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

                  <div>
                    <h3 className="font-semibold mb-3">What to Expect</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      {placeData.whatToExpect.map((item, index) => {
                         const IconComponent = item.icon; // Assuming item.icon is already a Lucide React component
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

                  <div>
                    <h3 className="font-semibold mb-3">Accessibility & Info</h3>
                    <div className="space-y-3 p-4 bg-blue-50 rounded-lg">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <span className="text-sm font-medium">Difficulty:</span>
                          <span className="text-sm ml-2">{placeData.accessibility.difficulty}</span>
                        </div>
                        <div>
                          <span className="text-sm font-medium">Duration:</span>
                          <span className="text-sm ml-2">{placeData.accessibility.duration}</span>
                        </div>
                        <div>
                          <span className="text-sm font-medium">Distance:</span>
                          <span className="text-sm ml-2">{placeData.accessibility.distance}</span>
                        </div>
                        <div>
                          <span className="text-sm font-medium">Transport:</span>
                          <span className="text-sm ml-2">{placeData.accessibility.transport}</span>
                        </div>
                      </div>
                      <div>
                        <span className="text-sm font-medium">Facilities:</span>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {placeData.accessibility.facilities.map((facility, idx) => (
                            <Badge key={idx} variant="secondary" className="text-xs">{facility}</Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

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
                </TabsContent>

                <TabsContent value="photos" className="mt-6">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {placeData.images.map((image, index) => (
                      <img
                        key={index}
                        src={image}
                        alt={`${placeData.name} - Photo ${index + 1}`}
                        className="w-full h-32 md:h-40 object-cover rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
                        onClick={() => setCurrentImageIndex(index)}
                      />
                    ))}
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
                        <span className="font-medium">Anita Verma</span>
                        <span className="text-sm text-muted-foreground">1 week ago</span>
                      </div>
                      <p className="text-muted-foreground">
                        "Absolutely breathtaking views! The trek is manageable and the sunrise view is worth every step.
                        Perfect spot for photography and peaceful meditation."
                      </p>
                    </div>
                    <div className="border-b pb-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <div className="flex">
                          {[1,2,3,4].map(i => (
                            <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          ))}
                          <Star className="w-4 h-4 text-gray-300" />
                        </div>
                        <span className="font-medium">Rohit Singh</span>
                        <span className="text-sm text-muted-foreground">2 weeks ago</span>
                      </div>
                      <p className="text-muted-foreground">
                        "Great viewpoint with amazing Himalayan views. The trek through pine forest is beautiful.
                        Went there for sunset and it was magical!"
                      </p>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="nearby" className="mt-6">
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-semibold mb-3">Nearby Attractions</h3>
                      <div className="grid md:grid-cols-2 gap-4">
                        {placeData.nearbyAttractions.map((attraction, index) => (
                          <div key={index} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 cursor-pointer" onClick={() => onViewDetails(attraction.id, attraction.type)}>
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
                              <Button variant="outline" size="sm" className="mt-1">
                                <Navigation className="w-3 h-3 mr-1" />
                                View
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold mb-3">Nearby Hotels</h3>
                      <div className="grid md:grid-cols-2 gap-4">
                        {placeData.nearbyHotels.map((hotel, index) => (
                          <div key={index} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 cursor-pointer" onClick={() => onViewDetails(hotel.id, "hotel")}>
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
                              <Button variant="outline" size="sm" className="mt-1">
                                View Hotel
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>

          {/* Quick Actions Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-20 space-y-4">
              <Card className="bg-white/95 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>Visit This Place</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button
                    className="w-full bg-primary hover:bg-primary/90"
                    size="lg"
                    onClick={() => onGetDirections(placeData.name)}
                  >
                    <Navigation className="w-4 h-4 mr-2" />
                    Get Directions
                  </Button>

                  <div className="space-y-3 text-sm">
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <h4 className="font-medium mb-2">Quick Info</h4>
                      <div className="space-y-1">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Entry Fee:</span>
                          <span className="font-medium text-green-600">{placeData.entryFee}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Duration:</span>
                          <span>{placeData.duration}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Best Time:</span>
                          <span>{placeData.bestTime}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/95 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-base">Need a Guide?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-3">
                    Get a local guide for the best experience and safety.
                  </p>
                  <Button variant="outline" className="w-full" size="sm">
                    Find Local Guides
                  </Button>
                </CardContent>
              </Card>

              {/* FAQ Section */}
              <FAQSection faqs={faqs} className="bg-white/95 backdrop-blur-sm" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}