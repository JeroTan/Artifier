import axios from 'axios';

export function ApiLink(Additionals = ""){
    const domain = "localhost:8000/api/v1/";
    const protocol = "http";
    const site = protocol+"://"+domain+Additionals;
    return site;
}

const basicRequest = axios.create({
    baseURL:ApiLink(),
    headers:{
        "content-type": "application/json",
        "accept": "application/json"
    }
});

function errorProcessing(error){
    const errorData = error.response.data;
    const status = error.response.status;
    return {
        status: status,
        data: errorData,
    }
}
function successProcessing(success){
    const successData = success.data;
    const status = success.status;
    return {
        status: status,
        data: successData,
    }
}

export async function ApiLogin(data){
    let response;
    try {
        response = await basicRequest.post('login', data);
    } catch (error) {
        response = errorProcessing(error);
    }
    console.log(response);
    return successProcessing(response);
}

export async function ApiTokenReset(navigation, isExpired){
    if(isExpired){
        navigation('/login');
        localStorage.removeItem('token');
    }
}
export async function ApiSetToken(d, navigation){
    if(d.staus == 200 && d?.data?.token){
        localStorage.setItem('token', d.data.token);
        navigation('/')
    }
}


