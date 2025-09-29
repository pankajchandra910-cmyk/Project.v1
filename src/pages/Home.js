import Header from "../component/Header";
import HeroCarousel from "../component/HeroCarousel";
import CategoryCard from "../component/CategoryCard";
import FeaturedCard from "../component/FeaturedCard";
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
import { Card, CardContent, CardHeader, CardTitle } from "../component/Card";
import { Button } from "../component/button";
import { useState ,useContext }  from "react";
import { useNavigate } from "react-router-dom";
import { GlobalContext } from "../component/GlobalContext";
import  LocationCarousel from "../component/LocationCarousel";



export default function Home(){



     const navigate = useNavigate();

  
    const {
    currentView,
    setCurrentView,
    isLoggedIn,
    setIsLoggedIn,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    userName,
    showMobileMenu,
    setShowMobileMenu,
    selectedItemId,
    setSelectedItemId,
    selectedDetailType,
    setSelectedDetailType,
    focusArea,
     setFocusArea
  } = useContext(GlobalContext);

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
      image: "https://nainitaltourism.org.in/images/places-to-visit/headers/naina-devi-temple-nainital-tourism-entry-fee-timings-holidays-reviews-header.jpg",
      title: "Naina Devi Temple",
      location: "Nainital, Uttarakhand",
      price: "Free Entry",
      rating: 4.7,
      description: "Visited by 500K+ annually—iconic spiritual destination ⭐ 4.7/5"
    },
    {
      id: "2",
      image: "https://images.unsplash.com/photo-1717050788940-189e308415fb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3VudGFpbiUyMHRyZWtraW5nJTIwaGltYWxheWFzfGVufDF8fHx8MTc1NzYxNjk4OHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      title: "China Peak",
      location: "Nainital, Uttarakhand",
      price: "₹50",
      rating: 4.8,
      description: "Top for adventure views—highest peak around Nainital ⭐ 4.8/5"
    },
    {
      id: "3",
      image: "https://images.unsplash.com/photo-1683973200791-47539048cf63?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiaGltdGFsJTIwbGFrZSUyMHV0dGFyYWtoYW5kfGVufDF8fHx8MTc1NzYxNjk4OHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      title: "Bhimtal Lake",
      location: "Bhimtal, Uttarakhand",
      price: "₹30",
      rating: 4.6,
      description: "Popular family spot—larger than Naini Lake ⭐ 4.6/5"
    },
    {
      id: "4",
      image: "https://images.unsplash.com/photo-1670555383991-ae6ad4bb39df?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHxoaWxsJTIwcmVzb3J0JTIwbW91bnRhaW4lMjB2aWV3fGVufDF8fHx8MTc1NzYxNjk4OXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      title: "Tiffin Top",
      location: "Nainital, Uttarakhand",
      price: "Free",
      rating: 4.5,
      description: "Eco-trail favorite—perfect for nature walks ⭐ 4.5/5"
    }
  ];


  const handleViewDetails = (id, type = "hotel") => {
    const routeMap = {
      hotel: `/hotel-details/${id}`,
      place: `/place-details/${id}`,
      trek: `/trek-details/${id}`,
      bike: `/bike-details/${id}`,
      cab: `/cab-details/${id}`,
      guide: `/guide-details/${id}`,
    };

    const path = routeMap[type] || "/";
    navigate(path);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    navigate("/search");
  };

  const handleLogoClick = () => {
    if (userType === "owner") {
      navigate("/owner-dashboard");
    } else {
      navigate("/profile");
    }
  };

  const handleBooking = () => {
    navigate("/search");
  };

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    setSearchQuery("");
    navigate("/search");
  };
  const handleExploreMore = (area) => {
    if (area === "Nainital") {
      navigate("/nainital-details");
    } else {
      setFocusArea(area);
      navigate("/map");
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

                    {/* Location Carousel */}
                    <LocationCarousel onLocationClick={handleExploreMore} />


                    {/* Categories */}
                    <section>
                      <h2 className="text-3xl font-bold text-center mb-8">Services</h2>
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-4">
                        {categories.map((category) => (
                          <CategoryCard
                            key={category.title}
                            icon={category.icon}
                            title={category.title}
                            description={category.description}
                            onClick={() => handleCategoryClick(category.title)}
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
                      <h2 className="text-3xl font-bold text-center mb-8">Top Popular Picks Across Hills</h2>
                      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
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
                      <h3 className="text-xl font-bold mb-4">Buddy In Hills</h3>
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
                          <span>info@buddyinhills.com</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
                    <p>&copy; 2024 Buddy In Hills. All rights reserved.</p>
                  </div>
                </div>
                </footer>
            </div>
        </>
    )
}