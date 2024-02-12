<?php
namespace App\Helper\V1;

use Illuminate\Http\Request;
use App\Helper\V1\Filterer;

class FilterImage extends Filterer {

    protected $filterParameter  = [
        'category_path_id'=>["eq", "match"],
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


}
