<?php

namespace App\Http\Controllers\Api\V1;

use App\Helper\V1\OwnCategory;
use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\CategoryPath;
use App\Models\Image;
use App\Models\ImageCategoryPaths;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CategoryCtrl extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $user = Auth::user();
        $image = Image::select('id')->where('user_id', $user->id);
        $image_category_paths = ImageCategoryPaths::select('category_path_id')->whereIn('image_id', $image);
        $category_path = CategoryPath::whereIn('id', $image_category_paths)->get()->toArray();

        $categoring = new OwnCategory;
        return response()->json($categoring->get($category_path), 200);
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
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
