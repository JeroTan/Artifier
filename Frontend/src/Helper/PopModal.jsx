import { ApiDeleteImage } from "./Api";


export function popLoginVerifying(Upcast){
    Upcast({run:'setAll', val:{
        isOpen: true,
        type: 'loading',
        title: "Logging-in",
        data: "Please wait for a while. . .",
        canClose: false,
    }});
}

export function popLoginSuccess(Upcast){
    Upcast({run:'setAll', val:{
        isOpen: true,
        type: 'success',
        title: "Login successfully",
        data: "We will direct you to the main page. . .",
        canClose: false,
        allowButton: false,
    }});
}

export function popLoginError(Upcast){
    Upcast({run:'setAll', val:{
        isOpen: true,
        type: 'error',
        title: "Login failed",
        data: "Please try again and double-check your credentials . .",
    }});
}

export function popSignupVerifying(Upcast){
    Upcast({run:'setAll', val:{
        isOpen: true,
        type: 'loading',
        title: "Signing-in",
        data: "Please wait for a while. . .",
        canClose: false,
    }});
}

export function popSignupSuccess(Upcast){
    Upcast({run:'setAll', val:{
        isOpen: true,
        type: 'success',
        title: "Account created successfully",
        data: "We will direct you to the main page. . .",
        canClose: false,
        allowButton: false,
    }});
}

export function popSignupError(Upcast){
    Upcast({run:'setAll', val:{
        isOpen: true,
        type: 'error',
        title: "Signup failed",
        data: "Please try again later and double-check your credentials . .",
    }});
}

export function popImage(Upcast, link){
    Upcast({run:'setAll', val:{
        isOpen: true,
        type: 'imageDisplay',
        title: "",
        width: "100%",
        data: link,
        allowButton: false,
        canClose: true,

    }});
}

export function popDeleteImageWarning(Upcast, title, confirmCallback = ()=>{}){
    Upcast({run:'setAll', val:{
        isOpen: true,
        type: 'warning',
        title: `Delete Warning`,
        data: `Are you sure you want to delete this image "${title}"? This action is irreversible, are you sure?`,
        confirmCallback: ()=>{
            confirmCallback(Upcast);
        },
    }});
}

export function popDeleteProcessing(Upcast){
    Upcast({run:'setAll', val:{
        isOpen: true,
        type: 'loading',
        title: "Deleting",
        data: "Please wait for a while. . .",
        canClose: false,
    }});
}

