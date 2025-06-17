<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Task extends Model
{
    protected $guarded = [];

    public function taskGroup()
    {
        return $this->belongsTo(TaskGroup::class);
    }

    public function assignUser()
    {
        return $this->belongsTo(User::class, "assign_to", "id");
    }
}