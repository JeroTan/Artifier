//Components
import Home from "./Pages/Home"
import Login from "./Pages/Login"
import Signup from "./Pages/Signup"

//Utilities
import Gatekeeper from "./Gatekeeper"

//Hooks
import { BrowserRouter, Routes, Route } from "react-router-dom"


export default()=>{
    return <BrowserRouter>
        <Routes>
            
            <Route path="/*" element={ 
                <Gatekeeper type="needAuthentication">
                    <Home />
                </Gatekeeper>
            } />

            <Route path="/login" element={
                <Gatekeeper type="noAuthentication">
                    <Login />
                </Gatekeeper>
            } />

            <Route path="/signup" element={
                <Gatekeeper type="noAuthentication">
                    <Signup />
                </Gatekeeper>
            } />

        </Routes>
    </BrowserRouter>
}