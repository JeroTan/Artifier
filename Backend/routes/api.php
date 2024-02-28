<?php

use App\Http\Controllers\Api\V1\CategoryCtrl;
use App\Http\Controllers\Api\V1\CategoryPathCtrl;
use App\Http\Controllers\Api\V1\ImageCtrl;
use App\Http\Controllers\Api\V1\LoginCtrl;
use App\Http\Controllers\Api\V1\SignupCtrl;
use App\Http\Controllers\Api\V1\UserCtrl;
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
    Route::post('signup', [SignupCtrl::class, 'signupUser']);

    Route::apiResource('category', CategoryCtrl::class)->middleware('auth:sanctum');

    Route::apiResource('category_path', CategoryPathCtrl::class)->middleware('auth:sanctum');
    Route::get('category_path_suggestion', [CategoryPathCtrl::class, 'pathSuggestion']);

    Route::apiResource('user', UserCtrl::class)->middleware('auth:sanctum');
});
