import { Card,CardContent } from "./Card";
import { Button } from "./button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";
import { ImageWithFallback }  from "./ImageWithFallback";

const heroSlides = [
  {
    id: 1,
    image: ".src/utils/hero1.jpg",
    title: "Discover Nainital Lake",
    subtitle: "Experience the serene beauty of the Queen of Lakes",
    buttonText: "Explore Now"
  },
  {
    id: 2,
    image: ".src/utils/hero2.jpg",
    title: "Explore Bhimtal",
    subtitle: "Find tranquility at the largest lake in Kumaon",
    buttonText: "Book Stay"
  },
  {
    id: 3,
    image: ".src/utils/hero3.jpg",
    title: "Mountain Trekking Adventures",
    subtitle: "Discover hidden trails and breathtaking views",
    buttonText: "Book Trek"
  },
  {
    id: 4,
    image: ".src/utils/hero4.jpg",
    title: "Lake Boating Experience",
    subtitle: "Enjoy peaceful boat rides across pristine waters",
    buttonText: "Book Boat"
  }
];

// interface HeroCarouselProps {
//   onBooking: (type: string) => void;
// }

export default function HeroCarousel({ onBooking }) {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

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
          <div className="relative h-full">
            <ImageWithFallback
              src={slide.image}
              alt={slide.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-40" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-white space-y-4 px-4">
                <h2 className="text-3xl md:text-5xl font-bold">{slide.title}</h2>
                <p className="text-lg md:text-xl opacity-90">{slide.subtitle}</p>
                <Button 
                  size="lg" 
                  className="bg-primary hover:bg-primary/90"
                  onClick={() => onBooking(slide.buttonText)}
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
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white"
        onClick={prevSlide}
      >
        <ChevronLeft className="w-6 h-6" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white"
        onClick={nextSlide}
      >
        <ChevronRight className="w-6 h-6" />
      </Button>

      {/* Indicators */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
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