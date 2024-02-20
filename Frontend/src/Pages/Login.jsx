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

    //Data
    const [ v_data, e_data ] = useState({
        username: "",
        password: "",
    });
    const [v_error, e_error] = useState({
        username: undefined,
        password: undefined,
    });

    //DOM Manip
    const buttonSubmitDisabled = useMemo(()=>{
        if(checkIfError(v_error))
            return 'disabled';
        return '';
    }, [v_error]);


    //>Functions
    const submitForm = useCallback((e)=>{
        e.preventDefault();
        if(checkIfError(v_error))
            return false;

        popLoginVerifying(ModalUpcast);
        ApiLogin(v_data).then((d)=>{
            if(d.status == 200){
                popLoginSuccess(ModalUpcast);
                let timer = setInterval(()=>{
                    ApiSetToken(d, navigation);
                    ModalUpcast({run:'close'});
                    clearInterval(timer);
                }, 1000);
            }else if(d.status == 400 || d.status == 401){
                popLoginError(ModalUpcast);
            }
            
        });
    }, [v_data, v_error]);
    const upCheck = useCallback((e, type)=>{
        /**Validation and if error add the error in v_username */
        e_data(prev=>{
            prev[type] = e.target.value;
            return structuredClone(prev);
        })
        e_error(prev =>{
            prev[type] = checkLoginField(type, e.target.value);
            return structuredClone(prev);
        })
    }, []);
    

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
                <h5 className="card-title mb-0">Login</h5>
                <small className="card-subtitle text-body-secondary"> Don't have and account yet? Click <Link className="link-opacity-50-hover" to="/signup">here</Link> to sign-up. </small>
            </div>
            {/**Adjust the Form Here */}
            <div className="card-body">
                <form onSubmit={submitForm}>
                    <div className="mb-3">
                        <label htmlFor="v_username" className="form-label">Username</label>
                        <input type="text" className={`form-control ${bootstrapValidity(v_error.username)}`} aria-describedby="usernameField" onInput={(e)=>upCheck(e, "username")} placeholder="NarutoKawazaki. . ." />
                        <small className="text-danger">{v_error.username}</small>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="v_password" className="form-label">Password</label>
                        <input type="password" className={`form-control ${bootstrapValidity(v_error.password)}`} aria-describedby="passwordField" onInput={(e)=>upCheck(e, "password")} placeholder="My$ecr&tP@ssW0rd. . ." />
                        <div className="text-danger">{v_error.password}</div>
                    </div>
                    <button type="submit" className={`btn btn-primary ${buttonSubmitDisabled}`}>Login</button>
                </form>
            </div>

        </div>


    </main>
    
</Pageplate>
}