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
        Schema::create('tasks', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('description');
            $table->string('attachment')->nullable();
            $table->string('assign_date');
            $table->string('assign_by');
            $table->string('assign_to');
            $table->string('time_line');
            $table->enum('status',['pending','inprogress','completed','cancelled','hold','rejected','approved','issues'])->default('pending');
            $table->unsignedBigInteger('module_id')->nullable();
            $table->unsignedBigInteger('submodule_id')->nullable();
            $table->unsignedBigInteger('feature_id')->nullable();
            $table->string('completetion_date')->nullable();
            // $table->unsignedBigInteger('task_group_id')->nullable();

            $table->foreign('module_id')->references('id')->on('task_groups')->onDelete('cascade');
            $table->foreign('submodule_id')->references('id')->on('task_groups')->onDelete('cascade');
            $table->foreign('feature_id')->references('id')->on('task_groups')->onDelete('cascade');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tasks');
    }
};
