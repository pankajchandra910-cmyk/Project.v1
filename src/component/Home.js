import Header from "./Header";
import Slider from "./Slider";
import FacilityCard from "./FacilityCard";
import DiscoverCard from "./DiscoverCard";
import PickCard from "./PickCard";
import ReasonCard from "./ReasonCard";
import Footer from "./Footer";
import { useState } from "react";



export default function Home(){


    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userName] = useState("Priya Sharma");
    const [showMobileMenu, setShowMobileMenu] = useState(false);
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

    return(
        <>
            <div className="min-h-screen bg-gray-50">
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
    </>
    )
}