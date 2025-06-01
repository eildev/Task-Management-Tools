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
            $table->unsignedBigInteger('created_by')->unsigned();
            $table->unsignedBigInteger('assign_by')->unsigned();
            $table->string('assign_date')->nullable();
            $table->unsignedBigInteger('assign_to')->nullable();
            $table->date('deadline')->nullable();
            $table->enum('priority',['low','medium','high'])->default('low');
            $table->enum('status',['pending','inprogress','completed','cancelled','hold','rejected','approved','issues'])->default('pending');
            $table->unsignedBigInteger('project_id');
            $table->unsignedBigInteger('module_id');
            $table->unsignedBigInteger('submodule_id')->nullable();
            $table->unsignedBigInteger('feature_id')->nullable();
            $table->string('completetion_date')->nullable();
            $table->string('remarks')->nullable();
            $table->unsignedBigInteger('updated_by')->unsigned()->nullable();
            // $table->unsignedBigInteger('task_group_id')->nullable();
            $table->foreign('project_id')->references('id')->on('task_groups')->onDelete('cascade');
            $table->foreign('module_id')->references('id')->on('task_groups')->onDelete('cascade');
            $table->foreign('submodule_id')->references('id')->on('task_groups')->onDelete('cascade');
            $table->foreign('feature_id')->references('id')->on('task_groups')->onDelete('cascade');
            $table->foreign('created_by')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('updated_by')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('assign_by')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('assign_to')->references('id')->on('users')->onDelete('cascade');


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
