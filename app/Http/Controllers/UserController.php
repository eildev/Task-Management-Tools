<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    public function index()
    {

        if (Auth::user()->role === 'admin' | Auth::user()->role === 'superadmin') {
            $users = User::all();
            // dd($users);
            return Inertia::render('User/Index', ['users' => $users]);
        } else {
            $users = User::where('created_by', Auth::user()->id)->get();
            return Inertia::render('User/Index');
        }
    }

    public function create()
    {
        // dd('create');
        return Inertia::render('User/Create');
    }

    public function store(Request $request)
    {

        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
            'phone' => 'required|string|max:20',
            'role' => 'required|string|in:admin,user,superadmin',
        ]);


        $user = new User;
        $user->name = $request->name;
        $user->email = $request->email;
        $user->password = Hash::make($request->password);
        $user->phone = $request->phone;
        $user->role = $request->role;
        if ($request->hasFile('image')) {
            $image = $request->file('image');
            $imagename = time() . '.' . $image->Extension();
            $path = "uploads/user/";
            $image->move($path, $imagename);
            $user->image = $path . $imagename;
        }
        // $user->created_by = Auth::user()->id;
        $user->save();

        return to_route('users.index');
    }

    public function edit($user_id)
    {
        $user = User::findOrFail($user_id);
        return Inertia::render('User/Edit', ['user' => $user]);
    }

    public function update(Request $request, $user_id)
    {
        $user = User::findOrFail($user_id);

        // Validation rules
        $rules = [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,' . $user->id,
            'phone' => 'required|string|max:20',
            'role' => 'required|string|in:admin,user,superadmin',
            'bio_data' => 'nullable|string|max:1000',
            'image' => 'nullable|image|mimes:jpeg,png,jpg|max:2048', // Max 2MB
        ];

        // Only validate password if provided
        if ($request->filled('password')) {
            $rules['password'] = 'required|string|min:8|confirmed';
        }

        $request->validate($rules);

        // Update user fields
        $user->name = $request->name;
        $user->email = $request->email;
        $user->phone = $request->phone;
        $user->role = $request->role;
        $user->bio_data = $request->bio_data;

        // Update password only if provided
        if ($request->filled('password')) {
            $user->password = Hash::make($request->password);
        }

        // Handle image upload
        if ($request->hasFile('image')) {
            $image = $request->file('image');
            $imagename = time() . '.' . $image->getClientOriginalExtension();
            $path = public_path('uploads/user/');
            $image->move($path, $imagename);
            $user->image = 'uploads/user/' . $imagename;
        }

        $user->save();

        return to_route('users.index')->with('success', 'User updated successfully!');
    }

    public function destroy($user_id)
    {
        $user = User::find($user_id);
        $user->delete();
        return to_route('users.index');
    }
}
