<?php

namespace App\Http\Controllers\Api\V1;

use App\Helper\V1\OwnCategory;
use App\Http\Controllers\Controller;
use App\Http\Requests\V1\CategoryPathReq;
use App\Models\Category;
use App\Models\CategoryPath;
use App\Models\Image;
use App\Models\ImageCategoryPaths;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CategoryPathCtrl extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $user = Auth::user();
        $image = Image::select('id')->where('user_id', $user->id);
        $image_category_paths = ImageCategoryPaths::select('category_path_id')->whereIn('image_id', $image);
        $category_path = CategoryPath::with('category')->whereIn('id', $image_category_paths)->get()->toArray();

        $ownCategory = new OwnCategory;
        return response()->json($ownCategory->getPathTree($category_path), 200);
    }
    public function pathSuggestion(Request $request){
        if(!$request->query("key") || is_array($request->query("key"))){
            return response()->json([], 200);
        }
        $category = Category::select("id")->whereRaw("LOWER(name) LIKE '%". $request->query("key") ."%'");
        $category_path = CategoryPath::select('category_path.*', 'category.name as category_name')->join('category',  'category_path.category_id', '=', 'category.id')->with('category')->whereIn('category_id', $category)->orderBy('category_name', 'asc')->limit(10)->get()->toArray();


        $ownCategory = new OwnCategory;
        return response()->json($ownCategory->getPath($category_path));
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
    public function store(CategoryPathReq $request)
    {
        $categoryIds = [];
        $allRawData = $request->all();
        foreach($allRawData as $key => $val){
            $refinedCategoryPath = [];

            $parentId = null;
            foreach($val['list'] as $jindex => $categoryVal){
                $catData = Category::where('name', $categoryVal["name"])->first();
                if(!$catData){
                    $catData = new Category;
                    $catData->name = $categoryVal['name'];
                    $r = rand(0,255);$g = rand(0,255);$b = rand(0,255);
                    $catData->color = "rgb($r, $g, $b)";
                    $catData->save();
                }
                $pathData = CategoryPath::where('category_id', $catData->id)->where('category_path_id', $parentId)->first();
                if(!$pathData){
                    $pathData = new CategoryPath;
                    $pathData->category_id = $catData->id;
                    $pathData->category_path_id = $parentId;
                    $pathData->save();
                }
                $parentId = $pathData->id;

                $refinedCategoryPath[] = ['id'=>$pathData->id, 'category_id'=>$catData->id, 'name'=>$catData->name];
            }

            $categoryIds[] = $refinedCategoryPath[count($refinedCategoryPath)-1]['id'];
        }

        return response()->json($categoryIds, 200);
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
