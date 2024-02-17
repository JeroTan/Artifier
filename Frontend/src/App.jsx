import React, { useCallback, useMemo } from "react";
import { useContext, useReducer } from "react";

//Loader
import 'bootstrap';
import './App.scss';

//Utilities
import Routing from "./Routing";
import {Gbl_settings, changerValue, initialValue} from "./GlobalSettings";


//Insert All Global Scope Here
export default ()=>{
    
    //>useReducer
    const [broadcast, upcast] = useReducer(changerValue, initialValue);
    
    return  <React.StrictMode>
        <Gbl_settings.Provider value={[broadcast, upcast]}>
            <Routing />  
        </Gbl_settings.Provider>          
    </React.StrictMode>
}