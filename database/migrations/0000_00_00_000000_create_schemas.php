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
    // Cambia el orden: suele ser mejor borrar en orden inverso al de creación
    // Pero lo más importante es el CASCADE
    $esquemas = ["crm", "usuarios", "laravel"]; 

    foreach($esquemas as $esquema) {
        // Añade una verificación para no borrar esquemas críticos del sistema
        if ($esquema !== 'public') {
            DB::statement("DROP SCHEMA IF EXISTS {$esquema} CASCADE");
        }
    }
}};