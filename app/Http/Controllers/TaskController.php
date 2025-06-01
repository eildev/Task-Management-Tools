<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Task;
use Illuminate\Container\Attributes\Auth;
use Inertia\Inertia;
use App\Models\TaskGroup;
use Illuminate\Support\Facades\Auth as FacadesAuth;
use App\Models\user;

class TaskController extends Controller
{
    public function index()
    {
        $tasks = Task::all();
        return Inertia::render('Tasks/Index', ['tasks' => $tasks]);
    }

    public function create()
    {
        return Inertia::render('Tasks/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'required|string|max:1000',
            'attachment' => 'nullable|file|mimes:jpg,jpeg,png,pdf,doc,docx,xlsx,xls|max:2048',
            'assign_date' => 'required|date',

            'assign_to' => 'required|string|max:255',
            'time_line' => 'required|string|max:255',
            'status' => 'required|in:pending,inprogress,completed,cancelled,hold,rejected,approved,issues',
            'module_id' => 'nullable|exists:task_groups,id',
            'submodule_id' => 'nullable|exists:task_groups,id',
            'feature_id' => 'nullable|exists:task_groups,id',
            'completetion_date' => 'nullable|date',
        ]);

        $task = new Task($validated);

        if ($request->hasFile('attachment')) {
            $file = $request->file('attachment');
            $filename = time() . '_' . $file->Extension();
            $path = 'attachments/tasks/';
            $file->move(public_path($path), $filename);
            $task->attachment = $path . $filename;
        }
        $task->assign_by = FacadesAuth::user()->id;
        $task->save();

        return response()->json([
            'success' => true,
            'message' => 'Task created successfully!',
            'task' => $task,
        ]);
    }

    public function edit($id)
    {
        $task = Task::find($id);
        return Inertia::render('Tasks/Edit', ['task' => $task]);
    }

    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'required|string|max:1000',
            'attachment' => 'nullable|file|mimes:jpg,jpeg,png,pdf,doc,docx,xlsx,xls|max:2048',
            'assign_date' => 'required|date',
            'assign_by' => 'required|string|max:255',
            'assign_to' => 'required|string|max:255',
            'time_line' => 'required|string|max:255',
            'status' => 'required|in:pending,inprogress,completed,cancelled,hold,rejected,approved,issues',
            'module_id' => 'nullable|exists:task_groups,id',
            'submodule_id' => 'nullable|exists:task_groups,id',
            'feature_id' => 'nullable|exists:task_groups,id',
            'completetion_date' => 'nullable|date',
        ]);
        $task = Task::find($id);
        $task->name = $request->name;
        $task->description = $request->description;
        $task->assign_date = $request->assign_date;
        $task->assign_by = FacadesAuth::user()->id;
        $task->assign_to = $request->assign_to;
        $task->time_line = $request->time_line;
        $task->status = $request->status;
        $task->module_id = $request->module_id;
        $task->submodule_id = $request->submodule_id;
        $task->feature_id = $request->feature_id;
        $task->completetion_date = $request->completetion_date;
        if ($request->hasFile('attachment')) {
            $file = $request->file('attachment');
            $filename = time() . '_' . $file->Extension();
            $path = 'attachments/tasks/';
            $file->move(public_path($path), $filename);
            $task->attachment = $path . $filename;
        }
        $task->save();
        return response()->json([
            'success' => true,
            'message' => 'Task updated successfully!',
            'task' => $task,
        ]);
    }

    public function destroy($id)
    {
        $task = Task::find($id);
        $task->delete();
        return response()->json([
            'success' => true,
            'message' => 'Task deleted successfully!',
        ]);
    }

    public function show($id)
    {
        $task = Task::find($id);
        return Inertia::render('Tasks/Show', ['task' => $task]);
    }
}
