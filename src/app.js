import React from "react";
import ReactDOM from "react-dom/client"
import { BrowserRouter, Routes, Route } from "react-router-dom";
import GlobalProvider from "./component/GlobalContext"
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./component/Signup";


function App(){

    return(
        <>
            <GlobalProvider>
                <BrowserRouter>
                    <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                    </Routes>
                </BrowserRouter>
            </GlobalProvider>
        </>
    )
}

ReactDOM.createRoot(document.getElementById('root')).render(<App></App>)