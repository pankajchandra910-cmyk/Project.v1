import React from "react";
import ReactDOM from "react-dom/client"
import { BrowserRouter,Routes, Route } from "react-router";
import Home from "./component/Home";
import Login from "./component/Login";
import Signup from "./component/Signup";


function App(){

    return(
        <>
            <BrowserRouter>
                <Routes>
                    <Route  path="/" element={<Home/>}></Route>
                    <Route  path="/login" element={<Login/>}></Route>
                    <Route  path="/signup" element={<Signup/>}></Route>
                </Routes>
            </BrowserRouter>
        </>
    )
}

ReactDOM.createRoot(document.getElementById('root')).render(<App></App>)