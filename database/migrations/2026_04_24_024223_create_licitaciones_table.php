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
            
            $table->text('descripcion')->nullable(); // Para detallar el alcance del servicio
            $table->decimal('monto_estimado', 15, 2)->nullable(); // Ej: 1500000.50 (Vital para el CRM)
            $table->date('fecha_cierre')->nullable(); // Cuándo se debe entregar la propuesta
            $table->decimal('monto_adjudicado', 15, 2)->nullable()->default(0);
            $table->date('fecha_adjudicacion')->nullable(); // Cuándo da la respuesta la minera
            
           $table->enum('estado_pipeline', [
                'Evaluación',
                'Preparación', 
                'Presentada',
                'Adjudicada',    
                'Perdida', 
                'Desierta',
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