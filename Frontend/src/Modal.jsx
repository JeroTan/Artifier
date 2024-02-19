import { createContext } from "react";


export const Gbl_Modal = createContext();

export const modalValue = {
    'type':'Success', //blank, success, error, warning, info, confirm, loading
    'title':'Title',
    'data':'This is a Subtext',
    'canClose':true,  //true means it can be close through UI if false can only be close through script
    'closeButton':false,
    'isOpen':true,
    'allowButton':true,
};

export const modalChanger = (state, action)=>{
    const refState = structuredClone(state);
    if(action.run === undefined){
        refState[action.key] = action.val;
        return structuredClone(refState);
    }

    switch(action.run){
        case "togglePop":
            refState.isOpen = refState.isOpen ? false : true;
        break;
        case "noClose":
            refState.canClose = false;
        break;
        case "canClose":
            refState.canClose = true;
        break;
        case "close":
            refState.isOpen = false;
        break;
        case "open":
            refState.isOpen = true;
        break;
        case 'setType':
            refState.type = action.val;
        break;
        case 'setAll':
            Object.keys(refState).forEach((i)=>{
                refState[i] = action?.val?.[i] ?? refState[i];
            });
        break;

    }
    return structuredClone(refState);
}