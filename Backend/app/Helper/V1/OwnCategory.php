<?php
namespace App\Helper\V1;

use App\Models\Category;
use App\Models\CategoryPath;
use App\Models\Image;
use App\Models\ImageCategoryPaths;
use App\Models\User;
use Illuminate\Support\Facades\Auth;

class OwnCategory{

    public function get($category_path){ //get Only Id

        $categoryID =  $this->filterCategory($category_path);
        return Category::whereIn('id',$categoryID)->get()->toArray();
    }

    protected function filterCategory($data){
        $allCategory = [];
        $allPath = CategoryPath::all()->toArray();

        function domainExpansion($limitless, $energy){ ///ENERGY means all the category
            $arrayToReturn = [];
            $result = OwnCategory::murasaki($limitless, $energy);
            $arrayToReturn = [ $result["category_id"] ];
            if($result["category_path_id"] != null){
                $arrayToReturn = array_merge( $arrayToReturn, domainExpansion($result["category_path_id"], $energy));
            }
            return $arrayToReturn;
        }


        foreach($data as $val){
            if($val["category_path_id"] == null){
                $allCategory[] = $val["category_id"];
            }else{
                $allCategory[] = $val["category_id"];
                $allCategory = array_merge($allCategory, domainExpansion($val["category_path_id"], $allPath ));
            }
        }

        return $allCategory;
    }

    public function getPath($category_path){//get the path but allowed without tree;
        $categoryPathTree = $this->pathingCategory($category_path, false);
        return $categoryPathTree;
    }

    public function getPathTree($category_path){//get path but parents must be solo

        $categoryPathTree = $this->pathingCategory($category_path);
        return $categoryPathTree;
    }

    public function getPathFlat($category_path){
        $categoryPathTree = $this->pathingCategory($category_path);

        $categoryPathTree = OwnCategory::flatten($categoryPathTree);

        return $categoryPathTree;
    }
    public function getPathFlatReverse($category_path){
        $categoryPathTree = $this->pathingCategory($category_path, true, true);

        $categoryPathTree = OwnCategory::flatten($categoryPathTree);
        return $categoryPathTree;
    }

    protected function pathingCategory($data, $makeSoloParent = true, $reverse = false){
        $allPath = CategoryPath::with('category')->get()->toArray();


        function linkDepth($categoryData, $allPath){
            if($categoryData['category_path_id'] === null){
                return [$categoryData];
            }
            $nextPath = OwnCategory::murasaki($categoryData['category_path_id'], $allPath);
            $parentLink = linkDepth($nextPath, $allPath);
            $newParentLink = parentToChild([$categoryData], $parentLink);
            return $newParentLink;

        }

        function parentToChild($dataToLink, $tree){

            if(isset($tree[0]["child"])){
                $child = parentToChild($dataToLink, $tree[0]["child"]);
                $relink = $tree;
                unset($relink[0]["child"]);
                return parentToChild($child, $relink);
            }
            $tree[0]['child'] = $dataToLink;
            return $tree;
        }

        function ReversePathing($categoryData, $allPath){
            $array = [];
            foreach($categoryData as $key => $val){
                $parent = $val["id"];
                $dataChild = OwnCategory::murasaki3($parent, $allPath);
                if($dataChild){
                    $val["child"] = ReversePathing($dataChild, $allPath);
                }
                $array[count($array)] = $val;
            }
            return $array;
        }

        $getParents =[];
        foreach($data as $val){
            if($val["category_path_id"] !== null)
                $getParents = [...$getParents,...linkDepth($val, $allPath)];
            else
                $getParents[] = $val;
        }

        if($reverse){
            $getParents = ReversePathing($data, $allPath);
        }


        //Make Them Solo Parent if Possible
        //make a recursive function that will accept arguments such as solo nad getparents
        function soloedParents($soloParents, $getParents){
            if(count($getParents) == 0){
                return $soloParents;
            }

            $refRawParent = $getParents[0];
            $link = false;
            foreach($soloParents as $key=> $val){
                if($val['id'] == $refRawParent['id']){
                    $newDepthSolo = [];
                    $newDepthReference = [];
                    if(isset($val['child']))
                        $newDepthSolo = $val['child'];


                    if(isset($refRawParent['child']))
                        $newDepthReference = $refRawParent['child'];


                    $toLink = soloedParents($newDepthSolo, $newDepthReference);
                    $soloParents[$key]['child'] = $toLink;
                    $link = true;
                    break;
                }
            }
            if(!$link){
                $soloParents[] = $refRawParent;
            };
            array_splice($getParents, 0, 1);
            return soloedParents($soloParents, $getParents);
        };
        if($makeSoloParent)
            $soloParents = soloedParents([], $getParents);
        else
            $soloParents = $getParents;

        return $soloParents;

    }

    public function checkIfParentExist($category_path_list){ // return true if full path is exist else return the index where the link to child found deadend
        $allPath = CategoryPath::with('category')->get()->toArray();

        $result = false;
        $lastParent = null;
        foreach($category_path_list as $key => $val){
            if($val['id'] == null){
                $result = $key;
                break;
            }

            $checkIfPathActuallyExist = $this->murasaki($val['id'], $allPath);
            if(!$checkIfPathActuallyExist){
                $result = $key;
                break;
            }
            if( $checkIfPathActuallyExist['category_path_id'] === $lastParent ){
                $lastParent = $val['id'];
            }else{
                $result = $key;
                break;
            }

            if($key == count($category_path_list)-1){
                $result = true;
                break;
            }
        }

        return $result;
    }

    public static function murasaki($blue, $red){//return the categorypath of match id; BLUE means the id of categoryPath
        if(count($red) == 1){
            if($red[0]["id"] === $blue)
                return $red[0];
            else return false;
        }

        $lengthOfArray = count($red);
        $leftHalf = floor($lengthOfArray/2);
        $rightHalf =  $lengthOfArray - $leftHalf;
        $leftArray = array_slice($red, 0, $leftHalf);
        $rightArray = array_slice($red, $leftHalf, $rightHalf);
        $leftSide = OwnCategory::murasaki($blue, $leftArray);
        $rightSide = OwnCategory::murasaki($blue, $rightArray);


        if($leftSide === false){
            return $rightSide;
        }else{
            return $leftSide;
        }
    }

    public static function murasaki2($blue, $red){//return the categorypath of match parentid from argument id; BLUE means the id of categoryPath
        if(count($red) == 1){
            if($red[0]["category_path_id"] === $blue)
                return $red[0];
            else return false;
        }

        $lengthOfArray = count($red);
        $leftHalf = floor($lengthOfArray/2);
        $rightHalf =  $lengthOfArray - $leftHalf;
        $leftArray = array_slice($red, 0, $leftHalf);
        $rightArray = array_slice($red, $leftHalf, $rightHalf);
        $leftSide = OwnCategory::murasaki($blue, $leftArray);
        $rightSide = OwnCategory::murasaki($blue, $rightArray);


        if($leftSide === false){
            return $rightSide;
        }else{
            return $leftSide;
        }
    }

    public static function murasaki3($blue, $red){//return the categorypaths(array) of match parentid from argument id; BLUE means the id of categoryPath
        if(count($red) == 1){
            if($red[0]["category_path_id"] === $blue)
                return [$red[0]];
            else return [];
        }


        $lengthOfArray = count($red);
        $leftHalf = floor($lengthOfArray/2);
        $rightHalf =  $lengthOfArray - $leftHalf;
        $leftArray = array_slice($red, 0, $leftHalf);
        $rightArray = array_slice($red, $leftHalf, $rightHalf);
        $leftSide = OwnCategory::murasaki3($blue, $leftArray);
        $rightSide = OwnCategory::murasaki3($blue, $rightArray);

        $arrayReturn = [];
        if(count($leftSide)){
            $arrayReturn = array_merge($arrayReturn, $leftSide);
        }
        if(count($rightSide)){
            $arrayReturn = array_merge($arrayReturn, $rightSide);
        }
        return $arrayReturn;
    }

    public static function flatten($initial){
        $flat = [];
            foreach($initial as $key => $val){
                $flat[count($flat)] = [
                    "id"=>$val["id"],
                    "category_id"=>$val["category_id"],
                    "category"=>$val["category"],
                ];

                if( isset($val["child"]) ){
                    $newData = OwnCategory::flatten($val["child"]);
                    $flat = array_merge($flat, $newData);
                }
            }

            return $flat;
    }

};
