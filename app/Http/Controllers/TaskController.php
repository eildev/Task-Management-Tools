<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Task;
use Inertia\Inertia;
use App\Models\TaskGroup;
use Illuminate\Support\Facades\Auth;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

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
        try {
            $user = Auth::user();
            $isAdmin = $user->role === 'admin' || $user->role === 'superadmin';

            // Build the query
            $query = Task::with(['assignUser' => function ($query) {
                $query->select('id', 'name', 'email'); // Optimize by selecting only needed fields
            }]);

            if (!$isAdmin) {
                // For non-admin users, fetch tasks they created OR are assigned to
                $query->where(function ($q) use ($user) {
                    $q->where('assign_to', $user->id)
                        ->orWhere('created_by', $user->id);
                });
            }

            // Fetch and map data
            $data = $query->get()->map(function ($task) {
                return [
                    'id' => $task->id,
                    'name' => $task->name,
                    'description' => $task->description,
                    'attachment' => $task->attachment,
                    'created_by' => $task->created_by,
                    'assign_by' => $task->assign_by,
                    'assign_date' => $task->assign_date,
                    'assign_to' => $task->assign_to,
                    'deadline' => $task->deadline ? Carbon::parse($task->deadline)->format('d M Y') : null,
                    'priority' => $task->priority,
                    'status' => $task->status,
                    'project_id' => $task->project_id,
                    'module_id' => $task->module_id,
                    'submodule_id' => $task->submodule_id,
                    'feature_id' => $task->feature_id,
                    'completion_date' => $task->completion_date,
                    'remarks' => $task->remarks,
                    'updated_by' => $task->updated_by,
                    'assigned_user' => $task->assignUser ? [
                        'id' => $task->assignUser->id,
                        'name' => $task->assignUser->name,
                        'email' => $task->assignUser->email,
                        'image' => $task->assignUser->image,
                    ] : null,
                    "project" => $task->project->name,
                    "module" => $task->module->name,
                ];
            })->toArray();

            return Inertia::render('Task/TaskManage', [
                'data' => $data,
            ]);
        } catch (\Exception $e) {
            Log::error('Error fetching tasks: ' . $e->getMessage());
            return Inertia::render('Error', [
                'message' => 'An error occurred while loading tasks. Please try again later.',
            ]);
        }
    }

    public function taskBoard()
    {
        try {
            $user = Auth::user();
            $isAdmin = $user->role === 'admin' || $user->role === 'superadmin';

            // Build queries based on role
            if ($isAdmin) {
                // Admins see all tasks
                $inProgress = Task::where('status', 'inprogress')->get();
                $completed = Task::where('status', 'completed')->get();
                $pending = Task::where('status', 'pending')->get();
            } else {
                // Users see only their assigned tasks
                $inProgress = Task::where('status', 'inprogress')
                    ->where('assign_to', $user->id)
                    ->get();
                $completed = Task::where('status', 'completed')
                    ->where('assign_to', $user->id)
                    ->get();
                $pending = Task::where('status', 'pending')
                    ->where('assign_to', $user->id)
                    ->get();
            }

            // Map data to ensure consistent format
            $data = [
                'inProgress' => $inProgress->map(function ($task) {
                    return [
                        'id' => $task->id,
                        'name' => $task->name,
                        'description' => $task->description,
                        'priority' => $task->priority,
                        'assign_date' => $task->assign_date ? Carbon::parse($task->assign_date)->format('d M Y') : null,
                        'attachment' => $task->attachment,
                        'status' => $task->status,
                    ];
                })->toArray(),
                'completed' => $completed->map(function ($task) {
                    return [
                        'id' => $task->id,
                        'name' => $task->name,
                        'description' => $task->description,
                        'priority' => $task->priority,
                        'assign_date' => $task->assign_date ? Carbon::parse($task->assign_date)->format('d M Y') : null,
                        'attachment' => $task->attachment,
                        'status' => $task->status,
                    ];
                })->toArray(),
                'pending' => $pending->map(function ($task) {
                    return [
                        'id' => $task->id,
                        'name' => $task->name,
                        'description' => $task->description,
                        'priority' => $task->priority,
                        'assign_date' => $task->assign_date ? Carbon::parse($task->assign_date)->format('d M Y') : null,
                        'attachment' => $task->attachment,
                        'status' => $task->status,
                    ];
                })->toArray(),
            ];

            return Inertia::render('Task/TaskBoard', $data);
        } catch (\Exception $e) {
            Log::error('Error fetching task board data: ' . $e->getMessage());
            return Inertia::render('Error', [
                'message' => 'An error occurred while loading the task board. Please try again later.',
            ]);
        }
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

    public function show($id)
    {
        $task = Task::with(['project', 'module', 'submodule', 'feature', 'assignUser', "assignBy"])
            ->findOrFail($id);

        return Inertia::render('Task/TaskDetailsPage', ['tasks' => $task]);
    }

    public function edit($id)
    {
        $taskGroups = TaskGroup::get();
        $users = User::get();
        $task = Task::with(['project', 'module', 'submodule', 'feature', 'assignUser', "assignBy"])
            ->findOrFail($id);
        return Inertia::render('Task/TaskEditPage', ['task' => $task, 'taskGroups' => $taskGroups, "users" => $users]);
    }

    public function update(Request $request, $id)
    {
        // dd($request->all());
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'required|string|max:1000',
            'attachment' => 'nullable|file|mimes:jpg,jpeg,png,pdf,doc,docx,xls,xlsx|max:2048',
            'assign_date' => 'nullable|date',
            'assign_to' => 'nullable|exists:users,id',
            'deadline' => 'nullable|date',
            'status' => 'required|in:pending,inprogress,completed,cancelled,hold,rejected,approved,issues',
            'project_id' => 'required|exists:task_groups,id',
            'module_id' => 'required|exists:task_groups,id',
            'submodule_id' => 'nullable|exists:task_groups,id',
            'feature_id' => 'nullable|exists:task_groups,id',
            'completion_date' => 'nullable|date',
            'remarks' => 'nullable|string|max:1000',
            'priority' => 'required|in:low,medium,high',
        ]);

        $task = Task::findOrFail($id);

        // Handle file upload
        if ($request->hasFile('attachment')) {
            // Delete old attachment if it exists
            if ($task->attachment && Storage::disk('public')->exists($task->attachment)) {
                Storage::disk('public')->delete($task->attachment);
            }

            // Store new attachment
            $file = $request->file('attachment');
            $filename = time() . '.' . $file->getClientOriginalExtension();
            $path = $file->storeAs('uploads/tasks', $filename, 'public');
            $validated['attachment'] = $path;
        }

        // Update task
        $task->update([
            'name' => $validated['name'],
            'description' => $validated['description'],
            'assign_date' => $validated['assign_date'],
            'assign_by' => Auth::user()->id,
            'assign_to' => $validated['assign_to'],
            'deadline' => $validated['deadline'],
            'status' => $validated['status'],
            'module_id' => $validated['module_id'],
            'submodule_id' => $validated['submodule_id'],
            'feature_id' => $validated['feature_id'],
            'priority' => $validated['priority'],
            'completion_date' => $validated['completion_date'],
            'remarks' => $validated['remarks'],
            'updated_by' => Auth::user()->id,
            'attachment' => $validated['attachment'] ?? $task->attachment,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Task updated successfully!',
            'task' => $task,
        ], 200);
    }

    public function destroy($id)
    {
        $task = Task::find($id);

        if ($task->attachment && Storage::disk('public')->exists($task->attachment)) {
            Storage::disk('public')->delete($task->attachment);
        }

        $task->delete();
        return response()->json([
            'success' => true,
            'message' => 'Task deleted successfully!',
        ]);
    }

    public function updateTaskStatus($id, Request $request)
    {
        try {
            $user = Auth::user();
            $task = Task::findOrFail($id);

            // Validate request
            $request->validate([
                'status' => ['required', 'in:pending,inprogress,completed'],
            ]);

            // Check permissions
            if (!$user->role === 'admin' && !$user->role === 'superadmin' && $task->assign_to !== $user->id) {
                return response()->json(['error' => 'Unauthorized'], 403);
            }

            // Update status
            $task->status = $request->status;
            $task->save();

            return response()->json(['message' => 'Status updated successfully']);
        } catch (\Exception $e) {
            Log::error('Error updating task status: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to update status'], 500);
        }
    }
}
