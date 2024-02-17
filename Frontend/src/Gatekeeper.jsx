import { Suspense, useCallback, useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import PageLoader from "./Utilities/PageLoader";
import { ApiVerify } from "./Helper/Api";


const gatepolice = {
    needAuthentication: (helper)=>{
        const token = localStorage.getItem('token');
        if(!token){
            helper.navigation('/login');
            return false;
        }
        return true;
    },
    noAuthentication: (helper)=>{
        const token = localStorage.getItem('token');
        if(token){
            helper.navigation('/');
            return false;
        }
        return true;
    }
};

export default (option)=>{
    const Content = option.children;
    const Type = option.type;
    const [c_verifying, s_verifying] = useState(true);


    const helper = {
        navigation: useNavigate(),
    }
    useEffect(()=>{
        if( typeof Type === "array"){
            for(let i = 0; i < Type.length; i++){
                if(!gatepolice[Type[i]](helper))
                    break;
            }
            
            s_verifying(false);
        }else{
            gatepolice[Type](helper);
            s_verifying(false);
        }
        
    }, []);

    return <>
        { c_verifying ? <PageLoader /> : <>
        <Suspense fallback={<PageLoader/>}>
            {Content}
        </Suspense>
        </> }
    </>
}