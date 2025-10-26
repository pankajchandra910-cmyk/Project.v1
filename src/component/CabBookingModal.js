import { useState, useRef, useEffect } from "react";
import { Button } from "./button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./Dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./select";
import { Calendar } from "./calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { Badge } from "./badge";
import { Input } from "./Input";
import { Label } from "./label";
import { Car, Phone, Calendar as CalendarIcon, CheckCircle } from "lucide-react";

/**
 * @typedef {object} CabBookingModalProps
 * @property {boolean} isOpen
 * @property {() => void} onClose
 */

/**
 * CabBookingModal component for booking cabs/taxis.
 * @param {CabBookingModalProps} props
 */
export default function CabBookingModal({ isOpen, onClose }) {
  /** @type {[string, import('react').Dispatch<import('react').SetStateAction<string>>]} */
  const [fromLocation, setFromLocation] = useState("");
  /** @type {[string, import('react').Dispatch<import('react').SetStateAction<string>>]} */
  const [toLocation, setToLocation] = useState("");
  /** @type {[Date | undefined, import('react').Dispatch<import('react').SetStateAction<Date | undefined>>]} */
  const [selectedDate, setSelectedDate] = useState(undefined);
  /** @type {[string, import('react').Dispatch<import('react').SetStateAction<string>>]} */
  const [selectedAgency, setSelectedAgency] = useState("");
  /** @type {[boolean, import('react').Dispatch<import('react').SetStateAction<boolean>>]} */
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  /** @type {[string, import('react').Dispatch<import('react').SetStateAction<string>>]} */
  const [estimatedFare, setEstimatedFare] = useState("");

  const locations = [
    "Nainital",
    "Bhimtal", 
    "Sukhatal",
    "Brahmsthali",
    "Pangoot",
    "Mukteshwar",
    "Almora",
    "Ranikhet"
  ];

  const agencies = [
    { name: "Taxi Nainital", rating: 4.5, vehicles: "Sedan, SUV, Tempo Traveller" },
    { name: "Nainital Taxi Services", rating: 4.3, vehicles: "Hatchback, Sedan, SUV" },
    { name: "Manoj Tour and Travels", rating: 4.7, vehicles: "All Types Available" }
  ];

  /**
   * Calculates the estimated fare based on selected locations.
   * @param {string} from
   * @param {string} to
   */
  const calculateFare = (from, to) => {
    if (from && to && from !== to) {
      // Simple fare calculation based on distance
      const baseRate = 12; // per km
      const distances = {
        "Nainital-Bhimtal": 22,
        "Nainital-Sukhatal": 18,
        "Nainital-Brahmsthali": 26,
        "Nainital-Pangoot": 15,
        "Nainital-Mukteshwar": 50,
        "Nainital-Almora": 65,
        "Nainital-Ranikhet": 60,
        // Add reverse routes for simpler lookup
        "Bhimtal-Nainital": 22,
        "Sukhatal-Nainital": 18,
        "Brahmsthali-Nainital": 26,
        "Pangoot-Nainital": 15,
        "Mukteshwar-Nainital": 50,
        "Almora-Nainital": 65,
        "Ranikhet-Nainital": 60,
        // Example for other routes, extend as needed
        "Bhimtal-Sattal": 10,
        "Sattal-Bhimtal": 10
      };
      
      const key = `${from}-${to}`;
      const distance = distances[key];

      if (distance !== undefined) {
        const fare = distance * baseRate;
        setEstimatedFare(`₹${fare}`);
      } else {
        // Fallback for unlisted routes, or more complex logic
        setEstimatedFare("₹" + (25 * baseRate)); // Default if no specific distance is found
      }
    } else {
      setEstimatedFare("");
    }
  };

  /**
   * Handles change for the "From" location select.
   * @param {string} value
   */
  const handleFromChange = (value) => {
    setFromLocation(value);
    calculateFare(value, toLocation);
  };

  /**
   * Handles change for the "To" location select.
   * @param {string} value
   */
  const handleToChange = (value) => {
    setToLocation(value);
    calculateFare(fromLocation, value);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center">
            <Car className="w-6 h-6 mr-2 text-primary" />
            Book Cab/Taxi
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Booking Form */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* From Location */}
            <div className="space-y-2">
              <Label htmlFor="from">From</Label>
              <Select value={fromLocation} onValueChange={handleFromChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select pickup location" />
                </SelectTrigger>
                <SelectContent>
                  {locations.map((location) => (
                    <SelectItem key={location} value={location}>
                      {location}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* To Location */}
            <div className="space-y-2">
              <Label htmlFor="to">To</Label>
              <Select value={toLocation} onValueChange={handleToChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select destination" />
                </SelectTrigger>
                <SelectContent>
                  {locations.map((location) => (
                    <SelectItem key={location} value={location}>
                      {location}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Date Picker */}
            <div className="space-y-2">
              <Label>Travel Date</Label>
              <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {selectedDate ? selectedDate.toLocaleDateString() : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={(date) => {
                      setSelectedDate(date);
                      setIsCalendarOpen(false);
                    }}
                    disabled={(date) => date < new Date()}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Estimated Fare */}
            <div className="space-y-2">
              <Label>Estimated Fare</Label>
              <Input
                value={estimatedFare}
                placeholder="Select locations"
                readOnly
                className="font-semibold text-primary"
              />
            </div>
          </div>

          {/* Travel Agency Selection */}
          <div className="space-y-3">
            <Label className="text-lg font-semibold">Choose Travel Agency</Label>
            <div className="space-y-3">
              {agencies.map((agency) => (
                <div
                  key={agency.name}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    selectedAgency === agency.name
                      ? "border-primary bg-primary/5"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  onClick={() => setSelectedAgency(agency.name)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold">{agency.name}</h4>
                      <p className="text-sm text-muted-foreground">{agency.vehicles}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="secondary">
                        ⭐ {agency.rating}
                      </Badge>
                      {selectedAgency === agency.name && (
                        <CheckCircle className="w-5 h-5 text-primary" />
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Phone className="w-5 h-5 text-primary" />
              <span className="font-semibold">Temporary Contact</span>
            </div>
            <p className="text-muted-foreground mb-3">
              Call for immediate booking and personalized service
            </p>
            <Button className="w-full bg-primary" asChild>
              <a href="tel:+919999999999">
                <Phone className="w-4 h-4 mr-2" />
                Call: +91 9999999999
              </a>
            </Button>
          </div>

          {/* Booking Status */}
          <div className="bg-yellow-100 border border-yellow-300 rounded-lg p-4 text-center">
            <Badge variant="outline" className="bg-yellow-200 text-yellow-800 mb-2">
              Coming Soon
            </Badge>
            <p className="font-semibold text-yellow-800">Online Booking Available Soon</p>
            <p className="text-sm text-yellow-700">
              We're working on bringing you a seamless online booking experience
            </p>
          </div>

          {/* Form Validation Indicators */}
          {fromLocation && toLocation && selectedDate && selectedAgency && (
            <div className="flex items-center justify-center space-x-2 text-green-600">
              <CheckCircle className="w-5 h-5" />
              <span className="font-medium">Ready to book! Please call the number above.</span>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}