import { useState, useEffect } from "react"; // Import useEffect
import { Card, CardContent, CardHeader, CardTitle } from "./Card";
import { Slider } from "./slider";
import { Checkbox } from "./checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./select";
import { Button } from "./button";
import { Label } from "./label";
import { Separator } from "./separator";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "./Sheet";

import { SlidersHorizontal, X } from "lucide-react";

export default function FilterSidebar({ filters, onFilterChange, onClearFilters, isMobile = false, allResults }) { // Added allResults prop
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  // Derive unique types from allResults
  const uniqueTypes = Array.from(new Set(allResults.map(item => item.type)));
  // You might want to sort these alphabetically or by some other logic
  uniqueTypes.sort();

  // Derive unique locations from allResults
  const uniqueLocations = Array.from(new Set(allResults.map(item => item.location)));
  uniqueLocations.sort();

  // Derive unique amenities from allResults
  const uniqueAmenities = Array.from(new Set(allResults.flatMap(item => item.amenities || [])));
  uniqueAmenities.sort();


  const handlePriceChange = (value) => {
    onFilterChange({
      ...filters,
      priceRange: [value[0], value[1]],
    });
  };

  const handleCheckboxChange = (category, value, checked) => {
    const currentValues = Array.isArray(filters[category]) ? filters[category] : [];
    const newValues = checked
      ? [...currentValues, value]
      : currentValues.filter((v) => v !== value);

    onFilterChange({
      ...filters,
      [category]: newValues,
    });
  };

  const handleSortChange = (value) => {
    onFilterChange({
      ...filters,
      sortBy: value,
    });
  };

  const FilterContent = () => (
    <div className="space-y-6">
      {/* Price Range */}
      <div>
        <Label htmlFor="price-range" className="text-sm font-medium">Price Range</Label>
        <div className="mt-3 px-3">
          <Slider
            id="price-range"
            value={filters.priceRange}
            onValueChange={handlePriceChange}
            max={15000}
            min={500}
            step={500}
            className="w-full"
            aria-label="Price range slider"
          />
          <div className="flex justify-between text-sm text-muted-foreground mt-2">
            <span>₹{filters.priceRange?.[0] ?? 500}</span>
            <span>₹{filters.priceRange?.[1] ?? 15000}</span>
          </div>
        </div>
      </div>

      <Separator />

      {/* Rating */}
      <div>
        <Label className="text-sm font-medium">Rating</Label>
        <div className="mt-3 space-y-2">
          {["4+ stars", "3+ stars", "2+ stars"].map((rating) => (
            <div key={rating} className="flex items-center space-x-2">
              <Checkbox
                id={`rating-${rating}`}
                checked={filters.rating && filters.rating.includes(rating)}
                onCheckedChange={(checked) =>
                  handleCheckboxChange("rating", rating, checked)
                }
              />
              <Label htmlFor={`rating-${rating}`} className="text-sm">{rating}</Label>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      {/* Type - Dynamically generated */}
      <div>
        <Label className="text-sm font-medium">Type</Label>
        <div className="mt-3 space-y-2">
          {uniqueTypes.map((type) => (
            <div key={type} className="flex items-center space-x-2">
              <Checkbox
                id={`type-${type}`}
                checked={filters.type && filters.type.includes(type)}
                onCheckedChange={(checked) =>
                  handleCheckboxChange("type", type, checked)
                }
              />
              <Label htmlFor={`type-${type}`} className="text-sm">{type}</Label>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      {/* Location - Dynamically generated */}
      <div>
        <Label className="text-sm font-medium">Location</Label>
        <div className="mt-3 space-y-2">
          {uniqueLocations.map((location) => (
            <div key={location} className="flex items-center space-x-2">
              <Checkbox
                id={`location-${location}`}
                checked={filters.location && filters.location.includes(location)}
                onCheckedChange={(checked) =>
                  handleCheckboxChange("location", location, checked)
                }
              />
              <Label htmlFor={`location-${location}`} className="text-sm">{location}</Label>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      {/* Amenities - Dynamically generated */}
      <div>
        <Label className="text-sm font-medium">Amenities</Label>
        <div className="mt-3 space-y-2">
          {uniqueAmenities.map((amenity) => (
            <div key={amenity} className="flex items-center space-x-2">
              <Checkbox
                id={`amenity-${amenity}`}
                checked={filters.amenities && filters.amenities.includes(amenity)}
                onCheckedChange={(checked) =>
                  handleCheckboxChange("amenities", amenity, checked)
                }
              />
              <Label htmlFor={`amenity-${amenity}`} className="text-sm">{amenity}</Label>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      {/* Sort By */}
      <div>
        <Label htmlFor="sort-by" className="text-sm font-medium">Sort By</Label>
        <Select value={filters.sortBy} onValueChange={handleSortChange}>
          <SelectTrigger id="sort-by" className="mt-2">
            <SelectValue placeholder="Select sorting" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="popularity">Popularity</SelectItem>
            <SelectItem value="price-low">Price: Low to High</SelectItem>
            <SelectItem value="price-high">Price: High to Low</SelectItem>
            <SelectItem value="rating">Rating</SelectItem>
            <SelectItem value="distance">Distance</SelectItem> {/* Assuming 'distance' is a valid sort key */}
          </SelectContent>
        </Select>
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetTrigger asChild>
          <Button
            variant="outline"
            className="w-full mb-4 h-12 text-base"
            onClick={() => setIsSheetOpen(true)}
          >
            <SlidersHorizontal className="w-4 h-4 mr-2" />
            Filters & Sort
          </Button>
        </SheetTrigger>
        <SheetContent side="bottom" className="h-[80vh] overflow-y-auto">
          <SheetHeader>
            <div className="flex items-center justify-between">
              <SheetTitle>Filters</SheetTitle>
              <Button variant="ghost" size="sm" onClick={() => { onClearFilters(); setIsSheetOpen(false); }}>
                Clear All
              </Button>
            </div>
            <SheetDescription>
              Customize your search results
            </SheetDescription>
          </SheetHeader>
          <div className="py-6">
            <FilterContent />
            <div className="mt-6 pt-6 border-t">
              <Button
                className="w-full bg-primary hover:bg-primary/90"
                onClick={() => setIsSheetOpen(false)}
              >
                Apply Filters
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Card className="sticky top-24 lg:max-h-[calc(100vh-theme(spacing.16)-theme(spacing.8))] lg:overflow-y-auto filter-scrollbar-hidden">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center">
            <SlidersHorizontal className="w-4 h-4 mr-2" />
            Filters
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" onClick={onClearFilters}>
              Clear All
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-2"
              aria-label={isCollapsed ? "Expand filters" : "Collapse filters"}
            >
              {isCollapsed ? <SlidersHorizontal className="w-4 h-4" /> : <X className="w-4 h-4" />}
            </Button>
          </div>
        </div>
      </CardHeader>
      {!isCollapsed && (
        <CardContent>
          <FilterContent />
        </CardContent>
      )}
    </Card>
  );
}
