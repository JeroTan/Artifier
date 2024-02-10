//Pages
import Home from "./Pages/Home"
import Login from "./Pages/Login"

//Hooks
import { BrowserRouter, Routes, Route } from "react-router-dom"

export default()=>{
    return <BrowserRouter>
        <Routes>
            <Route path="/*" element={<Home />} />

            <Route path="/Login" element={<Login />} />
        </Routes>
    </BrowserRouter>
}