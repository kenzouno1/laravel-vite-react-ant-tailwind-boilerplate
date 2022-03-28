<?php

namespace App\Http\Controllers;

use App\Models\Department;
use Illuminate\Http\Request;

class DepartmentController extends BaseController
{
    //auto middleware by group;
    public function __construct()
    {
        parent::__construct("department");
    }
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        return $this->ok(Department::with("roles")
                ->when($request->search, function ($query) use ($request) {
                    return $query->where("name", "like", "%{$request->search}%");
                })
                ->when($request->excludeIds, function ($query) use ($request) {
                    return $query->whereNotIn("id", $request->excludeIds);
                })
                ->get());
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
            "name" => "required|string|max:255",
        ]);

        $department = Department::create($request->all());
        return $this->ok($department);
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Department  $department
     * @return \Illuminate\Http\Response
     */
    public function show(Department $department)
    {
        $department->load(["roles","roles.childrenRecursive"]);
        return $this->ok($department);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Department  $department
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Department $department)
    {
        $request->validate([
            "name" => "required|string|max:255",
        ]);
        $department->update($request->all());
        return $this->ok($department);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Department  $department
     * @return \Illuminate\Http\Response
     */
    public function destroy(Department $department)
    {
        $department->delete();
        return $this->success("Xoá phòng ban thành công");
    }
}
