<?php

namespace App\Http\Controllers;

use Spatie\Permission\Models\Permission;
use stdClass;

class AccountController extends BaseController
{
    public function index()
    {
        $user = auth()->user()->append("permissions");
        return $this->ok($user
        );
    }

    public function update()
    {
    }
}
