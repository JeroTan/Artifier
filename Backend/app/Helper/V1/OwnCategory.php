<?php
namespace App\Helper\V1;

use App\Models\Category;
use App\Models\CategoryPath;
use App\Models\Image;
use App\Models\User;

class OwnCategory{

    public function get(){
        $user = User::find(9);
        $image = Image::select('category_path_id')->where('user_id', $user->id);
        $category_path = CategoryPath::where('id', $image)->get()->toArray();
        $categoryID =  $this->filterCategory($category_path);
        return Category::whereIn('id',$categoryID)->get()->toArray();
    }

    protected function filterCategory($data){
        $allCategory = [];
        $allPath = CategoryPath::all()->toArray();


        function murasaki($red, $blue){//return the categorypath id of parent value; BLUE means the id of categoryPath
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
            $leftSide = murasaki($leftArray, $blue);
            $rightSide = murasaki($rightArray, $blue);


            if($leftSide === false){
                return $rightSide;
            }else{
                return $leftSide;
            }
        }

        function domainExpansion($limitless, $energy){ ///ENERGY means all the category
            $arrayToReturn = [];
            $result = murasaki($energy, $limitless);
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
};
