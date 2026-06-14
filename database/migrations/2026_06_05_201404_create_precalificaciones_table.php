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
        
        Schema::connection('crm')->create('precalificaciones', function (Blueprint $table) {
            $table->id(); 
            
            
            $table->foreignId('empresa_id')->constrained('crm.empresas')->onDelete('cascade');
            $table->foreignId('division_id')->constrained('crm.divisiones')->onDelete('cascade');
            $table->foreignId('persona_id')->nullable()->constrained('crm.personas')->onDelete('set null');
            
            
            $table->string('nombre_precalificacion', 255); 
            $table->decimal('monto_estimado', 15, 2)->nullable();
            $table->text('descripcion')->nullable();
            
            
            $table->text('resumen_visita'); 
            $table->string('archivo_multimedia')->nullable(); 
            
          
            $table->string('estado', 50)->default('Pendiente');
            
            $table->timestamps(); 
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::connection('crm')->dropIfExists('precalificaciones');
    }
};