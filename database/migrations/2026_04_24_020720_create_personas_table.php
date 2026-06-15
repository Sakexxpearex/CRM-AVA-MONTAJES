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
            $table->foreignId('division_id')->constrained('crm.divisiones');

            //como no se si el contacto debe estar siosi en ua division, cambie los datos del seeder, en caso
            // de que no sea obligacion, este codigo de abajo deja ese atributo como nulleable
            // $table->foreignId('division_id')->nullable()->constrained('crm.divisiones')->onDelete('set null');
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
        Schema::connection('crm')->dropIfExists('personas');
    }
};