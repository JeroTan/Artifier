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
        $data = new Image;


        //-->Filterers
        $opt = new FilterImage;
        //Search Filter
        $opt_filter = $opt->transSearch($request);
        if($opt_filter){
            $data = $data->where(function($query) use($opt_filter) {
                foreach($opt_filter as $val){
                    $query = $query->orWhereRaw($val);
                }
            });
        }

        //Normal Filter
        $opt_filter = $opt->transFilter($request);
        if($opt_filter)
            $data = $data->where($opt_filter);

        //Between Filter
        $opt_filter = $opt->transBetween($request);
        if($opt_filter){
            foreach($opt_filter as $column => $betweenValue){
                $data = $data->whereBetween($column, $betweenValue);
            }
        }

        //Match filter
        $opt_filter = $opt->transMatch($request);
        if($opt_filter){
            foreach($opt_filter as $column => $matchers){
                $data = $data->whereIn($column, $matchers);
            }
        }

        //Sort Filter
        $opt_filter = $opt->transSort($request);
        if($opt_filter){
            foreach($opt_filter as $column => $sortValue){
                $data = $data->orderBy($column, $sortValue);
            }
        }
        //<--Filterers


        $data = $data->get();

        return ImageRes::collection($data);
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
