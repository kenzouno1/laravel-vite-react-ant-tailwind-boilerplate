<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Department extends Model
{
    use HasFactory;
    protected $guard_name = 'web';

    protected $fillable = [
        "name", 
    ];

    public function users()
    {
        return $this->belongsToMany(User::class);
    }

    //relationship many to one with roles
    public function roles()
    {
        return $this->hasMany(Role::class);
    }
}
