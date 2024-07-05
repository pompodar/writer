<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Category;
use Illuminate\Support\Facades\Auth;

class CategoryController extends Controller
{
    public function index()
    {
        $categories = Category::all();

        return response()->json(['categories' => $categories]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|unique:categories|string|max:255',
        ]);

        $user = Auth::user();

        $category = Category::create([
            'user_id' => 1,
            'name' => $request->input('name'),
            'parent_id' => $request->input('parent_id'),
        ]);

        return response()->json(['category' => $category], 201);
    }

    public function destroy($id)
    {
        $category = Category::find($id);

        if (!$category) {
            return response()->json(['error' => 'Category not found'], 404);
        }

        // Check if the user has permission to delete the category
        // You can customize this based on your authentication logic
        if ($category->user_id !== Auth::id()) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $category->delete();

        return response()->json(['message' => 'Category deleted successfully'], 200);
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'name' => 'required|string|max:255',
        ]);

        $category = Category::find($id);

        if (!$category) {
            return response()->json(['error' => 'Category not found'], 404);
        }

        // Check if the user has permission to update the category
        // You can customize this based on your authentication logic
        if ($category->user_id !== Auth::id()) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $category->update([
            'name' => $request->input('name'),
            'parent_id' => $request->input('parent_id'),
        ]);

        return response()->json(['category' => $category], 200);
    }

    public function menu()
    {
        $categories = Category::with('findChildren')->whereNull('parent_id')->get();
        
        return response()->json(['categories' => $categories]);
    }

}
