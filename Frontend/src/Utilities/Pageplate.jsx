//Utilities
import { useMemo, useRef } from "react";

//Components
import Navbar from "./Navbar";
import Footer from "./Footer";



export default (Option)=>{
    //Struct
    const Clean = Option.clean ?? undefined;
    const Container = Option.container ?? undefined;
    const Content = Option.children ?? <></>;
    const BodyColor = Option.bodyColor ?? "bg-body";
    const ClassName = useMemo(()=>{
        return [
            ( Container ? (Container === true ? "container" : Container) : "" ),
        ];
    }, [Container]);

    return <main>
        {Clean ? <></> : <Navbar/>}
        <div className={ ClassName.join(" ") } >
            {Content}
        </div>
        {Clean ? <></> : <Footer/>}
    </main>
}