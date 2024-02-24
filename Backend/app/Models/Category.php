<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    use HasFactory;

    protected $table = 'category';
    protected $primaryKey = 'id';
    // protected $keyType = ['id','string'];
    // public $incrementing = false;
    public $timestamps = false;

    protected $fillable = [
        "name",
        "color",
    ];

    //Relationships
    public function categoryPath(){
        return $this->hasMany(CategoryPath::class);
    }
    public function image(){
        return $this->belongsToMany(Image::class, 'image_category_paths', 'category_path_id', 'image_id');
    }
}
