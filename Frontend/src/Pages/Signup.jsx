//HOOKS
import { useEffect, useState, useCallback, useMemo, useRef, useReducer, useContext } from "react";
import axios from 'axios';
import { useNavigate } from "react-router-dom";

// Utilities
import Pageplate from "../Utilities/Pageplate";
import { Gbl_Settings } from "../GlobalSettings";
import { Link } from "react-router-dom";
import { ApiLink, ApiLogin, ApiSetToken, ApiSignup } from "../Helper/Api";
import { bootstrapValidity, checkIfError, checkSignupField } from "../Helper/Validation";
import { Gbl_Modal } from "../Modal";
import { popLoginError, popLoginSuccess, popLoginVerifying, popSignupSuccess, popSignupVerifying } from "../Helper/PopModal";

export default ()=>{
    //>Global
    const [Broadcast, Upcast] = useContext(Gbl_Settings);
    const changeTheme = useCallback(()=>{
        Upcast({run: 'changeTheme'});
    }, []);
    const [ModalCast, ModalUpcast] = useContext(Gbl_Modal);
    const navigation = useNavigate();

    //Data
    const [ v_data, e_data ] = useState({
        username: "",
        password: "",
        confirmPassword: "",
    });
    const [v_error, e_error] = useState({
        username: undefined,
        password: undefined,
        confirmPassword: undefined,
    });

    //Components
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

        popSignupVerifying(ModalUpcast); //PopUpToTellThatThere
        ApiSignup(v_data).then((d)=>{
            if(d.status == 200){
                popSignupSuccess(ModalUpcast); //Show PopUp success when success
                let timer = setInterval(()=>{ //Delay for better user Experience
                    ApiSetToken(d, navigation);
                    ModalUpcast({run:'close'});
                    clearInterval(timer);
                }, 1000);
            }else if(d.status == 422){
                e_error(prev=>{
                    const sPrev = structuredClone(prev);
                    Object.keys(d.data.errors).forEach((e) => {
                        sPrev[e] = d.data.errors[e][0];
                    });
                    return sPrev
                });
                ModalUpcast({run:'close'});
            }
        });
    }, [v_data, v_error]);

    const upCheck = useCallback((e, type)=>{
        /**Validation and if error add the error in v_username */
        e_data(prev=>{
            const sPrev = structuredClone(prev);
            sPrev[type] = e.target.value;
            return sPrev;
        })
        e_error(prev =>{
            const sPrev = structuredClone(prev);
            sPrev[type] = checkSignupField(type, e.target.value, v_data);
            return sPrev;
        })
    }, [v_data]);

    
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
                    <h4 className="card-title mb-0">Signup</h4>
                    <small className="card-subtitle text-body-secondary"> Already have an account? Click <Link className="link-opacity-50-hover" to="/login">here</Link> to log-in instead. </small>
                </div>
                {/**Adjust the Form Here */}
                <div className="card-body">
                    <form onSubmit={submitForm}>
                        <div className="mb-3">
                            <label htmlFor="v_username" className="form-label">Username</label>
                            <input id="v_username" type="text" className={`form-control ${bootstrapValidity(v_error.username)}`} aria-describedby="usernameField" onInput={(e)=>upCheck(e, "username")} placeholder="NarutoKawazaki. . ." />
                            <small className="text-danger">{v_error.username}</small>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="v_password" className="form-label">Password</label>
                            <input id="v_password" type="password" className={`form-control ${bootstrapValidity(v_error.password)}`} aria-describedby="passwordField" onInput={(e)=>upCheck(e, "password")} placeholder="My$ecr&tP@ssW0rd. . ." />
                            <div className="text-danger">{v_error.password}</div>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="v_confirmPassword" className="form-label">Confirm Password</label>
                            <input id="v_confirmPassword" type="password" className={`form-control ${bootstrapValidity(v_error.confirmPassword)}`} aria-describedby="confirmPasswordField" onInput={(e)=>upCheck(e, "confirmPassword")} placeholder="My$ecr&tP@ssW0rdBUTiTYPEX2. . ." />
                            <div className="text-danger">{v_error.confirmPassword}</div>
                        </div>
                        <button type="submit" className={`btn btn-primary ${buttonSubmitDisabled}`}>Create Account</button>
                    </form>
                </div>

            </div>

        </main>
    </Pageplate>
}