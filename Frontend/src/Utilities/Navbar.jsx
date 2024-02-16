// HOOKS
import { Link } from "react-router-dom";
import { useMemo } from "react";

//Components
import logo from "../Images/logo.svg";
import { randomizer } from "../Helper/Math";
import Icon from "./Icon";


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
                    <form className="d-flex me-auto" role="search">
                        <input className="form-control me-2" type="search" placeholder={RandSearchPlaceholder} aria-label="Search" />
                        <button className="btn btn-primary d-flex" type="submit"><Icon name="search" inClass={" my-fill-light"} outClass={"my-w-5 my-h-5"} /></button>
                    </form>
                    <ul className="navbar-nav mb-2 mb-lg-0">
                        <li className="nav-item">
                            <a className="nav-link active" aria-current="page" href="#">Home</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="#">Link</a>
                        </li>
                        <li className="nav-item dropdown">
                        <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                            Dropdown
                        </a>
                        <ul className="dropdown-menu">
                            <li><a className="dropdown-item" href="#">Action</a></li>
                            <li><a className="dropdown-item" href="#">Another action</a></li>
                            <li><hr className="dropdown-divider" /></li>
                            <li><a className="dropdown-item" href="#">Something else here</a></li>
                        </ul>
                        </li>
                        <li className="nav-item">
                        <a className="nav-link disabled" aria-disabled="true">Disabled</a>
                        </li>
                    </ul>
                    
                </div>

            </div>
        </nav>
    </>
}