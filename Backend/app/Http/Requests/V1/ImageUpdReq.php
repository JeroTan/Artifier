<?php

namespace App\Http\Requests\V1;

use Illuminate\Foundation\Http\FormRequest;

class ImageUpdReq extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $methodUsed = $this->method();
        $rules = [
            'userId'=>["required"],
            'categoryPathId'=>["required"],
            'title'=>["required"],
            'description'=>["required"],
            'image'=>["required"],
        ];

        if($methodUsed == 'PATCH'){
            foreach($rules as $key => $val){
                $rules[$key] = ["sometimes", ...$val];
            };
        }

        return $rules;
    }

    protected function prepareForValidation()
    {
        $methodUsed = $this->method();
        $merger = [];

        if($methodUsed == 'PATCH'){
            if($this?->userId){
                $merger['user_id']=$this->userId;
            }
            if($this?->categoryPathId){
                $merger['category_path_id']=$this->categoryPathId;
            }
        }else{
            $merger = [
                'user_id'=>$this->userId,
                'category_path_id'=>$this->categoryPathId,
            ];
        }


        if($merger)
            $this->merge($merger);
    }
}
