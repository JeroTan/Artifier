<?php

namespace Database\Seeders;

use App\Models\ImageCategoryPaths;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ImageCategoryPathsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        //Image::factory()->count(10)->create();
        ImageCategoryPaths::factory()->count(30)->create();
    }
}
