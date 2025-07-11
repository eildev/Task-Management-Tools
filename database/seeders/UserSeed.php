<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
class UserSeed extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
      User::create([
            'name' => 'superadmin',
            'email' => 'superadmin@gmail.com',
            'password' =>Hash::make('111'),
            'role' => 'admin',
        ]);

    }
}
