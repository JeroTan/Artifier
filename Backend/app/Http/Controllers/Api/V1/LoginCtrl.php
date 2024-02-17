<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\V1\LoginReq;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class LoginCtrl extends Controller
{

    public function loginUser(LoginReq $request){
        if(Auth::attempt($request->only('username', 'password'))){
            $User = Auth::user();
            if($User instanceof User){
                return response()->json(['token'=>$User->createToken('authenticatedToken', ['manageGallery'])->plainTextToken], 200);
            }
        }
        return response()->json([
            'invalid'=>"We cannot find your credentials, please try again."
        ], 400);
    }

}
