import Header from "./Header";
import HeroCarousel from "./HeroCarousel";
import CategoryCard from "./CategoryCard";
import FeaturedCard from "./FeaturedCard";
import { 
  Bed, 
  MapPin, 
  Mountain, 
  Car, 
  Users, 
  Home,
  ArrowLeft,
  Calendar,
  Phone,
  Mail,
  Bike,
  MessageCircle,
  Edit,
  Star,
  Navigation,
  Menu,
  X,
  User
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./Card";
import { Button } from "./button";
import { useState } from "react";



export default function Home(){

    const AppViews = [
  "login",
  "home",
  "search",
  "details",
  "hotel-details",
  "place-details",
  "trek-details",
  "bike-details",
  "cab-details",
  "guide-details",
  "profile",
  "owner-dashboard",
  "map",
  "booking"
];



    const [currentView, setCurrentView] = useState("login") // instead of useState<AppView>
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");
    const [userName] = useState("Priya Sharma");
    const [showMobileMenu, setShowMobileMenu] = useState(false);
    const [selectedItemId, setSelectedItemId] = useState("");
    const [selectedDetailType, setSelectedDetailType] = useState("hotel");

       // Mock data
    const categories = [
        { icon: Bed, title: "Hotels & Resorts", description: "Comfortable stays" },
        { icon: MapPin, title: "Places to Visit", description: "Top attractions" },
        { icon: Mountain, title: "Tours & Treks", description: "Adventure trails" },
        { icon: Car, title: "Cabs & Taxis", description: "Local transport" },
        { icon: Users, title: "Local Guides", description: "Expert guidance" },
        { icon: Home, title: "Hill Stays", description: "Mountain resorts" },
        { icon: Bike, title: "Rental Bikes", description: "Scooters & bikes" }
    ];
    
     const featuredPlaces = [
    {
      id: "1",
      image: "https://images.unsplash.com/photo-1670555383991-ae6ad4bb39df?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHxoaWxsJTIwcmVzb3J0JTIwbW91bnRhaW4lMjB2aWV3fGVufDF8fHx8MTc1NzYxNjk4OXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      title: "Luxury Resort Bhimtal",
      location: "Bhimtal, Uttarakhand",
      price: "₹5,000",
      rating: 4.5,
      description: "Scenic lake views with modern amenities and spa facilities"
    },
    {
      id: "2",
      image: "https://images.unsplash.com/photo-1717050788940-189e308415fb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3VudGFpbiUyMHRyZWtraW5nJTIwaGltYWxheWFzfGVufDF8fHx8MTc1NzYxNjk4OHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      title: "Nainital Trek Package",
      location: "Nainital, Uttarakhand",
      price: "₹2,500",
      rating: 4.8,
      description: "3-day guided trek through scenic mountain trails"
    },
    {
      id: "3",
      image: "https://images.unsplash.com/photo-1656828059867-3fb503eb2214?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuYWluaXRhbCUyMGxha2UlMjBzdW5zZXQlMjBtb3VudGFpbnN8ZW58MXx8fHwxNzU3NjE2OTg3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      title: "Naini Lake Retreat",
      location: "Nainital, Uttarakhand",
      price: "₹3,500",
      rating: 4.6,
      description: "Lakefront hotel with boating and mountain views"
    }
  ];



    const handleSearch = (query) => {
    setSearchQuery(query);
    setCurrentView("search");
  };

   const handleLogoClick = () => {
    if (userType === "owner") {
      setCurrentView("owner-dashboard");
    } else {
      setCurrentView("profile");
    }
  };

   const handleBooking = () => {
    setCurrentView("search");
  };

   const handleCategoryClick = () => {
    setSelectedCategory(category);
    setSearchQuery("");
    setCurrentView("search");
  };


const handleViewDetails = (id, type = "hotel") => {
  const view = `${type}-details`;
  if (AppViews.includes(view)) {
    setSelectedItemId(id);
    setSelectedDetailType(type);
    setCurrentView(view);
  } else {
    console.warn(`Invalid view type: ${view}`);
  }
};

   
    return(
        <>
            <div className="min-h-screen  bg-gray-50">
                    <Header 
                    isLoggedIn={isLoggedIn} 
                    onSearch={handleSearch} 
                    userName={userName}
                    onLogoClick={handleLogoClick}
                    onMenuToggle={() => setShowMobileMenu(!showMobileMenu)}
                    showMobileMenu={showMobileMenu}
                    />
                    
                    {/* Mobile Menu Overlay */}
                    {showMobileMenu && (
                    <div className="fixed inset-0 z-40 bg-black bg-opacity-50 md:hidden">
                        <div className="fixed right-0 top-0 h-full w-80 bg-white shadow-xl transform transition-transform duration-300 ease-in-out">
                        <div className="p-6 border-b">
                            <div className="flex items-center justify-between">
                            <h2 className="text-xl font-semibold">Menu</h2>
                            <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => setShowMobileMenu(false)}
                            >
                                <X className="w-5 h-5" />
                            </Button>
                            </div>
                        </div>
                        <div className="p-6 space-y-4">
                            <Button 
                            variant="ghost" 
                            className="w-full justify-start" 
                            onClick={() => {
                                setCurrentView("profile");
                                setShowMobileMenu(false);
                            }}
                            >
                            <User className="w-4 h-4 mr-2" />
                            My Profile
                            </Button>
                            <Button 
                            variant="ghost" 
                            className="w-full justify-start"
                            onClick={() => {
                                setShowAIChat(true);
                                setShowMobileMenu(false);
                            }}
                            >
                            <MessageCircle className="w-4 h-4 mr-2" />
                            Ask AI Assistant
                            </Button>
                            <Button 
                            variant="ghost" 
                            className="w-full justify-start"
                            onClick={() => {
                                handleExploreMore("Nainital");
                                setShowMobileMenu(false);
                            }}
                            >
                            <Navigation className="w-4 h-4 mr-2" />
                            Explore Map
                            </Button>
                        </div>
                        </div>
                    </div>

                        
                        )
                      } 
            

                <main className="container mx-auto px-4 py-8 space-y-12">
                    {/* Hero Carousel */}
                    <HeroCarousel onBooking={handleBooking} />

                        {/* Categories */}
                    <section>
                    <h2 className="text-3xl font-bold text-center mb-8">
                        Explore Nainital
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-4">
                        {categories.map((category) => (
                        <CategoryCard
                            key={category.title}
                            icon={category.icon}
                            title={category.title}
                            description={category.description}
                            onClick={() =>
                            handleCategoryClick(category.title)
                            }
                        />
                        ))}
                    </div>
                    </section>


                    {/* Enhanced Banners */}
                    <section className="grid md:grid-cols-2 gap-6">
                    <Card className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow" onClick={() => handleExploreMore("Nainital")}>
                        <div className="relative h-48">
                        <div 
                            className="absolute inset-0 bg-cover bg-center"
                            style={{
                            backgroundImage: `url('https://images.unsplash.com/photo-1656828059867-3fb503eb2214?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuYWluaXRhbCUyMGxha2UlMjBzdW5zZXQlMjBtb3VudGFpbnN8ZW58MXx8fHwxNzU3NjE2OTg3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral')`
                            }}
                        />
                        <div className="absolute inset-0" />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="text-center text-white">
                            <h3 className="text-2xl font-bold mb-2">Explore Nainital</h3>
                            <p className="mb-4">Discover the Queen of Hills</p>
                            <Button variant="secondary">
                                <Navigation className="w-4 h-4 mr-2" />
                                View Map
                            </Button>
                            </div>
                        </div>
                        </div>
                    </Card>

                    <Card className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow" onClick={() => handleExploreMore("Lakes")}>
                        <div className="relative h-48">
                        <div 
                            className="absolute inset-0 bg-cover bg-center"
                            style={{
                            backgroundImage: `url('https://images.unsplash.com/photo-1683973200791-47539048cf63?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiaGltdGFsJTIwbGFrZSUyMHV0dGFyYWtoYW5kfGVufDF8fHx8MTc1NzYxNjk4OHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral')`
                            }}
                        />
                        <div className="absolute inset-0" />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="text-center text-white">
                            <h3 className="text-2xl font-bold mb-2">Explore Lakes</h3>
                            <p className="mb-4">Bhimtal, Sukhatal & More</p>
                            <Button variant="secondary">
                                <Navigation className="w-4 h-4 mr-2" />
                                View Map
                            </Button>
                            </div>
                        </div>
                        </div>
                    </Card>
                    </section>


                    {/* Featured Section */}
                    <section>
                    <h2 className="text-3xl font-bold text-center mb-8">Top Picks in Nainital</h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {featuredPlaces.map((place) => (
                        <FeaturedCard
                            key={place.id}
                            {...place}
                            onViewDetails={handleViewDetails}
                        />
                        ))}
                    </div>
                    </section>

                    {/* About Section */}
                    <section className="bg-white rounded-lg p-8 text-center">
                    <h2 className="text-3xl font-bold mb-4">Why Choose NainiExplore?</h2>
                    <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                        Your local Uttarakhand guide, covering Nainital to remote hills. We provide 
                        real-time local guide availability, detailed trekking paths with maps, and 
                        insider tips you won't find on Google. All-in-one search without leaving our site.
                    </p>
                    </section>

                </main>
                
                <footer className="bg-gray-900 text-white py-12">
                    <div className="container mx-auto px-4">
                    <div className="grid md:grid-cols-4 gap-8">
                        <div>
                        <h3 className="text-xl font-bold mb-4">NainiExplore</h3>
                        <p className="text-gray-400">
                            Your gateway to exploring the beautiful lakes and mountains of Uttarakhand.
                        </p>
                        </div>
                        <div>
                        <h4 className="font-semibold mb-4">Quick Links</h4>
                        <ul className="space-y-2 text-gray-400">
                            <li>About Us</li>
                            <li>Contact</li>
                            <li>Privacy Policy</li>
                            <li>Terms of Service</li>
                        </ul>
                        </div>
                        <div>
                        <h4 className="font-semibold mb-4">Destinations</h4>
                        <ul className="space-y-2 text-gray-400">
                            <li>Nainital</li>
                            <li>Bhimtal</li>
                            <li>Sukhatal</li>
                            <li>Naukuchiatal</li>
                        </ul>
                        </div>
                        <div>
                        <h4 className="font-semibold mb-4">Contact Us</h4>
                        <div className="space-y-2 text-gray-400">
                            <div className="flex items-center space-x-2">
                            <Phone className="w-4 h-4" />
                            <span>+91 9876543210</span>
                            </div>
                            <div className="flex items-center space-x-2">
                            <Mail className="w-4 h-4" />
                            <span>info@nainiexplore.com</span>
                            </div>
                        </div>
                        </div>
                    </div>
                    <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
                        <p>&copy; 2024 NainiExplore. All rights reserved.</p>
                    </div>
                    </div>
                </footer>
            </div>
        </>
    )
}