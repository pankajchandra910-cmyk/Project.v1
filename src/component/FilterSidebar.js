import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./Card";
import { Slider } from "./slider";
import { Checkbox } from "./checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./select";
import { Button } from "./button";
import { Label } from "./label";
import { Separator } from "./separator";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "./Sheet";

import { SlidersHorizontal,  ChevronUp, ChevronDown } from "lucide-react"; // Added Chevron icons

export default function FilterSidebar({
  filters,
  onFilterChange,
  onClearFilters,
  isMobile = false,
  allResultTypes = [],      // Default to empty array
  allResultLocations = [], // Default to empty array
  allResultAmenities = [], // Default to empty array, ensures .map() is safe
}) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  // Memoize unique options (now directly from props passed from SearchView)
  const uniqueTypes = useMemo(() => {
    const types = [...allResultTypes]; // Use the passed prop
    types.sort();
    return types;
  }, [allResultTypes]);

  const uniqueLocations = useMemo(() => {
    const locations = [...allResultLocations]; // Use the passed prop
    locations.sort();
    return locations;
  }, [allResultLocations]);

  const uniqueAmenities = useMemo(() => {
    const amenities = [...allResultAmenities]; // Use the passed prop
    amenities.sort();
    return amenities;
  }, [allResultAmenities]);


  // Memoize handler functions to prevent unnecessary re-renders of children
  const handlePriceChange = useCallback((value) => {
    onFilterChange({
      ...filters,
      priceRange: [value[0], value[1]],
    });
  }, [filters, onFilterChange]);

  const handleCheckboxChange = useCallback((category, value, checked) => {
    // Ensure currentValues is always an array before filtering/spreading
    const currentValues = Array.isArray(filters[category]) ? filters[category] : [];
    const newValues = checked
      ? [...currentValues, value]
      : currentValues.filter((v) => v !== value);

    onFilterChange({
      ...filters,
      [category]: newValues,
    });
  }, [filters, onFilterChange]);

  const handleSortChange = useCallback((value) => {
    onFilterChange({
      ...filters,
      sortBy: value,
    });
  }, [filters, onFilterChange]);

  const handleClearAndCloseSheet = () => {
    onClearFilters();
    setIsSheetOpen(false);
  };

  // Common content for both desktop and mobile sidebar
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
          {/* Using number strings for simpler filter logic based on integer rating */}
          {["4", "3", "2"].map((minRating) => (
            <div key={minRating} className="flex items-center space-x-2">
              <Checkbox
                id={`rating-${minRating}`}
                checked={filters.rating && filters.rating.includes(minRating)}
                onCheckedChange={(checked) =>
                  handleCheckboxChange("rating", minRating, checked)
                }
              />
              <Label htmlFor={`rating-${minRating}`} className="text-sm">{minRating}+ stars</Label>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      {/* Type - Dynamically generated from allResultTypes prop */}
      <div>
        <Label className="text-sm font-medium">Type</Label>
        <div className="mt-3 space-y-2">
          {uniqueTypes.length > 0 ? (
            uniqueTypes.map((type) => (
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
            ))
          ) : (
            <p className="text-sm text-muted-foreground">No types available.</p>
          )}
        </div>
      </div>

      <Separator />

      {/* Location - Dynamically generated from allResultLocations prop */}
      <div>
        <Label className="text-sm font-medium">Location</Label>
        <div className="mt-3 space-y-2">
          {uniqueLocations.length > 0 ? (
            uniqueLocations.map((location) => (
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
            ))
          ) : (
            <p className="text-sm text-muted-foreground">No locations available.</p>
          )}
        </div>
      </div>

      <Separator />

      {/* Amenities - Dynamically generated from allResultAmenities prop */}
      <div>
        <Label className="text-sm font-medium">Amenities</Label>
        <div className="mt-3 space-y-2">
          {uniqueAmenities.length > 0 ? (
            uniqueAmenities.map((amenity) => (
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
            ))
          ) : (
            <p className="text-sm text-muted-foreground">No amenities available.</p>
          )}
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
            <SelectItem value="distance">Distance</SelectItem> {/* Keep if you plan to implement */}
          </SelectContent>
        </Select>
      </div>
    </div>
  );

  // Mobile view (Sheet component)
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
        <SheetContent side="bottom" className="h-[80vh] max-h-[80vh] overflow-y-auto flex flex-col">
          <SheetHeader className="flex-shrink-0"> {/* Ensure header doesn't scroll */}
            <div className="flex items-center justify-between">
              <SheetTitle>Filters</SheetTitle>
              <Button variant="ghost" size="sm" onClick={handleClearAndCloseSheet}>
                Clear All
              </Button>
            </div>
            <SheetDescription>
              Customize your search results
            </SheetDescription>
          </SheetHeader>
          <div className="py-6 flex-grow overflow-y-auto"> {/* Main content area is scrollable */}
            <FilterContent />
          </div>
          <div className="mt-auto pt-4 border-t flex-shrink-0"> {/* Footer area */}
            <Button
              className="w-full bg-primary hover:bg-primary/90"
              onClick={() => setIsSheetOpen(false)}
            >
              Apply Filters
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  // Desktop view (Card component)
  return (
    <Card className="sticky top-24 lg:max-h-[calc(110vh-10rem)] lg:overflow-y-auto filter-scrollbar-hidden">
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
              {isCollapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
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
