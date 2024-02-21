<?php

namespace Database\Factories;

use App\Models\CategoryPath;
use App\Models\Image;
use App\Models\ImageCategoryPaths;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\ImageCategoryPaths>
 */
class ImageCategoryPathsFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */

    protected $model = ImageCategoryPaths::class;

    public function definition(): array
    {
        return [
            "image_id"=>Image::factory(),
            "category_path_id"=>CategoryPath::factory()
        ];
    }
}
