<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

use App\Http\Controllers\TaskGroupController;
use App\Http\Controllers\TaskController;


// Route::get('/', function () {
//     return Inertia::render('Welcome', [
//         'canLogin' => Route::has('login'),
//         'canRegister' => Route::has('register'),
//         'laravelVersion' => Application::VERSION,
//         'phpVersion' => PHP_VERSION,
//     ]);
// });

// Route::get('/', function () {
//     return Inertia::render('Home');
// });

Route::get('/', [DashboardController::class, 'index']);
Route::get('/task', function () {
    return Inertia::render('Task');
});

Route::middleware('auth')->group(function () {

    Route::controller(TaskController::class)->group(function () {
        Route::get('/tasks', 'index')->name('tasks.index');
        Route::get('/tasks/create', 'create')->name('tasks.create');
        Route::post('/tasks', 'store')->name('tasks.store');
        Route::get('/tasks/{task}', 'show')->name('tasks.show');
        Route::get('/tasks/{task}/edit', 'edit')->name('tasks.edit');
        Route::put('/tasks/{task}', 'update')->name('tasks.update');
        Route::delete('/tasks/{task}', 'destroy')->name('tasks.destroy');
    });
    Route::controller(TaskGroupController::class)->group(function () {
        Route::get('/task-groups', 'index')->name('task-groups.index');
        Route::get('/task-groups/create', 'create')->name('task-groups.create');
        Route::post('/task-groups', 'store')->name('task-groups.store');
        Route::get('/task-groups/{taskGroup}', 'show')->name('task-groups.show');
        Route::get('/task-groups/{taskGroup}/edit', 'edit')->name('task-groups.edit');
        Route::put('/task-groups/{taskGroup}', 'update')->name('task-groups.update');
        Route::delete('/task-groups/{taskGroup}', 'destroy')->name('task-groups.destroy');
    });
});






Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__ . '/auth.php';
