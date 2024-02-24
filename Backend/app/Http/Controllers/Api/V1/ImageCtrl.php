<?php

namespace App\Http\Controllers\Api\V1;

use App\Helper\V1\FFQuery;
use App\Helper\V1\Filer;
use App\Helper\V1\FilterImage;
use App\Helper\V1\OwnCategory;
use App\Http\Controllers\Controller;
use App\Http\Requests\V1\ImageAddMultiReq;
use App\Http\Requests\V1\ImageAddReq;
use App\Http\Requests\V1\ImageUpdReq;
use App\Http\Resources\V1\ImageRes;
use App\Models\CategoryPath;
use App\Models\Image;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ImageCtrl extends Controller
{
    public function __invoke()
    {
        return Image::all()->toArray();
    }


    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $data = new Image;


        //-->Filterers
        $opt = new FilterImage;
        $ffq = new FFQuery;
        $data = $ffq->init($opt, $data, $request)->doAll()->getQuery();
        //<--Filterers

        $data = $data->get();

        return ImageRes::collection($data);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(Request $reuqest)
    {

    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(ImageAddReq $request)
    {

        $image = new Image;
        $image->user_id = $request->user_id;
        $image->title = $request->title;
        $image->description = $request->description;
        $image->save();

        $filer = new Filer;
        $image->image = $filer->id($image->id)->name($image->title)->file($request->image)->path("gallery/")->uploadFile(true);
        $image->save();

        // $image->refresh();
        $image->categoryPath()->attach($request->category_path_id);
        // $image->load('categoryPath');
        return response()->json($image->categoryPath, 200);
    }


    public function storeMulti(ImageAddMultiReq $request){
        $reviseData = collect($request->all())->map(function($val){
            return array_filter($val, function($key){
                return match($key){
                    'userId'=>false,
                    'categoryPathId'=>false,
                    default=>true
                };
            }, ARRAY_FILTER_USE_KEY);
        })->toArray();
        Image::insert($reviseData);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id){
        $image = Image::find($id);

        $pathfinder = new OwnCategory;
        $tempPath = array_map(fn($val)=>$val['id'], $image->categoryPath->toArray());
        $tempPath = CategoryPath::with('category')->whereIn('id', $tempPath)->get()->toArray();
        $categoryPath = $pathfinder->getPath($tempPath );

        $image = [...$image->toArray(), "categoryPath"=>$categoryPath];
        return new ImageRes( $image );
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
    public function update(ImageUpdReq $request, string $id)
    {

        $image = Image::find($id);

        return $image->update($request->all());
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
