<?php

namespace Database\Seeders;

use App\Models\Department;
use App\Models\Permission;
use App\Models\Role;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class RoleSeed extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $groups = config("caps");
        foreach ($groups as $group) {
            foreach($group["caps"] as $perms)
            Permission::firstOrCreate(['name' => $perms]);
        }
        $department = Department::firstOrCreate(["name" => "Admin"]);
        
        $role = Role::firstOrCreate(['name' => "CEO","department_id" => $department->id]);
        $role2 = Role::firstOrCreate(['name' => "IT","department_id" => $department->id]);
        $role->permissions()->sync(Permission::all()->pluck("id"));
        $role2->permissions()->sync(Permission::all()->pluck("id"));

    }
}
