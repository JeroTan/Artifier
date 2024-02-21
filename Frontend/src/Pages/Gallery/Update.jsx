import { useReducer } from "react";

export const UpdateImage = (option)=>{
    const [thisCast, thisUpcast] = useReducer((state, action)=>{
        const refState = structuredClone(state);
        if(action.run === undefined){
            state[action.key] = action.val;
            return refState;
        }
    }, {
        preview: false,
    });
    
    return <Pageplate container={true}>

    </Pageplate>
}