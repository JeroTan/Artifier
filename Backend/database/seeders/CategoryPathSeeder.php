<?php

namespace Database\Seeders;

use App\Models\CategoryPath;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class CategoryPathSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        CategoryPath::factory()->count(10)->create();
    }
}
