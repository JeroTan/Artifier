//Components
import Home from "./Pages/Home";
import Login from "./Pages/Login";
import Signup from "./Pages/Signup";
import { AddImage } from "./Pages/Gallery/Add";
import { UpdateImage } from "./Pages/Gallery/Update";

//Utilities
import Gatekeeper from "./Gatekeeper"

//Hooks
import { HashRouter, BrowserRouter, Routes, Route } from "react-router-dom"
import View from "./Pages/Gallery/View";



export default()=>{
    return <HashRouter>
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

            <Route path="/image/" element={ 
                <Gatekeeper type="needAuthentication">
                    <AddImage />
                </Gatekeeper>
            } />

            <Route path="/add_image" element={ 
                <Gatekeeper type="needAuthentication">
                    <AddImage />
                </Gatekeeper>
            } />

            <Route path="/view_image/:id" element={
                <Gatekeeper type="needAuthentication">
                    <View />
                </Gatekeeper>
            }/>

            <Route path="/update_image/" element={ 
                <Gatekeeper type="needAuthentication">
                    <UpdateImage />
                </Gatekeeper>
            } />

        </Routes>
    </HashRouter>
}