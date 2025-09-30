import React from "react";
import { Card, CardContent } from "./Card";
import { Button } from "./button";
import { Badge } from "./badge";
import { Star, MapPin } from "lucide-react";
import { ImageWithFallback } from "./ImageWithFallback";

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
  amenities,
  availability,
  onViewDetails,
  onBookNow,
}) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-all duration-200">
      <div className="md:flex">
        {/* Image */}
        <div className="md:w-80 aspect-video md:aspect-square relative">
          <ImageWithFallback
            src={image}
            alt={title}
            className="w-full h-full object-cover"
          />
          <Badge className="absolute top-3 left-3 bg-primary text-white">
            {type}
          </Badge>
          {availability && (
            <Badge
              variant="secondary"
              className="absolute top-3 right-3 bg-green-100 text-green-800"
            >
              {availability}
            </Badge>
          )}
        </div>

        {/* Content */}
        <CardContent className="flex-1 p-4 md:p-6">
          <div className="space-y-3">
            {/* Header */}
            <div>
              <h3 className="text-xl font-semibold">{title}</h3>
              <div className="flex items-center space-x-4 text-sm text-muted-foreground mt-1">
                <div className="flex items-center space-x-1">
                  <MapPin className="w-4 h-4" />
                  <span>{location}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span>{rating}</span>
                  <span>({reviewCount} reviews)</span>
                </div>
              </div>
            </div>

            {/* Description */}
            <p className="text-muted-foreground line-clamp-2">{description}</p>

            {/* Amenities */}
            <div className="flex flex-wrap gap-2">
              {amenities.slice(0, 4).map((amenity) => (
                <Badge key={amenity} variant="outline" className="text-xs">
                  {amenity}
                </Badge>
              ))}
              {amenities.length > 4 && (
                <Badge variant="outline" className="text-xs">
                  +{amenities.length - 4} more
                </Badge>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between pt-2">
              <div>
                <span className="text-2xl font-bold text-primary">{price}</span>
                {type !== "Places" && (
                  <span className="text-muted-foreground">/night</span>
                )}
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onViewDetails(id)}
                >
                  View Details
                </Button>
                {onBookNow && type !== "Places" && (
                  <Button
                    size="sm"
                    className="bg-primary"
                    onClick={() => onBookNow(id)}
                  >
                    Book Now
                  </Button>
                )}
                {type === "Places" && (
                  <Button
                    size="sm"
                    className="bg-secondary"
                    onClick={() => onViewDetails(id)}
                  >
                    Get Directions
                  </Button>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </div>
    </Card>
  );
}
