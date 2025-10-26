import React from "react";
import ReactDOM from "react-dom/client"
import { BrowserRouter, Routes, Route } from "react-router-dom";
import GlobalProvider from "./component/GlobalContext"
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./component/Signup";
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
import About from "./pages/About"; // Assuming you put them in the pages folder
import Contact from "./pages/Contact";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
function App(){

    return(
        <>
            <GlobalProvider>
                <BrowserRouter>
                    <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/privacy" element={<PrivacyPolicy />} />
                    <Route path="/terms" element={<TermsOfService />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/search" element={<SearchView/>} />
                    <Route path="/profile" element={<ProfileView/>} />
                    <Route path="/owner-dashboard/:profession" element={<OwnerDashboard />} />
                    <Route path="/listings/:id" element={<ListingDetail />} />
                    <Route path="/location-details/:locationId" element={<LocationDetailsPage />} />
                    {/* <Route path="/listings/:id/edit" element={<ListingEdit />} /> */}
                    <Route path="/place-details/:placeId" element={<PlaceDetailsPage />} />
                    <Route path="/trek-details/:trekId" element={<TrekDetailsPage />} />
                    <Route path="/map-view/:focusId" element={<MapViewPage/>} /> 
                    <Route path="/popular-details/:popularId" element={<PopularDetailsPage/>} /> 
                    <Route path="/book-item/:itemId" element={<BookingPage />} />
                    
                    </Routes>
                </BrowserRouter>
            </GlobalProvider>
        </>
    )
}

ReactDOM.createRoot(document.getElementById('root')).render(<App></App>)