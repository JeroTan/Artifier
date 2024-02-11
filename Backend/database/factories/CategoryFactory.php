<?php

namespace Database\Factories;

use App\Models\Category;
use App\Models\CategoryPath;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Category>
 */
class CategoryFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    protected $model = Category::class;

    public function definition(): array
    {
        //$categories = ['Genshin Impact', 'Project Sekai', 'Honkai Star Rail', 'Honkai Impact 3rd', 'Others'];
        $faked = $this->faker;
        $rgb = rand(0,255).", ".rand(0,255).", ".rand(0,255);
        $color = "rgb($rgb)";
        return [
            "name"=>$faked->word(),
            "color"=>$color,
        ];
    }
}
