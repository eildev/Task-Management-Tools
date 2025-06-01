<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Task extends Model
{
    protected $guarded = [];

    public function taskGroup(){
        return $this->belongsTo(TaskGroup::class);
    }

    public function user(){
        return $this->belongsTo(User::class);
    }
}
