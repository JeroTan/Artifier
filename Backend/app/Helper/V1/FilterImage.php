<?php
namespace App\Helper\V1;

use Illuminate\Http\Request;

class FilterImage {
    protected $parameters = [
        'category_path_id'=>["eq"],
        'created_at'=>["lt", "gt", "gte", "lte"],
        'updated_at'=>["lt", "gt", "gte", "lte"],
    ];

    protected $mapper = [
        "eq"=>"=",
        "gt"=>">",
        "lt"=>"<",
        "gte"=>">=",
        "lte"=>"<=",
    ];

    public function transFilter(Request $request){
        $transformedFilter = [];
        foreach($this->parameters as $column =>$val){
            $data = $request->query($column);
            if(!$data){
                continue;
            }


            foreach($this->mapper as $key2 =>$val2){
                if(!isset($data[$key2])){
                    continue;
                }
                $transformedFilter[] = [ $column, $this->mapper[$key2], $data[$key2] ];
            }

        };
        return $transformedFilter;
    }

    public function transBetween(Request $request){

    }

    public function transSearch(Request $request){

    }

    public function transMatch(Request $request){

    }

    public function transSelect(Request $request){

    }

    public function transSort(Request $request){

    }
}
