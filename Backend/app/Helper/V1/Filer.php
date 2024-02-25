<?php
namespace App\Helper\V1;

use Illuminate\Support\Facades\Storage;

class Filer{
    protected $name= "";
    protected $id = "";
    protected $file;
    protected $path = "";
    protected $newFilename = "";

    public function __construct($id = "", $name = "", $file = null, $path = '')
    {
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

    public function uploadFile($returnName = false){
        $this->newFilename = $this->file->hashName();
        Storage::disk('public')->put(  $this->path, $this->file );
        return $returnName ? $this->newFilename : $this;
    }

    public function deleteFile(){
        if( Storage::disk('public')->exists($this->path.$this->name) ){
            Storage::disk('public')->delete($this->path.$this->name);
        }
        return true;
    }

    public function getNewName(){
        return $this->newFilename;
    }
}
