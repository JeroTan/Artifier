<?php
namespace App\Helper\V1;

use Illuminate\Http\Request;
use App\Helper\V1\Filterer;
use App\Models\ImageCategoryPaths;

class FilterImage extends Filterer {

    protected $filterParameter  = [
        'created_at'=>["lt", "gt", "gte", "lte"],
        'updated_at'=>["lt", "gt", "gte", "lte"],
    ];

    protected $sortParameter = [
        'title',
        'description',
        'image',
        'created_at',
        'updated_at',
    ];

    protected $searchMapper = [
        'title',
        'description',
        'created_at',
        'updated_at',
    ];

    protected $relationParameter = [
        'category_path_id',
    ];

    protected $relationMapper = [
        'category_path_id'=>['table'=>ImageCategoryPaths::class, 'select'=>'image_id', 'column'=>'category_path_id', 'matchToColumn'=>'id'],
    ];

}
