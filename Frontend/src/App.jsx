import React from "react";

//Loader
import 'bootstrap';
import './App.scss';

//Utilities
import Routing from "./Routing";

//Insert All Global Scope Here
export default ()=>{

    return  <React.StrictMode>
        <Routing />    
    </React.StrictMode>
}