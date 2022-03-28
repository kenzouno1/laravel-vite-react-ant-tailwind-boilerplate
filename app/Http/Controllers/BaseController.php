<?php

namespace App\Http\Controllers;

class BaseController extends Controller
{
    public function __construct($group=null)
    {
        if (isset($group)) {
            $this->middleware("abilities:$group.manage")->only("index");
            $this->middleware("abilities:$group.create")->only("store");
            $this->middleware("abilities:$group.update")->only("update");
            $this->middleware("abilities:$group.delete")->only("destroy");
        }}

    protected function success($msg=null)
    {
        return response()->json([
            "message" => $msg,
        ], 200);
    }
    protected function ok($data)
    {
        return response()->json(
            $data
        , 200);
    }

    protected function error($msg)
    {
        return response()->json([
            "message" => $msg,
        ], 400);
    }
}
