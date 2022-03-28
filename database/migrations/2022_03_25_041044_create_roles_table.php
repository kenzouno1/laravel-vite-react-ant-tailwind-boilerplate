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
        Schema::create('roles', function (Blueprint $table) {
            $table->increments("id");
            $table->unsignedInteger("parent_id")->nullable();
            $table->unsignedInteger("department_id");
            $table->string("name");
            $table->timestamps();

             $table->foreign("parent_id")->references("id")->on("roles");
             $table->foreign("department_id")->references("id")->on("departments");
        });

        
        Schema::create("permission_role", function (Blueprint $table) {
            $table->unsignedInteger("role_id");
            $table->unsignedInteger("permission_id");
            $table->primary(["role_id", "permission_id"]);

            $table->foreign("role_id")->references("id")->on("roles")->onDelete("cascade");
            $table->foreign("permission_id")->references("id")->on("permissions")->onDelete("cascade");
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('permission_role');
        Schema::dropIfExists('roles');
    }
};
