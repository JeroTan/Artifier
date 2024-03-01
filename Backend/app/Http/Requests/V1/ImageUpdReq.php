<?php

namespace App\Http\Requests\V1;

use App\Helper\V1\KeyConverter;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;

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
        return [
            'imageId'=>'required|exists:image,id',
            'title'=>'required|max:256',
            'description'=>'array',
            'description.*'=>'nullable|string',
            'categoryPathId'=>"required|array|min:1",
            "categoryPathId.*"=>"required|exists:category_path,id",
        ];
    }

    protected function prepareForValidation()
    {
        $this->merge([
            'categoryPathId'=>$this->input('categoryPathId') === null ? [] : json_decode($this->input('categoryPathId', true)),
            'description'=> $this->input('description') === null ? [] : $this->input('description'),
        ]);
    }

    protected function passedValidation()
    {
        $this->replace([
            'description' => json_encode($this->description),
            'title' => $this->title,
            'category_path_id' => $this->categoryPathId,
            'image_id'=>$this->imageId,
        ]);
    }
}
