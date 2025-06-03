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

        if (Auth::user()->role === 'admin'| Auth::user()->role === 'superadmin') {
        $users = User::all();
        // dd($users);
        return Inertia::render('User/Index', ['users' => $users]);
        }
        else {
        $users = User::where('created_by', Auth::user()->id)->get();
        return Inertia::render('User/Index');
        }
    }

    public function create(){
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
            $user->password =Hash::make($request->password);
            $user->phone = $request->phone;
            $user->role = $request->role;
            if($request->hasFile('image')){
                $image=$request->file('image');
                $imagename=time().'.'.$image->Extension();
                $path="Users/Image/";
                $image->move($path,$imagename);
                $user->image=$path.$imagename;

            }
            // $user->created_by = Auth::user()->id;
            $user->save();

            return to_route('users.index');
        }

   public function edit($user_id){
         $user = User::find($user_id);
         dd($user);
        return Inertia::render('User/Edit', ['user' => $user]);
   }

        public function destroy($user_id){
            $user = User::find($user_id);
            $user->delete();
            return to_route('users.index');
        }
}
