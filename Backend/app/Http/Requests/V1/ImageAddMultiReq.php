<?php

namespace App\Http\Requests\V1;

use Illuminate\Foundation\Http\FormRequest;

class ImageAddMultiReq extends FormRequest
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
        return [
            '*.userId'=>'required',
            '*.categoryPathId'=>'required',
            '*.title'=>'required',
            '*.description'=>'required',
            '*.image'=>'required',
        ];
    }

    protected function prepareForValidation()
    {
        $merger = [];
        foreach($this->toArray() as $val){
            $val['user_id'] = $val['userId'] ?? null;
            $val['category_path_id'] = $val['categoryPathId'] ?? null;
            $merger[] = $val;
        };

        $this->merge($merger);
    }
}
