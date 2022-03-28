<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'username',
        'password',
        'avatar',
    ];

    protected $append = ["departments"];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
        'pivot',
    ];

    public function departments()
    {
        return $this->belongsToMany(Department::class, 'department_user', 'department_id', 'user_id');
    }

    /**
     * Interact with the user's first name.
     *
     * @return \Illuminate\Database\Eloquent\Casts\Attribute
     */
    protected function permissions(): Attribute
    {
        return Attribute::make(
            get:fn() => Cache::remember("user_permission_" . $this->id, 60 * 60 * 24, function () {
                return DB::table("users")
                    ->join("department_user", "users.id", "=", "department_user.user_id")
                    ->join("departments", "department_user.department_id", "=", "departments.id")
                    ->join("department_role", "department_user.department_id", "=", "department_role.department_id")
                    ->join("roles", "department_role.role_id", "=", "roles.id")
                    ->join("permission_role", "roles.id", "=", "permission_role.role_id")
                    ->join("permissions", "permission_role.permission_id", "=", "permissions.id")
                    ->pluck("permissions.name");
            })
        );
    }
}
