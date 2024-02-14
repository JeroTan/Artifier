<?php

namespace App\Http\Controllers\Api\V1;

use App\Helper\V1\FFQuery;
use App\Helper\V1\FilterImage;
use App\Http\Controllers\Controller;
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

        return $request->method();
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
        $image = image::find($id);

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
