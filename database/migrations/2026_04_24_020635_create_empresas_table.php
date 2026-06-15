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
       Schema::connection('crm')->create('empresas', function (Blueprint $table) {
            $table->id();
            
            // Datos de la empresa
            $table->string('rut')->nullable();
            $table->string('nombre')->nullable(); 
            $table->string('alias')->nullable(); // Ej: CODELCO [NUEVO]
            // Solo aceptará estos 3 valores exactos
            $table->enum('tipo', ['Cliente', 'Competencia', 'Subcontratista']);
            
            $table->timestamps(); // Crea fecha_creacion y fecha_actualizacion
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::connection('crm')->dropIfExists('empresas');
    }
};