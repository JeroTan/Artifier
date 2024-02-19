import axios from 'axios';
import { useContext } from 'react';
import { Gbl_Modal } from '../Modal';

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

const authRequest = ()=>{
    return axios.create({
        baseURL:ApiLink(),
        headers:{
            "content-type": "application/json",
            "accept": "application/json",
            'authorization': `Bearer ${localStorage.getItem('token')}`,
            'Access-Control-Allow-Credentials': 'true',
            "Access-Control-Allow-Origin": "<origin>",
        }
    });
}

//>>InHouse Helper
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
export async function ApiRequestPlate(request = "get",queryString = "", data=false, ){
    let response;
    const token = localStorage.getItem('token') ?? false;
    const AxiosTime = token ? authRequest() : basicRequest;
    try {
        switch(request){
            case "get":
                response = await AxiosTime.get(queryString);
            break;
            case "post":
                response = await AxiosTime.post(queryString, data);
            break;
            case "put":
                response = await AxiosTime.put(queryString, data);
            break;
            case "patch":
                response = await AxiosTime.patch(queryString, data);
            break;
            case "delete":
                response = await AxiosTime.delete(queryString);
            break;
        }
        response = successProcessing(response);
    } catch (error) {
        response = errorProcessing(error);
    }
    return response;
}
//<<InHouse Helper

///>>> LOGIN / SETTING UP ACCOUNT / AUTH
export async function ApiLogin(data){
    return await ApiRequestPlate('post', 'login', data);
}

export async function ApiTokenReset(navigation, addon = ()=>true){
    localStorage.removeItem('token');
    navigation('/login');
    addon();
}
export async function ApiSetToken(d, navigation, addon = ()=>true){
    if(d.status == 200 && d?.data?.token){
        localStorage.setItem('token', d.data.token);
        navigation('/');
        addon();
    }
}
export function checkTokenValidity(d, navigation){

}
///<<< LOGIN / SETTING UP ACCOUNT / AUTH

///>>> Image Query
export async function ApiGetCategory(){
    return await ApiRequestPlate('get', 'category');
}


///<<< Image Query





