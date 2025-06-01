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

    public function store(Request $request){
        $request->validate([
            'name' => 'required|string|max:255',
            'type' => 'required|string|max:255',
        ]);

        $taskGroup = new TaskGroup();
        $taskGroup->name = $request->name;
        $taskGroup->type = $request->type;
            $taskGroup->description = $request->description;
        if($request->hasFile('image')){
            $image= $request->file('image');
            $imageName = time().'.'.$image->Extension();
            $path="/images/taskGroups/";
            $image->move(public_path($path),$imageName);
            $taskGroup->image = $path.$imageName;
        }
        $taskGroup->save();

        // return to_route('taskGroups.index');
        return response()->json([
                'success' => true,
                'message' => 'Task Group created successfully!',
                'taskGroup' => $taskGroup,
            ]);
          }


    public function edit($id){
        $taskGroup = TaskGroup::find($id);
        return Inertia::render('TaskGroups/Edit',['taskGroup' => $taskGroup]);
    }

    public function update(Request $request, $id){
        $request->validate([
            'name' => 'required|string|max:255',
            'type' => 'required|string|max:255',
        ]);
        $taskGroup = TaskGroup::find($id);
        $taskGroup->name = $request->name;
        $taskGroup->type = $request->type;
        $taskGroup->description = $request->description;
        if($request->hasFile('image')){
            if($taskGroup->image && file_exists(public_path($taskGroup->image))){
                unlink(public_path($taskGroup->image));
            }
            $image=$request->file('image');
            $imageName = time().'.'.$image->Extension();
            $path="/images/taskGroups/";
            $image->move(public_path($path),$imageName);
            $taskGroup->image = $path.$imageName;
        }
        $taskGroup->save();
         return response()->json([
                'success' => true,
                'message' => 'Task Group Updated successfully!',
                'taskGroup' => $taskGroup,
            ]);

    }

    public function show($id){
        $taskGroup = TaskGroup::find($id);
        return Inertia::render('TaskGroups/Show',['taskGroup' => $taskGroup]);
    }

    public function destroy($id){
        $taskGroup = TaskGroup::find($id);
        if($taskGroup->image && file_exists(public_path($taskGroup->image))){
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
