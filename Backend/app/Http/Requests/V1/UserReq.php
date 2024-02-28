<?php

namespace App\Http\Requests\V1;


use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;

class UserReq extends FormRequest
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
            "username"=>[
                "sometimes",
                "required",
                "max:32",
                "regex:/^[a-zA-Z0-9\,\.\-\_\"\'\s]*$/",
                Rule::unique("user", "username")->ignore(Auth::user()->id),
            ],
            "password"=>"required",
            "newPassword"=>"sometimes|required|min:8|max:256|same:confirmPassword",
            "confirmPassword"=>"sometimes|required|min:8|max:256|same:newPassword"
        ];
    }

    public function messages(): array
    {
        return [
            'username.required' => 'You forget your username.',
            'username.max'=> 'The username only accept maximum of 32 characters',
            'username.regex'=> 'The username should only be an alphabet or number or -_.,\'"',
            'username.unique'=> 'The username is already used.',
            'password.required' => 'Your forget your current password for verification.',
            'newPassword.required' => 'Your forget your new newPassword.',
            'newPassword.min'=>'The password should be at least 8 characters long.',
            'newPassword.max'=>'The password character limit is 256.',
            'newPassword.same'=>'The password does not match with your confirm password.',
            'confirmPassword.required' => 'You forget to confirm your password.',
            'confirmPassword.min'=>'The password should be at least 8 characters long.',
            'confirmPassword.max'=>'The password character limit is 256.',
            'confirmPassword.same'=>'The password does not match with your new password.',
        ];
    }
}
