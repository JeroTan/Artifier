import axios from 'axios';
import { useContext } from 'react';
import { Gbl_Modal } from '../Modal';

export function ApiLink(Additionals = "", withApiLink = true){
    const domain = "localhost:8000";
    const apiField = "/api/v1/";
    const protocol = "http";
    const site = protocol+"://"+domain+(withApiLink?apiField:"")+Additionals;
    return site;
}

const basicRequest = axios.create({
    baseURL:ApiLink(),
    headers:{
        "content-type": "application/json",
        "accept": "application/json"
    }
});

const authRequest = (file)=>{
    return axios.create({
        baseURL:ApiLink(),
        headers:{
            "content-type": file?"multipart/form-data":"application/json",
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
export async function ApiRequestPlate(request = "get",queryString = "", data=false, file=false){
    let response;
    const token = localStorage.getItem('token') ?? false;
    const AxiosTime = token ? authRequest(file) : basicRequest;
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
export async function ApiSignup(data){
    return await ApiRequestPlate('post', 'signup', data);
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
export async function ApiGetCategory(query = ""){
    return await ApiRequestPlate('get', 'category'+query);
}
export async function ApiGetCategoryPathTree(query = ""){
    return await ApiRequestPlate('get', 'category_path'+query);
}

export async function ApiGetImage(query = ""){
    return await ApiRequestPlate('get', 'image/'+query);
}

export async function ApiGetPathSuggestion(query = ""){
    return await ApiRequestPlate('get', 'category_path_suggestion'+"?key="+query);
}

export function ApiImageLink(image, faction = "gallery/"){
    const routeSlash = "/storage/"+faction;
    return ApiLink(routeSlash+image, false);
}

///<<< Image Query


///>>> Image Upload and Editing
export async function ApiApplyNewCategory(data){
    return await ApiRequestPlate('post', 'category_path', data);
}
export async function ApiUploadImageData(formData){
    return await ApiRequestPlate('post', 'image', formData, true);
}
export async function ApiUpdateImageData(data, imageId){
    return await ApiRequestPlate('patch', 'image/'+imageId, data);
}
export async function ApiLinkImageCategory(data){
    return await ApiRequestPlate('post', 'image_category_paths', data);
}
export async function ApiDeleteImage(id){
    return await ApiRequestPlate('delete', 'image/'+id);
}
///<<< Image Upload and Editing





