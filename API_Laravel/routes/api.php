<?php

use App\Http\Controllers\UsersController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Route::get('/user', function (Request $request) {
//     return $request->user();
// })->middleware('auth:sanctum');

Route::post('login', [UsersController::class, 'login'])->name('login');
Route::post('signup', [UsersController::class, 'signup'])->name('signup');

Route::group(['middleware' => ['auth:sanctum']], function () {
    Route::post('logout', [UsersController::class, 'logout']);
    Route::post('refreshToken', [UsersController::class, 'refreshToken']);
});
  
