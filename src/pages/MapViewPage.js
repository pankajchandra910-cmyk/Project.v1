import React, { useState, useEffect, useCallback, useRef, useContext } from "react";
import { Button } from "../component/button";
import { Input } from "../component/Input";
import { Card, CardContent } from "../component/Card";
import { Badge } from "../component/badge";
import { GlobalContext } from "../component/GlobalContext";
import { ArrowLeft, Search, ZoomIn, ZoomOut, MapPin, Navigation, Star, X } from "lucide-react";
import { ImageWithFallback } from "../component/ImageWithFallback";
import { locationsData } from "../assets/dummy"; // Assuming this contains all your location data
import { useSearchParams, useNavigate } from "react-router-dom";

export default function MapViewPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [selectedPin, setSelectedPin] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredPins, setFilteredPins] = useState([]);
  const [activeFilter, setActiveFilter] = useState(null);

  // Global context for managing selected items and focus areas
  const {
    setSelectedItemId,
    setSelectedDetailType,
    focusArea,
    setFocusArea,
  } = useContext(GlobalContext);

  const mapRef = useRef(null);
  const googleMap = useRef(null);
  const markersRef = useRef([]);
  const allMapPins = useRef([]); // Store all original pins extracted from dummy data

  // Function to extract and normalize all relevant map pins from locationsData
  const extractMapPins = useCallback(() => {
    const pins = [];
    Object.values(locationsData).forEach((locationDetail) => {
      // Add the main location as a pin if it has coordinates
      if (locationDetail.lat && locationDetail.lng) {
        pins.push({
          id: locationDetail.id,
          type: locationDetail.type || "place", // Default to 'place' if not specified
          name: locationDetail.name,
          location: locationDetail.location,
          distance: locationDetail.distance || "N/A",
          rating: locationDetail.rating || 0,
          image: locationDetail.gallery?.[0] || locationDetail.image?.[0] || "",
          description: locationDetail.description,
          lat: locationDetail.lat,
          lng: locationDetail.lng,
          // Specific properties for info card
          price: locationDetail.price,
          features: locationDetail.features,
          activities: locationDetail.activities, // Direct activities for the main place
          parentLocationId: locationDetail.id, // This pin is the parent
          parentLocationName: locationDetail.name,
        });
      }

      // Add popular spots (attractions, viewpoints, lakes, etc.) as pins
      locationDetail.popularSpots?.forEach((spot) => {
        if (spot.lat && spot.lng) {
          pins.push({
            id: spot.id,
            type: spot.type.toLowerCase().includes("hotel") || spot.type.toLowerCase().includes("resort") ? "hotel" : spot.type.toLowerCase(),
            name: spot.name,
            location: spot.location || locationDetail.location,
            distance: spot.distance || "N/A",
            rating: spot.rating || 0,
            image: spot.image || locationDetail.gallery?.[0] || locationDetail.images?.[0] || "",
            description: spot.description,
            lat: spot.lat,
            lng: spot.lng,
            activities: spot.activities, // Activities specific to the spot
            parentLocationId: locationDetail.id,
            parentLocationName: locationDetail.name,
          });
        }
      });

      // Add hotels as pins
      locationDetail.hotels?.forEach((hotel) => {
        if (hotel.lat && hotel.lng) {
          pins.push({
            id: hotel.id,
            type: "hotel",
            name: hotel.name,
            location: hotel.location || locationDetail.location,
            distance: hotel.distance || "N/A",
            rating: hotel.rating || 0,
            image: hotel.image || locationDetail.gallery?.[0] || locationDetail.images?.[0] || "",
            description: hotel.description,
            lat: hotel.lat,
            lng: hotel.lng,
            price: hotel.price,
            features: hotel.features,
            parentLocationId: locationDetail.id,
            parentLocationName: locationDetail.name,
          });
        }
      });

      // Add other activities/boating points as pins if they have coordinates
      locationDetail.boatingPoints?.forEach(point => {
        if (point.lat && point.lng) {
          pins.push({
            id: point.id || `${locationDetail.id}-${point.name.replace(/\s/g, '-').toLowerCase()}`,
            type: "activity", // Or 'boating' if you want a specific filter
            name: point.name,
            location: point.location || locationDetail.location,
            distance: "N/A", // Can be calculated if needed
            rating: 0, // Or average from location if available
            image: locationDetail.gallery?.[0] || locationDetail.images?.[0] || "",
            description: point.description,
            lat: point.lat,
            lng: point.lng,
            activities: ["Boating", "Photography"], // Specific activities
            parentLocationId: locationDetail.id,
            parentLocationName: locationDetail.name,
          });
        }
      });

      locationDetail.otherActivities?.forEach(activity => {
        if (activity.lat && activity.lng) {
          pins.push({
            id: activity.id || `${locationDetail.id}-${activity.name.replace(/\s/g, '-').toLowerCase()}`,
            type: "activity",
            name: activity.name,
            location: activity.location || locationDetail.location,
            distance: "N/A",
            rating: 0,
            image: locationDetail.gallery?.[0] || locationDetail.images?.[0] || "",
            description: activity.description,
            lat: activity.lat,
            lng: activity.lng,
            activities: [activity.name],
            parentLocationId: locationDetail.id,
            parentLocationName: locationDetail.name,
          });
        }
      });
    });
    return pins;
  }, []);


  // Initialize all pins once when component mounts
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
        pin.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pin.location.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    setFilteredPins(currentPins);
  }, [searchQuery, activeFilter]); // Depend on searchQuery and activeFilter


  const getPinColor = (type) => {
    switch (type) {
      case "viewpoint":
      case "place":
        return "#3b82f6"; // blue-500
      case "hotel":
        return "#22c55e"; // green-500
      case "lake":
        return "#06b6d4"; // cyan-500
      case "trek":
        return "#f97316"; // orange-500
      case "activity":
        return "#8b5cf6"; // violet-500
      default:
        return "#6b7280"; // gray-500
    }
  };

  const getPinIconHTML = (type) => {
    let iconEmoji = "📍";
    switch (type) {
      case "viewpoint":
      case "place":
        iconEmoji = "🏔️";
        break;
      case "hotel":
        iconEmoji = "🏨";
        break;
      case "lake":
        iconEmoji = "🏞️";
        break;
      case "trek":
        iconEmoji = "🥾";
        break;
      case "activity":
        iconEmoji = "🚣";
        break;
      default:
        iconEmoji = "📍";
        break;
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

      const destLat = searchParams.get('destLat');
      const destLng = searchParams.get('destLng');
      const destName = searchParams.get('destName'); // Optional, for pre-selecting pin

      // Determine initial map center and zoom
      if (destLat && destLng) {
        initialLocation = { lat: parseFloat(destLat), lng: parseFloat(destLng) };
        initialZoom = 15; // Zoom in for a specific destination
        // Attempt to pre-select the pin if destName matches
        const preSelectedPin = allMapPins.current.find(pin =>
          Math.abs(pin.lat - parseFloat(destLat)) < 0.0001 &&
          Math.abs(pin.lng - parseFloat(destLng)) < 0.0001 &&
          pin.name === destName
        );
        if (preSelectedPin) {
          setSelectedPin(preSelectedPin);
        }
      } else {
        // Use focusArea from context if available and valid
        const areaId = focusArea ? focusArea.toLowerCase().replace(/\s/g, '-') : 'nainital-area';
        const areaData = Object.values(locationsData).find(loc => loc.id === areaId);
        if (areaData && areaData.lat && areaData.lng) {
          initialLocation.lat = areaData.lat;
          initialLocation.lng = areaData.lng;
          // Optionally, if the focusArea itself is a location pin, select it
          const focusAreaPin = allMapPins.current.find(pin => pin.id === areaId);
          if(focusAreaPin) {
            setSelectedPin(focusAreaPin);
          }
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

      googleMap.current.addListener("click", () => {
        setSelectedPin(null);
      });
    }
  }, [searchParams, focusArea]); // Depend on searchParams and focusArea to re-initialize map if needed


  // Render markers on the map
  const renderMarkers = useCallback((pins) => {
    if (!googleMap.current) return;

    markersRef.current.forEach(marker => marker.setMap(null));
    markersRef.current = [];

    const bounds = new window.google.maps.LatLngBounds();
    let atLeastOnePinHasCoords = false;

    pins.forEach(pin => {
      if (pin.lat && pin.lng) { // Ensure pin has valid coordinates
        atLeastOnePinHasCoords = true;
        const marker = new window.google.maps.Marker({
          position: { lat: pin.lat, lng: pin.lng },
          map: googleMap.current,
          title: pin.name,
          icon: {
            url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(getPinIconHTML(pin.type))}`,
            anchor: new window.google.maps.Point(16, 16),
            scaledSize: new window.google.maps.Size(32, 32),
          },
        });

        marker.addListener("click", (e) => {
          e.stop();
          setSelectedPin(pin);
          googleMap.current?.panTo({ lat: pin.lat, lng: pin.lng });
        });
        markersRef.current.push(marker);
        bounds.extend(marker.getPosition());
      }
    });

    // Only fit bounds if there are pins with valid coordinates and we're not focusing on a specific destination
    const destLat = searchParams.get('destLat');
    if (atLeastOnePinHasCoords && !destLat) {
        googleMap.current.fitBounds(bounds);
        if (googleMap.current.getZoom() > 15) {
            googleMap.current.setZoom(15);
        }
    }
  }, [getPinIconHTML, searchParams]);

  // Initial marker render and re-render on filteredPins change
  useEffect(() => {
    if (googleMap.current) {
      renderMarkers(filteredPins);
    }
  }, [filteredPins, renderMarkers]);


  const handleBack = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  const handleViewDetails = useCallback((id, type) => {
    setSelectedItemId(id);
    setSelectedDetailType(type);
    const routeMap = {
      hotel: `/hotel-details/${id}`,
      popular: `/popular-details/${id}`,
      place: `/place-details/${id}`,
      trek: `/trek-details/${id}`,
      bike: `/bike-details/${id}`,
      cab: `/cab-details/${id}`,
      guide: `/guide-details/${id}`,
      resort: `/hotel-details/${id}`,
      viewpoint: `/place-details/${id}`,
      lake: `/place-details/${id}`,
      adventure: `/place-details/${id}`,
      wildlife: `/place-details/${id}`,
      temple: `/place-details/${id}`,
      "historic site": `/place-details/${id}`,
      activity: `/place-details/${id}` // Generic route for activities, adjust if you have specific activity pages
    };
    const path = routeMap[type.toLowerCase()] || "/";
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
      let centerLat = 29.391775;
      let centerLng = 79.455979; // Default to Nainital
      let defaultZoom = 12;

      // Try to recenter to the current focusArea if available
      const areaId = focusArea ? focusArea.toLowerCase().replace(/\s/g, '-') : 'nainital-area';
      const areaData = Object.values(locationsData).find(loc => loc.id === areaId);
      if (areaData && areaData.lat && areaData.lng) {
        centerLat = areaData.lat;
        centerLng = areaData.lng;
        defaultZoom = 12; // Maintain a broader view for the main area
      }

      googleMap.current.panTo({ lat: centerLat, lng: centerLng });
      googleMap.current.setZoom(defaultZoom);
    }
  };

  const handleGetDirections = useCallback((lat, lng, name, parentId) => {
    // Set the focusArea to the parent location ID if the selected pin is a sub-item,
    // otherwise, use the pin's own ID as the focus area.
    const currentFocusId = parentId || selectedPin?.id || focusArea || "nainital-area";
    setFocusArea(currentFocusId);
    navigate(`/map-view/${currentFocusId}?destLat=${lat}&destLng=${lng}&destName=${encodeURIComponent(name)}`);
  }, [navigate, setFocusArea, focusArea, selectedPin]);

  const handleQuickFilter = (type) => {
    setActiveFilter(prev => (prev === type ? null : type)); // Toggle filter
  };


  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          {/* Header content: Back button, Title, Search and Map controls */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="flex items-center space-x-4 mb-4 md:mb-0"> {/* Added mb-4 for spacing on small screens */}
              <Button variant="ghost" onClick={handleBack} className="flex-shrink-0">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <h1 className="text-lg md:text-xl font-semibold whitespace-nowrap overflow-hidden text-ellipsis">
                {focusArea ? `${focusArea.split('-').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' ')} Area Map` : "Explore Map"}
              </h1>
            </div>

            {/* Search Bar and Map Controls */}
            <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4 w-full md:w-auto">
              {/* Search Bar */}
              <div className="relative w-full sm:w-auto">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Search locations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-full sm:w-64" // Full width on small, 64 on small-medium and up
                />
              </div>

              {/* Map Controls - moved to the next line on small/medium */}
              <div className="flex space-x-2 mt-2 sm:mt-0 justify-start sm:justify-end w-full sm:w-auto">
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
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8"> {/* Changed to grid-cols-1 for small screens */}
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
                    <span className="text-sm">Viewpoints/Places</span>
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
                    variant={activeFilter === "place" || activeFilter === "viewpoint" ? "default" : "outline"}
                    size="sm"
                    className="w-full justify-start"
                    onClick={() => handleQuickFilter("place")}
                  >
                    🏔️ Viewpoints & Places
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
                  {activeFilter ? `Filtered ${activeFilter.charAt(0).toUpperCase() + activeFilter.slice(1)}s` : "Popular Spots"}
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
                          <p className="text-xs text-muted-foreground">{pin.location}</p>
                        </div>
                        <div className="flex items-center space-x-1">
                          {pin.rating > 0 && (
                            <>
                              <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                              <span className="text-xs">{pin.rating}</span>
                            </>
                          )}
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
                      <Badge className="text-white" style={{ backgroundColor: getPinColor(selectedPin.type) }}>
                        {selectedPin.type.charAt(0).toUpperCase() + selectedPin.type.slice(1)}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{selectedPin.location}</p>
                    {selectedPin.rating > 0 && (
                      <div className="flex items-center space-x-1 mt-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm">{selectedPin.rating}</span>
                      </div>
                    )}
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

                  {(selectedPin.type === "viewpoint" || selectedPin.type === "place" || selectedPin.type === "activity" || selectedPin.type === "lake" || selectedPin.type === "trek") && selectedPin.activities && selectedPin.activities.length > 0 && (
                    <div>
                      <h4 className="font-medium text-sm mb-2">Activities/Highlights:</h4>
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
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1"
                      onClick={() => handleGetDirections(selectedPin.lat, selectedPin.lng, selectedPin.name, selectedPin.parentLocationId)}
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