<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\TaskGroup;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;


class TaskGroupController extends Controller
{
    public function index()
    {
        $taskGroups = TaskGroup::all();
        return Inertia::render('TaskGroups/Index', ['taskGroups' => $taskGroups]);
    }

    public function create()
    {
        return Inertia::render('TaskGroups/Create');
    }

    public function store(Request $request)
    {
        // Define type-based name field labels
        $typeLabels = [
            'project' => 'Project name',
            'module' => 'Module name',
            'submodule' => 'Submodule name',
            'feature' => 'Feature name',
        ];

        // Get the label for the given type, or use a default
        $nameLabel = $typeLabels[$request->type] ?? 'Task Group name';

        // Define validation rules
        $rules = [
            'name' => 'required|string|max:255',
            'type' => 'required|string|max:255',
            'description' => 'nullable|string',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,pdf|max:2048',
        ];

        // Define custom validation messages
        $messages = [
            'name.required' => "The {$nameLabel} is required.",
            'name.string' => "The {$nameLabel} must be a string.",
            'name.max' => "The {$nameLabel} may not be greater than 255 characters.",
            'type.required' => 'The type is required.',
            'type.string' => 'The type must be a string.',
            'type.max' => 'The type may not be greater than 255 characters.',
            'end_date.after_or_equal' => 'The end date must be a date after or equal to the start date.',
            'image.image' => 'The attachment must be an image or PDF.',
            'image.mimes' => 'The attachment must be a file of type: jpeg, png, jpg, pdf.',
            'image.max' => 'The attachment may not be greater than 2048 kilobytes.',
        ];

        // Validate the request
        $request->validate($rules, $messages);

        // Create a new TaskGroup
        $taskGroup = new TaskGroup();
        $taskGroup->name = $request->name;
        $taskGroup->type = $request->type;
        $taskGroup->description = $request->description;
        $taskGroup->start_date = $request->start_date;
        $taskGroup->end_date = $request->end_date;
        $taskGroup->created_by = Auth::user()->id;

        // Handle image upload
        if ($request->hasFile('image')) {
            $image = $request->file('image');
            $imageName = time() . '.' . $image->getClientOriginalExtension();
            $path = public_path('/uploads/taskGroups/');
            $image->move($path, $imageName);
            $taskGroup->image = '/uploads/taskGroups/' . $imageName;
        }

        // Save the TaskGroup
        $taskGroup->save();

        // Define success message based on type
        $typeMessages = [
            'project' => 'Project created successfully!',
            'module' => 'Module created successfully!',
            'submodule' => 'Submodule created successfully!',
            'feature' => 'Feature created successfully!',
        ];

        // Get the success message for the given type
        $message = $typeMessages[$request->type] ?? 'Task Group created successfully!';

        // Return JSON response
        return response()->json([
            'success' => true,
            'message' => $message,
            'taskGroup' => $taskGroup,
        ], 201);
    }


    public function edit($id)
    {
        $taskGroup = TaskGroup::find($id);
        return Inertia::render('TaskGroups/Edit', ['taskGroup' => $taskGroup]);
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'type' => 'required|string|max:255',
        ]);
        $taskGroup = TaskGroup::find($id);
        $taskGroup->name = $request->name;
        $taskGroup->type = $request->type;
        $taskGroup->description = $request->description;
        $taskGroup->start_date = $request->start_date;
        $taskGroup->end_date = $request->end_date;
        $taskGroup->updated_by = Auth::user()->id;
        if ($request->hasFile('image')) {
            if ($taskGroup->image && file_exists(public_path($taskGroup->image))) {
                unlink(public_path($taskGroup->image));
            }
            $image = $request->file('image');
            $imageName = time() . '.' . $image->Extension();
            $path = "/images/taskGroups/";
            $image->move(public_path($path), $imageName);
            $taskGroup->image = $path . $imageName;
        }
        $taskGroup->save();
        return response()->json([
            'success' => true,
            'message' => 'Task Group Updated successfully!',
            'taskGroup' => $taskGroup,
        ]);
    }

    public function show($id)
    {
        $taskGroup = TaskGroup::find($id);
        return Inertia::render('TaskGroups/Show', ['taskGroup' => $taskGroup]);
    }

    public function destroy($id)
    {
        $taskGroup = TaskGroup::find($id);
        if ($taskGroup->image && file_exists(public_path($taskGroup->image))) {
            unlink(public_path($taskGroup->image));
        }
        $taskGroup->delete();
        return response()->json([
            'success' => true,
            'message' => 'Task Group Deleted successfully!',
            'taskGroup' => $taskGroup,
        ]);
    }
}
