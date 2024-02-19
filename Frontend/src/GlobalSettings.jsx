import { createContext } from "react";


export const Gbl_Settings = createContext();

export const initialValue = {
    theme: "dark",
    search: "",
};

export const changerValue = (state, action)=>{
    const refState = structuredClone(state);
    if(action.run == undefined){
        refState[action.key] = action.val;
        return refState;
    }

    switch(action.run){
        case "change-theme":
            refState.theme = refState.theme == 'dark' ? 'light' : 'dark';
        break;
    }
    return refState;
}