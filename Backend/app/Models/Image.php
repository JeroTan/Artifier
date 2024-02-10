<?php

namespace App\Models;

use Carbon\Traits\Timestamp;
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

    //Relationships
    public function user(){
        return $this->belongsTo(User::class);
    }
    public function categoryPath(){
        return $this->belongsTo(CategoryPath::class);
    }

}
