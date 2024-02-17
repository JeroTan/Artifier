<?php

use App\Http\Controllers\Api\V1\ImageCtrl;
use App\Http\Controllers\Api\V1\LoginCtrl;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::prefix('v1')->namespace("App\Http\Controllers\Api\V1")->group(function(){
    // Route::get('image', ImageCtrl::class);
    Route::apiResource('image', ImageCtrl::class)->middleware('auth:sanctum');
    Route::post('image/multi', [ImageCtrl::class, 'storeMulti'])->middleware('autt:sanctum');

    Route::post('login', [LoginCtrl::class, 'loginUser']);
    Route::post('loginVerify', [LoginCtrl::class, 'loginVerify']);
});
