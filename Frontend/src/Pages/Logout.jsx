import { useEffect } from "react";
import { ApiTokenReset } from "../Helper/Api";
import { useNavigate } from "react-router-dom";

export default ()=>{
    //Helper
    const navigation = useNavigate();
    
    ApiTokenReset();

    useEffect(()=>{
        let delaytion = setInterval(()=>{
            console.log("here");
            if(!localStorage.getItem('token')){
                navigation('/login');
                clearInterval(delaytion);
            }
        }, 100);
    }, [localStorage.getItem('token')]);

    return <>
        <main className="d-flex justify-content-center">
            <div className="text-center">
                <h3 className="mb-1">Logging Out Please Wait</h3>
            </div>
        </main>
    </>
}