<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::connection('crm')->create('personas', function (Blueprint $table) {
            $table->id();
            
            // Datos personales básicos
            $table->string('rut')->unique()->nullable(); 
            $table->string("nombre_1");
            $table->string("nombre_2");
            $table->string("apellido_1");
            $table->string("apellido_2");
            
            // Datos de contacto (nullable por si el gerente no los tiene a mano)
            $table->string('email')->nullable();
            $table->string('telefono')->nullable();
            $table->string('perfil_linkedin')->nullable();
            
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('personas');
    }
};