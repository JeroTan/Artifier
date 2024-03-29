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
            helper.navigation('/login');
            return false;
        }
        return true;
    },
    noAuthentication: (helper)=>{
        const token = localStorage.getItem('token');
        if(token){
            redirect('/');
            helper.navigation('/');
            return false;
        }
        return true;
    }
};

export default (option)=>{
    const Content = option.children;
    const Rule = option.type;
    const [c_verifying, s_verifying] = useState(true);
    const [c_error, s_error] = useState(true);

    //This will be use inside a rule component
    const helper = {
        navigation: useNavigate(),
    }

    //This will be the one who manage the rotation of rules
    useEffect(()=>{
        if( typeof Rule === "array"){
            if(Rule.every(x=> gatepolice[x](helper))){
                s_error(false);
            }
        }else{
            if(gatepolice[Rule](helper)){
                s_error(false);
            }
        }
            
        s_verifying(false);
    }, [s_error, s_verifying]);

    return <>
        { c_verifying ? <PageLoader /> : Content }
    </>
}