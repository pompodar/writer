<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;
use App\Http\Controllers\ArticleController;
use App\Http\Controllers\CategoryController;
use App\Models\Article;

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::delete('/users/{userId}', [UserController::class, 'deleteUser']);

Route::get('/users/', [UserController::class, 'getUsers']);

Route::post('messages', [\App\Http\Controllers\ChatController::class, 'message']);

Route::get('/get-messages/', [\App\Http\Controllers\ChatController::class, 'index']);

Route::get('/articles', function () {
        return response()->json(['articles' => App\Models\Article::with('categories')->get()]);
}); 

Route::get('/article/article_categories/{id}', function ($id) {
    $articleWithCategories = Article::with('categories')->find($id);

    return response()->json(['articleWithCategories' => $articleWithCategories]);
});



Route::post('/articles/create', [ArticleController::class, 'store']);

Route::put('/articles/{id}', [ArticleController::class, 'update']);

Route::delete('/articles/{id}', [ArticleController::class, 'destroy']);


Route::get('/categories', function () {
        return response()->json(['categories' => App\Models\Category::all()]);
}); 

Route::post('/categories/create', [CategoryController::class, 'store']);

Route::put('/categories/{id}', [CategoryController::class, 'update']);

Route::delete('/categories/{id}', [CategoryController::class, 'destroy']);

Route::get('/categories-menu', [CategoryController::class, 'menu']);
