<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CategoryPath extends Model
{
    use HasFactory;

    protected $table = 'category_path';
    protected $primaryKey = 'id';
    // protected $keyType = ['id','string'];
    // public $incrementing = false;
    public $timestamps = false;

    protected $fillable = [
        "category_id",
        "category_path_id",
    ];

    //Relationship
    public function imageCategoryPaths(){
        return $this->hasMany(ImageCategoryPaths::class);
    }
    public function category(){
        return $this->belongsTo(Category::class);
    }
    public function parent(){ //What parent they are linked up if the parent is null then that record is a parent
        return $this->belongsTo(CategoryPath::class, 'category_path_id');
    }
    public function linked(){
        return $this->hasMany(CategoryPath::class, 'category_path_id');
    }
}
