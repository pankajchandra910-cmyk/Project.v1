import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { Button } from "./button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ImageWithFallback } from "./ImageWithFallback"; // Assuming this component handles image loading with fallbacks

// Define your hero slides data
const heroSlides = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1656828059867-3fb503eb2214?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuYWluaiBhbCUyMGxha2UlMjBzdW5zZXQlMjBtb3VudGFpbnN8ZW58MXx8fHwxNzU3NjE2OTg3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    title: "Discover Nainital Lake",
    subtitle: "Experience the serene beauty of the Queen of Lakes",
    buttonText: "Explore Now",
    action: "explore-location", // Action to navigate to a location details page
    targetId: "nainital" // The ID for the location
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1683973200791-47539048cf63?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHxiaGltdGFsJTIwbGFrZSUyMHV0dGFyYWtoYW5kfGVufDF8fHx8MTc1NzYxNjk4OHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    title: "Explore Bhimtal",
    subtitle: "Find tranquility at the largest lake in Kumaon",
    buttonText: "Book Stay",
    action: "book-item", // Action to navigate to a booking page
    targetId: "bhimtal-hotel-package" // A unique ID for the item to book
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1717050788940-189e308415fb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3VudGFpbiUyMHRyZWtraW5nJTIwaGltYWxheWFzfGVufDF8fHx8MTc1NzYxNjk4OHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    title: "Mountain Trekking Adventures",
    subtitle: "Discover hidden trails and breathtaking views",
    buttonText: "Book Trek",
    action: "book-item", // Action to navigate to a booking page
    targetId: "mountain-trek-package" // A unique ID for the item to book
  },
  {
    id: 4,
    image: "https://images.unsplash.com/photo-1735242004608-35b11962c9f7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHxsYWtlJTIwYm9hdGluZCUyMHV0dGFyYWtoYW5kfGVufDF8fHx8MTc1NzYxNjk4OXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    title: "Lake Boating Experience",
    subtitle: "Enjoy peaceful boat rides across pristine waters",
    buttonText: "Book Boat",
    action: "book-item", // Action to navigate to a booking page
    targetId: "lake-boating-package" // A unique ID for the item to book
  }
];

export default function HeroCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate(); // Initialize useNavigate hook

  // Automatically advance slides every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);

    return () => clearInterval(timer); // Cleanup the timer on component unmount
  }, []);

  // Handler for next slide button
  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  }, []);

  // Handler for previous slide button
  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  }, []);

  // Handler for the button click on each slide
  const handleButtonClick = useCallback((slide) => {
    if (slide.action === "explore-location" && slide.targetId) {
      navigate(`/location-details/${slide.targetId}`);
    } else if (slide.action === "book-item" && slide.targetId) {
      navigate(`/book-item/${slide.targetId}`);
    } else {
      // Fallback for any other actions or if targetId is missing
      console.warn("Unhandled action or missing targetId for slide:", slide);
      // You might navigate to a generic search page or home page here
      navigate('/search');
    }
  }, [navigate]);

  return (
    <div className="relative h-96 md:h-[500px] overflow-hidden rounded-lg">
      {heroSlides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-transform duration-500 ease-in-out ${
            index === currentSlide ? "translate-x-0" :
            index < currentSlide ? "-translate-x-full" : "translate-x-full"
          }`}
        >
          <div className="relative h-full w-full"> {/* Added w-full here */}
            <ImageWithFallback
              src={slide.image}
              alt={slide.title}
              className="w-full h-full object-cover"
            />
            {/* Overlay for better text readability */}
            <div className="absolute inset-0 bg-black/40" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-white space-y-4 px-4">
                <h2 className="text-3xl md:text-5xl font-bold">{slide.title}</h2>
                <p className="text-lg md:text-xl opacity-90">{slide.subtitle}</p>
                <Button
                  size="lg"
                  className="bg-primary hover:bg-primary/90"
                  onClick={() => handleButtonClick(slide)} // Use the new handler
                >
                  {slide.buttonText}
                </Button>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Buttons */}
      <Button
        variant="ghost"
        size="sm"
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white z-10"
        onClick={prevSlide}
      >
        <ChevronLeft className="w-6 h-6" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white z-10"
        onClick={nextSlide}
      >
        <ChevronRight className="w-6 h-6" />
      </Button>

      {/* Indicators */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2 z-10">
        {heroSlides.map((_, index) => (
          <button
            key={index}
            className={`w-3 h-3 rounded-full transition-all ${
              index === currentSlide ? "bg-white" : "bg-white/50"
            }`}
            onClick={() => setCurrentSlide(index)}
          />
        ))}
      </div>
    </div>
  );
}