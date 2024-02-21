//Get all the error data and return true if there is one error
export function checkIfError(val){
    return !Object.keys(val).every((e)=>{
        return val[e] === false;
    });
}

export function isLogin(){
    const token = localStorage.getItem('token');
    if(token)
        return true;
    return false;
}

export function bootstrapValidity(isError){
    if(isError === undefined)
        return "";
    if(isError === false)
        return "is-valid";
    return 'is-invalid';
}

//ErrorList Template
function checkUsername(val){
    return ErrorChecking(['required', 'stringWithBasicSpecial', ['max', 32] ], val, "username");
};

function checkPassword(val){
    return ErrorChecking(['required', ['min', 8], ['max', 256] ], val, "password");
}

function checkComparePassword(val, allField){
    return ErrorChecking(['required', ['min', 8], ['max', 256], ['passMatch', allField.password] ], val, "confirm password");
}




export function checkLoginField(attr, val){
    const result = ErrorChecking(['required'], val, attr)
    return result === true ? false : result;
}
export function checkSignupField(attr, val, allField = ""){
    let result;
    if(attr == 'username'){
        result = checkUsername(val);
    }else if(attr == 'password'){
        result = checkPassword(val);
    }else if(attr == 'confirmPassword'){
        result = checkComparePassword(val, allField);
    }
    return result === true ? false : result;
}








//TEMPLATES
function ErrorChecking(Type, Val, Attribute){
    let error = false;
    for(const e of Type){
        let eRef;
        let eAddons;
        if(typeof e === "object"){
            eRef = e;
            eAddons = eRef[1] ?? "";
        }else{
            eRef = e.split(':');
            eAddons = eRef[1] ?? "";
        }

        if(!ErrorRules(eRef[0], Val, eAddons)){
            error = ErrorMessage(eRef[0], Attribute, eAddons);
            break;
        }
    }
    return error;
}

function ErrorRules(Type, Val, Addons = ""){ //Type is the Rule, Value is the data to be verified;

    const errorRules = {
        'required':data=>data != '',
        'min':(data, minValue)=>data.length >= minValue,
        'max':(data, maxValue)=>data.length <= maxValue,
        'stringWithBasicSpecial':(data)=>/^[a-zA-Z0-9\,\.\-\_\"\'\s]*$/.test(data),
        'match':(data, toBeMatch)=>data === toBeMatch,
        'passMatch':(data, toBeMatch)=>(toBeMatch!=="" ? (data === toBeMatch) : true),
    };

    if(typeof Type == "array"){
        return Type.every((e)=>{
            return errorRules[e](Val, Addons);
        })
    }else{
        return errorRules[Type](Val, Addons);
    }
}

function ErrorMessage(Type, Attribute, Addons = ""){ //Type is the Rule, Attribute is The name of the Field
    let errorMessage = '';

    switch(Type){
        case 'required':
            errorMessage = `You forget the ${Attribute}.`;
        break;
        case 'min':
            errorMessage = `The ${Attribute} only accept minimum of ${Addons} character${Addons>0?"s":""}`;
        break;
        case 'max':
            errorMessage = `The ${Attribute} only accept maximum of ${Addons} character${Addons>0?"s":""}`;
        break;
        case 'stringWithBasicSpecial':
            errorMessage = `Your ${Attribute} should only be an alphabet or number or -_.,'"`;
        break;
        case 'match':
            errorMessage = `Your ${Attribute} did not match with other fields.`;
        break;
        case 'passMatch':
            errorMessage = `Password did not match with confirm password.`;
        break;
    }

    return errorMessage;
}