//HOOKS
import { useEffect, useState, useCallback, useMemo, useRef, useReducer, } from "react";
import { useNavigate } from "react-router-dom";

// Utilities

export default ()=>{
    //Definer
    const navigation = useNavigate();

    //Check if Login First
    useEffect(()=>{
        //navigation("/Login");
    });


    return <>
        <h1>Hi sekai</h1>
    </>
}