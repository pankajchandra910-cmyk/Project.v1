import { Card, CardContent } from "./Card";
import { Button } from "./button";
import { Star, MapPin } from "lucide-react";
import { ImageWithFallback } from "./ImageWithFallback";



export default function FeaturedCard({
  id,
  image,
  title,
  location,
  price,
  rating,
  description,
  onViewDetails
}) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="aspect-video relative">
        <ImageWithFallback
          src={image}
          alt={title}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-3 right-3 bg-white px-2 py-1 rounded-md shadow-sm">
          <div className="flex items-center space-x-1">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-medium">{rating}</span>
          </div>
        </div>
      </div>
      <CardContent className="p-4 space-y-3">
        <div>
          <h3 className="font-semibold text-lg">{title}</h3>
          <div className="flex items-center space-x-1 text-muted-foreground">
            <MapPin className="w-4 h-4" />
            <span className="text-sm">{location}</span>
          </div>
        </div>
        
        <p className="text-sm text-muted-foreground line-clamp-2">{description}</p>
        
        <div className="flex items-center justify-between">
          <div>
            <span className="text-lg font-semibold text-primary">{price}</span>
            <span className="text-sm text-muted-foreground">/night</span>
          </div>
          <Button 
            size="sm" 
            className="bg-primary"
            onClick={() => onViewDetails(id)}
          >
            View Details
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}