<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Article;
use Illuminate\Support\Facades\Auth;

class ArticleController extends Controller
{
    public function index()
    {
        $articles = Article::all();

        return response()->json(['articles' => $articles]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'tags' => 'array'
        ]);

        $user = Auth::user();

        $article = Article::create([
            'user_id' => 1,
            'title' => $request->input('title'),
            'body' => $request->input('content'),
            'tags' => $request->input('tags'),
        ]);

        $category_id = $request->input('selectedCategory');

        $article->categories()->syncWithoutDetaching($category_id);

        return response()->json(['article' => $article], 201);
    }

    public function update(Request $request, $id)
    {
        // Validate the request data
        $request->validate([
            'title' => 'required|string|max:255',
            'body' => 'required|string',
            'tags' => 'array',
            'category_ids' => 'array',
        ]);

        // Find the article by ID
        $article = Article::findOrFail($id);

        // Update the article with the validated data
        $article->update([
            'title' => $request->input('title'),
            'body' => $request->input('body'),
            'tags' => $request->input('tags', []), // Assuming 'tags' is an array
        ]);

        $article->categories()->sync($request->input('categories', []));

        // Return a response, you can customize this as needed
        return response()->json(['message' => 'Article updated successfully']);
    }

    public function destroy($id)
    {
        $article = Article::find($id);

        if (!$article) {
            return response()->json(['error' => 'Article not found'], 404);
        }

        // Check if the user has permission to delete the article
        // You can customize this based on your authentication logic
        // if ($article->user_id !== Auth::id()) {
        //     return response()->json(['error' => 'Unauthorized'], 403);
        // }

        $article->delete();

        return response()->json(['message' => 'Article deleted successfully'], 200);
    }
}
