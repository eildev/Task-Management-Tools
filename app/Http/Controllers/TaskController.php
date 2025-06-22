<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Task;
use Inertia\Inertia;
use App\Models\TaskGroup;
use Illuminate\Support\Facades\Auth;
use App\Models\User;

class TaskController extends Controller
{
    public function index()
    {
        $taskGroups = TaskGroup::get();
        $users = User::get();
        return Inertia::render('Task/Task', ['taskGroups' => $taskGroups, 'users' => $users]);
    }

    public function manageTask()
    {
        $data = Task::with('assignUser')->get()->toArray();

        return Inertia::render('Task/TaskManage', [
            'data' => $data,
        ]);
    }

    public function taskBoard()
    {
        // $tasks = Task::where('assign_to', Auth::user()->id)->get();
        $inProgress = Task::where("status", 'inprogress')->where('assign_to', Auth::user()->id)->get();
        $completed = Task::where("status", 'completed')->where('assign_to', Auth::user()->id)->get();
        $pending = Task::where("status", 'pending')->where('assign_to', Auth::user()->id)->get();

        $data = [
            "inProgress" => $inProgress,
            "completed" => $completed,
            "pending" => $pending,
        ];

        return Inertia::render('Task/TaskBoard',  $data);
    }

    public function show($id)
    {
        $task = Task::with(['project', 'module', 'submodule', 'feature', 'assignedTo'])
            ->findOrFail($id);
        return response()->json([
            'success' => true,
            'task' => $task,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'required|string|max:1000',
            'attachment' => 'nullable|file|mimes:jpg,jpeg,png,pdf,doc,docx,xlsx,xls|max:2048',
            'assign_date' => 'nullable|date',
            'assign_to' => 'nullable|string|max:255',
            'deadline' => 'nullable|date',
            'status' => 'nullable|in:pending,inprogress,completed,cancelled,hold,rejected,approved,issues',
            'project_id' => 'required|exists:task_groups,id',
            'module_id' => 'required|exists:task_groups,id',
            'submodule_id' => 'nullable|exists:task_groups,id',
            'feature_id' => 'nullable|exists:task_groups,id',
            'completion_date' => 'nullable|date',
            'priority' => 'nullable|in:low,medium,high',
        ]);

        $validated['status'] = $validated['status'] ?? 'pending';
        $validated['priority'] = $validated['priority'] ?? 'low';

        $task = new Task($validated);

        if ($request->hasFile('attachment')) {
            $file = $request->file('attachment');
            $filename = time() . '.' . $file->extension();
            $path = 'uploads/tasks/';
            $file->move(public_path($path), $filename);
            $task->attachment = $path . $filename;
        }

        $task->assign_by = Auth::user()->id;
        $task->created_by = Auth::user()->id;
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
            'assign_date' => 'nullable|date',

            'assign_to' => 'nullable|string|max:255',
            'deadline' => 'nullable|date',
            'status' => 'required|in:pending,inprogress,completed,cancelled,hold,rejected,approved,issues',
            'project_id' => 'required|exists:task_groups,id',
            'module_id' => 'required|exists:task_groups,id',
            'submodule_id' => 'nullable|exists:task_groups,id',
            'feature_id' => 'nullable|exists:task_groups,id',
            'completion_date' => 'nullable|date',
        ]);
        $task = Task::find($id);
        $task->name = $request->name;
        $task->description = $request->description;
        $task->assign_date = $request->assign_date;
        $task->assign_by = Auth::user()->id;
        $task->assign_to = $request->assign_to;
        $task->deadline = $request->deadline;
        $task->status = $request->status;
        $task->module_id = $request->module_id;
        $task->submodule_id = $request->submodule_id;
        $task->feature_id = $request->feature_id;
        $task->priority = $request->priority;
        $task->completion_date = $request->completion_date;
        $task->updated_by = Auth::user()->id;
        if ($request->hasFile('attachment')) {
            $file = $request->file('attachment');
            $filename = time() . '_' . $file->Extension();
            $path = 'uploads/tasks/';
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

    public function status_change($id, Request $request)
    {
        $task = Task::find($id);
        $task->status = $request->status;
        $task->save();
        return Inertia::render('Tasks/Index', ['taskGroup' => $task]);
    }
}