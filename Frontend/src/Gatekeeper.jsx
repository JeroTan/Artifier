import { Suspense, useCallback, useEffect, useState } from "react";
import { Navigate, redirect, useNavigate } from "react-router-dom";
import PageLoader from "./Utilities/PageLoader";
import { ApiVerify } from "./Helper/Api";
import PageError from "./Utilities/PageError";


const gatepolice = {
    needAuthentication: (helper)=>{
        const token = localStorage.getItem('token');
        if(!token){
            redirect('/login');
            return false;
        }
        return true;
    },
    noAuthentication: (helper)=>{
        const token = localStorage.getItem('token');
        if(token){
            redirect('/');
            return false;
        }
        return true;
    }
};

export default (option)=>{
    const Content = option.children;
    const Rule = option.type;
    const [c_verifying, s_verifying] = useState(true);

    //This will be use inside a rule component
    const helper = {
        navigation: useNavigate(),
    }

    //This will be the one who manage the rotation of rules
    useEffect(()=>{
        if( typeof Rule === "array"){
            Rule.every(x=> gatepolice[x](helper))
        }else{
            gatepolice[Rule](helper)
        }
            
        s_verifying(false);
    }, [s_verifying]);

    return <>
        { c_verifying ? <PageLoader /> : Content }
    </>
}