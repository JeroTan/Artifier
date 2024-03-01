<?php
namespace App\Helper\V1;

use App\Models\User;
use Illuminate\Support\Facades\Auth;

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
                if(strtotime($betweenValue[0])){
                    $betweenValue[0] = date($betweenValue[0]);
                }
                if(strtotime($betweenValue[1])){
                    $betweenValue[1] = date($betweenValue[1]);
                }
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

    public function relation(){
        if(!$this->isInitialize())
            return $this;

        $opt_filter = $this->FilterRef->transRelation($this->Request);
        if($opt_filter){
            foreach($opt_filter as $column => $query){
                $this->Query = $this->Query->whereIn($column, $query);
            }
        }
        return $this;
    }

    public function custom($callback){//Be sure that the return value is a Query
        $this->Query = $callback($this->Query);
        return $this;
    }

    public function auth(){
        if(!$this->isInitialize())
            return $this;

        $user = Auth::user();
        $this->Query = $this->Query->where('user_id', $user->id);
        return $this;
    }

    public function doAll($auth = false, $custom = false){
        $returner = $this;
        if($auth){
            $returner = $returner->auth();
        }
        if($custom){
            if(is_array($custom)){
                foreach($custom as $callback){
                    $returner =$returner->custom($callback);
                }
            }else{
                $returner = $returner->custom($custom);
            }
        }
        $returner->search()->filter()->between()->match()->relation()->sort();
        return $returner;
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
