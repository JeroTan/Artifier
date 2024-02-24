<?php
namespace App\Helper\V1;

use Illuminate\Http\Request;

class Filterer{
    public function __invoke(){
        return $this;
    }
    /*Parameter is the one that will be use to identify what kind of filter
    * Column is the one you will see in the database
    */
    protected $filterParameter = [];
    protected $searchParameter = "search";
    protected $sortParameter = []; //Column That Will be Sort
    protected $relationParameter = []; //Will be used for public relation, This is always be a match and it will return a query of variables

    protected $singleMapper = [
        "eq"=>"=",
        "gt"=>">",
        "lt"=>"<",
        "gte"=>">=",
        "lte"=>"<=",
    ];
    protected $searchMapper = []; //Column That Will be search
    protected $relationMapper = []; //Table that will be traverse

    public function transFilter(Request $request){
        $transformedFilter = [];
        foreach($this->filterParameter as $column =>$parameter){
            $data = $this->queryChecker($request, $column, $parameter);
            if(!$data){
                continue;
            }

            foreach($this->singleMapper as $key2 =>$val2){
                if(!isset($data[$key2])){
                    continue;
                }
                $transformedFilter[] = [ $column, $this->singleMapper[$key2], $data[$key2] ];
                unset($this->filterParameter[$column]);
            }

        };
        return $transformedFilter;
    }

    public function transBetween(Request $request){
        $transformedFilter = [];
        foreach($this->filterParameter as $column=>$parameter){
            $data = $this->queryChecker($request, $column, $parameter);
            if(!$data){
                continue;
            }

            if(!isset($data['between'])){
                continue;
            }

            $data = explode(",", $data);

            if(count($data) != 2){
                continue;
            }

            $transformedFilter[$column] = $data;
            unset($this->filterParameter[$column]);
        }
        return $transformedFilter;
    }

    public function transMatch(Request $request){
        $transformedFilter = [];
        foreach($this->filterParameter as $column=>$parameter){
            $data = $this->queryChecker($request, $column, $parameter);
            if(!$data){
                continue;
            }

            if(!isset($data['match'])){
                continue;
            }

            $data = explode(",", $data['match']);

            $transformedFilter[$column] = $data;
            unset($this->filterParameter[$column]);
        }
        return $transformedFilter;
    }

    public function transSort(Request $request){
        $transformedFilter = [];
        $sortOrder = [];
        $rawQueryKeys = array_keys($request->query());

        foreach($this->sortParameter as $column){
            $data = $request->query($column);
            if(!$data){
                continue;
            }

            if( !isset($data["sort"]) || !in_array($data["sort"], ['ASC', 'DESC']) ){
                continue;
            }


            $sortOrder[ array_search($column, $rawQueryKeys) ] = [$column, $data["sort"]];
        }

        asort($sortOrder);

        foreach($sortOrder as $val){
            $transformedFilter[$val[0]] = $val[1];
        }

        return $transformedFilter;
    }

    public function transSearch(Request $request){
        $transformedFilter = [];
        $data = $request->query($this->searchParameter);
        if(!$data){
            return $transformedFilter;
        }

        foreach($this->searchMapper as $column){
            $r_column = $column;

            $transformedFilter[] = "LOWER($r_column) LIKE '%". strtolower($data) ."%'";
        }
        return $transformedFilter;
    }

    public function transRelation(Request $request){
        $transformedFilter = []; //id and query
        foreach($this->relationParameter as $column){

            $data = $request->query($column);//Check if Query does exist
            if(!$data){
                continue;
            }

            $queruring = $this->relationMapper[$column];//Get all the query data for the table relationship
            $data = explode(",", $data);
            $table = new $queruring['table'];

            $transformedFilter[$queruring['matchToColumn']] = $table->select($queruring['select'])->whereIn($queruring['column'], $data);
        }
        return $transformedFilter;
    }

    protected function queryChecker(Request $request, $column, $parameter){
        $data = $request->query($column);
        if(!$data){
            return false;
        }

        $queryKeys = array_keys($data);

        $valid = false;
        foreach($queryKeys as $key2){
            if(in_array($key2, $parameter)){
                $valid = true;
                break;
            }
        }
        if(!$valid){
            return false;
        }
        return $data;
    }

    public function transAll(Request $request, $queryData){
        //Search

        //Normal Filter
        //Between
        //Match
        //Sort
        //Return Data;
    }
}
