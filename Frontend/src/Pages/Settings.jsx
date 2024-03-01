import { useCallback, useContext, useEffect, useMemo, useReducer, useRef, useState } from "react";
import { Gbl_Settings } from "../GlobalSettings";
import Pageplate from "../Utilities/Pageplate"
import { ApiGetYourInfo, ApiUpdateInfo, GetPublicAsset } from "../Helper/Api";
import Icon from "../Utilities/Icon";
import { TextLoading } from "../Helper/Placholder";

//Asset

const lightPreview = "profileSample_light.jpg";
const darkPreview = "profileSample_dark.jpg";

export default ()=>{
    //Global
    //>Global
    const [Broadcast, Upcast] = useContext(Gbl_Settings);
    const Theme = Broadcast.theme;

    //States
    const [c_fetching, s_fetching] = useState(false);
    const [ThisCast, ThisUpcast] = useReducer((state, action)=>{
        const refState = structuredClone(state);
        switch(action.run){
            case "updateUsername":
                if(refState.e_username)
                    refState.e_username = undefined;
                refState.username = action.val;
            break;
            case "updateNewPassword":
                if(refState.e_newPassword)
                    refState.e_newPassword = undefined;
                refState.newPassword = action.val;
            break;
            case "updateConfirmPassword":
                if(refState.e_confirmPassword)
                    refState.e_confirmPassword = undefined;
                refState.confirmPassword = action.val;
            break;
            case "updatePassword":
                if(refState.e_password)
                    refState.e_password = undefined;
                refState.password = action.val;
            break;
            case "addError":
                refState["e_"+action.field] = action.val ? action.val : undefined;
            break;
            case "openEditUsername":
                refState.editUsername = true;
                refState.editPassword = false;
                refState.username = refState.fetchUsername;
            break;
            case "openEditPassword":
                refState.editPassword = true;
                refState.editUsername = false;
            break;
            case "closeEditUsername":
                refState.editUsername = false;
                refState.username = "";
            break;
            case "closeEditPassword":
                refState.editPassword = false;
                refState.password = "";
                refState.newPassword = "";
                refState.confirmPassword = "";
            break;
            case "fetchedUsername":
                refState.fetchUsername = action.val;
            break;
            
        }
        return refState;
    },{
        username: "",
        password: "",
        newPassword: "",
        confirmPassword: "",
        e_username: undefined,
        e_password: undefined,
        e_newPassword: undefined,
        e_confirmPassword: undefined,
        editPassword: false,
        editUsername: false,
        fetchUsername: "",
    });

    //DOMBinding
    const usernameRef = useRef();
    const passwordRef = useRef();
    const previewImgSrc = useMemo(()=>{
        if(Theme == "dark")
            return GetPublicAsset(darkPreview);
        return GetPublicAsset(lightPreview);
    }, [Theme]);
    
    //Functions
    const changeTheme = useCallback(()=>{//Use To change the theme
        Upcast({run: 'changeTheme'});
    }, []);
    const fetchInfo = useCallback(()=>{//Function that will fetch the data to the reducer container
        s_fetching(true);
        ApiGetYourInfo().then(d=>{
            ThisUpcast({run:"updateUsername", val:d.data.username});
            ThisUpcast({run:"fetchedUsername", val:d.data.username});
            s_fetching(false);
        });
    }, []);
    const changeUsername = useCallback(()=>{
        s_fetching(true);
        ApiUpdateInfo({
            username:ThisCast.username,
            password: ThisCast.password
        }).then(d=>{
            s_fetching(false);

            if(d.status == 200){
                ThisUpcast({run:"closeEditUsername"});
            }else{
                if(d.status == 422){
                    const errors = d.data.errors;
                    Object.keys(errors).forEach((x)=>{
                       ThisUpcast({run:"addError", val:errors[x], field:x});
                    });
                }
            }
        });
    }, [ThisCast.username, ThisCast.password]);
    const changePassword = useCallback(()=>{
        s_fetching(true);
        ApiUpdateInfo({
            password: ThisCast.password,
            newPassword: ThisCast.newPassword,
            confirmPassword: ThisCast.confirmPassword,
        }).then(d=>{
            s_fetching(false);

            if(d.status == 200){
                ThisUpcast({run:"closeEditPassword"});
            }
            else{
                if(d.status == 422){
                    const errors = d.data.errors;
                    Object.keys(errors).forEach((x)=>{
                       ThisUpcast({run:"addError", val:errors[x], field:x});
                    });
                }
            }
        });
    }, [ThisCast.password, ThisCast.newPassword, ThisCast.confirmPassword]);

    //Effects
    useEffect(()=>{//Initial Load of Info
        fetchInfo();
    }, []);


    return <Pageplate container={true}>
        <main className="container my-4">
            <div className="card overflow-hidden">


                <div className="position-relative w-100 bg-primary overflow-hidden" style={{aspectRatio: 4/1}}>
                    <div className="position-relative w-100 h-100 overflow-hidden">
                        <img src={previewImgSrc} className="position-relative w-100 h-100  object-fit-cover" alt={`picturePreview`}></img>
                    </div>
                    <div className="position-absolute bottom-0 end-0">
                        <h1 className="m-2">{ThisCast.fetchUsername}</h1>
                    </div>
                </div>
                
                {/** FORM */}
                <div className="card-body">
                    <h4 className="card-title mb-4">Credentials</h4>
                    {c_fetching? <>
                        <TextLoading title="Processing" subtitle="Fetching your information." />
                    </>:<>
                        <div className="mb-4">
                            {ThisCast.editUsername ? <>
                                <label htmlFor="username" className="form-label">Username</label>
                                <input value={ThisCast.username} id="username" type="text" className="form-control mb-2" 
                                    placeholder="Username Gone :-(" 
                                    aria-label="User's Username"  
                                    onInput={(e)=>ThisUpcast({run:"updateUsername", val:e.target.value})}
                                />
                                <small className="text-danger d-block mb-2">{ThisCast.e_username}</small>

                                <label htmlFor="password" className="form-label">Password</label>
                                <input value={ThisCast.password} id="password" type="password" className="form-control mb-2" 
                                    placeholder="Type your current password" 
                                    aria-label="User's Password"  
                                    onInput={(e)=>ThisUpcast({run:"updatePassword", val:e.target.value})}
                                />
                                <small className="text-danger">{ThisCast.e_password}</small>

                                <div className="d-flex flex-wrap gap-2">
                                    <small className="text-success my-pointer" onClick={changeUsername} >Save</small> 
                                    <small className="text-danger my-pointer" onClick={()=>ThisUpcast({run:"closeEditUsername"})} >Cancel</small>
                                </div>
                                
                            </>: <>
                                <button className="btn btn-outline-secondary d-flex gap-2" type="button" onClick={()=>ThisUpcast({run:"openEditUsername"})} >
                                    Update Username<Icon name="edit" inClass="my-fill-secondary" outClass="my-w-5 my-h-5" />
                                </button>
                            </>

                            }
                        </div>
                        <div className="mb-4">
                            {ThisCast.editPassword ? <>
                                <label htmlFor="newPassword" className="form-label">New Password</label>
                                <input value={ThisCast.newPassword} id="newPassword" type="password" className="form-control mb-2" 
                                    placeholder="Type Your New Password" 
                                    onInput={(e)=>ThisUpcast({run:"updateNewPassword", val:e.target.value})}
                                />
                                <small className="text-danger d-block mb-2">{ThisCast.e_newPassword}</small>

                                <label htmlFor="confirmPassword" className="form-label">Confirm New Password</label>
                                <input value={ThisCast.confirmPassword} id="confirmPassword" type="password" className="form-control mb-2" 
                                    placeholder="Re-Type Your New Password" 
                                    onInput={(e)=>ThisUpcast({run:"updateConfirmPassword", val:e.target.value})}
                                />
                                <small className="text-danger d-block mb-2">{ThisCast.e_confirmPassword}</small>

                                <label htmlFor="password2" className="form-label">Password</label>
                                <input value={ThisCast.password} id="password2" type="password" className="form-control mb-2" 
                                    placeholder="Type your current password" 
                                    onInput={(e)=>ThisUpcast({run:"updatePassword", val:e.target.value})}
                                />
                                <small className="text-danger d-block mb-2">{ThisCast.e_password}</small>

                                <div className="d-flex flex-wrap gap-2">
                                    <small className="text-success my-pointer" onClick={changePassword}>save</small> 
                                    <small className="text-danger my-pointer" onClick={()=>ThisUpcast({run:"closeEditPassword"})} >cancel</small>
                                </div>
                            </>:<>
                                <button className="btn btn-outline-secondary d-flex gap-2" type="button" onClick={()=>ThisUpcast({run:"openEditPassword"})} >
                                    Update Password<Icon name="edit" inClass="my-fill-secondary" outClass="my-w-5 my-h-5" />
                                </button>
                            </>}
                        </div>
                    </>}

                    
                        
                </div>


            </div>  
        </main>
    </Pageplate>
}