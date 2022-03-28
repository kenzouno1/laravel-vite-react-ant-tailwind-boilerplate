<?php

namespace App\Enums;

enum Status: int
{
    case Active = 1;
    case Deactive = 2;
    case Deleted = 3;
}