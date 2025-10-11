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
import  NainitalDetailsPage  from './pages/NainitalDetailsPage';
import PlaceDetailsPage from "./pages/PlaceDetailsPage";


function App(){

    return(
        <>
            <GlobalProvider>
                <BrowserRouter>
                    <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/search" element={<SearchView/>} />
                    <Route path="/profile" element={<ProfileView/>} />
                    <Route path="/owner-dashboard/:profession" element={<OwnerDashboard />} />
                    <Route path="/listings/:id" element={<ListingDetail />} />
                    <Route path="/location-details/:locationId" element={<NainitalDetailsPage />} />
                    {/* <Route path="/listings/:id/edit" element={<ListingEdit />} /> */}
                    <Route path="/place-details/:id" element={<PlaceDetailsPage />} />
                    </Routes>
                </BrowserRouter>
            </GlobalProvider>
        </>
    )
}

ReactDOM.createRoot(document.getElementById('root')).render(<App></App>)