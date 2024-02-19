

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