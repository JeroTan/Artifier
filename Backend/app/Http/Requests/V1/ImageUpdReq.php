<?php

namespace App\Http\Requests\V1;

use App\Helper\V1\KeyConverter;
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
        $merger = [
            'user_id'=>false,
        ];
        $kChange = new KeyConverter;

        foreach($merger as $key => $val){
            if( $methodUsed == 'PATCH' || $this->input( $kChange->fromSnakeCase($key)->toCamelCase() ) != null ){
                $queryKey =  $kChange->fromSnakeCase($key)->toCamelCase();
                $merger[$key] = $this->$queryKey ;
            }else{
                unset($merger[$key]);
            }
        }


        if($merger)
            $this->merge($merger);
    }
}
