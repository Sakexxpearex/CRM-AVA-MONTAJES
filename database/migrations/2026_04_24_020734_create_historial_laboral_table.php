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
        Schema::connection('crm')->create('historial_laboral', function (Blueprint $table) {
            $table->id();
            
            // Las dos llaves foráneas que conectan los mundos
            $table->foreignId('persona_id')->constrained('personas')->onDelete('cascade');
            $table->foreignId('division_id')->constrained('divisiones')->onDelete('cascade');
            
            // Datos específicos de esta pega
            $table->string('cargo'); // Ej: "Gerente de Proyectos", "Jefe de Terreno"
            $table->boolean('estado_actual')->default(true); // Asumimos que si lo anotan, trabaja ahí actualmente
            
            // Fechas (opcionales)
            $table->date('fecha_inicio')->nullable();
            $table->date('fecha_fin')->nullable();
            
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('historial_laboral');
    }
};