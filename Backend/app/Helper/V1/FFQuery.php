<?php
namespace App\Helper\V1;

class FFQuery{ //Fast Filter Query - Use to do all filtering and queriying
    protected $FilterRef;
    protected $Query;
    protected $Request;

    public function init($FilterRef, $Query, $Request){
        $this->FilterRef = $FilterRef;
        $this->Query = $Query;
        $this->Request = $Request;
        return $this;
    }

    public function search(){
        if(!$this->isInitialize())
            return $this;

        $opt_filter = $this->FilterRef->transSearch($this->Request);
        if($opt_filter){
            $this->Query = $this->Query->where( function($query) use($opt_filter) {
                foreach( $opt_filter as $val ){
                    $query = $query->orWhereRaw($val);
                }
            });
        }
        return $this;
    }

    public function filter(){
        if(!$this->isInitialize())
            return $this;

        $opt_filter = $this->FilterRef->transFilter($this->Request);
        if($opt_filter)
            $this->Query = $this->Query->where($opt_filter);

        return $this;
    }

    public function between(){
        if(!$this->isInitialize())
            return $this;

        $opt_filter = $this->FilterRef->transBetween($this->Request);
        if($opt_filter){
            foreach($opt_filter as $column => $betweenValue){
                $this->Query = $this->Query->whereBetween($column, $betweenValue);
            }
        }

        return $this;
    }

    public function match(){
        if(!$this->isInitialize())
            return $this;

        $opt_filter = $this->FilterRef->transMatch($this->Request);
        if($opt_filter){
            foreach($opt_filter as $column => $matchers){
                $this->Query = $this->Query->whereIn($column, $matchers);
            }
        }
        return $this;
    }

    public function sort(){
        if(!$this->isInitialize())
            return $this;

        $opt_filter = $this->FilterRef->transSort($this->Request);
        if($opt_filter){
            foreach($opt_filter as $column => $sortValue){
                $this->Query = $this->Query->orderBy($column, $sortValue);
            }
        }
        return $this;
    }

    public function doAll(){
        return $this->search()->filter()->between()->match()->sort();
    }

    public function getQuery(){
        if(!$this->isInitialize())
            return false;

        return $this->Query;
    }

    protected function isInitialize(){
        if($this->FilterRef && $this->Query && $this->Request)
            return true;
        return false;
    }
}
