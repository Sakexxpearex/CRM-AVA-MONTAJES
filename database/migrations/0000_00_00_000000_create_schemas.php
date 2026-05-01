<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    protected $connection = "usuarios";

    /**
     * Run the migrations.
     */
    public function up(): void
    {
        $esquemas = [
            "usuarios",
            "laravel",
            "crm"
        ];

        foreach($esquemas as $esquema) {
            DB::statement("CREATE SCHEMA IF NOT EXISTS {$esquema}");
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        $esquemas = [
            "laravel",
            "usuarios",
            "crm"
        ];

        foreach($esquemas as $esquema) {
            DB::statement("DROP SCHEMA IF EXISTS {$esquema} CASCADE");
        }
    }
};
