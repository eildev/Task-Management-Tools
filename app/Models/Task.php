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


    public function project()
    {
        return $this->belongsTo(TaskGroup::class, 'project_id', "id");
    }
    public function module()
    {
        return $this->belongsTo(TaskGroup::class, 'module_id', "id");
    }
    public function submodule()
    {
        return $this->belongsTo(TaskGroup::class, 'submodule_id', "id");
    }
    public function feature()
    {
        return $this->belongsTo(TaskGroup::class, 'feature_id', "id");
    }

    public function assignUser()
    {
        return $this->belongsTo(User::class, "assign_to", "id");
    }

    public function assignBy()
    {
        return $this->belongsTo(User::class, "assign_by", "id");
    }
}
