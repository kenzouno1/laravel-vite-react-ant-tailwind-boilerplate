<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('departments', function (Blueprint $table) {
            $table->increments("id");
            $table->string("name");
            $table->timestamps();
        });

        //create pivot table relationship many to many for departments and ussers
        Schema::create("department_user", function (Blueprint $table) {
            $table->unsignedInteger("department_id");
            $table->unsignedInteger("user_id");
            $table->primary(["department_id", "user_id"]);

            $table->foreign("department_id")->references("id")->on("departments")->onDelete("cascade");
            $table->foreign("user_id")->references("id")->on("users")->onDelete("cascade");
        });

    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('department_user');
        Schema::dropIfExists('department_role');
        Schema::dropIfExists('departments');
    }
};
