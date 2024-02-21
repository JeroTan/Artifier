<?php
namespace App\Helper\V1;

use App\Models\Category;
use App\Models\CategoryPath;
use App\Models\Image;
use App\Models\User;
use Illuminate\Support\Facades\Auth;

class OwnCategory{

    public function get(){
        $user = Auth::user();
        $image = Image::select('category_path_id')->where('user_id', $user->id);
        $category_path = CategoryPath::where('id', $image)->get()->toArray();
        $categoryID =  $this->filterCategory($category_path);
        return Category::whereIn('id',$categoryID)->get()->toArray();
    }


    public function getPathTree(){
        $user = Auth::user();
        $image = Image::select('category_path_id')->where('user_id', $user->id);
        $category_path = CategoryPath::with('category')->where('id', $image)->get()->toArray();
        $categoryPathTree = $this->pathingCategory($category_path);
        return $categoryPathTree;
    }

    protected function pathingCategory($data){
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

        $getParents =[];
        foreach($data as $val){
            if($val["category_path_id"] !== null)
                $getParents = [...$getParents,...linkDepth($val, $allPath)];
            else
                $getParents[] = $val;
        }

        //Make Them Solo Parent
        //make a recursive function that will accept arguments such as solo nad getparents
        function soloedParents($soloParents, $getParents){
            if(count($getParents) == 0){
                return $soloParents;
            }

            $refRawParent = $getParents[0];
            $link = false;
            foreach($soloParents as $key=> $val){
                if($val['id'] == $refRawParent['id']){
                    $toLink = soloedParents($soloParents[$key]['child'], $refRawParent['child']);
                    $soloParents[$key]['child'] = [$toLink];
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
        $soloParents = soloedParents([], $getParents);

        return $soloParents;

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
                $allCategory = array_merge($allCategory, domainExpansion($val["category_path_id"], $allPath ));
            }
        }

        return $allCategory;
    }

    public static function murasaki($blue, $red){//return the categorypath id of parent value; BLUE means the id of categoryPath
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

};
