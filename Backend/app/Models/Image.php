<?php

namespace App\Models;

use Carbon\Traits\Timestamp;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Image extends Model
{
    use HasFactory, Timestamp;

    protected $table = 'image';
    protected $primaryKey = 'id';
    // protected $keyType = ['id','string'];
    // public $incrementing = false;
    //public $timestamps = false;

    protected $fillable = [
        "user_id",
        "category_path_id",
        "title",
        "description",
        "image",
    ];

    //Relationships
    public function user(){
        return $this->belongsTo(User::class);
    }
    public function imageCategoryPaths(){
        return $this->hasMany(ImageCategoryPaths::class);
    }
    public function categoryPath(){
        return $this->belongsToMany(CategoryPath::class, 'image_category_paths', 'image_id', 'category_path_id', 'id');
    }

}
