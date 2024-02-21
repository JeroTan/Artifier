<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\V1\SignupReq;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class SignupCtrl extends Controller
{
    function signupUser(SignupReq $request){
        $user = new User;
        $user->username = $request->username;
        $user->password = Hash::make($request->password);
        $user->save();
        if(Auth::attempt($request->only('username', 'password'))){
            $User = Auth::user();
            if($User instanceof User){
                return response()->json(['token'=>$User->createToken('authenticatedToken', ['manageGallery'])->plainTextToken], 200);
            }
        }
        return response()->json([
            'invalid'=>"We cannot process your account creation, please try again later."
        ], 401);
    }
}
