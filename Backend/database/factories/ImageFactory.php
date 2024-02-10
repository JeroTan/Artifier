<?php

namespace Database\Factories;

use App\Models\CategoryPath;
use App\Models\Image;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Image>
 */
class ImageFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    protected $model = Image::class;

    public function definition(): array
    {
        $faked = $this->faker;
        return [
            "user_id"=>User::factory(),
            "category_path_id"=>CategoryPath::factory(),
            "title"=>$faked->sentence(3),
            "description"=>$faked->paragraph(),
            "image"=>$faked->imageUrl(640, 480, 'illustration', true),
        ];
    }
}
