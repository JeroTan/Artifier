<?php

namespace App\Http\Controllers\Api\V1;

use App\Helper\V1\FilterImage;
use App\Http\Controllers\Controller;
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
        $opt = new FilterImage;
        $opt_filter = $opt->transFilter($request);

        return ImageRes::collection(Image::all());
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
