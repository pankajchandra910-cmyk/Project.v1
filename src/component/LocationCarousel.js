import React, { useState } from "react";
import { Button } from "./button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./dialog";
import { Badge } from "./badge";
import { ChevronLeft, ChevronRight, X, MapPin, Star } from "lucide-react";
import { ImageWithFallback } from "./ImageWithFallback"; 

const locations = [
  {
    id: "1",
    name: "Nainital",
    image: "https://images.unsplash.com/photo-1656828059867-3fb503eb2214?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuYWluXzQ2N3x_MTA0NDUzNjZ8MHwxfHNlYXJjaHwxfHxuYWluXzQ2N3x_MTA0NDUzNjZ8MHwxfHxuYWluXzQ2N3x_MTA0NDUzNjZ8MHwxfHNlYXJjaHwxfHxuYWluXzQ2N3x_MTA0NDUzNjZ8ZW58MXx8fHwxNzU3NjE2OTg3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    distance: "0km",
    viewpoints: ["Naini Lake", "Mall Road", "Snow View Point"],
    description: "The Queen of Hills, famous for its pristine lake and colonial charm",
    gallery: [
      "https://images.unsplash.com/photo-1656828059867-3fb503eb2214?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuYWluXzQ2N3x_MTA0NDUzNjZ8MHwxfHNlYXJjaHwxfHxuYWluXzQ2N3x_MTA0NDUzNjZ8MHwxfHxuYWluXzQ2N3x_MTA0NDUzNjZ8MHwxfHxuYWluXzQ2N3x_MTA0NDUzNjZ8ZW58MXx8fHwxNzU3NjE2OTg3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuYWluXzQ2N3x_MTA0NDUzNjZ8MHwxfHNlYXJjaHwxfHxuYWluXzQ2N3x_MTA0NDUzNjZ8MHwxfHxuYWluXzQ2N3x_MTA0NDUzNjZ8MHwxfHxuYWluXzQ2N3x_MTA0NDUzNjZ8ZW58MXx8fHwxNzU3NjE2OTg3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      "https://images.unsplash.com/photo-1617469767053-d3b523a0b982?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxZnxtb3VudGFpbiUyMGxha2V8ZW58MXx8fHwxNzU3NjIyNzUyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
    ]
  },
  {
    id: "2",
    name: "Bhimtal",
    image: "https://images.unsplash.com/photo-1683973200791-47539048cf63?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiaGltdGFsJTIwbGFrZSUyMHV0dGFyYWtoYW5kfGVufDF8fHx8MTc1NzYxNjk4OHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    distance: "22km",
    viewpoints: ["Bhimtal Lake", "Island Restaurant", "Butterfly Research Centre"],
    description: "Larger lake than Naini with serene surroundings and island restaurant",
    gallery: [
      "https://images.unsplash.com/photo-1683973200791-47539048cf63?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiaGltdGFsJTIwbGFrZSUyMHV0dGFyYWtoYW5kfGVufDF8fHx8MTc1NzYxNjk4OHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      "https://images.unsplash.com/photo-1617469767053-d3b523a0b982?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxZnxtb3VudGFpbiUyMGxha2V8ZW58MXx8fHwxNzU3NjIyNzUyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
    ]
  },
  {
    id: "3",
    name: "Sukhatal",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuYWluXzQ2N3x_MTA0NDUzNjZ8MHwxfHNlYXJjaHwxfHxuYWluXzQ2N3x_MTA0NDUzNjZ8MHwxfHxuYWluXzQ2N3x_MTA0NDUzNjZ8MHwxfHxuYWluXzQ2N3x_MTA0NDUzNjZ8ZW58MXx8fHwxNzU3NjE2OTg3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    distance: "18km",
    viewpoints: ["Sukhatal Lake", "Forest Walks", "Bird Watching Points"],
    description: "Peaceful lake perfect for meditation and nature photography",
    gallery: [
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuYWluXzQ2N3x_MTA0NDUzNjZ8MHwxfHNlYXJjaHwxfHxuYWluXzQ2N3x_MTA0NDUzNjZ8MHwxfHxuYWluXzQ2N3x_MTA0NDUzNjZ8MHwxfHxuYWluXzQ2N3x_MTA0NDUzNjZ8ZW58MXx8fHwxNzU3NjE2OTg3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
    ]
  },
  {
    id: "4",
    name: "Brahmsthali",
    image: "https://images.unsplash.com/photo-1717050788940-189e308415fb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3VudGFpbiUyMHRyZWtraW5nJTIwaGltYWxheWFzfGVufDF8fHx8MTc1NzYxNjk4OHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    distance: "26km",
    viewpoints: ["Brahma Temple", "Himalayan Views", "Sunrise Point"],
    description: "Spiritual destination with panoramic mountain views",
    gallery: [
      "https://images.unsplash.com/photo-1717050788940-189e308415fb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3VudGFpbiUyMHRyZWtraW5nJTIwaGltYWxheWFzfGVufDF8fHx8MTc1NzYxNjk4OHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
    ]
  },
  {
    id: "5",
    name: "Naini Track",
    image: "https://images.unsplash.com/photo-1670555383991-ae6ad4bb39df?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHxoaWxsJTIwcmVzb3J0JTIwbW91bnRhaW4lMjB2aWV3fGVufDF8fHx8MTc1NzYxNjk4OXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    distance: "8km",
    viewpoints: ["Tiffin Top", "Dorothy's Seat", "Lands End"],
    description: "Popular trekking route with multiple viewpoints",
    gallery: [
      "https://images.unsplash.com/photo-1670555383991-ae6ad4bb39df?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHxoaWxsJTIwcmVzb3J0JTIwbW91bnRhaW4lMjB2aWV3fGVufDF8fHx8MTc1NzYxNjk4OXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
    ]
  },
  {
    id: "6",
    name: "Kanchi Dhaam",
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZW1wbGUlMjBtb3VudGFpbnN8ZW58MXx8fHwxNzU3NjIyODUyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    distance: "15km",
    viewpoints: ["Temple Complex", "Valley Views", "Sacred Ponds"],
    description: "Ancient temple complex with spiritual significance",
    gallery: [
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZW1wbGUlMjBtb3VudGFpbnN8ZW58MXx8fHwxNzU3NjIyODUyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
    ]
  },
  {
    id: "7",
    name: "Naina Devi Temple",
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZW1wbGUlMjBtb3VudGFpbnN8ZW58MXx8fHwxNzU3NjIyODUyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    distance: "2km",
    viewpoints: ["Temple Premises", "Lake Views", "Prayer Halls"],
    description: "Sacred temple dedicated to Goddess Naina Devi",
    gallery: [
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZW1wbGUlMjBtb3VudGFpbnN8ZW58MXx8fHwxNzU3NjIyODUyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
    ]
  },
  {
    id: "8",
    name: "China Peak",
    image: "https://images.unsplash.com/photo-1717050788940-189e308415fb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3VudGFpbiUyMHRyZWtraW5nJTIwaGltYWxheWFzfGVufDF8fHx8MTc1NzYxNjk4OHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    distance: "6km",
    viewpoints: ["Summit Views", "Trekking Trails", "Sunrise Point"],
    description: "Highest peak around Nainital, perfect for adventure seekers",
    gallery: [
      "https://images.unsplash.com/photo-1717050788940-189e308415fb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3VudGFpbiUyMHRyZWtraW5nJTIwaGltYWxheWFzfGVufDF8fHx8MTc1NzYxNjk4OHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
    ]
  },
  {
    id: "9",
    name: "Himdarshan",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuYWluXzQ2N3x_MTA0NDUzNjZ8MHwxfHNlYXJjaHwxfHxuYWluXzQ2N3x_MTA0NDUzNjZ8MHwxfHxuYWluXzQ2N3x_MTA0NDUzNjZ8MHwxfHxuYWluXzQ2N3x_MTA0NDUzNjZ8ZW58MXx8fHwxNzU3NjE2OTg3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    distance: "12km",
    viewpoints: ["Himalayan Range", "Valley Views", "Photography Points"],
    description: "Best spot for Himalayan range photography",
    gallery: [
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuYWluXzQ2N3x_MTA0NDUzNjZ8MHwxfHNlYXJjaHwxfHxuYWluXzQ2N3x_MTA0NDUzNjZ8MHwxfHxuYWluXzQ2N3x_MTA0NDUzNjZ8MHwxfHxuYWluXzQ2N3x_MTA0NDUzNjZ8ZW58MXx8fHwxNzU3NjE2OTg3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
    ]
  },
  {
    id: "10",
    name: "Pangoot",
    image: "https://images.unsplash.com/photo-1617469767053-d3b523a0b982?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxZnxtb3VudGFpbiUyMGxha2V8ZW58MXx8fHwxNzU3NjIyNzUyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    distance: "15km",
    viewpoints: ["Bird Watching", "Forest Trails", "Eco Point"],
    description: "Paradise for bird watchers and nature enthusiasts",
    gallery: [
      "https://images.unsplash.com/photo-1617469767053-d3b523a0b982?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxZnxtb3VudGFpbiUyMGxha2V8ZW58MXx8fHwxNzU3NjIyNzUyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
    ]
  }
];

export default function LocationCarousel({ onLocationClick = () => {} }) {
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const handleLocationClick = (location) => {
    // If it's Nainital and we have a special handler, use it
    if (location.name === "Nainital" && onLocationClick) {
      onLocationClick("Nainital");
      return;
    }
    
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
              className="flex-shrink-0 w-36 h-32 rounded-lg overflow-hidden cursor-pointer hover:scale-105 transition-transform duration-300 shadow-md hover:shadow-lg snap-start"
              onClick={() => handleLocationClick(location)}
            >
              <div className="relative h-full">
                <ImageWithFallback
                  src={location.image}
                  alt={location.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
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