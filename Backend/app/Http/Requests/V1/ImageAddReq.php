<?php

namespace App\Http\Requests\V1;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;

class ImageAddReq extends FormRequest
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
            'user_id'=>'required',
            'title'=>'required|max:256',
            'description'=>'array',
            'description.*'=>'nullable|string',
            'image'=>'required|image|max:10000',
            'categoryPathId'=>"required|array|min:1",
            "categoryPathId.*"=>"required|exists:category_path,id",
        ];
    }

    protected function prepareForValidation()
    {
        $this->merge([
            'user_id'=>Auth::user()->id,
            'description'=>$this->input('description')  === null ? [] : json_decode($this->input('description'), true),
            'categoryPathId'=>$this->input('categoryPathId') === null ? [] : json_decode($this->input('categoryPathId', true))
        ]);
    }

    protected function passedValidation()
    {
        $this->replace([
            'user_id'=> $this->user_id,
            'description' => json_encode($this->description),
            'title' => $this->title,
            'image' => $this->image,
            'category_path_id' => $this->categoryPathId,
        ]);
    }
}
