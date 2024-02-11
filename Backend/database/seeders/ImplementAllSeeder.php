<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\CategoryPath;
use App\Models\Image;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ImplementAllSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $image = Image::factory(10)->create();
        //This One Image Implements Everything AMAZING
    }
}
