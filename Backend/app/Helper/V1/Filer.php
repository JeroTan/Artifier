<?php
namespace App\Helper\V1;

use Illuminate\Support\Facades\Storage;
use Intervention\Image\ImageManager as Image;
use Intervention\Image\Drivers\Imagick\Driver as ImagickDriver;
use Intervention\Image\Encoders\AutoEncoder;

class Filer{
    protected $name= "";
    protected $id = "";
    protected $file;
    protected $path = "";
    protected $newFilename = "";
    protected $modifiedImage = "";

    public function __construct($id = "", $name = "", $file = null, $path = ''){
        $this->id = $id;
        $this->name = $name;
        $this->file = $file;
        $this->path = $path;
    }

    public function id($id){
        $this->id = $id;
        return $this;
    }
    public function name($name){
        $this->name = $name;
        return $this;
    }
    public function file($file){
        $this->file = $file;
        return $this;
    }
    public function path($path){
        $this->path = $path;
        return $this;
    }
    public function newFilename($newFilename){
        $this->newFilename = $newFilename;
        return $this;
    }

    public function modifyImage($size = [512,512], $quality = 40){
        $Image = new Image(new ImagickDriver());
        $Image = $Image->read(($this->file));
        $Image = $Image->cover($size[0], $size[1]);
        $Image = $Image->encode(new AutoEncoder(quality: $quality));
        $this->modifiedImage = $Image;

        return $this;
    }

    public function createThumbImage($size = [192, 192], $returnName = false){
        $this->modifyImage($size);
        Storage::disk('public')->put(  $this->path."thumb/".$this->newFilename, $this->modifiedImage );
        return $returnName ? $this->newFilename : $this;
    }
    public function hashName(){
        $this->newFilename = $this->file->hashName();
        return $this;
    }

    public function getFile($returnChain = false){
        $imageFile = null;
        if(Storage::disk('public')->exists($this->path.$this->name) )
            $imageFile = Storage::disk('public')->get($this->path.$this->name);
        if($returnChain){
            $this->file = $imageFile;
            return $this;
        }
        return $imageFile;

    }
    public function uploadFile($returnName = false){
        $this->hashName();
        Storage::disk('public')->put(  $this->path, $this->file );
        return $returnName ? $this->newFilename : $this;
    }

    public function deleteFile(){
        if( Storage::disk('public')->exists($this->path.$this->name) ){
            Storage::disk('public')->delete($this->path.$this->name);
        }
        return $this;
    }
    public function deleteThumb(){
        if( Storage::disk('public')->exists($this->path."thumb/".$this->name) ){
            Storage::disk('public')->delete($this->path."thumb/".$this->name);
        }
        return $this;
    }

    public function getNewName(){
        return $this->newFilename;
    }
}
