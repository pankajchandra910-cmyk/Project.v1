
import React, { useState, useEffect, useCallback, useRef, useContext } from "react";
import { Button } from "../component/button";
import { Input } from "../component/Input";   
import { Card, CardContent } from "../component/Card"; 
import { Badge } from "../component/badge";   
import { GlobalContext } from "../component/GlobalContext"; 
import { ArrowLeft, Search, ZoomIn, ZoomOut, MapPin, Navigation, Star, X } from "lucide-react";
import { ImageWithFallback } from "../component/ImageWithFallback"; 
import { locationsData } from "../assets/dummy"; 
import { useSearchParams, useNavigate } from "react-router-dom";

export default function MapViewPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedPin, setSelectedPin] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredPins, setFilteredPins] = useState([]);
  const [activeFilter, setActiveFilter] = useState(null);
  const {setSelectedItemId, setSelectedDetailType,focusArea} = useContext(GlobalContext);

  const mapRef = useRef(null);
  const googleMap = useRef(null);
  const markersRef = useRef([]);

  // Function to extract and normalize all relevant map pins from locationsData
  const extractMapPins = useCallback(() => {
    const pins = [];
    Object.values(locationsData).forEach((locationDetail) => {
      // Main location pin (e.g., Nainital itself)
      if (locationDetail.lat && locationDetail.lng) {
        pins.push({
          id: locationDetail.id,
          type: locationDetail.type || "other", // Use location type from dummy data
          name: locationDetail.name,
          distance: locationDetail.distance || "N/A", // Assume distance might be present or N/A
          rating: locationDetail.rating || 0,
          image: locationDetail.images && locationDetail.images.length > 0 ? locationDetail.images[0] : "",
          description: locationDetail.description,
          lat: locationDetail.lat,
          lng: locationDetail.lng,
          // Add any other specific properties needed for rendering the info card
          price: locationDetail.price, // Example: for hotels
          features: locationDetail.features, // Example: for hotels
          activities: locationDetail.activities, // Example: for viewpoints/lakes
        });
      }

      // Add popular spots as pins
      locationDetail.popularSpots?.forEach(spot => {
        if (spot.lat && spot.lng) {
          pins.push({
            id: spot.id,
            type: spot.type,
            name: spot.name,
            distance: spot.distance || "N/A",
            rating: spot.rating || 0,
            image: spot.image || (locationDetail.images && locationDetail.images.length > 0 ? locationDetail.images[0] : ""),
            description: spot.description,
            lat: spot.lat,
            lng: spot.lng,
            activities: spot.activities,
          });
        }
      });

      // Add hotels as pins
      locationDetail.hotels?.forEach(hotel => {
        if (hotel.lat && hotel.lng) {
          pins.push({
            id: hotel.id,
            type: "hotel",
            name: hotel.name,
            distance: hotel.distance,
            rating: hotel.rating,
            image: hotel.image || (locationDetail.images && locationDetail.images.length > 0 ? locationDetail.images[0] : ""),
            description: hotel.description,
            lat: hotel.lat,
            lng: hotel.lng,
            price: hotel.price,
            features: hotel.features,
          });
        }
      });
      // You can add more categories like restaurants, treks, etc. if they have lat/lng
    });
    return pins;
  }, []);

  const allMapPins = useRef([]); // Store all original pins

  // Initialize all pins once
  useEffect(() => {
    allMapPins.current = extractMapPins();
    setFilteredPins(allMapPins.current);
  }, [extractMapPins]);

  // Filter logic for search and quick filters
  useEffect(() => {
    let currentPins = allMapPins.current;

    if (activeFilter) {
      currentPins = currentPins.filter(pin => pin.type === activeFilter.toLowerCase());
    }

    if (searchQuery) {
      currentPins = currentPins.filter(pin =>
        pin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pin.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    setFilteredPins(currentPins);
    // Markers are rendered in a separate effect that watches filteredPins
  }, [searchQuery, activeFilter]);

  const getPinColor = (type) => {
    switch (type) {
      case "viewpoint": return "#3b82f6"; // blue-500
      case "hotel": return "#22c55e"; // green-500
      case "lake": return "#06b6d4"; // cyan-500
      case "trek": return "#f97316"; // orange-500
      case "activity": return "#8b5cf6"; // violet-500
      default: return "#6b7280"; // gray-500
    }
  };

  const getPinIconHTML = (type) => {
    let iconEmoji = "📍";
    switch (type) {
      case "viewpoint": iconEmoji = "🏔️"; break;
      case "hotel": iconEmoji = "🏨"; break;
      case "lake": iconEmoji = "🏞️"; break;
      case "trek": iconEmoji = "🥾"; break;
      case "activity": iconEmoji = "🚣"; break;
      default: iconEmoji = "📍"; break;
    }
    const color = getPinColor(type);
    return `
      <div style="
        background-color: ${color};
        border-radius: 50%;
        width: 32px;
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-size: 16px;
        border: 2px solid white;
        box-shadow: 0 2px 5px rgba(0,0,0,0.3);
        transform: translate(-50%, -50%);
        cursor: pointer;
      ">${iconEmoji}</div>
    `;
  };

  // Initialize Google Map
  useEffect(() => {
    if (mapRef.current && !googleMap.current && window.google) {
      let initialLocation = { lat: 29.391775, lng: 79.455979 }; // Default to Nainital center
      let initialZoom = 12;

      // Check if a destination is provided in the URL for directions
      const destLat = searchParams.get('destLat');
      const destLng = searchParams.get('destLng');
      const destName = searchParams.get('destName');

      if (destLat && destLng) {
        initialLocation = { lat: parseFloat(destLat), lng: parseFloat(destLng) };
        initialZoom = 15; // Zoom in if a specific destination is given
        // Optionally, select the pin for immediate display
        const preSelectedPin = allMapPins.current.find(pin => pin.lat === initialLocation.lat && pin.lng === initialLocation.lng && pin.name === destName);
        if (preSelectedPin) {
          setSelectedPin(preSelectedPin);
        }
      } else {
        // Fallback to focusArea if no specific destination
        const areaData = Object.values(locationsData).find(loc => loc.id === focusArea.toLowerCase().replace(/\s/g, '-'));
        if (areaData && areaData.lat && areaData.lng) {
          initialLocation.lat = areaData.lat;
          initialLocation.lng = areaData.lng;
        }
      }

      googleMap.current = new window.google.maps.Map(mapRef.current, {
        center: initialLocation,
        zoom: initialZoom,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
        zoomControl: true,
      });

      // Add a listener for map clicks to deselect pin
      googleMap.current.addListener("click", () => {
        setSelectedPin(null);
      });
    }
  }, [focusArea, searchParams]); // Rerun effect if searchParams change for new directions request

  // Render markers on the map
  const renderMarkers = useCallback((pins) => {
    if (!googleMap.current) return;

    // Clear existing markers
    markersRef.current.forEach(marker => marker.setMap(null));
    markersRef.current = [];

    const bounds = new window.google.maps.LatLngBounds();

    pins.forEach(pin => {
      const marker = new window.google.maps.Marker({
        position: { lat: pin.lat, lng: pin.lng },
        map: googleMap.current,
        title: pin.name,
        icon: {
          url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(getPinIconHTML(pin.type))}`,
          anchor: new window.google.maps.Point(16, 16), // Center the icon
          scaledSize: new window.google.maps.Size(32, 32),
        },
      });

      marker.addListener("click", (e) => {
        e.stop(); // Stop event propagation to prevent map click from deselecting
        setSelectedPin(pin);
        // Center the map on the clicked marker
        googleMap.current?.panTo({ lat: pin.lat, lng: pin.lng });
      });
      markersRef.current.push(marker);
      bounds.extend(marker.getPosition());
    });

    if (pins.length > 0) {
      // Only fit bounds if not coming from a direct directions request (which already set center/zoom)
      if (!searchParams.get('destLat')) {
        googleMap.current.fitBounds(bounds);
        if (googleMap.current.getZoom() > 15) { // Prevent zooming in too much if only one pin
          googleMap.current.setZoom(15);
        }
      }
    }
  }, [getPinIconHTML, searchParams]);

  // Initial marker render and re-render on filteredPins change
  useEffect(() => {
    if (googleMap.current) {
      renderMarkers(filteredPins);
    }
  }, [filteredPins, renderMarkers]); // Removed googleMap.current from deps to avoid re-rendering markers on map object change, already handled by map ref.

  const handleBack = useCallback(() => {
      navigate(-1); // Go back to the previous page in history
  }, [navigate]);

    const handleViewDetails = useCallback((id, type) => {
      setSelectedItemId(id); // Set global context if needed for other components
      setSelectedDetailType(type); // Set global context if needed for other components
      const routeMap = {
        hotel: `/hotel-details/${id}`,
        place: `/place-details/${id}`,
        trek: `/trek-details/${id}`,
        bike: `/bike-details/${id}`,
        cab: `/cab-details/${id}`,
        guide: `/guide-details/${id}`,
        resort: `/hotel-details/${id}`, // Assuming 'resort' maps to hotel details
        viewpoint: `/place-details/${id}`,
        lake: `/place-details/${id}`,
        adventure: `/place-details/${id}`,
        wildlife: `/place-details/${id}`,
        temple: `/place-details/${id}`,
        "historic site": `/place-details/${id}`, // Added for Gurney House
        // Add other types as needed from your dummy data
      };
      const path = routeMap[type.toLowerCase()] || "/"; // Default to home if type not found
      navigate(path);
    }, [navigate, setSelectedItemId, setSelectedDetailType]);

  const handleZoomIn = () => {
    if (googleMap.current) {
      googleMap.current.setZoom(googleMap.current.getZoom() + 1);
    }
  };

  const handleZoomOut = () => {
    if (googleMap.current) {
      googleMap.current.setZoom(googleMap.current.getZoom() - 1);
    }
  };

  const handleRecenter = () => {
    if (googleMap.current) {
      const initialLocation = { lat: 29.391775, lng: 79.455979 };
      const areaData = Object.values(locationsData).find(loc => loc.id === focusArea.toLowerCase().replace(/\s/g, '-'));
      if (areaData && areaData.lat && areaData.lng) {
        initialLocation.lat = areaData.lat;
        initialLocation.lng = areaData.lng;
      }
      googleMap.current.panTo(initialLocation);
      googleMap.current.setZoom(12); // Reset zoom
    }
  };

  const handleGetDirectionsExternal = useCallback((lat, lng) => {
    // Open Google Maps in a new tab with directions
    const destination = `${lat},${lng}`;
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${destination}`, '_blank');
  }, []);

  const handleQuickFilter = (type) => {
    setActiveFilter(prev => (prev === type ? null : type)); // Toggle filter
  };

  // Dummy nearby hotels for the info card (can be dynamically fetched if needed)
  const nearbyHotels = [
    { name: "Lake View Inn", distance: "1.2km", rating: 4.3, id: "fake-hotel-1", type: "hotel" },
    { name: "Hill Station Resort", distance: "2.1km", rating: 4.6, id: "fake-hotel-2", type: "hotel" },
    { name: "Mountain Lodge", distance: "2.8km", rating: 4.1, id: "fake-hotel-3", type: "hotel" }
  ];


  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" onClick={handleBack}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <h1 className="text-xl font-semibold">
                {focusArea} Area Map
              </h1>
            </div>

            {/* Search Bar and Map Controls */}
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Search locations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>

              {/* Map Controls */}
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" onClick={handleZoomIn}>
                  <ZoomIn className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={handleZoomOut}>
                  <ZoomOut className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={handleRecenter}>
                  <Navigation className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Map Section */}
          <div className="lg:col-span-3">
            <Card className="overflow-hidden">
              <div ref={mapRef} className="h-96 md:h-[600px] w-full relative">
                {/* Google Map will be rendered here */}
              </div>
            </Card>

            {/* Legend */}
            <Card className="mt-4">
              <CardContent className="p-4">
                <h3 className="font-semibold mb-3">Map Legend</h3>
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                    <span className="text-sm">Viewpoints</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                    <span className="text-sm">Hotels & Resorts</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-cyan-500 rounded-full"></div>
                    <span className="text-sm">Lakes</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-orange-500 rounded-full"></div>
                    <span className="text-sm">Treks</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-violet-500 rounded-full"></div>
                    <span className="text-sm">Activities</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Quick Filters */}
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-3">Quick Filters</h3>
                <div className="space-y-2">
                  <Button
                    variant={activeFilter === "viewpoint" ? "default" : "outline"}
                    size="sm"
                    className="w-full justify-start"
                    onClick={() => handleQuickFilter("viewpoint")}
                  >
                    🏔️ Viewpoints
                  </Button>
                  <Button
                    variant={activeFilter === "hotel" ? "default" : "outline"}
                    size="sm"
                    className="w-full justify-start"
                    onClick={() => handleQuickFilter("hotel")}
                  >
                    🏨 Hotels
                  </Button>
                  <Button
                    variant={activeFilter === "lake" ? "default" : "outline"}
                    size="sm"
                    className="w-full justify-start"
                    onClick={() => handleQuickFilter("lake")}
                  >
                    🏞️ Lakes
                  </Button>
                  <Button
                    variant={activeFilter === "trek" ? "default" : "outline"}
                    size="sm"
                    className="w-full justify-start"
                    onClick={() => handleQuickFilter("trek")}
                  >
                    🥾 Treks
                  </Button>
                  <Button
                    variant={activeFilter === "activity" ? "default" : "outline"}
                    size="sm"
                    className="w-full justify-start"
                    onClick={() => handleQuickFilter("activity")}
                  >
                    🚣 Activities
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Nearby Places - Now shows filtered pins or popular ones */}
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-3">
                  {activeFilter ? `Filtered ${activeFilter}s` : "Popular Spots"}
                </h3>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {filteredPins.length > 0 ? (
                    filteredPins.map((pin) => (
                      <div
                        key={pin.id}
                        className="flex items-center justify-between p-2 hover:bg-gray-50 rounded cursor-pointer"
                        onClick={() => setSelectedPin(pin)}
                      >
                        <div>
                          <p className="font-medium text-sm">{pin.name}</p>
                          <p className="text-xs text-muted-foreground">{pin.distance}</p>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                          <span className="text-xs">{pin.rating}</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">No places found matching your criteria.</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Selected Pin Details Panel */}
        {selectedPin && (
          <Card className="fixed bottom-4 left-4 right-4 z-50 lg:left-auto lg:w-96 animate-in slide-in-from-bottom duration-300">
            <CardContent className="p-0">
              <div className="relative">
                <button
                  onClick={() => setSelectedPin(null)}
                  className="absolute top-2 right-2 z-10 bg-white rounded-full p-1 shadow hover:bg-gray-100"
                >
                  <X className="w-4 h-4" />
                </button>
                <div className="aspect-video">
                  <ImageWithFallback
                    src={selectedPin.image}
                    alt={selectedPin.name}
                    className="w-full h-full object-cover rounded-t-lg"
                  />
                </div>
                <div className="p-4 space-y-3">
                  <div>
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold">{selectedPin.name}</h3>
                      <Badge className="text-white" style={{backgroundColor: getPinColor(selectedPin.type)}}>
                        {selectedPin.type}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{selectedPin.distance}</p>
                    <div className="flex items-center space-x-1 mt-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm">{selectedPin.rating}</span>
                    </div>
                  </div>

                  <p className="text-sm">{selectedPin.description}</p>

                  {/* Dynamic content based on pin type */}
                  {selectedPin.type === "hotel" && (
                    <>
                      {selectedPin.price && (
                        <p className="text-sm font-medium">Price: {selectedPin.price}/night</p>
                      )}
                      {selectedPin.features && selectedPin.features.length > 0 && (
                        <div>
                          <h4 className="font-medium text-sm mb-2">Features:</h4>
                          <div className="flex flex-wrap gap-1">
                            {selectedPin.features.map((feature, idx) => (
                              <Badge key={idx} variant="secondary" className="text-xs">
                                {feature}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </>
                  )}

                  {selectedPin.type === "viewpoint" && (
                    <div>
                      <h4 className="font-medium text-sm mb-2">Nearby Hotels:</h4>
                      <div className="space-y-1">
                        {nearbyHotels.map((hotel, index) => (
                          <div key={index} className="flex items-center justify-between text-xs">
                            <span>{hotel.name}</span>
                            <div className="flex items-center space-x-1">
                              <span className="text-muted-foreground">{hotel.distance}</span>
                              <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                              <span>{hotel.rating}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                   {selectedPin.activities && selectedPin.activities.length > 0 && (
                    <div>
                      <h4 className="font-medium text-sm mb-2">Activities:</h4>
                      <div className="flex flex-wrap gap-1">
                        {selectedPin.activities.map((activity, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            {activity}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex space-x-2 pt-2">
                    <Button
                      size="sm"
                      className="flex-1 bg-primary"
                      onClick={() => handleViewDetails(selectedPin.id, selectedPin.type)}
                    >
                      View Details
                    </Button>
                    {/* Direct link for external Google Maps directions */}
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1"
                      onClick={() => handleGetDirectionsExternal(selectedPin.lat, selectedPin.lng)}
                    >
                      <Navigation className="w-4 h-4 mr-2" />
                      Get Directions
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}