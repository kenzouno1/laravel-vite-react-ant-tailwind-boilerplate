<?php

use App\Http\Controllers\AccountController;
use App\Http\Controllers\AttachmentController;
use App\Http\Controllers\DepartmentController;
use App\Http\Controllers\PermissionController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\TokenController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
 */

Route::post("/login", [TokenController::class, "login"]);

Route::middleware("auth:sanctum")->group(function () {
    //user api
    Route::apiResource("/users",UserController::class);
    Route::apiResource('/roles', RoleController::class);
    Route::get("/permissions",PermissionController::class);
    Route::apiResource("/departments",DepartmentController::class);
    Route::apiResource("/account",AccountController::class)->only(["update","index"]);
    Route::apiResource("/attachments",AttachmentController::class)->only(["store","index","destroy"]);

});

// Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
//     return $request->user();
// });
