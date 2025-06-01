<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\TaskGroup;
use Inertia\Inertia;
class TaskGroupController extends Controller
{
    public function index(){
        $taskGroups = TaskGroup::all();
        return Inertia::render('TaskGroups/Index',['taskGroups' => $taskGroups]);
    }

    public function create(){
        return Inertia::render('TaskGroups/Create');
    }

    

}
