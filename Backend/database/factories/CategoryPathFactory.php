<?php

namespace Database\Factories;

use App\Models\Category;
use App\Models\CategoryPath;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\CategoryPath>
 */
class CategoryPathFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    protected $model = CategoryPath::class;

    public function definition(): array
    {
        $categoryLinked = CategoryPath::get()->count() ? ( rand(0,1) ? CategoryPath::factory() : null  ) : null;
        return [
            "category_path_id"=>$categoryLinked,
            "category_id"=>Category::factory(),
        ];
    }
}
