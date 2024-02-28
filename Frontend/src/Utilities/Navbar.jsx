// HOOKS
import { Link, useNavigate } from "react-router-dom";
import { useMemo, useContext, useCallback } from "react";

//Components
import logo from "../Images/logo.svg";
import { randomizer } from "../Helper/Math";
import Icon from "./Icon";
import { Gbl_Settings } from "../GlobalSettings";
import { isLogin } from "../Helper/Validation";
import { ApiTokenReset } from "../Helper/Api";


export default()=>{
    const RandSearchPlaceholder = useMemo(()=>{
        const text = [
            "Sci-fi",
            "Pokemon",
            "Ganyu",
            "Sparkle",
            "Lumine",
            "Suisei",
            "Minato Aqua",
            "Gojo Saturo",
            "Tanjiro Kamado",
        ];
        return text[randomizer(0, text.length)] + ". . .";
    }, []);

    //Helper
    const navigation = useNavigate();

    //>Global
    const [Broadcast, Upcast] = useContext(Gbl_Settings);
    const changeTheme = useCallback(()=>{
        Upcast({run: 'change-theme'});
    }, []);

    //Components
    const LogoutButton = useMemo(()=>{
        if(!isLogin())
            return "";

        return <>
            <li className="nav-item">
                <a className="nav-link" href="#" onClick={()=>ApiTokenReset(navigation)}>Logout</a>
            </li>
        </>
    }, [isLogin()]);
    const AddImageButton = useMemo(()=>{
        if(!isLogin())
            return "";
        return <>
            <li className="nav-item">
                <button type="button" className="btn btn-outline-primary rounded-pill d-flex align-items-center gap-1 me-2" onClick={()=>navigation('/add_image')}> 
                    <Icon name="plus" inClass="my-fill-primary" outClass="my-w-5 my-h-5" /> Add Image
                </button>
            </li>
        </>
    }, [isLogin()])

    return <>
        <nav className="navbar navbar-expand-lg bg-body-secondary shadow-sm">
            <div className="container-fluid">


                <Link className="navbar-brand" to="/">
                    <img src={logo} alt="Logo" width="30" height="30" className="d-inline-block align-text-top me-2" />
                    <span>Artifier</span>
                </Link>

                {/* This is For Navigation Burger */}
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navLinks" aria-controls="navLinks" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>

                {/* The content of navbar that will be responsive */}
                <div className="collapse navbar-collapse" id="navLinks">
                    <form className="d-flex me-auto mt-lg-0 mb-lg-0 mt-4 mb-3" role="search">
                        <input className="form-control me-2" type="search" placeholder={RandSearchPlaceholder} aria-label="Search" />
                        <button className="btn btn-primary d-flex" type="submit"><Icon name="search" inClass={" my-fill-light"} outClass={"my-w-5 my-h-5"} /></button>
                    </form>
                    
                    <ul className="navbar-nav mb-2 mb-lg-0">

                        {AddImageButton}

                        <li className="nav-item nav-link">
                            <div className="form-check form-switch ">
                                <input className="form-check-input" type="checkbox" role="switch" id="toggleThemeMode" checked={Broadcast.theme == 'dark'} onChange={changeTheme}/>
                                <label className="form-check-label" htmlFor="toggleThemeMode">{Broadcast.theme == 'dark'?"Dark":"Light"} Mode</label>
                            </div>
                        </li>
                        
                        <li className="nav-item">
                            <Link className="nav-link" to="/settings">Settings</Link>
                        </li>
                        {LogoutButton}
                        
                    </ul>
                    
                </div>

            </div>
        </nav>
    </>
}