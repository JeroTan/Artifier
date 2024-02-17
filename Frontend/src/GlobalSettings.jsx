import { createContext } from "react";


export const Gbl_settings = createContext();

export const initialValue = {
    theme: "dark",
    search: "",
};

export const changerValue = (state, action)=>{
    if(action.run !== undefined){
        switch(action.run){
            case "change-theme":
                state.theme = state.theme == 'dark' ? 'light' : 'dark';
            break;
        }

    }else{
        state[action.key] = action.val;
    }
    
    return structuredClone(state);
}