<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TaskGroup extends Model
{
    protected $fillable = [
        'name',
        'type',
        'description',
        'start_date',
        'end_date',
        'image',
        'created_by',
    ];

    protected $casts = [
        'start_date' => 'date',
        'end_date' => 'date',
    ];

    public function tasks()
    {
        return $this->hasMany(Task::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
