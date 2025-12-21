
import React from "react";
// Ensure these paths match your project structure
import { Button } from "./button";
import { Badge } from "./badge";
// If you don't have a specific Card component, use a simple div with classes, 
// otherwise keep your import { Card, CardContent } from "./card"; 
import { Star, MapPin, ChevronRight } from "lucide-react";

// Fallback image helper if ImageWithFallback isn't available
const ImgHelper = ({ src, alt, className }) => (
  <img 
    src={src || "https://placehold.co/600x400?text=No+Image"} 
    alt={alt} 
    className={className}
    onError={(e) => { e.target.src = "https://placehold.co/600x400?text=Fallback"; }} 
  />
);

export default function ListingCard({
  id,
  image,
  title,
  type,
  location,
  price,
  rating,
  reviewCount,
  description,
  amenities = [], // Default to empty array
  availability,
  onViewDetails,
  onBookNow,
}) {
  return (
    <div className="group bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col md:flex-row h-auto md:h-64 mb-6">
      
      {/* --- Image Section --- */}
      {/* Mobile: Full Width | Desktop: Fixed Width (approx 35%) */}
      <div className="md:w-72 lg:w-80 shrink-0 relative h-48 md:h-full">
        <ImgHelper
          src={image}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute top-3 left-3 flex gap-2">
            <Badge className="bg-white/90 text-gray-800 shadow-sm backdrop-blur-sm hover:bg-white">
                {type}
            </Badge>
        </div>
      </div>

      {/* --- Content Section --- */}
      <div className="flex-1 p-5 flex flex-col justify-between">
        
        {/* Upper Info */}
        <div className="space-y-2">
            <div className="flex justify-between items-start">
                <h3 className="text-xl font-bold text-gray-900 group-hover:text-primary transition-colors line-clamp-1">
                    {title}
                </h3>
                {availability && (
                     <Badge variant="secondary" className="hidden sm:inline-flex bg-green-50 text-green-700 border-green-200 text-xs">
                        {availability}
                     </Badge>
                )}
            </div>

            {/* Ratings & Location */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                <div className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{location}</span>
                </div>
                {rating > 0 && (
                    <div className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-yellow-50 text-yellow-700 font-medium">
                        <Star className="w-3.5 h-3.5 fill-current" />
                        <span>{rating}</span>
                        <span className="text-gray-400 font-normal">({reviewCount})</span>
                    </div>
                )}
            </div>

            {/* Description (Line clamped) */}
            <p className="text-gray-600 text-sm line-clamp-2 md:line-clamp-2 mt-2 leading-relaxed">
                {description || "Experience the best of nature and local hospitality..."}
            </p>

            {/* Amenities Pills */}
            <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-gray-50 md:border-none md:pt-0">
                {amenities.slice(0, 4).map((amenity, index) => (
                    <span key={index} className="text-[11px] px-2 py-1 bg-gray-50 text-gray-600 rounded-md border border-gray-100">
                        {amenity}
                    </span>
                ))}
                {amenities.length > 4 && (
                    <span className="text-[11px] px-2 py-1 text-gray-400">+{amenities.length - 4} more</span>
                )}
            </div>
        </div>

        {/* --- Footer / Price Action --- */}
        <div className="flex items-center justify-between pt-4 mt-2 border-t border-gray-100 md:border-none md:pt-0">
            <div>
                 <span className="text-lg md:text-2xl font-bold text-gray-900">
                    ₹{price ? price.toLocaleString() : "On Request"}
                 </span>
                 {price > 0 && <span className="text-xs text-gray-400 font-medium ml-1">/ day avg</span>}
            </div>

            <div className="flex items-center gap-3">
                 <Button 
                    onClick={() => onViewDetails(id)}
                    className="h-10 px-5 md:px-8 bg-primary hover:bg-primary/90 text-white rounded-lg group/btn"
                 >
                    View Details 
                    <ChevronRight className="w-4 h-4 ml-1 md:hidden" />
                 </Button>
            </div>
        </div>

      </div>
    </div>
  );
}