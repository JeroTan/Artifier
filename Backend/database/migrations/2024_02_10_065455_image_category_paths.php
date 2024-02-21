<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('image_category_paths', function (Blueprint $table) {
            $table->id();
            $table->foreignId('image_id')->nullable()->constrained('image')->nullOnDelete()->cascadeOnUpdate();
            $table->foreignId('category_path_id')->nullable()->constrained('category_path')->nullOnDelete()->cascadeOnUpdate();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::disableForeignKeyConstraints();
        Schema::dropIfExists('image_category_paths');
        Schema::enableForeignKeyConstraints();
    }
};
