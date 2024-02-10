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
        Schema::create('category_path', function (Blueprint $table) {
            $table->id();
            $table->foreignId('category_id')->constrained('category')->cascadeOnDelete()->cascadeOnUpdate();
        });
        Schema::table('category_path', function(Blueprint $table){
            $table->foreignId('category_path_id')->nullable()->constrained('category_path')->nullOnDelete()->cascadeOnUpdate();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::disableForeignKeyConstraints();
        Schema::dropIfExists('category_path');
        Schema::enableForeignKeyConstraints();
    }
};
