<?php

namespace App\Http\Requests\V1;

use Illuminate\Foundation\Http\FormRequest;

class SignupReq extends FormRequest
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
            'username.max'=> 'The username only accept maximum of 32 characters',
            'username.regex'=> 'The username should only be an alphabet or number or -_.,\'"',
            'username.unique'=> 'The username is already used.',
            'password.required' => 'Your forget your password.',
            'password.min'=>'The password should be at least 8 characters long.',
            'password.max'=>'The password character limit is 256.',
            'password.same'=>'The password does not match with your confirm password.',
            'confirmPassword.required' => 'You forget to confirm your password.',
            'confirmPassword.min'=>'The password should be at least 8 characters long.',
            'confirmPassword.max'=>'The password character limit is 256.',
            'confirmPassword.same'=>'The password does not match with your confirm password.',
        ];
    }
    public function rules(): array
    {
        return [
            'username'=>'required|max:32|regex:/^[a-zA-Z0-9\,\.\-\_\"\'\s]*$/|unique:user,username',
            'password'=>'required|min:8|max:256|same:confirmPassword',
            'confirmPassword'=>'required|min:8|max:256|same:password',
        ];
    }
}
