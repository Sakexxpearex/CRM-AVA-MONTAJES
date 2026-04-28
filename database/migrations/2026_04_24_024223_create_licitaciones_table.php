<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::connection('crm')->create('licitaciones', function (Blueprint $table) {
            $table->id();
            
            
            $table->foreignId('empresa_id')->constrained('empresas')->onDelete('cascade');
            $table->foreignId('division_id')->constrained('divisiones')->onDelete('cascade');
            
            $table->string('nombre_proyecto');
            
            
            $table->enum('estado_pipeline', [
                'Evaluación', 
                'Preparación', 
                'Filtro', 
                'Ganada', 
                'Perdida', 
                'Llenar Cupo'
            ])->default('Evaluación');


            $table->unsignedBigInteger('proyecto_id')->nullable(); 
            
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('licitaciones');
    }
};