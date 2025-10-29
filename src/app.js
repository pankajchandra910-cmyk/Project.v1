import React, { useContext } from "react"; // Import useContext
import ReactDOM from "react-dom/client"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"; // Import Navigate
import GlobalProvider, { GlobalContext } from "./component/GlobalContext" // Import GlobalContext
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import SearchView from "./pages/SearchView";
import ProfileView from "./pages/ProfileView";
import  OwnerDashboard  from "./pages/OwnerDashboard";
import  ListingDetail  from './component/ListingDetail';
import  LocationDetailsPage  from './pages/LocationDetailsPage';
import PlaceDetailsPage from "./pages/PlaceDetailsPage";
import MapViewPage from "./pages/MapViewPage";
import PopularDetailsPage from './pages/PopularDetailsPage';
import BookingPage from './pages/BookingPage';
import TrekDetailsPage from './pages/TrekDetailsPage';
import About from "./pages/About";
import Contact from "./pages/Contact";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import ComingSoonPage from './pages/ComingSoonPage'; 
import { Toaster } from "sonner"; // For toasts
import { Loader2 } from "lucide-react";

// New: ProtectedRoute component
const ProtectedRoute = ({ children, allowedRoles = [] }) => {
    const { isLoggedIn, loadingUser, userType } = useContext(GlobalContext);

    if (loadingUser) {
        // Optionally render a loading spinner or skeleton
        return (
            <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-50 to-green-50">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
        );
    }

    if (!isLoggedIn) {
        return <Navigate to="/login" replace />;
    }

    // Check if the user's type is among the allowed roles
    if (allowedRoles.length > 0 && !allowedRoles.includes(userType)) {
        // If not authorized, redirect to home or a specific unauthorized page
        return <Navigate to="/" replace />; // Or /unauthorized
    }

    return children;
};

function App(){

    return(
        <>
            <GlobalProvider>
                <BrowserRouter >
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/about" element={<About />} />
                        <Route path="/contact" element={<Contact />} />
                        <Route path="/privacy" element={<PrivacyPolicy />} />
                        <Route path="/terms" element={<TermsOfService />} />
                        <Route path="/login" element={<Login/>} />
                        <Route path="/signup" element={<Signup/>} />
                        <Route path="/search" element={<SearchView/>} />

                        {/* Protected Routes */}
                        <Route path="/profile" element={
                            
                                <ProfileView/>       
                        } />
                        <Route path="/owner-dashboard/:profession" element={
                            <ProtectedRoute allowedRoles={[ "owner"]}>
                                <OwnerDashboard />
                            </ProtectedRoute>
                        } />
                        <Route path="/listings/:id" element={
                             <ProtectedRoute allowedRoles={[ "owner"]}>
                                <ListingDetail />
                             </ProtectedRoute>
                           
                        } />
                        <Route path="/location-details/:locationId" element={
                            <ProtectedRoute allowedRoles={["user", "owner"]}>
                                <LocationDetailsPage />
                            </ProtectedRoute>
                            
                        } />
                        <Route path="/place-details/:placeId" element={
                            <ProtectedRoute allowedRoles={["user", "owner"]}>
                                <PlaceDetailsPage />
                            </ProtectedRoute>
                            
                        } />
                        <Route path="/trek-details/:trekId" element={
                            <ProtectedRoute allowedRoles={["user", "owner"]}>
                                <TrekDetailsPage />
                            </ProtectedRoute>
                            
                        } />
                        <Route path="/map-view/:focusId" element={
                            <ProtectedRoute allowedRoles={["user", "owner"]}>
                                <MapViewPage/>
                            </ProtectedRoute>
                            
                        } />
                        <Route path="/popular-details/:popularId" element={
                            <ProtectedRoute allowedRoles={["user", "owner"]}>
                                <PopularDetailsPage/>
                            </ProtectedRoute>
                        } />
                        <Route path="/book-item/:itemId" element={
                            <ProtectedRoute allowedRoles={["user", "owner"]}>
                                <ComingSoonPage />
                            </ProtectedRoute>
                            
                        } />

                    </Routes>
                </BrowserRouter>
                <Toaster /> {/* Add Sonner Toaster */}
            </GlobalProvider>
        </>
    )
}

ReactDOM.createRoot(document.getElementById('root')).render(<App></App>)