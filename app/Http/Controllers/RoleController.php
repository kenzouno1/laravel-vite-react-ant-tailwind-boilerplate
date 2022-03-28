<?php

namespace App\Http\Controllers;

use App\Models\Permission;
use App\Models\Role;
use Illuminate\Http\Request;

class RoleController extends BaseController
{
    //auto middleware

    public function __construct()
    {
        parent::__construct("role");
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $data = Role::when($request->department_id, function ($query) use ($request) {
            $query->where("department_id", $request->department_id);
        })->get();
        return $this->ok($data);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|not_in:Admin',
            'caps' => 'required|array|min:1',
        ]);

        foreach ($request->caps as $cap) {
            Permission::firstOrCreate(['name' => $cap]);
        }
        $role = Role::firstOrCreate([
            "name" => $request->name,
            "guard_name" => "web",
        ]);

        $permissions = Permission::whereIn("name", $request->caps)->get();

        $role->syncPermissions($permissions);
        return $this->ok($role);
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Role  $role
     * @return \Illuminate\Http\Response
     */
    public function show(Role $role)
    {
        $role->load("childrenRecursive");
        return $this->ok($role);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Role  $role
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Role $role)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Role  $role
     * @return \Illuminate\Http\Response
     */
    public function destroy(Role $role)
    {
        if ($role->name == "Admin") {
            return $this->error("Không được phép xoá quyền mặc định");
        }
        $role->delete();
        return $this->success("Xoá quyền thành công");
    }
}
