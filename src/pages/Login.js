import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { GlobalContext } from "../component/GlobalContext";
import { LoginModal } from "../component/LoginModal";


export default function Login(){
    const navigate = useNavigate();
    const {
        isLoggedIn,
        setIsLoggedIn,
        language,
        setLanguage,
        userType,
        setUserType,
        profession, // We will use this profession from context to navigate
        setProfession,
    } = useContext(GlobalContext);

    const handleLogin = (type, prof) => {
        setIsLoggedIn(true);
        setUserType(type);
        if (prof) setProfession(prof); // Make sure profession is set in context here

        if (type === 'owner') {
            // Navigate to owner-dashboard with profession as a URL parameter
            navigate(`/owner-dashboard/${prof}`); // IMPORTANT CHANGE HERE
        } else {
            navigate("/");
        }
    };

    return(
        <div className="min-h-screen bg-linear-to-br from-blue-50 to-green-50">
            <div className="relative min-h-screen flex items-center justify-center">
                <div
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                    style={{
                        backgroundImage: `url('https://images.unsplash.com/photo-1656828059867-3fb503eb2214?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuYWluaXtal%20l%20suns%20%20mountains%7C%20unsplash&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral')`
                    }}
                />
                <div className="absolute inset-0 bg-gray-900 bg-opacity-50" /> {/* Added a semi-transparent overlay */}

                <div className="relative z-10 text-center text-white space-y-6 px-4">
                    <h1 className="text-4xl md:text-6xl font-bold text-primary">NainiExplore</h1>
                    <p className="text-xl md:text-2xl opacity-90">
                        Discover Nainital & Uttarakhand – Hotels, Treks, Tours, All in One Place
                    </p>
                    <LoginModal
                        isOpen={true}
                        onClose={() => {}}
                        onLogin={handleLogin}
                        language={language}
                        onLanguageChange={setLanguage}
                        // Pass current userType and profession from GlobalContext to LoginModal
                        // This ensures the modal reflects the current state if it's already set
                        currentUserType={userType}
                        currentProfession={profession}
                    />
                </div>
            </div>
        </div>
    );
}