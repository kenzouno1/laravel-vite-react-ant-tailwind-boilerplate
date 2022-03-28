<?php

namespace Database\Seeders;

use App\Enums\Status;
use App\Models\Department;
use App\Models\User;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;

class DepartmentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $admin = Department::firstOrCreate([
            "name" => "Admin",
        ]);

        $user = User::firstOrCreate(["username" => "admin"], [
            "username" => "admin",
            "password" => bcrypt("admin@123"),
            "name" => "Super Admin",
            "status" => Status::Active->value,
        ]);

        $user->departments()->sync([$admin->id]);
    }
}
