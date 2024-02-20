//HOOKS
import { useEffect, useState, useCallback, useMemo, useRef, useReducer, useContext } from "react";
import axios from 'axios';
import { useNavigate } from "react-router-dom";

// Utilities
import Pageplate from "../Utilities/Pageplate";
import { Gbl_Settings } from "../GlobalSettings";
import { Link } from "react-router-dom";
import { ApiLink, ApiLogin, ApiSetToken } from "../Helper/Api";
import { bootstrapValidity, checkIfError, checkLoginField } from "../Helper/Validation";
import { Gbl_Modal } from "../Modal";
import { popLoginError, popLoginSuccess, popLoginVerifying } from "../Helper/PopModal";

export default ()=>{
    //>Global
    const [Broadcast, Upcast] = useContext(Gbl_Settings);
    const changeTheme = useCallback(()=>{
        Upcast({run: 'change-theme'});
    }, []);
    const [ModalCast, ModalUpcast] = useContext(Gbl_Modal);
    const navigation = useNavigate();

    
    return <Pageplate clean={true} container={true}>
        <main className="d-flex justify-content-center flex-wrap align-items-start">
            

            <div className="w-100 d-flex py-3">
                <div className="form-check form-switch ms-auto">
                    <input className="form-check-input" type="checkbox" role="switch" id="toggleThemeMode" checked={Broadcast.theme == 'dark'} onChange={changeTheme}/>
                    <label className="form-check-label" htmlFor="toggleThemeMode">{Broadcast.theme == 'dark'?"Dark":"Light"} Mode</label>
                </div>
            </div>


            <div className="card" style={{width:"30rem"}}>

                <div className="card-body">
                    <h5 className="card-title mb-0">Signup</h5>
                    <small className="card-subtitle text-body-secondary"> Already have an account? Click <Link className="link-opacity-50-hover" to="/login">here</Link> to log-in instead. </small>
                </div>
                {/**Adjust the Form Here */}
                <div className="card-body">
                    
                </div>

            </div>

        </main>
    </Pageplate>
}