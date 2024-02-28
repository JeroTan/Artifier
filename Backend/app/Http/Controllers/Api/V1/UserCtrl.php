<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\V1\UserReq;
use App\Models\Image;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class UserCtrl extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        return response()->json(User::find(Auth::user()->id), 200);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UserReq $request, string $id)
    {
        $data = User::find(Auth::user()->id);
        if( !Auth::guard('web')->attempt(['password'=>$request->password, "username"=>$data->username]) ){
            return response()->json( ["errors"=>["password"=>"Invalid current password. Please input again the correct password."]], 422 );
        }

        if($request->username){
            $data->username = $request->username;
        }

        if($request->newPassword){
            $data->password = Hash::make($request->newPassword);
        }
        $data->save();

        return $request->username;
        return $data;
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
