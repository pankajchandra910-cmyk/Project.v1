import React, { useState } from "react";
import { Button } from "./button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./dialog";
import { Badge } from "./badge";
import { ChevronLeft, ChevronRight, X, MapPin, Star } from "lucide-react";
import { ImageWithFallback } from "./ImageWithFallback";
import { locations } from "../assets/dummy";


export default function LocationCarousel({ onLocationClick = () => {} }) {
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const handleLocationClick = (location) => {
    // Always call onLocationClick if it's provided.
    // The parent component can then decide to navigate or do something else.
    if (onLocationClick) {
      onLocationClick(location.name); // Pass the location name to the handler
    }

    // If onLocationClick doesn't prevent default behavior (like navigating
    // to a different page), then open the modal to show details.
    // This allows the parent to either navigate OR open the modal.
    setSelectedLocation(location);
    setSelectedImageIndex(0);
    setIsModalOpen(true);
  };

  const nextImage = () => {
    if (selectedLocation && selectedImageIndex < selectedLocation.gallery.length - 1) {
      setSelectedImageIndex(selectedImageIndex + 1);
    }
  };

  const prevImage = () => {
    if (selectedImageIndex > 0) {
      setSelectedImageIndex(selectedImageIndex - 1);
    }
  };

  return (
    <section className="space-y-6">
      <h2 className="text-3xl font-bold text-center mb-8">Explore Hill Destinations</h2>

      {/* Scrollable Carousel */}
      <div className="relative">
        <div className="flex space-x-4 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory">
          {locations.map((location) => (
            <div
              key={location.id}
              className="shrink-0 w-36 h-32 rounded-lg overflow-hidden cursor-pointer hover:scale-105 transition-transform duration-300 shadow-md hover:shadow-lg snap-start"
              onClick={() => handleLocationClick(location)}
            >
              <div className="relative h-full">
                <ImageWithFallback
                  src={location.image}
                  alt={location.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-opacity-40 flex items-center justify-center">
                  <div className="text-center text-white p-2">
                    <h3 className="font-semibold text-sm">{location.name}</h3>
                    <p className="text-xs opacity-90">{location.distance}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Location Details Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {selectedLocation && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold flex items-center justify-between">
                  {selectedLocation.name}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsModalOpen(false)}
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-6">
                {/* Image Gallery */}
                <div className="relative">
                  <div className="aspect-video rounded-lg overflow-hidden">
                    <ImageWithFallback
                      src={selectedLocation.gallery[selectedImageIndex]}
                      alt={`${selectedLocation.name} - Image ${selectedImageIndex + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {selectedLocation.gallery.length > 1 && (
                    <>
                      <Button
                        variant="secondary"
                        size="sm"
                        className="absolute left-2 top-1/2 transform -translate-y-1/2"
                        onClick={prevImage}
                        disabled={selectedImageIndex === 0}
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="secondary"
                        size="sm"
                        className="absolute right-2 top-1/2 transform -translate-y-1/2"
                        onClick={nextImage}
                        disabled={selectedImageIndex === selectedLocation.gallery.length - 1}
                      >
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </>
                  )}

                  <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2">
                    <div className="flex space-x-1">
                      {selectedLocation.gallery.map((_, index) => (
                        <div
                          key={index}
                          className={`w-2 h-2 rounded-full ${
                            index === selectedImageIndex ? 'bg-white' : 'bg-white/50'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Location Details */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <div className="flex items-center space-x-2 mb-3">
                      <MapPin className="w-5 h-5 text-primary" />
                      <span className="text-lg font-medium">Distance from Nainital: {selectedLocation.distance}</span>
                    </div>
                    <p className="text-muted-foreground mb-4">{selectedLocation.description}</p>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-3 flex items-center">
                      <Star className="w-5 h-5 text-yellow-500 mr-2" />
                      Best Viewpoints
                    </h4>
                    <div className="space-y-2">
                      {selectedLocation.viewpoints.map((viewpoint, index) => (
                        <Badge key={index} variant="secondary" className="mr-2 mb-2">
                          {viewpoint}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}