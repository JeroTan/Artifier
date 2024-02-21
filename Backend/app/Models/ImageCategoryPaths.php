<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ImageCategoryPaths extends Model
{
    use HasFactory;
    protected $table = 'image_category_paths';
    protected $primaryKey = 'id';
    // protected $keyType = ['id','string'];
    // public $incrementing = false;
    public $timestamps = false;

    //Relationships
    public function image(){
        return $this->belongsTo(Image::class);
    }
    public function categoryPath(){
        return $this->belongsTo(CategoryPath::class);
    }
}
