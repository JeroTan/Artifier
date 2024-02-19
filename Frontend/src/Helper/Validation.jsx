export function isLogin(){
    const token = localStorage.getItem('token');
    if(token)
        return true;
    return false;
}

export function checkUsername(val){
    
};

export function checkPassword(val){

}

export function comparePassword(val){

}

export function checkLoginField(type, val){
    const result = ErrorCheck(['required'], val, type)
    return result === true ? false : result;
}

export function bootstrapValidity(isError){
    if(isError === undefined)
        return "";
    if(isError === false)
        return "is-valid";
    return 'is-invalid';
}

//Get all the error data and return true if there is one error
export function checkIfError(val){
    return !Object.keys(val).every((e)=>{
        return val[e] === false;
    });
}

export function ErrorCheck(Type, Val, Attribute){
    let error = false;
    for(const e of Type){
        if(!ErrorRules(e, Val)){
            error = ErrorMessage(e, Attribute);
            break;
        }
    }
    return error;
}

function ErrorRules(Type, Val){

    const errorRules = {
        'required':data=>data != '',

    };

    if(typeof Type == "array"){
        return Type.every((e)=>{
            return errorRules[e](Val);
        })
    }else{
        return errorRules[Type](Val);
    }
}

function ErrorMessage(Type, Attribute){
    const errorMessage = {
        'required':`You forget the ${Attribute}.`,
    }
    return errorMessage[Type];
}