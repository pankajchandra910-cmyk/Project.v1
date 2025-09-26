import Header from "./Header";
import HeroCarousel from "./HeroCarousel";
import CategoryCard from "./CategoryCard";
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

    const [currentView, setCurrentView] = useState("login") // instead of useState<AppView>
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");
    const [userName] = useState("Priya Sharma");
    const [showMobileMenu, setShowMobileMenu] = useState(false);


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
 

    return(
        <>
            <div className="min-h-0  bg-gray-50">
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
            </div>

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
                        backgroundImage: `url('src/utils/Card1.jpg')`
                        }}
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-40" />
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
                        backgroundImage: `url('src/utils/Card2.jpg')`
                        }}
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-40" />
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

            </main>
        </>
    )
}