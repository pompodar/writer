<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\UserController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Repositories\Contracts\SearchRepository;
use App\Http\Controllers\SearchController;
use App\Http\Controllers\CategoryController;
use App\Models\Article;
use App\Models\Category;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::prefix('/dashboard')->group(function () {
    Route::get('/', function () {
        return Inertia::render('Dashboard');
    })->name('dashboard');
    
    Route::get('/users', [UserController::class, 'index'])->middleware(['auth', 'verified', 'admin'])->name('users');
})->middleware(['auth', 'verified']);

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';

Route::delete('/users/{userId}', [UserController::class, 'deleteUser']);

Route::get('/articles', function (SearchRepository $searchRepository) {
    $articles = request()->has('q')
        ? $searchRepository->search(request('q'))
        : Article::with('categories')->paginate(5);

    foreach ($articles as $article) {
        foreach ($article->categories as $category) {
            
            $parents = $category->findParents();
            // $parents now contains an array of parent categories
        }
    }

    return Inertia::render('Articles', [
        'articles' => $articles,
    ]);
})->name('articles');

// Route::get('/cats', function (SearchRepository $searchRepository) {
//     $categories = Category::with('findChildren')->whereNull('parent_id')->get();

//     return Inertia::render('Cats', [
//         'cats' => $categories,
//     ]);
// })->name('cats');

// Route::get('/articles', function (SearchRepository $searchRepository) {
//     $articles = Article::with('categories')->paginate(5); // Change the number to your desired pagination size

//     return Inertia::render('Articles', ['articles' => $articles]);
// })->name('articles');

 Route::get('/articles/add', function (SearchRepository $searchRepository) {
     return Inertia::render('Add_Article');
 })->name('add_article'); 
 
Route::get('/articles/{id}', function (SearchRepository $searchRepository, $id) {
    $article = Article::with('categories')->find($id);

    return Inertia::render('Article', ['article' => $article]);
})->name('articles');

Route::get('/categories', function () {
    return Inertia::render('Categories', ['categories' => App\Models\Category::all()]);
 })->name('categories'); 

 Route::get('/categories/add', function () {
    return Inertia::render('Add_Category', ['categories' => App\Models\Category::all()]);
 })->name('add_category');  

Route::get('/{name}', function ($name) {
    $articles = [Category::where('name', $name)->first()->articles];

    return Inertia::render('Articles', ['articles' => $articles]);
})->name('category-articles');
