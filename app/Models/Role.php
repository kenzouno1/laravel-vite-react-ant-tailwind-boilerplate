<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Role extends Model
{
    use HasFactory;

    //relationship one to many department

    public function department()
    {
        return $this->belongsTo(Department::class);
    }

    //relation ship permission
    public function permissions()
    {
        return $this->belongsToMany(Permission::class);
    }

    //relationship parent
    public function parent()
    {
        return $this->belongsTo(Role::class, "parent_id");
    }
    //relationship childs
    public function childs()
    {
        return $this->hasMany(Role::class, "parent_id");
    }

    public function childrenRecursive()
    {
        return $this->childs()->with('childrenRecursive');
    }
}
