import React, { useCallback, useMemo } from "react";
import { useContext, useReducer } from "react";

//Loader
import 'bootstrap';
import './App.scss';

//Utilities
import Routing from "./Routing";
import {Gbl_Settings, changerValue, initialValue} from "./GlobalSettings";
import { Gbl_Modal, modalChanger, modalValue } from "./Modal";


//Insert All Global Scope Here
export default ()=>{
    
    //>useReducer
    const [globalBroadcast, globalUpcast] = useReducer(changerValue, initialValue);
    const [modalBroadcast, modalUpcast] = useReducer(modalChanger, modalValue );
    
    return  <React.StrictMode>
        <Gbl_Settings.Provider value={[globalBroadcast, globalUpcast]}>
        <Gbl_Modal.Provider value={[modalBroadcast, modalUpcast]}>
            <Routing />
        </Gbl_Modal.Provider>     
        </Gbl_Settings.Provider>          
    </React.StrictMode>
}