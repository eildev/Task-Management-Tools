<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

use App\Http\Controllers\TaskGroupController;
use App\Http\Controllers\TaskController;
use App\Http\Controllers\SprintController;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\UserController;


Route::get('/', function () {
    return Inertia::render('Auth/Login', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});


Route::middleware('auth')->group(function () {


    Route::get('/admindashboard', [DashboardController::class, 'index'])->name('adminDashboard');

    Route::controller(TaskController::class)->group(function () {
        Route::get('/task', 'index')->name('task.index');
        Route::get('/task-manage', 'manageTask')->name('task.manage');
        Route::get('/task-board', 'taskBoard')->name('task.board');
        Route::post('/task/store', 'store')->name('task.store');
        Route::get('/tasks/{task}', 'show')->name('tasks.show');
        Route::get('/tasks/edit/{task}', 'edit')->name('tasks.edit');
        Route::post('/task/update/{id}', 'update')->name('tasks.update');
        Route::delete('/tasks/delete/{task}', 'destroy')->name('tasks.destroy');
        Route::patch('/tasks/{id}/status', 'updateTaskStatus')->name('tasks.status.update');
    });
    Route::controller(TaskGroupController::class)->group(function () {
        Route::post('/task-groups', 'store')->name('task-groups.store');
        Route::get('/task-groups/view', 'view')->name('task.groups.view');
        Route::get('/task-groups/{taskGroup}', 'show')->name('task-groups.show');
        Route::get('/task-groups/{taskGroup}/edit', 'edit')->name('task-groups.edit');
        Route::put('/task-groups/{taskGroup}', 'update')->name('task-groups.update');
        Route::delete('/task-groups/{taskGroup}', 'destroy')->name('task-groups.destroy');
    });

    Route::controller(SprintController::class)->group(function () {
        Route::get('/sprints', 'index')->name('sprints.index');
        Route::get('/sprints/create', 'create')->name('sprints.create');
        Route::post('/sprints', 'store')->name('sprints.store');
        Route::get('/sprints/{sprint}', 'show')->name('sprints.show');
        Route::get('/sprints/{sprint}/edit', 'edit')->name('sprints.edit');
        Route::put('/sprints/{sprint}', 'update')->name('sprints.update');
        Route::delete('/sprints/{sprint}', 'destroy')->name('sprints.destroy');
    });

    Route::controller(ProfileController::class)->group(function () {
        Route::get('/viewprofile', 'edit')->name('profile.edit');
        Route::post('/profile', 'update')->name('profile.update');
        Route::delete('/profile', 'destroy')->name('profile.destroy');
    });

    // Route::controller(RegisteredUserController::class)->group(function () {
    //     Route::get('/register', 'create')->name('register');
    //     Route::post('/register', 'store')->name('register.store');
    // });
    Route::controller(UserController::class)->group(function () {
        Route::get('/users/index', 'index')->name('users.index');
        Route::get('/users/create', 'create')->name('users.create');
        Route::post('/users/store', 'store')->name('users.store');
        Route::get('/users/{user}', 'show')->name('users.show');
        Route::get('/users/{user}/edit', 'edit')->name('users.edit');
        Route::put('/users/{user}', 'update')->name('users.update');
        Route::get('/users/{user_id}/delete', 'destroy')->name('users.destroy');
    });
});






// Route::get('/dashboard', function () {
//     return Inertia::render('Dashboard');
// })->middleware(['auth', 'verified'])->name('dashboard');



require __DIR__ . '/auth.php';