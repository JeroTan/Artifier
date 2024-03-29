<?php

use App\Http\Controllers\Api\V1\CategoryCtrl;
use App\Http\Controllers\Api\V1\CategoryPathCtrl;
use App\Http\Controllers\RunnerCtrl;
use App\Models\Category;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/

Route::get('/', function () {
    return view('welcome');
});

Route::get('/initial', function(){
    Auth::attempt(['username'=>"aqua", 'password'=>'password']);
    return Auth::user();
});

Route::get('/testing', [CategoryPathCtrl::class, 'index']);

Route::get('/runner');

Route::prefix('/runner')->group(function(){
    Route::get('/thumb', [RunnerCtrl::class, 'convertImage']);
});
