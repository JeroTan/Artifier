//Utilities
import { useContext, useMemo, useRef } from "react";

//Components
import Navbar from "./Navbar";
import Footer from "./Footer";
import { Gbl_settings } from "../GlobalSettings";



export default (Option)=>{
    //Struct
    const Clean = Option.clean ?? undefined;
    const Container = Option.container ?? undefined;
    const Content = Option.children ?? <></>;
    const ClassName = useMemo(()=>{
        return [
            ( Container ? (Container === true ? "container-xxl" : Container) : "" ),
            'h-100 align-self-stretch grow-1 min-vh-100',
        ];
    }, [Container]);
    
    //Global
    const [Broadcast, Upcast] = useContext(Gbl_settings);
    const {theme} = Broadcast;

    return <main className="d-flex flex-column bg-body text-body" data-bs-theme={theme}>
        {Clean ? <></> : <Navbar/>}
        <div className={ ClassName.join(" ") }>
            {Content}
        </div>
        {Clean ? <></> : <Footer/>}
    </main>
}