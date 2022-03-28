<?php

namespace App\Http\Controllers;

use App\Enums\Status;
use App\Models\User;
use Illuminate\Http\Request;

class UserController extends BaseController
{

    public function __construct()
    {
        parent::__construct("user");
    }

    public function index(Request $request)
    {
        return $this->ok(User::all());
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Role  $role
     * @return \Illuminate\Http\Response
     */
    public function show(User $user)
    {
        return $this->ok($user);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required',
            'username' => 'required|unique:users',
            'password' => 'min:6|required',
        ]);
    }

    public function destroy(User $user)
    {
        $user->update([
            "status" => Status::Deleted->value,
        ]);

        return $this->success("Xoá user thành công");
    }

    public function update(User $user, Request $request)
    {
        $user->update($request->all());
        return $this->ok($user);

    }
}
