<?php

namespace App\Http\Requests\V1;

use Illuminate\Foundation\Http\FormRequest;

class LoginReq extends FormRequest
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

    public function messages(): array
    {
        return [
            'username.required' => 'You forget your username.',
            'password.required' => 'Your forget your password.',
        ];
    }
    public function rules(): array
    {
        return [
            'username'=>'required',
            'password'=>'required',
        ];
    }
}
