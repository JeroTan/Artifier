<?php

namespace App\Http\Controllers\Api\V1;

use App\Helper\V1\FFQuery;
use App\Helper\V1\FilterImage;
use App\Http\Controllers\Controller;
use App\Http\Requests\V1\ImageAddMultiReq;
use App\Http\Requests\V1\ImageAddReq;
use App\Http\Requests\V1\ImageUpdReq;
use App\Http\Resources\V1\ImageRes;
use App\Models\Image;
use Illuminate\Http\Request;

class ImageCtrl extends Controller
{
    public function __invoke()
    {
        return Image::all();
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
        return new ImageRes( Image::create($request->all()) );
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
    public function show(string $id)
    {
        return new ImageRes(Image::find($id));
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
