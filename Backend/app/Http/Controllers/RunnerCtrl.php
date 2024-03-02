<?php

namespace App\Http\Controllers;

use App\Helper\V1\Filer;
use App\Models\Image;
use Illuminate\Http\Request;

class RunnerCtrl extends Controller
{
    function convertImage(){
        $getImage = Image::select("image")->orderBy("image", "ASC")->get()->toArray();
        foreach($getImage as $val){
            $filer = new Filer;
            $filer = $filer
                ->name($val["image"])
                ->newFilename($val["image"])
                ->path("gallery/")
                ->getFile(true)
                ->createThumbImage();
        }
        return "DONE!";
    }
}
